import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  churchName: string;
  tagline: string;
  logo: string;
  heroImage: string;
  liveStreamUrl: string;
  serviceTimings: string;
  location: string;
  phone: string;
  email: string;
  facebookUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  paystackEnabled: boolean;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    churchName: { type: String, default: "Jesus Convoy" },
    tagline: { type: String, default: "Advancing God's Kingdom Together" },
    logo: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    liveStreamUrl: { type: String, default: "" },
    serviceTimings: {
      type: String,
      default: "Sunday: 8am & 10:30am | Wednesday: 6pm",
    },
    location: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    paystackEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
export default Settings;
