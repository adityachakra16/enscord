import { GuildMember } from "discord.js";
import { verifyEns } from "../services/verificationService";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: "guildMemberAdd",
  execute: async (member: GuildMember) => {
    console.log("guildMemberAdd");
    if (member.nickname?.endsWith(".eth")) await verifyEns(member);
  },
};

export default event;
