import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import Image from "next/image";
import Logo from "../public/logo_4.png";

export default function Home() {
  return (
    <div className="flex flex-col items-center		 justify-center gap-8">
      <Image src={Logo} width={400} height={400} alt="Enscord Logo" />
      <div className="text-2xl font-bold">
        A Discord bot that protects your ENS name from impersonators
      </div>
      <a
        href="https://discord.com/api/oauth2/authorize?client_id=1152847163550867466&permissions=469764096&scope=bot"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button>
          <b>Add to Server</b>
        </button>
      </a>
    </div>
  );
}
