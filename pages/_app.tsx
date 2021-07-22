import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Windmill } from "@windmill/react-ui";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Windmill>
      <Component {...pageProps} />
    </Windmill>
  );
}

export default MyApp;
