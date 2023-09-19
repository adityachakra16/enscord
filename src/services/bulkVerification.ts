import { Guild } from "discord.js";
import { usersThatHaveVerifiedEthAddress } from "./userService";
import { isEnsOwner } from "./ensService";
import GuildModel from "../schemas/Guild";

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
      member.send(
        "You have an ENS name set, but you have not connected your account. Please connect your account to verify your ENS name."
      );
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
      member?.send(
        `You have an ENS name set, but you do not own the ENS name that you have set. Please set an ENS name that you own or connect a different account.`
      );
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
