require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();


app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", require("./src/routes/auth"));


const PORT = process.env.PORT || 3001;
app.listen(PORT, (err) => {
  console.log(`🚀 Server running on port ${PORT}`);
    if (err) {
        console.error("❌ Server error:", err);
    }
});
