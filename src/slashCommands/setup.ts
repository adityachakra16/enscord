import {
  SlashCommandBuilder,
  ChannelType,
  TextChannel,
  EmbedBuilder,
  Guild,
  PermissionFlagsBits,
} from "discord.js";
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";
import { bulkVerifyEns } from "../services/verificationService";

const command: SlashCommand = {
  command: (new SlashCommandBuilder() as any)
    .setName("setup")
    .setDescription("Setup ENS Cord")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addBooleanOption((option: any) =>
      option
        .setName("notify")
        .setDescription("Notify existing members to verify their ENS names")
        .setRequired(true)
    )
    .addBooleanOption((option: any) =>
      option
        .setName("max-protection")
        .setDescription(
          "Prevent existing members from posting if they have not verified ENS name"
        )
        .setRequired(true)
    ),
  execute: async (interaction) => {
    interaction.reply({
      content: "Setting up ENS Cord...",
    });

    const {
      membersWithEnsNickname,
      unverifiedEnsMembersWithoutConnectedAccounts,
      usersWithInValidEnsNames,
    } = await bulkVerifyEns(
      interaction.guild as Guild,
      interaction.options.getBoolean("notify") as boolean,
      interaction.options.getBoolean("max-protection") as boolean
    );

    await interaction.followUp({
      content: "Setup Completed. Here are the current stats:",
      embeds: [
        new EmbedBuilder().setTitle("ENS Stats").setFields([
          {
            name: "Members with ENS names",
            value: membersWithEnsNickname.toString(),
          },
          {
            name: "Members with ENS names that are verified",
            value: (
              membersWithEnsNickname -
              unverifiedEnsMembersWithoutConnectedAccounts -
              usersWithInValidEnsNames
            ).toString(),
          },
          {
            name: "Members with ENS names that are not verified",
            value: (
              unverifiedEnsMembersWithoutConnectedAccounts +
              usersWithInValidEnsNames
            ).toString(),
          },
        ]),
      ],
    });
  },
  cooldown: 10,
};

export default command;
