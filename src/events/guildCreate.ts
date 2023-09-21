import { ChannelType, Guild, Role } from "discord.js";
import GuildModel from "../schemas/Guild";
import { bulkVerifyEns } from "../services/verificationService";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: "guildCreate",
  execute: async (guild: Guild) => {
    console.log(`Joined ${guild.name}`);

    try {
      const guildExists = await GuildModel.exists({ guildID: guild.id });
      if (guildExists) throw new Error("Guild already exists");

      let ensVerifiedRole = guild.roles.cache.find(
        (role) => role.name === "ENS Verified"
      );
      let ensUnverifiedRole = guild.roles.cache.find(
        (role) => role.name === "ENS Unverified"
      );

      // Create ENS related roles
      if (!ensVerifiedRole)
        ensVerifiedRole = await guild.roles.create({
          name: "ENS Verified",
          color: 1, //green
        });

      if (!ensUnverifiedRole)
        ensUnverifiedRole = await guild.roles.create({
          name: "ENS Unverified",
          color: 0, //red,
        });
      console.log({ ensVerifiedRole, ensUnverifiedRole });
      // Update permissions for unverified ENS role to not be able to send messages
      const channels = await guild.channels.fetch();
      channels.forEach(async (channel) => {
        if (channel?.type === ChannelType.GuildText) {
          await channel.permissionOverwrites.create(ensUnverifiedRole as Role, {
            SendMessages: false,
          });
        }
      });
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
