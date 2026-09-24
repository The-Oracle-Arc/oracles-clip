import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/content-Cryr-qN7.js
var ingestSource = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("4ab3b371d983ac7d40dfbdb86c7babc1b38b35807aa7a810da14ef9617277da2"));
var listSources = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f2b03bb4302609c130b1eaebff6a4960cb4400f74952dead62ffba9a043f91d4"));
var getSourceAnalysis = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((sourceId) => String(sourceId)).handler(createSsrRpc("09631b65e4173bf5d8e674bad759e5e1df68f2d44740219d2a6895c8f3881f6d"));
var createClipsFromCandidates = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("2995a149738752b7cdc4a2c246f1ba621e8a55dd8a8152c922c382db9c226610"));
var createSeriesFromSource = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("420b839e7359ae43581b4803d5182597342e5dae319d637fba5e3e6ac4c480da"));
var listContent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input ?? {}).handler(createSsrRpc("9095e1f6f996d234e74071b08b71af9856ed4c753c583a43d95bcb267d75146c"));
var getClip = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => String(id)).handler(createSsrRpc("1e4dceeba5268d18fbf8d09db29be11805392bdc0cf62d2f6b930954a752bbe4"));
var updateClip = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("296a979429682dd0f200841b1edb6a33e80085e5fd7031662b4b738372cf7a64"));
var listSeries = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d6553e1753db4045946c9b758adb2866c16c45e6f7e4913a89a7614b4ee1fb6c"));
var getSeries = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => String(id)).handler(createSsrRpc("bff499585f550a121ba9560d564093a50ff9eab33d935f34e98bfce894c22e39"));
//#endregion
export { getSourceAnalysis as a, listSeries as c, getSeries as i, listSources as l, createSeriesFromSource as n, ingestSource as o, getClip as r, listContent as s, createClipsFromCandidates as t, updateClip as u };
