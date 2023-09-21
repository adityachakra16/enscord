import { ChannelType, Guild } from "discord.js";
import GuildModel from "../schemas/Guild";
import { bulkVerifyEns } from "../services/verificationService";
import { BotEvent } from "../types";

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
      color: 0, //red,
    });

    // Update permissions for unverified ENS role to not be able to send messages
    const channels = await guild.channels.fetch();
    channels.forEach(async (channel) => {
      if (channel?.type === ChannelType.GuildText) {
        await channel.permissionOverwrites.create(ensUnverifiedRole, {
          SendMessages: false,
        });
      }
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

    // // Find every member that has an ENS name and verify them
    // await bulkVerifyEns(guild, true);
  },
};

export default event;
