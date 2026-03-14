import app from "./app.js";
import { sequelize } from "./models/index.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅  Database connected");

    // Sync models (use migrations in production)
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("✅  Models synchronised");

    app.listen(PORT, () =>
      console.log(`🚀  Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌  Unable to start server:", err);
    process.exit(1);
  }
})();
