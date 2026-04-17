import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMinistry extends Document {
  name: string;
  description: string;
  leader?: mongoose.Types.ObjectId;
  workers: mongoose.Types.ObjectId[];
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MinistrySchema = new Schema<IMinistry>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    leader: { type: Schema.Types.ObjectId, ref: "User", default: null },
    workers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Ministry: Model<IMinistry> =
  mongoose.models.Ministry || mongoose.model<IMinistry>("Ministry", MinistrySchema);
export default Ministry;
