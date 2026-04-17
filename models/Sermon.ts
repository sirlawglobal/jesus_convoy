import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISermon extends Document {
  title: string;
  speaker: string;
  topic: string;
  date: Date;
  videoUrl?: string;
  audioUrl?: string;
  description?: string;
  thumbnail?: string;
  tags: string[];
  views: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const SermonSchema = new Schema<ISermon>(
  {
    title: { type: String, required: true, trim: true },
    speaker: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    videoUrl: { type: String, default: "" },
    audioUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    slug: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

const Sermon: Model<ISermon> =
  mongoose.models.Sermon || mongoose.model<ISermon>("Sermon", SermonSchema);
export default Sermon;
