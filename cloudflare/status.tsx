
import { CloudflareConnectionContext } from "../context/CloudflareStore";

export const checkStatus = async (
    cfContext: CloudflareConnectionContext,
    videoUID: string
  ) => {
    const PROGRESS_URL = `https://api.cloudflare.com/client/v4/accounts/${cfContext.cloudflareConnection?.accountId}/stream/${videoUID}`
    const resp = await fetch(PROGRESS_URL,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cfContext.cloudflareConnection?.bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return await resp.json();
  };
