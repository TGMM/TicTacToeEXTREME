import express from "express";
import { isValidObjectId, Types } from "mongoose";
import verifyAccess from "../middleware/verifyAccess";
import Skin, { Skin as SkinModel } from "../models/skin";
import User from "../models/user";

const router = express();

const route = "skin";

router.get(`/${route}`, async (req, res) => {
  const skins = await Skin.find().populate("author").exec();

  if (!skins) return res.sendStatus(404);

  return res.json(skins);
});

router.get(`/${route}/:id`, async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.sendStatus(400);

  const skin = await Skin.findById(id).populate("author").exec();

  if (!skin) return res.sendStatus(404);

  return res.json(skin);
});

router.post(`/${route}`, verifyAccess, async (req, res) => {
  const newSkin = req.body as Omit<SkinModel, "author"> & {
    author: Types.ObjectId;
  };
  console.log(newSkin);
  if (newSkin.type == undefined || !newSkin.url || !newSkin.title)
    return res.sendStatus(400);

  const author = await User.findOne({ email: req.userId }).exec();
  if (!author) return res.sendStatus(500);

  newSkin.author = author._id;

  const skinDoc = new Skin(newSkin);
  skinDoc.save();

  res.status(200).json(skinDoc.toJSON());
});

router.patch(`/${route}/:id`, verifyAccess, async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.sendStatus(400);

  const skinUpdate = req.body as SkinModel;
  if (!skinUpdate.type && !skinUpdate.url && !skinUpdate.title)
    return res.sendStatus(200);

  const skin = await Skin.findById(id).populate("author").exec();
  if (!skin) return res.sendStatus(404);

  if (skin.author.email != req.userId) return res.sendStatus(403);

  await skin.updateOne(skinUpdate).exec();

  res.status(200).send();
});

router.delete(`/${route}/:id`, verifyAccess, async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.sendStatus(400);

  const skin = await Skin.findById(id).populate("author").exec();
  if (!skin) return res.sendStatus(404);

  if (skin.author.email != req.userId) return res.sendStatus(403);

  await skin.remove();

  res.status(200).send();
});

router.get("/userSkins", verifyAccess, async (req, res) => {
  console.log(req.userId);
  if (!req.userId) return res.sendStatus(401);

  const user = await User.findOne({ email: req.userId }).exec();
  if (!user) return res.sendStatus(404);

  return res.status(200).json({
    board: user.currentBoard,
    cross: user.currentCross,
    circle: user.currentCircle,
  });
});

router.patch("/userSkins", verifyAccess, async (req, res) => {
  console.log(req.userId);
  if (!req.userId) return res.sendStatus(401);

  const user = await User.findOne({ email: req.userId }).exec();
  if (!user) return res.sendStatus(404);

  const skin = await Skin.findById(req.body.skinId).exec();
  if (!skin) return res.sendStatus(404);

  switch (skin.type) {
    case 0:
      user.currentBoard = skin.url;
      break;
    case 1:
      user.currentCross = skin.url;
      break;
    case 2:
      user.currentCircle = skin.url;
      break;
    default:
      break;
  }

  user.save();

  return res.sendStatus(200);
});

export default router;
