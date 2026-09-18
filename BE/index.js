const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const PROFILE_PATH = path.join(__dirname, "data", "profile.json");

app.use(express.json());

app.get("/api/profile", (req, res) => {
  try {
    const config = JSON.parse(fs.readFileSync(PROFILE_PATH, "utf-8"));
    const { privatePasswordHash, ...publicConfig } = config;
    res.json(publicConfig);
  } catch (err) {
    res.status(500).json({ error: "Không thể đọc file cấu hình" });
  }
});

app.put("/api/profile", (req, res) => {
  try {
    const { name, displayName, theme, password } = req.body || {};

    const newName = name ?? displayName;
    if (!newName || !theme) {
      return res.status(400).json({ error: "name và theme là bắt buộc" });
    }

    const config = JSON.parse(fs.readFileSync(PROFILE_PATH, "utf-8"));

    config.displayName = newName;
    config.preferences = config.preferences || {};
    config.preferences.theme = theme;

    if (password) {
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto.scryptSync(password, salt, 64).toString("hex");
      config.privatePasswordHash = `${salt}:${hash}`;
    }

    fs.writeFileSync(PROFILE_PATH, JSON.stringify(config, null, 2), "utf-8");

    const { privatePasswordHash, ...publicConfig } = config;
    res.json(publicConfig);
  } catch (err) {
    res.status(500).json({ error: "Không thể lưu file cấu hình" });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});