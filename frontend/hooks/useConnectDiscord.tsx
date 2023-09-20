import { useRouter } from "next/router";
import { useEffect } from "react";

export default function useConnectDiscord() {
  const router = useRouter();
  const { code, state } = router.query;

  const fetchDiscordUser = async () => {
    if (!code) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BOT_URI}/auth/discord?code=${code}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log({ res });
    if (!res.ok) {
      throw new Error("Failed to fetch discord user");
    }

    const data = await res.json();
    console.log({ data });
    localStorage.setItem("discordId", data.id);
    localStorage.setItem("userToken", data.jwtToken);

    return data;
  };

  useEffect(() => {
    if (code) {
      void fetchDiscordUser().then((userData: any) => {
        window.opener.postMessage({ discordUser: userData.discordUser }, "*");
        window.close();
      });
    }
  }, [code]);
}
