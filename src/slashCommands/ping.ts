import {
  SlashCommandBuilder,
  ChannelType,
  TextChannel,
  EmbedBuilder,
} from "discord.js";
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the bot's ping"),
  execute: (interaction) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: "ENS Cord" })
          .setDescription(
            `A Discord bot that protects your ENS name from impersonators 🙅‍♀️`
          )
          .setColor(getThemeColor("text")),
      ],
    });
  },
  cooldown: 10,
};

export default command;
