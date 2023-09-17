import {
  Client,
  GatewayIntentBits,
  Collection,
  PermissionFlagsBits,
  Partials,
} from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers } =
  GatewayIntentBits;
const { Channel, GuildMember, User } = Partials;
const client = new Client({
  intents: [Guilds, MessageContent, GuildMessages, GuildMembers],
  partials: [Channel, GuildMember, User],
});
import { Command, SlashCommand } from "./types";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
config();

client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, "./handlers");
readdirSync(handlersDir).forEach((handler) => {
  if (!handler.endsWith(".js")) return;
  require(`${handlersDir}/${handler}`)(client);
});

console.log("client");
client.login(process.env.TOKEN);
