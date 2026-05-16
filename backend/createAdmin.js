const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.findOneAndUpdate(
      { username: "admin" },
      {
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        isAdmin: true,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log("Utilizator admin sincronizat cu succes.");
    console.log("Admin: admin / admin123");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Eroare la conectarea MongoDB:", err);
  });
