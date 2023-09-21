import { GuildMember } from "discord.js";
import { verifyEns } from "../services/verificationService";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: "guildMemberUpdate",
  execute: async (oldMember: GuildMember, newMember: GuildMember) => {
    console.log("guildMemberUpdate");

    try {
      if (oldMember.nickname === newMember.nickname) return;
      await verifyEns(newMember);
    } catch (err) {
      console.log({ err });
    }
  },
};

export default event;
