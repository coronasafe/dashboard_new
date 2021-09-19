import "../styles/globals.css";
import "../styles/marker.css";
import "../styles/table.css";

import Head from "next/head";
import type { AppProps } from "next/app";
import { Windmill } from "@windmill/react-ui";
import NavBar from "../components/NavBar";

import { SidebarProvider } from "../lib/hooks";
import theme from "../utils/theme";
import Filter from "../components/Filter";
import { Filters } from "../components/Filters";
import ContentNav from "../components/ContentNav";
import { useRouter } from "next/router";
import { FACILITY_TYPES } from "../lib/common";

function MyApp({ Component, pageProps }: AppProps) {
  const query = new URLSearchParams(
    process.browser ? window.location.search : ""
  );
  const initialFacilityType = (query.get("facility_type") as string)
    ?.split(",")
    .map((i) => {
      const key = parseInt(i.trim());
      return key >= 0 ? FACILITY_TYPES[key] : null;
    })
    .filter((i) => i != null) as string[];
  const initialDate = query.get("date") as string;
  const filterProps = { initialFacilityType, initialDate, query };

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
        <div className="container mx-auto px-4">
          <ContentNav />
          <Filters {...filterProps} />
        </div>
        <Component {...pageProps} {...filterProps} />
      </SidebarProvider>
    </Windmill>
  );
}

export default MyApp;
