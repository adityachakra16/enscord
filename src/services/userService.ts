import UserDetails from "../schemas/UserDetails";
import UserDetailsModel from "../schemas/UserDetails";
import { IUserDetails } from "../types";

export async function usersThatHaveVerifiedEthAddress(
  userIdsArray: string[]
): Promise<IUserDetails[]> {
  const users = await UserDetailsModel.find({ userID: { $in: userIdsArray } });
  return users;
}
