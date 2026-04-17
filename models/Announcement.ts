import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  message: string;
  audience: "all" | "workers" | "ministry";
  ministry?: mongoose.Types.ObjectId;
  priority: "low" | "normal" | "high";
  expiresAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    audience: { type: String, enum: ["all", "workers", "ministry"], default: "all" },
    ministry: { type: Schema.Types.ObjectId, ref: "Ministry", default: null },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    expiresAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
export default Announcement;
