import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email."],
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  passwordHash: {
    type: String,
    required: [true, "Please provide a password."],
  },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
