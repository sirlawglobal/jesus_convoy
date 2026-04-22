import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDonation extends Document {
  donorName: string;
  email: string;
  amount: number;
  currency: "NGN" | "USD";
  category: "tithe" | "offering" | "donation";
  reference: string;
  status: "pending" | "success" | "failed";
  createdAt: Date;
}

const DonationSchema = new Schema<IDonation>(
  {
    donorName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ["NGN", "USD"], default: "NGN" },
    category: { type: String, enum: ["tithe", "offering", "donation"], default: "donation" },
    reference: { type: String, required: true, unique: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  },
  { timestamps: true }
);

const Donation: Model<IDonation> =
  mongoose.models.Donation || mongoose.model<IDonation>("Donation", DonationSchema);
export default Donation;
