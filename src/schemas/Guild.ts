import { Schema, model } from "mongoose";
import { IGuild } from "../types";

const GuildSchema = new Schema<IGuild>({
  guildID: { required: true, type: String, unique: true },
  options: {
    prefix: { type: String, default: process.env.PREFIX },
  },
  ensVerifiedRoleID: { type: String },
  ensUnverifiedRoleID: { type: String },
});

const GuildModel = model("guild", GuildSchema);

export default GuildModel;
