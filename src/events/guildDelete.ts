import { Guild } from "discord.js";
import GuildModel from "../schemas/Guild";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: "guildDelete",
  execute: async (guild: Guild) => {
    console.log("guildDelete");
    try {
      await GuildModel.deleteOne({ guildID: guild.id });
    } catch (err) {
      console.log({ err });
    }
  },
};

export default event;
