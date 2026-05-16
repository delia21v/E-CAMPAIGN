const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Campaign = require("./models/Campaign");
const PetitionSignature = require("./models/PetitionSignature");
const Donation = require("./models/Donation");
const VolunteerApplication = require("./models/VolunteerApplication");
const ForumTopic = require("./models/ForumTopic");
const ForumReply = require("./models/ForumReply");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([
    Campaign.deleteMany(),
    PetitionSignature.deleteMany(),
    Donation.deleteMany(),
    VolunteerApplication.deleteMany(),
    ForumTopic.deleteMany(),
    ForumReply.deleteMany(),
  ]);

  const admin = await User.findOneAndUpdate(
    { username: "admin" },
    {
      username: "admin",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      isAdmin: true,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const demoUser = await User.findOneAndUpdate(
    { username: "demo" },
    {
      username: "demo",
      email: "demo@example.com",
      password: await bcrypt.hash("demo123", 10),
      isAdmin: false,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const [schoolCampaign, healthCampaign] = await Campaign.create([
    {
      title: "Acces la educatie pentru copii vulnerabili",
      slug: "acces-la-educatie",
      summary: "Strangem sprijin pentru rechizite, mentorat si activitati educationale.",
      description: "Campanie sociala pentru sprijinirea copiilor aflati in risc de abandon scolar.",
      category: "educatie",
      goal: "500 de copii sprijiniti prin voluntariat si donatii",
      targetAmount: 25000,
      createdBy: admin._id,
    },
    {
      title: "Sanatate si siguranta pentru comunitati",
      slug: "sanatate-si-siguranta",
      summary: "Promovam accesul la informare, sprijin si servicii de baza.",
      description: "Campanie umanitara pentru comunitati vulnerabile si familii cu copii.",
      category: "umanitar",
      goal: "1000 de semnaturi pentru sustinerea initiativei",
      targetAmount: 15000,
      createdBy: admin._id,
    },
  ]);

  await PetitionSignature.create([
    {
      campaignId: schoolCampaign._id,
      userId: demoUser._id,
      fullName: "Andrei Popescu",
      email: "andrei@example.com",
      city: "Ramnicu Valcea",
      message: "Sustin accesul egal la educatie.",
    },
    {
      campaignId: schoolCampaign._id,
      fullName: "Maria Ionescu",
      email: "maria@example.com",
      city: "Bucuresti",
      message: "Este o cauza importanta.",
    },
  ]);

  await Donation.create([
    {
      campaignId: schoolCampaign._id,
      userId: demoUser._id,
      donorName: "Andrei Popescu",
      email: "andrei@example.com",
      amount: 100,
    },
    {
      campaignId: healthCampaign._id,
      donorName: "Ioana Dumitru",
      email: "ioana@example.com",
      amount: 250,
    },
  ]);

  await VolunteerApplication.create([
    {
      userId: demoUser._id,
      fullName: "Andrei Popescu",
      email: "andrei@example.com",
      phone: "0712345678",
      city: "Ramnicu Valcea",
      age: 21,
      motivation: "Vreau sa ajut la organizarea atelierelor pentru copii.",
      status: "pending",
    },
  ]);

  const topic = await ForumTopic.create({
    title: "Cum putem promova petitia in comunitate?",
    body: "Propun sa strangem idei pentru distribuirea campaniei in scoli si centre comunitare.",
    authorId: demoUser._id,
    campaignId: schoolCampaign._id,
  });

  await ForumReply.create({
    topicId: topic._id,
    body: "Putem pregati afise si o postare standard pentru social media.",
    authorId: admin._id,
  });

  console.log("Seed e-campaign finalizat.");
  console.log("Admin: admin / admin123");
  console.log("User demo: demo / demo123");
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
