const fs = require('fs');
const path = require('path');

// Fungsi convert CSV ke JSON
function csvToJson(csvPath, jsonPath) {
  const csv = fs.readFileSync(csvPath, 'utf-8');
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    result.push(obj);
  }
  
  fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
  console.log(`✅ Converted: ${csvPath} → ${jsonPath}`);
}

// Convert semua file
const files = [
  { csv: 'data.csv', json: '../data/vocabulary.json' },
  { csv: 'categories.csv', json: '../data/categories.json' },
  { csv: 'english_lessons.csv', json: '../data/english-lessons.json' },
  { csv: 'nahwu_lessons.csv', json: '../data/nahwu-lessons.json' },
  { csv: 'roadmap.csv', json: '../data/roadmap.json' }
];

files.forEach(f => csvToJson(f.csv, f.json));
console.log('\n🎉 All files converted!');