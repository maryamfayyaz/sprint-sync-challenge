require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swaggerSpec");

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", require("./src/routes/auth"));
app.use("/users", require("./src/routes/users"));
app.use("/tasks", require("./src/routes/tasks"));
app.use("/ai", require("./src/routes/ai"));

// Swagger Docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: "/docs/swagger.json"
  }
}));

// Serve the raw JSON spec at a separate route
app.get("/docs/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, (err) => {
  console.log(`🚀 Server running on port ${PORT}`);
    if (err) {
        console.error("❌ Server error:", err);
    }
});
