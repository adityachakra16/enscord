import { Schema, model } from "mongoose";
import { IUserDetails } from "../types";

const UserDetailsSchema = new Schema<IUserDetails>({
  userID: { required: true, type: String },
  ethAddresses: { required: true, type: [String] },
  discordIds: { required: true, type: [String] },
  verified: { required: true, type: Boolean },
  verifiedAt: { required: true, type: Date },
});

const UserDetailsModel = model("userDetails", UserDetailsSchema);

export default UserDetailsModel;
