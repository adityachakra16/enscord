import { GuildMember } from "discord.js";
import { verifyEns } from "../services/verificationService";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: "guildMemberUpdate",
  execute: async (oldMember: GuildMember, newMember: GuildMember) => {
    console.log("guildMemberUpdate");

    if (newMember.nickname?.endsWith(".eth")) await verifyEns(newMember);
  },
};

export default event;
