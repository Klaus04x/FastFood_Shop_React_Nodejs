import express from "express";

const promoCodeRouter = express.Router();

// Danh sách mã giảm giá giả lập (trong thực tế, bạn sẽ lấy từ database)
const PROMO_CODES = [
    { code: "GIAM10", discount: 10 }, // Giảm 10%
    { code: "SALE5", discount: 5 },   // Giảm $5
];

promoCodeRouter.post("/validate", (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.json({ success: false, message: "Please enter a promo code." });
    }

    const foundCode = PROMO_CODES.find(p => p.code.toUpperCase() === code.toUpperCase());

    if (foundCode) {
        return res.json({ success: true, discount: foundCode.discount, message: "Promo code applied successfully!" });
    } else {
        return res.json({ success: false, message: "Invalid promo code." });
    }
});

export default promoCodeRouter;