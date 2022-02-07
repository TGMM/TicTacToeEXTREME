import mongoose from "mongoose";
import { User } from "./user";
const Schema = mongoose.Schema;

export interface Skin {
  type: number;
  url: URL;
  author: User;
  title: string;
}

const SkinSchema = new Schema({
  type: Number,
  url: String,
  author: { type: Schema.Types.ObjectId, ref: "users" },
  title: String,
});

export default mongoose.model<Skin>("skins", SkinSchema);
