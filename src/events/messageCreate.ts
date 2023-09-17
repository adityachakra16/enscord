import { ChannelType, Message } from "discord.js";
import {
  checkPermissions,
  getGuildOption,
  sendTimedMessage,
} from "../functions";
import { BotEvent } from "../types";
import mongoose from "mongoose";

const event: BotEvent = {
  name: "messageCreate",
  execute: async (message: Message) => {
    console.log("messageCreate");
  },
};

export default event;
