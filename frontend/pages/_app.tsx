import React from "react";
import { AppProps } from "next/app";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  createAuthenticationAdapter,
  getDefaultWallets,
  lightTheme,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { SiweMessage } from "siwe";
import { useRouter } from "next/router";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string }),
    publicProvider(),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "ENS Cord",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({
  Component,
  pageProps,
  err,
}: AppProps & { err: Error }) {
  const [authenticationStatus, setAuthenticationStatus] = React.useState<
    "unauthenticated" | "authenticated"
  >("unauthenticated");

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const token = localStorage.getItem("userToken") || "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BOT_URI}/auth/nonce`,
        {
          headers: { Authorization: token },
          credentials: "include",
        }
      );
      const res = await response.text();
      return res;
    },
    createMessage: ({ nonce, address, chainId }) => {
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
    },
    getMessageBody: ({ message }) => {
      return message.prepareMessage();
    },
    verify: async ({ message, signature }) => {
      const token = localStorage.getItem("userToken") || "";
      console.log({ message, signature });
      const verifyRes: any = await fetch(
        `${process.env.NEXT_PUBLIC_BOT_URI}/auth/wallet`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify({ message, signature }),
          credentials: "include",
        }
      );
      setAuthenticationStatus(
        verifyRes.ok ? "authenticated" : "unauthenticated"
      );
      return Boolean(verifyRes.ok);
    },
    signOut: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BOT_URI}/auth/signout`,
        {
          credentials: "include",
        }
      );
    },
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={authenticationStatus}
      >
        <RainbowKitProvider chains={chains} modalSize={"compact"}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}
