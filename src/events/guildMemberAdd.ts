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
  name: "guildMemberAdd",
  execute: async (member: GuildMember) => {
    console.log("guildMemberAdd");
    const verified = await verifyEns(member);
  },
};
