import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "leader" | "worker";
  ministry?: mongoose.Types.ObjectId;
  avatar?: string;
  phone?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "leader", "worker"], default: "worker" },
    ministry: { type: Schema.Types.ObjectId, ref: "Ministry", default: null },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
