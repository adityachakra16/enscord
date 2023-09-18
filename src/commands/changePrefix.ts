import { TextChannel } from "discord.js";
import { Command } from "../types";

const command: Command = {
  name: "changePrefix",
  execute: (message, args) => {
    let prefix = args[1];
    if (!prefix)
      return (message.channel as TextChannel).send("No prefix provided");
    if (!message.guild) return;
    (message.channel as TextChannel).send("Prefix successfully changed!");
  },
  permissions: ["Administrator"],
  aliases: [],
};

export default command;
