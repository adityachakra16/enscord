import { GuildMember } from "discord.js";
import { verifyEns } from "../services/verificationService";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: "guildMemberAdd",
  execute: async (member: GuildMember) => {
    console.log("guildMemberAdd");
    try {
      await verifyEns(member);
    } catch (err) {
      console.log({ err });
    }
  },
};

export default event;
