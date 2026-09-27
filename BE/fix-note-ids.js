// fix-note-ids.js — chạy 1 lần để dọn id trùng trong dữ liệu cũ
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const notesDir = path.join(__dirname, 'data', 'notes');
const privateFile = path.join(__dirname, 'data', 'private.json');

const fixFile = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  const notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const seen = new Set();
  let changed = false;

  notes.forEach((note) => {
    if (!note.id || seen.has(note.id)) {
      note.id = crypto.randomUUID();
      changed = true;
    }
    seen.add(note.id);
  });

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
    console.log(`Đã sửa id trùng trong: ${filePath}`);
  } else {
    console.log(`Không có id trùng: ${filePath}`);
  }
};

fs.readdirSync(notesDir)
  .filter((f) => f.endsWith('.json'))
  .forEach((f) => fixFile(path.join(notesDir, f)));

fixFile(privateFile);