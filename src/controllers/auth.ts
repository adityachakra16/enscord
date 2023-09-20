import { generateNonce } from "siwe";
import UserDetailsModel from "../schemas/UserDetails";
import { connect as connectDiscord } from "../services/auth/discord";
import { generateToken, verifyToken } from "../services/auth/jwt";
import { connect as connectWallet, getNonce } from "../services/auth/wallet";

const express = require("express");
const router = express.Router();

// Sample user API endpoints
router.post("/discord", async (req: any, res: any) => {
  const discordUser = await connectDiscord(req.query.code);
  console.log({ discordUser });
  const jwtToken = generateToken(discordUser.user.userID);

  res.status(200).send({
    jwtToken,
    discordUser,
    auth: true,
  });
});

router.get("/nonce", verifyToken, async (req: any, res: any) => {
  const nonce = await getNonce();
  res.status(200).send(nonce);
});

router.post("/wallet", verifyToken, async (req: any, res: any) => {
  const ethAddress = await connectWallet(req.body.message, req.body.signature);
  console.log({
    uId: req.userId,
  });
  const user = await UserDetailsModel.findOne({
    userID: req.userId,
  });
  console.log({ user });
  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }

  user.ethAddresses.push(ethAddress);
  await user.save();

  res.status(200).send({
    user,
  });
});

export default router;
