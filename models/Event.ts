import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location?: string;
  image?: string;
  registrationOpen: boolean;
  registrations: { name: string; email: string; phone?: string; registeredAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, default: "" },
    image: { type: String, default: "" },
    registrationOpen: { type: Boolean, default: false },
    registrations: [
      {
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        registeredAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;
