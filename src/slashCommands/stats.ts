import {
  SlashCommandBuilder,
  ChannelType,
  TextChannel,
  EmbedBuilder,
  Guild,
} from "discord.js";
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";
import { bulkVerifyEns } from "../services/verificationService";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("stats")
    .setDescription(
      "Shows the number of verified ens names and the number of ens names that are not verified"
    ),
  execute: async (interaction) => {
    console.log("stats");
    await interaction.reply({
      content: "Calculating stats...",
    });
    const {
      membersWithEnsNickname,
      unverifiedEnsMembersWithoutConnectedAccounts,
      usersWithInValidEnsNames,
    } = await bulkVerifyEns(interaction.guild as Guild, false, false);
    console.log({
      membersWithEnsNickname,
      unverifiedEnsMembersWithoutConnectedAccounts,
      usersWithInValidEnsNames,
    });
    await interaction.followUp({
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
