import UserDetailsModel from "../../schemas/UserDetails";

export async function connect(code: string) {
  console.log({
    code,
    clientId: process.env.CLIENT_ID,
    token: process.env.CLIENT_SECRET,
  });
  const oauthResult = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID as string,
      client_secret: process.env.CLIENT_SECRET as string,
      code: code as string,
      grant_type: "authorization_code",
      redirect_uri: `${process.env.DISCORD_REDIRECT_URI}/linkDiscord`,
      scope: "guilds",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const oauthData: any = await oauthResult.json();
  console.log({ oauthData });

  const userResult = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${oauthData.token_type} ${oauthData.access_token}`,
    },
  });
  const userData = await userResult.json();
  console.log({
    userData,
  });
  const user = await UserDetailsModel.findOne({
    userID: userData.id,
  });
  console.log({ user });
  if (user)
    return {
      user,
      discordUsername: userData.username,
    };

  const newUser = new UserDetailsModel({
    userID: userData.id,
    verified: false,
    verifiedAt: new Date(),
    ethAddresses: [],
    discordIds: [userData.id],
  });
  const res = await newUser.save();
  return {
    user: res,
    discordUsername: userData.username,
  };
}
