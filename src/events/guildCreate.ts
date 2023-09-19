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

    console.log(`Joined ${guild.name}`);

    // Create ENS related roles
    const ensVerifiedRole = await guild.roles.create({
      name: "ENS Verified",
      color: 1, //green
    });
    const ensUnverifiedRole = await guild.roles.create({
      name: "ENS Unverified",
      color: 0, //red
    });

    try {
      let newGuild = new GuildModel({
        guildID: guild.id,
        options: {},
        joinedAt: Date.now(),
        ensVerifiedRoleID: ensVerifiedRole.id,
        ensUnverifiedRoleID: ensUnverifiedRole.id,
      });
      await newGuild.save();
    } catch (err) {
      console.log({ err });
    }

    // Find every member that has an ENS name
    await bulkVerifyEns(guild, true);
  },
};

export default event;
