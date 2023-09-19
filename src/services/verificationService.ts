import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Guild,
  GuildMember,
} from "discord.js";
import { usersThatHaveVerifiedEthAddress } from "./userService";
import { isEnsOwner } from "./ensService";
import GuildModel from "../schemas/Guild";
import UserDetails from "../schemas/UserDetails";

export async function verifyEns(member: GuildMember): Promise<boolean> {
  // Fetch the roles associated with ENS verification
  const guild = member.guild;
  const guildModel = await GuildModel.findOne({
    where: { guildID: guild.id },
  });
  const unverifiedEnsRoleId = guildModel?.ensUnverifiedRoleID;
  if (!unverifiedEnsRoleId) throw new Error("Unverified ENS role not found");
  const unverifiedEnsRole = guild.roles.cache.get(unverifiedEnsRoleId);
  if (!unverifiedEnsRole) throw new Error("Unverified ENS role not found");
  const verifiedEnsRoleId = guildModel?.ensVerifiedRoleID;
  if (!verifiedEnsRoleId) throw new Error("Verified ENS role not found");
  const verifiedEnsRole = guild.roles.cache.get(verifiedEnsRoleId);
  if (!verifiedEnsRole) throw new Error("Verified ENS role not found");

  if (member.nickname?.endsWith(".eth")) {
    //check if ethaddress exists is valid

    const userDetails = await UserDetails.findOne({
      where: { userId: member.id },
    });
    if (
      !userDetails?.ethAddresses?.length ||
      !isEnsOwner(userDetails.ethAddresses, member.nickname)
    ) {
      await member.send({
        content: `Your display name is ${member.nickname} in ${guild.name} server, but you have not verified your ENS Name. Please verify your ENS name to send messages or change your server nickname.`,
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents([
            new ButtonBuilder()
              .setLabel("Verify ENS Name")
              .setStyle(ButtonStyle.Link)
              .setURL("http://localhost:3000/verify"),
          ]),
        ],
      });
      await member.roles.add(unverifiedEnsRole);
      return false;
    }
    member.roles.add(verifiedEnsRole);
  }
  member.roles.remove(unverifiedEnsRole);
  return true;
}

export async function bulkVerifyEns(
  guild: Guild,
  warnUnverifiedEnsOwners?: boolean,
  blockFromPosting?: boolean
): Promise<{
  membersWithEnsNickname: number;
  unverifiedEnsMembersWithoutConnectedAccounts: number;
  usersWithInValidEnsNames: number;
}> {
  const members = await guild.members.fetch();
  const membersWithEnsNickname = members.filter((member) =>
    member.nickname?.endsWith(".eth")
  );
  console.log({ membersWithEnsNickname });

  // Find every member that has an ENS name and has connected their account
  const usersWithConnectedAccounts = await usersThatHaveVerifiedEthAddress(
    membersWithEnsNickname.map((member) => member.id)
  );
  console.log({ usersWithConnectedAccounts });

  // Find every member that has an ENS name and has not connected their account
  const userIdsWithConnectedAccounts = usersWithConnectedAccounts.map(
    (user) => user.userID
  );
  const unverifiedEnsMembersWithoutConnectedAccounts =
    membersWithEnsNickname.filter(
      (member) => !userIdsWithConnectedAccounts.includes(member.id)
    );
  console.log({ unverifiedEnsMembersWithoutConnectedAccounts });

  // Send a message to every member that has an ENS name and has not connected their account
  if (warnUnverifiedEnsOwners)
    unverifiedEnsMembersWithoutConnectedAccounts.forEach((member) => {
      member.send({
        content: `Your display name is ${member.nickname} in ${guild.name} server, but you have not verified your ENS Name. Please verify your ENS name to send messages or change your server nickname.`,
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents([
            new ButtonBuilder()
              .setLabel("Verify ENS Name")
              .setStyle(ButtonStyle.Link)
              .setURL("http://localhost:3000/verify"),
          ]),
        ],
      });
    });

  // Find every member that has a a connected account but does not own the ENS name that they have set
  const userIdToEnsMap = membersWithEnsNickname.reduce(
    (acc, user) => {
      acc[user.id] = user.nickname as string;
      return acc;
    },
    {} as {
      [key: string]: string;
    }
  );
  const usersWithInValidEnsNames = usersWithConnectedAccounts.filter((user) => {
    const ensName = userIdToEnsMap[user.userID];
    return !isEnsOwner(user.ethAddresses, ensName);
  });
  console.log({ usersWithInValidEnsNames });

  // Send a message to every member that has a a connected account but does not own the ENS name that they have set
  if (warnUnverifiedEnsOwners)
    usersWithInValidEnsNames.forEach((user) => {
      const member = members.get(user.userID);
      member?.send({
        content: `Your display name is ${member.nickname} in ${guild.name} server, but you have not verified your ENS Name. Please verify your ENS name to send messages or change your server nickname.`,
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents([
            new ButtonBuilder()
              .setLabel("Verify ENS Name")
              .setStyle(ButtonStyle.Link)
              .setURL("http://localhost:3000/verify"),
          ]),
        ],
      });
    });

  // Block every member (other than admins) that does not have a verified ENS from posting messages
  if (blockFromPosting) {
    const guildModel = await GuildModel.findOne({
      guildID: guild.id,
    });
    if (!guildModel) throw new Error("Guild not found");
    const ensUnverifiedRole = guild.roles.cache.get(
      guildModel.ensUnverifiedRoleID
    );
    if (!ensUnverifiedRole) throw new Error("ENS Unverified role not found");
    usersWithInValidEnsNames.forEach((user) => {
      const member = members.get(user.userID);
      member?.roles.add(ensUnverifiedRole);
    });
  }

  return {
    membersWithEnsNickname: membersWithEnsNickname.size,
    unverifiedEnsMembersWithoutConnectedAccounts:
      unverifiedEnsMembersWithoutConnectedAccounts.size,
    usersWithInValidEnsNames: usersWithInValidEnsNames.length,
  };
}