'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, GraduationCap, Trophy, XCircle } from 'lucide-react';
import { completeLesson, recordLessonPractice } from '../lib/premiumLearning';

const shuffle = (input = []) => {
  const array = [...input];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function LessonPractice({ type, lesson, allLessons = [], progress, onProgressChange }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const isEnglish = type === 'english';
  const correctText = isEnglish ? (lesson?.example_en || lesson?.content_en) : (lesson?.example_ar || lesson?.content_ar);
  const options = useMemo(() => {
    if (!lesson || !correctText) return [];
    const candidates = allLessons
      .filter((item) => item.id !== lesson.id)
      .map((item) => isEnglish ? (item.example_en || item.content_en) : (item.example_ar || item.content_ar))
      .filter(Boolean);
    return shuffle([correctText, ...shuffle(candidates).slice(0, 3)]);
  }, [lesson?.id, correctText, allLessons, isEnglish]);

  if (!lesson) return null;

  const lessonState = progress?.[type]?.[lesson.id];
  const completed = Boolean(lessonState?.completed);

  const submit = (option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const score = option === correctText ? 100 : 0;
    const next = recordLessonPractice(type, lesson.id, score);
    onProgressChange?.(next);
  };

  const markDone = () => {
    const next = completeLesson(type, lesson.id, { score: Math.max(70, lessonState?.bestScore || 0) });
    onProgressChange?.(next);
  };

  return (
    <div className="lesson-practice-card">
      <div className="lesson-practice-head">
        <div>
          <span className="lesson-practice-kicker"><GraduationCap size={14} /> Mini Practice</span>
          <h4>Manakah contoh yang sesuai dengan materi ini?</h4>
        </div>
        {completed ? <span className="lesson-complete-badge"><CheckCircle2 size={15} /> Selesai</span> : <span className="lesson-progress-badge"><Circle size={14} /> Belum selesai</span>}
      </div>

      <div className="lesson-practice-options">
        {options.map((option) => {
          const correct = option === correctText;
          const chosen = selected === option;
          return (
            <button
              type="button"
              key={option}
              onClick={() => submit(option)}
              disabled={answered}
              dir={!isEnglish ? 'rtl' : 'ltr'}
              className={`${!isEnglish ? 'arabic-text' : ''} ${answered && correct ? 'is-correct' : ''} ${answered && chosen && !correct ? 'is-wrong' : ''}`}
            >
              <span>{option}</span>
              {answered && correct && <CheckCircle2 size={18} />}
              {answered && chosen && !correct && <XCircle size={18} />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`lesson-practice-feedback ${selected === correctText ? 'success' : 'retry'}`}>
          {selected === correctText ? <Trophy size={18} /> : <XCircle size={18} />}
          <div>
            <strong>{selected === correctText ? 'Benar! +15 XP' : 'Belum tepat. Contoh yang benar ditandai hijau.'}</strong>
            <p>Skor terbaik lesson ini: {Math.max(lessonState?.bestScore || 0, selected === correctText ? 100 : 0)}%</p>
          </div>
        </div>
      )}

      {!completed && (
        <button type="button" className="lesson-mark-done" onClick={markDone}>
          <CheckCircle2 size={17} /> Tandai materi selesai
        </button>
      )}
    </div>
  );
}
