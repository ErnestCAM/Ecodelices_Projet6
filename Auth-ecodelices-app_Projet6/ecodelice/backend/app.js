// backend/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cookieParser from "cookie-parser";
import multer from "multer";
import JsBarcode from "jsbarcode";
import { createCanvas } from "canvas";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
// servir les images uploadées
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const upload = multer({ dest: "uploads/" });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

function authenticateToken(req, res, next) {
  let token = req.headers["authorization"];
  if (!token && req.cookies) token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Token manquant" });
  if (token.startsWith("Bearer ")) token = token.slice(7);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalide" });
    req.user = user;
    next();
  });
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role)
      return res.status(403).json({ error: "Accès refusé" });
    next();
  };
}

function isValidCardNumber(num) {
  return /^[0-9]{16}$/.test(num);
}

function generateReceiptCode(orderId) {
  return "ECDL" + orderId + Date.now();
}

/* ===================== PRODUITS ===================== */

// Route produits public : TOUS les produits (dispo ou non)
app.get("/api/products", async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Modifier disponibilité produit (admin)
app.patch(
  "/products/:id/availability",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res, next) => {
    const productId = req.params.id;
    const { available } = req.body;
    try {
      await pool.query("UPDATE products SET available = ? WHERE id = ?", [
        available,
        productId,
      ]);
      res.json({ message: "Disponibilité produit mise à jour." });
    } catch (err) {
      next(err);
    }
  }
);

/* ===================== BLOG ===================== */
/*
Table à créer au besoin :

CREATE TABLE blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(255) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
*/

// Liste des articles (public)
app.get("/api/blog/posts", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, content, image, created_at AS createdAt FROM blog_posts ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Création d’un article (admin)
app.post(
  "/api/blog/posts",
  authenticateToken,
  authorizeRole("admin"),
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const file = req.file;
      if (!title || !content || !file) {
        return res
          .status(400)
          .json({ error: "Titre, contenu et image sont requis" });
      }
      const imagePath = `/uploads/${file.filename}`;
      await pool.query(
        "INSERT INTO blog_posts (title, content, image) VALUES (?, ?, ?)",
        [title, content, imagePath]
      );
      res.json({ message: "Article créé avec succès" });
    } catch (err) {
      next(err);
    }
  }
);

// Mise à jour d’un article (admin)
app.put(
  "/api/blog/posts/:id",
  authenticateToken,
  authorizeRole("admin"),
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      let query = "UPDATE blog_posts SET title = ?, content = ?";
      const params = [title, content];

      if (req.file) {
        const imagePath = `/uploads/${req.file.filename}`;
        query += ", image = ?";
        params.push(imagePath);
      }
      query += " WHERE id = ?";
      params.push(id);

      await pool.query(query, params);
      res.json({ message: "Article mis à jour" });
    } catch (err) {
      next(err);
    }
  }
);

// Suppression d’un article (admin)
app.delete(
  "/api/blog/posts/:id",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await pool.query("DELETE FROM blog_posts WHERE id = ?", [id]);
      res.json({ message: "Article supprimé" });
    } catch (err) {
      next(err);
    }
  }
);

/* ===================== AUTH / UTILISATEURS ===================== */

app.post("/register", async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !email || !password)
      return res.status(400).send("Tous les champs sont requis");

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, "user")',
      [username, hashed, email]
    );

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Bienvenue sur Ecodelice !",
      text: `Bonjour ${username},\n\nVotre inscription est confirmée.`,
    });

    res.send("Utilisateur créé et email envoyé.");
  } catch (err) {
    next(err);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (!rows.length) return res.status(400).send("Utilisateur non trouvé");
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).send("Mot de passe incorrect");
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

app.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!users.length) return res.status(400).send("Email non trouvé");
    const user = users[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Réinitialisation de mot de passe",
      text: `Réinitialisez votre mot de passe avec ce lien (valide 15 minutes):\n${resetUrl}`,
    });
    res.send("Mail de réinitialisation envoyé avec succès.");
  } catch (err) {
    next(err);
  }
});

app.post("/verify-token", (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, id: decoded.id });
  } catch (err) {
    res.status(400).json({ valid: false, message: "Token invalide ou expiré" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [
      hashed,
      decoded.id,
    ]);
    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    res.status(400).json({ message: "Lien expiré ou invalide" });
  }
});

app.get("/profile", authenticateToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, email, role FROM users WHERE id = ?",
      [req.user.id]
    );
    if (!rows.length)
      return res.status(404).json({ error: "Utilisateur introuvable" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/* ===================== COMMANDES / PAIEMENT ===================== */

app.post("/orders", authenticateToken, async (req, res, next) => {
  const { items } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, order_date, total_amount, status) VALUES (?, NOW(), 0, "en attente")',
      [req.user.id]
    );

    const orderId = orderResult.insertId;
    let totalHT = 0;

    for (const item of items) {
      const [productRows] = await conn.query(
        "SELECT price, available FROM products WHERE id = ?",
        [item.product_id]
      );
      if (!productRows.length) throw new Error("Produit non trouvé");
      if (!productRows[0].available) throw new Error("Produit indisponible");
      const priceAtPurchase = productRows[0].price;
      totalHT += priceAtPurchase * item.quantity;

      await conn.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, priceAtPurchase]
      );
    }

    const fraisEtTaxes = +(totalHT * 0.0105).toFixed(2);
    const totalTTC = +(totalHT + fraisEtTaxes).toFixed(2);

    await conn.query("UPDATE orders SET total_amount = ? WHERE id = ?", [
      totalTTC,
      orderId,
    ]);
    await conn.commit();
    conn.release();

    res.json({ orderId, totalHT, fraisEtTaxes, totalTTC, statut: "en attente" });
  } catch (err) {
    if (conn) await conn.rollback();
    next(err);
  }
});

