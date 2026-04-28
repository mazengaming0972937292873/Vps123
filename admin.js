const express = require("express");
const router = express.Router();
const fs = require("fs");

// كلمة السر اللي هتحطها في الرابط
const ADMIN_PASSWORD = "mysecretadmin"; 

// مسار الدخول: /admin?pass=mysecretadmin
router.get("/", (req, res) => {
    const { pass } = req.query;

    if (pass !== ADMIN_PASSWORD) {
        return res.status(403).send("<h1>غير مسموح لك بالدخول! ❌</h1>");
    }

    // واجهة بسيطة جداً (HTML) لإضافة مفتاح جديد
    res.send(`
        <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h2>لوحة تحكم توزيع الـ API Keys 👑</h2>
            <form action="/admin/generate" method="POST">
                <input type="text" name="friendName" placeholder="اسم صاحبك" required style="padding: 10px;">
                <button type="submit" style="padding: 10px; background: green; color: white;">توليد مفتاح</button>
            </form>
            <div id="result"></div>
        </body>
        </html>
    `);
});

// استقبال طلب التوليد
router.post("/generate", express.urlencoded({ extended: true }), (req, res) => {
    const { friendName } = req.body;
    const newKey = "AKC-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    // هنا ممكن تحفظ المفتاح في ملف JSON عشان الكود التاني يعرف يقرأه
    let keys = {};
    if (fs.existsSync("./keys.json")) {
        keys = JSON.parse(fs.readFileSync("./keys.json"));
    }
    
    keys[newKey] = friendName;
    fs.writeFileSync("./keys.json", JSON.stringify(keys, null, 2));

    res.send(`
        <h3>تم توليد مفتاح لـ ${friendName} ✅</h3>
        <p style="font-size: 20px; color: blue;">المفتاح هو: <b>${newKey}</b></p>
        <a href="/admin?pass=${ADMIN_PASSWORD}">الرجوع للخلف</a>
    `);
});

module.exports = router;
