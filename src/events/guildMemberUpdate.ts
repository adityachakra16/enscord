import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Guild,
  GuildMember,
  User,
} from "discord.js";
import { BotEvent } from "../types";
import UserDetails from "../schemas/UserDetails";
import { isEnsOwner } from "../services/ensService";
import GuildModel from "../schemas/Guild";
import { verifyEns } from "../services/verificationService";

const event: BotEvent = {
  name: "guildMemberUpdate",
  execute: async (oldMember: GuildMember, newMember: GuildMember) => {
    console.log("guildMemberUpdate");
    const verified = await verifyEns(newMember);
  },
};

export default event;