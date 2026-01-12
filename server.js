// ------------------------------
// server.js
// ------------------------------

require("dotenv").config();
const express = require("express");
const path = require("path");
const stripe = require("stripe")(process.env.SECRET_KEY);

const app = express();

// ------------------------------
// Config
// ------------------------------
const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || `http://localhost:${PORT}`;
const STATIC_DIR = path.join(__dirname, process.env.STATIC_DIR || "client");

// ------------------------------
// Middleware
// ------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(STATIC_DIR));

// ------------------------------
// Routes
// ------------------------------

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(STATIC_DIR, "index.html"));
});

// Success & cancel pages
app.get("/success", (req, res) => {
  res.sendFile(path.join(STATIC_DIR, "success.html"));
});
app.get("/cancel", (req, res) => {
  res.sendFile(path.join(STATIC_DIR, "cancel.html"));
});

// Workshop pages
app.get("/workshop1", (req, res) => {
  res.sendFile(path.join(STATIC_DIR, "workshops", "workshop1.html"));
});
app.get("/workshop2", (req, res) => {
  res.sendFile(path.join(STATIC_DIR, "workshops", "workshop2.html"));
});
app.get("/workshop3", (req, res) => {
  res.sendFile(path.join(STATIC_DIR, "workshops", "workshop3.html"));
});

// ------------------------------
// Stripe checkout
// ------------------------------
app.post("/create-checkout-session/:pid", async (req, res) => {
  try {
    const priceId = req.params.pid;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${DOMAIN}/success?id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/cancel`,
      allow_promotion_codes: true,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ error: "Checkout session creation failed" });
  }
});

// ------------------------------
// Start server
// ------------------------------
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
  console.log(`You may access your app at: ${DOMAIN}`);
});
