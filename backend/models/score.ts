import mongoose from "mongoose";
import { User } from "./user";
const Schema = mongoose.Schema;

export interface UserScore {
  user: User;
  matchesWon: number;
  score: number;
}

const UserScoreSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
  matchesWon: Number,
  score: Number,
});

export default mongoose.model<UserScore>("userScores", UserScoreSchema);
