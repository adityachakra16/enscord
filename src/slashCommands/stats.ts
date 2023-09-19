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
    const {
      membersWithEnsNickname,
      unverifiedEnsMembersWithoutConnectedAccounts,
      usersWithInValidEnsNames,
    } = await bulkVerifyEns(interaction.guild as Guild, true, true);
    console.log({
      membersWithEnsNickname,
      unverifiedEnsMembersWithoutConnectedAccounts,
      usersWithInValidEnsNames,
    });
    interaction.reply({
      embeds: [
        new EmbedBuilder().setTitle("ENS Stats").setFields([
          {
            name: "Members with ENS names",
            value: membersWithEnsNickname.toString(),
          },
          {
            name: "Members with ENS names that are not verified",
            value: unverifiedEnsMembersWithoutConnectedAccounts.toString(),
          },
          {
            name: "Members with ENS names that are not owned by them",
            value: usersWithInValidEnsNames.toString(),
          },
        ]),
      ],
    });
  },
  cooldown: 10,
};

export default command;
