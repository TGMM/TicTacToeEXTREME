import express from "express";

const router = express();

router.get("/scores", async (req, res) => {
  return res.sendStatus(200);
});
