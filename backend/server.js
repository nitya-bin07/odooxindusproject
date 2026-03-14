const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db"); // import database
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Inventory API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});