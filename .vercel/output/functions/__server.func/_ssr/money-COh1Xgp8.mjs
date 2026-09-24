import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/money-COh1Xgp8.js
var getEarnings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("86142a47cf4ad78d994b0f29432b4ebfbee86eafd46b684c847646cb52485ee7"));
var requestWithdrawal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a2dd4135fe7c016af1763d6831b66f4bd06433363a04ad9d2c2b7e84e49eefba"));
var getAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("962fa6ac841d1133fec8b56f9715100e7975396788a54f66c2f8e30e27349a81"));
//#endregion
export { getEarnings as n, requestWithdrawal as r, getAnalytics as t };
