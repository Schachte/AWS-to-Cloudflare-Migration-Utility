import { useState } from "react";
import CloudflareContext, {
  CloudflareConnection,
} from "../context/CloudflareStore";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import AWSContext, { AWSConnection } from "../context/AWSStore";

export default function App({ Component, pageProps }: AppProps) {
  const [cloudflareConnection, setCloudflareConnection] =
    useState<CloudflareConnection>({});
  const [awsConnection, setAWSConnection] = useState<AWSConnection>({});

  return (
    <CloudflareContext.Provider
      value={{
        cloudflareConnection,
        setCloudflareConnection,
      }}
    >
      <AWSContext.Provider
        value={{
          awsConnection,
          setAWSConnection,
        }}
      >
        <Component {...pageProps} />
      </AWSContext.Provider>
    </CloudflareContext.Provider>
  );
}
