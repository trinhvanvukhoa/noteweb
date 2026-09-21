const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(cors()); // Cho phép FE gọi API
app.use(express.json()); // Đọc dữ liệu JSON từ FE gửi lên
const profilePath = path.join(__dirname, 'data', 'profile.json');
const notesDir = path.join(__dirname, 'data', 'notes');
// Chỉ cho phép chủ đề gồm chữ, số, gạch ngang/gạch dưới để tránh path traversal
const notesFile = (topic) => {
    if (!/^[a-zA-Z0-9_-]+$/.test(topic)) return null;
    return path.join(notesDir, `${topic}.json`);
};
// Đọc file JSON, luôn trả về mảng
const readNotes = (notesPath) => {
    try {
        const data = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
};
// API 1: Đọc thông tin Profile
app.get('/api/profile', (req, res) => {
    try {
        const rawData = fs.readFileSync(profilePath, 'utf8');
        const profile = JSON.parse(rawData);
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: "Lỗi đọc file" });
    }
});
// API 2: Cập nhật Profile
app.put('/api/profile', (req, res) => {
    try {
        const newProfile = req.body;
        // Ghi đè dữ liệu mới vào file
        fs.writeFileSync(profilePath, JSON.stringify(newProfile, null, 2), 'utf8');
        res.json({ success: true, message: "Đã cập nhật Profile" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi ghi file" });
    }
});
// API 3: Đọc danh sách ghi chú theo chủ đề
app.get('/api/notes/:topic', (req, res) => {
    const notesPath = notesFile(req.params.topic);
    if (!notesPath) return res.status(400).json({ message: "Chủ đề không hợp lệ" });
    // File chưa tồn tại -> readNotes trả về mảng rỗng
    res.json(readNotes(notesPath));
});
// API 4: Thêm ghi chú mới theo chủ đề
app.post('/api/notes/:topic', (req, res) => {
    try {
        const notesPath = notesFile(req.params.topic);
        if (!notesPath) return res.status(400).json({ message: "Chủ đề không hợp lệ" });
        const { title, content } = req.body;

        const notes = readNotes(notesPath);

        const newNote = {
            id: Date.now().toString(),
            title,
            content,
            createdAt: new Date().toISOString()
        };
        notes.push(newNote);
        fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2), 'utf8');
        res.json(newNote);
    } catch (error) {
        res.status(500).json({ message: "Lỗi ghi file" });
    }
});
// API 5: Cập nhật ghi chú theo chủ đề và id
app.put('/api/notes/:topic/:id', (req, res) => {
    try {
        const { topic, id } = req.params;
        const notesPath = notesFile(topic);
        if (!notesPath) return res.status(400).json({ message: "Chủ đề không hợp lệ" });
        const { title, content } = req.body;

        const notes = readNotes(notesPath);

        const note = notes.find((item) => item.id === id);
        if (!note) {
            return res.status(404).json({ message: "Không tìm thấy ghi chú" });
        }

        note.title = title;
        note.content = content;
        note.updatedAt = new Date().toISOString();

        fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2), 'utf8');
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: "Lỗi ghi file" });
    }
});
// API 6: Xóa ghi chú theo chủ đề và id
app.delete('/api/notes/:topic/:id', (req, res) => {
    try {
        const { topic, id } = req.params;
        const notesPath = notesFile(topic);
        if (!notesPath) return res.status(400).json({ message: "Chủ đề không hợp lệ" });

        const notes = readNotes(notesPath);
        const remaining = notes.filter((item) => item.id !== id);
        fs.writeFileSync(notesPath, JSON.stringify(remaining, null, 2), 'utf8');
        res.json({ success: true, message: "Đã xóa ghi chú" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi ghi file" });
    }
});
// API 7: Thống kê note theo ngày / tháng / năm (gom nhóm bằng reduce)
app.get('/api/tasks/statistics', (req, res) => {
    try {
        // Đọc toàn bộ file JSON trong data/notes (kế thừa dữ liệu hiện có)
        const files = fs.readdirSync(notesDir).filter((file) => file.endsWith('.json'));
        const allNotes = files.flatMap((file) =>
            readNotes(path.join(notesDir, file))
        );

        const stats = allNotes.reduce(
            (acc, note) => {
                if (!note.createdAt) return acc;
                // Cắt chuỗi ISO 8601: "2026-09-10T08:00:00Z"
                const day = note.createdAt.slice(0, 10); // 2026-09-10
                const month = note.createdAt.slice(0, 7); // 2026-09
                const year = note.createdAt.slice(0, 4); // 2026

                acc.byDay[day] = (acc.byDay[day] || 0) + 1;
                acc.byMonth[month] = (acc.byMonth[month] || 0) + 1;
                acc.byYear[year] = (acc.byYear[year] || 0) + 1;
                return acc;
            },
            { total: 0, byDay: {}, byMonth: {}, byYear: {} }
        );

        stats.total = allNotes.length;
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Lỗi thống kê" });
    }
});
const privateNotesFile = path.join(__dirname, 'data', 'private.json');
// Khởi tạo file private.json nếu chưa tồn tại
if (!fs.existsSync(privateNotesFile)) {
    fs.writeFileSync(privateNotesFile, '[]', 'utf8');
}
// 1. API Xác thực mật khẩu
app.post('/api/private/auth', (req, res) => {
    try {
        const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
        // Kiểm tra pass truyền lên có khớp với pass trong profile không
        if (profile.password === req.body.password) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: "Sai mật khẩu" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống xác thực" });
    }
});
// 2. API Lấy danh sách Ghi chú riêng tư
app.get('/api/private/notes', (req, res) => {
    res.json(readNotes(privateNotesFile));
});
// 3. API Thêm Ghi chú riêng tư
app.post('/api/private/notes', (req, res) => {
    try {
        const notes = readNotes(privateNotesFile);
        const newNote = {
            id: Date.now().toString(),
            title: req.body.title || "Lưu bút mật",
            content: req.body.content || "",
            createdAt: new Date().toISOString()
        };
        notes.push(newNote);
        fs.writeFileSync(privateNotesFile, JSON.stringify(notes, null, 2), 'utf8');
        res.json({ success: true, note: newNote });
    } catch (error) {
        res.status(500).json({ message: "Lỗi thêm ghi chú kín" });
    }
});
// 4. API Cập nhật Ghi chú riêng tư theo id
app.put('/api/private/notes/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const notes = readNotes(privateNotesFile);
        const note = notes.find((item) => item.id === id);
        if (!note) {
            return res.status(404).json({ message: "Không tìm thấy ghi chú" });
        }

        note.title = title;
        note.content = content;
        note.updatedAt = new Date().toISOString();

        fs.writeFileSync(privateNotesFile, JSON.stringify(notes, null, 2), 'utf8');
        res.json({ success: true, note });
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật ghi chú kín" });
    }
});
// 5. API Xóa Ghi chú riêng tư theo id
app.delete('/api/private/notes/:id', (req, res) => {
    try {
        const { id } = req.params;
        const notes = readNotes(privateNotesFile);
        const remaining = notes.filter((item) => item.id !== id);
        fs.writeFileSync(privateNotesFile, JSON.stringify(remaining, null, 2), 'utf8');
        res.json({ success: true, message: "Đã xóa ghi chú kín" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa ghi chú kín" });
    }
});
const PORT = 3000;
app.listen(PORT, () => console.log(`Backend chạy tại http://localhost:${PORT}`));