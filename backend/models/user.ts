import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface User {
  email: string;
  password: string;
  currentBoard: URL;
  currentCross: URL;
  currentCircle: URL;
  profilePic: URL;
}

const UserSchema = new Schema({
  email: String,
  password: String,
  currentBoard: { type: String, default: null },
  currentCross: { type: String, default: null },
  currentCircle: { type: String, default: null },
  profilePic: { type: String, default: null },
});

export default mongoose.model<User>("users", UserSchema);
