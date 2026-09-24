import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/publish-2e7g_sgF.js
var listPlatforms = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a82933418019a07798e5ff9327663eb2a9e3c4636eb5ef27724ac00023afdbd4"));
var connectPlatform = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((platform) => String(platform)).handler(createSsrRpc("054e275c0d1ca4d5bdf2a51f02a64c64cc745ca1c3083796ca1fe8e6c51aaaf2"));
var queuePublish = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("12d0b4ec252b554d8e9cdc2af60714dcb3763d3b4eecf27454e129cc63ab44f5"));
var listPublishing = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5c5a17a6415755e94916e8b78bfeded10a4892f9b83d37dfbd056652563bd6dc"));
//#endregion
export { queuePublish as i, listPlatforms as n, listPublishing as r, connectPlatform as t };
