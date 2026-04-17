/**
 * Seed script – creates a default admin user and sample data.
 * Run: npx tsx scripts/seed.ts
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/jesus_convoy";

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  // Dynamic imports (models expect Mongoose to be connected first)
  const { default: User } = await import("../models/User");
  const { default: Ministry } = await import("../models/Ministry");
  const { default: Sermon } = await import("../models/Sermon");
  const { default: Event } = await import("../models/Event");
  const { default: BlogPost } = await import("../models/BlogPost");
  const { default: Announcement } = await import("../models/Announcement");
  const { default: Settings } = await import("../models/Settings");

  // Clear existing
  await Promise.all([
    User.deleteMany({}), Ministry.deleteMany({}), Sermon.deleteMany({}),
    Event.deleteMany({}), BlogPost.deleteMany({}), Announcement.deleteMany({}),
  ]);

  // Users
  const adminPw = await bcrypt.hash("admin123", 12);
  const leaderPw = await bcrypt.hash("leader123", 12);
  const workerPw = await bcrypt.hash("worker123", 12);

  const admin = await User.create({ name: "Pastor John Convoy", email: "admin@jesusconvoy.org", password: adminPw, role: "admin" });
  const leader = await User.create({ name: "Deacon Samuel Ade", email: "leader@jesusconvoy.org", password: leaderPw, role: "leader" });
  const worker = await User.create({ name: "Sister Grace", email: "worker@jesusconvoy.org", password: workerPw, role: "worker" });

  // Ministry
  const ministry = await Ministry.create({
    name: "Worship & Music",
    description: "Leading the congregation in Spirit-filled worship and praise through music and prayer.",
    leader: leader._id,
    workers: [worker._id],
  });

  // Assign ministry to leader/worker
  await User.findByIdAndUpdate(leader._id, { ministry: ministry._id });
  await User.findByIdAndUpdate(worker._id, { ministry: ministry._id });

  // Sermons
  await Sermon.insertMany([
    { title: "Walking in Divine Purpose", speaker: "Pastor John Convoy", topic: "Faith", date: new Date("2026-04-13"), description: "Discover how to identify and walk boldly in the divine purpose God has for your life.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", slug: "walking-in-divine-purpose", views: 142 },
    { title: "The Power of Prayer", speaker: "Pastor John Convoy", topic: "Prayer", date: new Date("2026-04-06"), description: "Unlock the transformative power of consistent, faith-filled prayer.", slug: "the-power-of-prayer", views: 98 },
    { title: "Living in Kingdom Abundance", speaker: "Deacon Samuel Ade", topic: "Stewardship", date: new Date("2026-03-30"), description: "Understanding God's economy and how to be a faithful steward of His blessings.", slug: "living-in-kingdom-abundance", views: 75 },
  ]);

  // Events
  const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);
  const nextMonth = new Date(); nextMonth.setDate(nextMonth.getDate() + 30);
  await Event.insertMany([
    { title: "Annual Church Convention 2026", description: "Join us for a powerful 3-day convention featuring worship, prayers, and anointed ministry.", date: nextMonth, location: "Jesus Convoy Auditorium, Lagos", registrationOpen: true },
    { title: "Youth Night Friday", description: "An electrifying evening of worship, Word, and fellowship for young adults.", date: nextWeek, location: "Church Grounds", registrationOpen: true },
  ]);

  // Blog Posts
  await BlogPost.create({ title: "5 Ways to Deepen Your Relationship with God", slug: "5-ways-to-deepen-relationship-with-god", content: `Spending time with God is the cornerstone of the Christian life. Here are five practical ways to strengthen your walk with Him.\n\n1. **Daily Scripture Reading** – Make it a habit to read at least one chapter of the Bible every day.\n\n2. **Prayer Journal** – Write your prayers and watch God answer them over time.\n\n3. **Fast Regularly** – Fasting sharpens your spiritual sensitivity.\n\n4. **Fellowship** – Don't forsake the gathering of believers.\n\n5. **Serve Others** – Serving is a powerful act of worship.`, category: "Devotional", author: admin._id, published: true, publishedAt: new Date() });

  // Announcements
  await Announcement.insertMany([
    { title: "Welcome to Jesus Convoy!", message: "We are thrilled to have you join our community. Explore our website to learn more about our services and ministries.", audience: "all", priority: "normal", createdBy: admin._id },
    { title: "Volunteer Training This Saturday", message: "All ministry workers are expected to attend the volunteer training session this Saturday at 9am in the main hall.", audience: "workers", priority: "high", createdBy: admin._id },
  ]);

  // Settings
  await Settings.findOneAndUpdate({}, {
    churchName: "Jesus Convoy",
    tagline: "Advancing God's Kingdom Together",
    serviceTimings: "Sunday: 8am & 10:30am | Wednesday: 6pm",
    location: "Lagos, Nigeria",
    email: "info@jesusconvoy.org",
    phone: "+234 800 000 0000",
    paystackEnabled: true,
  }, { upsert: true });

  console.log("\n🎉 Seed complete!");
  console.log("─────────────────────────────────────────────");
  console.log("  Admin:  admin@jesusconvoy.org  / admin123");
  console.log("  Leader: leader@jesusconvoy.org / leader123");
  console.log("  Worker: worker@jesusconvoy.org / worker123");
  console.log("─────────────────────────────────────────────\n");

  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
