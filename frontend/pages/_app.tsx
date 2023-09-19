import React from "react";
import { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({
  Component,
  pageProps,
  err,
}: AppProps & { err: Error }) {
  return <Component {...pageProps} />;
}
