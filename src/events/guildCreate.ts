import { Guild } from "discord.js";
import GuildModel from "../schemas/Guild";
import { BotEvent } from "../types";
import { usersThatHaveVerifiedEthAddress } from "../services/userService";
import { isEnsOwner } from "../services/ensService";
import { bulkVerifyEns } from "../services/bulkVerification";

const event: BotEvent = {
  name: "guildCreate",
  execute: async (guild: Guild) => {
    console.log("guildCreate");
    try {
      let newGuild = new GuildModel({
        guildID: guild.id,
        options: {},
        joinedAt: Date.now(),
      });
      await newGuild.save();
    } catch (err) {
      console.log({ err });
    }

    console.log(`Joined ${guild.name}`);
    // Find every member that has an ENS name
    await bulkVerifyEns(guild, true);
  },
};

export default event;