app.post("/pay/:orderId", authenticateToken, async (req, res, next) => {
  const orderId = req.params.orderId;
  const { cardNumber } = req.body;
  if (!cardNumber || !isValidCardNumber(cardNumber))
    return res
      .status(400)
      .json({ error: "Numéro de carte invalide : 16 chiffres requis." });
  try {
    const [orderRows] = await pool.query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [orderId, req.user.id]
    );
    if (!orderRows.length)
      return res.status(404).json({ error: "Commande introuvable" });
    const receiptCode = generateReceiptCode(orderId);
    await pool.query(
      "UPDATE orders SET status = ?, receipt_code = ? WHERE id = ?",
      ["payée", receiptCode, orderId]
    );
    res.json({ message: "Paiement simulé avec succès", receiptCode });
  } catch (err) {
    next(err);
  }
});

app.get(
  "/receipt/:orderId/barcode",
  authenticateToken,
  async (req, res, next) => {
    const orderId = req.params.orderId;
    try {
      const [rows] = await pool.query(
        "SELECT receipt_code FROM orders WHERE id = ? AND user_id = ?",
        [orderId, req.user.id]
      );
      if (!rows.length || !rows[0].receipt_code)
        return res.status(404).send("Aucun reçu disponible");
      const canvas = createCanvas();
      JsBarcode(canvas, rows[0].receipt_code, {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: true,
      });
      res.setHeader("Content-Type", "image/png");
      canvas.pngStream().pipe(res);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/receipt/:orderId/pdfBase64",
  authenticateToken,
  async (req, res, next) => {
    const orderId = req.params.orderId;
    try {
      const [orderRows] = await pool.query(
        "SELECT * FROM orders WHERE id = ? AND user_id = ?",
        [orderId, req.user.id]
      );
      if (!orderRows.length)
        return res.status(404).json({ error: "Commande introuvable" });
      const order = orderRows[0];
      const [items] = await pool.query(
        `SELECT oi.product_id, oi.quantity, p.name AS product_name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orderId]
      );
      const canvas = createCanvas();
      JsBarcode(canvas, order.receipt_code, {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: true,
      });
      const barcodeBuffer = canvas.toBuffer();

      const doc = new PDFDocument({ size: "A4", margin: 50 });
      let buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        let pdfData = Buffer.concat(buffers);
        let base64pdf = pdfData.toString("base64");
        res.json({ pdf: base64pdf });
      });

      doc.fontSize(20).fillColor("#7CB342").text("Ecodelice", {
        align: "center",
      });
      doc.moveDown();
      doc.fontSize(16).text("Confirmation Commande", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).fillColor("black").text(
        `Montant : ${order.total_amount} €`
      );
      doc.moveDown();

      items.forEach((item) => {
        doc.text(`${item.product_name} × ${item.quantity}`);
      });

      doc.moveDown();
      doc.image(barcodeBuffer, { fit: [300, 80], align: "center" });
      doc.moveDown(0.5);
      doc.font("Courier")
        .fontSize(10)
        .text(`ID commande : ${order.id}`, { align: "center" });

      const orderDate = new Date(order.order_date).toLocaleDateString();
      doc.fontSize(10).text(orderDate, 480, 770);

      doc.end();
    } catch (err) {
      next(err);
    }
  }
);

app.get("/orders", authenticateToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, order_date, total_amount, receipt_code, status FROM orders WHERE user_id = ?",
      [req.user.id]
    );
  res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.get("/orders/:orderId/items", authenticateToken, async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const [orderCheck] = await pool.query(
      "SELECT id FROM orders WHERE id = ? AND user_id = ?",
      [orderId, req.user.id]
    );
    if (!orderCheck.length)
      return res.status(404).json({ error: "Commande introuvable" });
    const [items] = await pool.query(
      `SELECT oi.product_id, oi.quantity, p.name AS product_name
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    res.json(items);
  } catch (err) {
    next(err);
  }
});

/* ===================== AUTRES ===================== */

app.post(
  "/admin/import-file",
  authenticateToken,
  authorizeRole("admin"),
  upload.single("importFile"),
  async (req, res, next) => {
    try {
      const file = req.file;
      if (!file)
        return res.status(400).json({ error: "Fichier manquant" });
      res.json({
        message: "Fichier importé avec succès",
        filename: file.filename,
      });
    } catch (err) {
      next(err);
    }
  }
);

app.post("/send-faq", authenticateToken, async (req, res) => {
  const { faqContent } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: process.env.SENDER_EMAIL,
      subject: "FAQ Ecodelice - Message utilisateur",
      text: faqContent,
    });
    res.json({ message: "FAQ envoyée au support." });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de l'envoi", details: err.message });
  }
});

app.post("/contact", async (req, res, next) => {
  const { name, email, message } = req.body;
  if (!email || !message)
    return res
      .status(400)
      .json({ error: "Email et message obligatoires" });
  try {
    await transporter.sendMail({
      from: email,
      to: process.env.SENDER_EMAIL,
      subject: `Formulaire contact EcoDelice : ${name || "Invité"}`,
      text: `Nom: ${name || "Non renseigné"}\nEmail: ${email}\n\nMessage:\n${message}`,
    });
    res.json({ success: true, message: "Message envoyé avec succès." });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de l'envoi du message." });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error("Erreur attrapée:", err);
  res
    .status(500)
    .json({ error: "Erreur interne serveur", message: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Backend lancé sur http://localhost:${PORT}`)
);
