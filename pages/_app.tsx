import "../styles/globals.css";
import "../styles/marker.css";
import "../styles/table.css";

import Head from "next/head";
import type { AppProps } from "next/app";
import { Windmill } from "@windmill/react-ui";
import NavBar from "../components/NavBar";

import { SidebarProvider } from "../lib/hooks";
import theme from "../utils/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Windmill usePreferences theme={theme}>
      <Head>
        <meta charSet="utf-8" />
        <link
          rel="icon"
          href="https://cdn.coronasafe.network/care-manifest/images/icons/icon-192x192.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0e9f6e" />
        <meta
          name="description"
          content="A data visualization dashboard with capacity map, plots and charts of districts."
        />
        <link
          rel="apple-touch-icon"
          href="https://cdn.coronasafe.network/care-manifest/images/icons/icon-192x192.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <title>Care Dashboard</title>
      </Head>
      <SidebarProvider>
        <NavBar />
        <Component {...pageProps} />
      </SidebarProvider>
    </Windmill>
  );
}

export default MyApp;
