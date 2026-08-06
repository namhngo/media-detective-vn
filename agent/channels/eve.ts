import { eveChannel } from "eve/channels/eve";
import { httpBasic, localDev } from "eve/channels/auth";

const internalToken = process.env.EVE_INTERNAL_TOKEN;

/**
 * Next.js is the only production caller. Local development keeps Eve's loopback
 * access so evals and the Next dev server work without exposing a public route.
 */
export default eveChannel({
  auth: internalToken
    ? [
        httpBasic({ username: "next-api", password: internalToken }),
        localDev(),
      ]
    : [localDev()],
});
