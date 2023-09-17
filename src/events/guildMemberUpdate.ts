import { Guild, GuildMember, User } from "discord.js";
import { BotEvent } from "../types";
import UserDetails from "../schemas/UserDetails";
import { isEnsOwner } from "../services/ensService";

const event: BotEvent = {
  name: "guildMemberUpdate",
  execute: async (oldMember: GuildMember, newMember: GuildMember) => {
    console.log("guildMemberUpdate");
    if (newMember.nickname?.endsWith(".eth")) {
      //check if ethaddress exists is valid
      const userDetails = await UserDetails.findOne({
        where: { userId: newMember.id },
      });
      if (!userDetails?.ethAddresses?.length) {
        await newMember.edit({ nick: null });
        await newMember.send(
          "Please verify your ethereum address to set your username as an ENS name."
        );
        return;
      }
      if (!isEnsOwner(userDetails.ethAddresses, newMember.nickname)) {
        await newMember.edit({ nick: null });
        await newMember.send(
          "Please set an ENS name that you own or connect an ethereum address that owns this ENS name. Your connected ethAddresses are"
        );
        return;
      }
    }
  },
};

export default event;
