import React from "react";

export type CloudflareConnection = {
  accountId?: string;
  bearerToken?: string;
}

export type CloudflareConnectionContext = {
  cloudflareConnection?: CloudflareConnection,
  setCloudflareConnection: (input: CloudflareConnection) => void 
}

const CloudflareContext = React.createContext<CloudflareConnectionContext>({
  setCloudflareConnection: () => {}
})

export default CloudflareContext;