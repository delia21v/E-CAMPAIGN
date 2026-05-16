const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const existing = await User.findOne({ username: "admin" });
  if (existing) {
    console.log("Admin deja există.");
    return mongoose.disconnect();
  }

  const hashedPassword = await bcrypt.hash("admin", 10);
  const adminUser = new User({
    username: "admin",
    password: hashedPassword,
    isAdmin: true
  });

  await adminUser.save();
  console.log("Utilizator admin creat cu succes.");
  mongoose.disconnect();
}).catch(err => {
  console.error("Eroare la conectarea MongoDB:", err);
});
