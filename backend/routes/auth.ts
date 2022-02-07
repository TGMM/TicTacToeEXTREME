import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";

const router = express();

router.post("/login", async (req, res) => {
  const email = req.body.email as string;
  const plainpassword = req.body.password as string;

  if (!email || !plainpassword) return res.sendStatus(400);

  const user = await User.findOne({ email });

  if (!user) return res.sendStatus(401);

  const valid = await bcrypt.compare(plainpassword, user.password);

  if (valid) {
    const token = jwt.sign({ id: user.email }, process.env.SECRET!, {
      expiresIn: "1h",
    });
    console.log(token);
    res.cookie("token", token, { httpOnly: false });

    return res.sendStatus(200);
  }

  return res.sendStatus(401);
});

router.post("/register", async (req, res) => {
  const userData: { username: string; email: string; password: string } =
    req.body;

  if (!userData || !userData.email || !userData.password) return;

  const user = new User(userData);
  const exists = await User.findOne({ email: user.email }).exec();

  if (!exists) {
    user.password = await bcrypt.hash(user.password, 10);

    await user.save();

    return res.sendStatus(200);
  }

  return res.sendStatus(403);
});

router.post("/logout", (_, res) => {
  res.clearCookie("token");
  res.sendStatus(200);
});

export default router;
