const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const petitionRoutes = require("./routes/petitionRoutes");
const donationRoutes = require("./routes/donationRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const forumRoutes = require("./routes/forumRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/petition", petitionRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/forum", forumRoutes);
app.use("/images", express.static(path.join(__dirname, "../frontend/public/images")));

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.static(path.join(__dirname, "build")));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectat"))
  .catch((err) => console.error(err));

app.listen(process.env.PORT, () => {
  console.log(`Server pornit pe portul ${process.env.PORT}`);
});
