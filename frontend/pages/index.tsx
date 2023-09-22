import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import Image from "next/image";
import Logo from "../public/logo_4.png";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center		 justify-center gap-8">
        <Image src={Logo} width={400} height={400} alt="Enscord Logo" />
        <div className="text-2xl font-bold">
          A Discord bot that protects your ENS name from impersonators
        </div>
        <a
          href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=2617248784&scope=bot`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>
            <b>Add to Server</b>
          </button>
        </a>
        <a
          className="hover: cursor-pointer underline"
          href={"https://github.com/adityachakra16/enscord#how-it-works"}
          target="_blank"
          rel="noopener noreferrer"
        >
          How it works
        </a>
        <div className="text-sm text-gray-500">
          ENS Cord is still in alpha and may contain bugs. Please reach out to
          @chakra17 on Discord if you plan to add it to your server.
        </div>
      </div>
      <a
        href="https://github.com/adityachakra16/enscord"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-0 right-0 text-gray-700 hover:text-gray-900 text-sm flex items-center space-x-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 250 250"
          fill="#151513"
          className="position: absolute; top: 0; right: 0"
        >
          <path d="M0 0l115 115h15l12 27 108 108V0z" fill="#fff" />
          <path
            d="M128 109c-15-9-9-19-9-19 3-7 2-11 2-11-1-7 3-2 3-2 4 5 2 11 2 11-3 10 5 15 9 16"
            className="octo-arm -webkit-transform-origin: 130px 106px; transform-origin: 130px 106px"
          />
          <path
            className="octo-body"
            d="M115 115s4 2 5 0l14-14c3-2 6-3 8-3-8-11-15-24 2-41 5-5 10-7 16-7 1-2 3-7 12-11 0 0 5 3 7 16 4 2 8 5 12 9s7 8 9 12c14 3 17 7 17 7-4 8-9 11-11 11 0 6-2 11-7 16-16 16-30 10-41 2 0 3-1 7-5 11l-12 11c-1 1 1 5 1 5z"
          />
        </svg>
      </a>
    </div>
  );
}
