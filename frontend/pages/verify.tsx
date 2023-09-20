import React, { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import Image from "next/image";
import Logo from "../public/logo_4.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Connect from "@/components/ConnectButton";

export default function Verify() {
  const [connectedEthaddress, setConnectedEthaddress] = useState<string>("");
  const [discordUsername, setDiscordUsername] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.discordUser) {
          setDiscordUsername(event.data.discordUser?.discordUsername);
        }
      },
      false
    );
  }, []);

  return (
    <div className="flex flex-col items-center		 justify-center gap-8">
      <Image src={Logo} width={200} height={200} alt="Enscord Logo" />
      <div className="text-2xl font-bold">
        Please connect your Discord account and your wallet to verify your ENS
        name
      </div>
      {!discordUsername && (
        <a
          href="#"
          onClick={() => {
            const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FlinkDiscord&response_type=code&scope=guilds%20identify`;
            window.open(url, "popup", "width=600,height=600");
          }}
        >
          <button>
            <b>Connect Discord</b>
          </button>
        </a>
      )}
      {discordUsername && (
        <div>
          <b>Discord Username:</b> {discordUsername}
        </div>
      )}
      <a href="#">
        <Connect />
      </a>
    </div>
  );
}
