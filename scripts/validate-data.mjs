import fs from 'node:fs';

const vocabulary = JSON.parse(fs.readFileSync(new URL('../data/vocabulary.json', import.meta.url), 'utf8'));

const requiredFields = ['id', 'id_lang', 'en', 'ar', 'category'];
const errors = [];
const warnings = [];
const ids = new Set();
const categories = new Map();
const labels = new Map();

for (const [index, item] of vocabulary.entries()) {
  for (const field of requiredFields) {
    if (item[field] === undefined || item[field] === null || String(item[field]).trim() === '') {
      errors.push(`Baris ${index + 1}: field ${field} kosong`);
    }
  }

  const id = Number(item.id);
  if (!Number.isInteger(id) || id <= 0) errors.push(`Baris ${index + 1}: id tidak valid (${item.id})`);
  if (ids.has(id)) errors.push(`ID duplikat: ${id}`);
  ids.add(id);

  const category = String(item.category || '').trim();
  categories.set(category, (categories.get(category) || 0) + 1);

  const label = String(item.id_lang || '').trim().toLocaleLowerCase('id-ID');
  if (label) {
    if (!labels.has(label)) labels.set(label, []);
    labels.get(label).push(id);
  }
}

for (const [label, duplicateIds] of labels.entries()) {
  if (duplicateIds.length > 1) warnings.push(`Label Indonesia duplikat "${label}": ${duplicateIds.join(', ')}`);
}

if (errors.length > 0) {
  console.error('❌ Validasi data gagal:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`✅ Vocabulary valid: ${vocabulary.length} kata, ${ids.size} ID unik, ${categories.size} kategori.`);
console.log(`ℹ️  ${vocabulary.filter((item) => item.pronunciation).length} kata memiliki pronunciation.`);
console.log(`ℹ️  ${vocabulary.filter((item) => item.example_id).length} kata memiliki contoh Bahasa Indonesia.`);
if (warnings.length > 0) {
  console.log(`⚠️  ${warnings.length} label Indonesia masih memiliki duplikasi semantik (tidak memblokir build).`);
}
