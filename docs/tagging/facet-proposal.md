# Initial tag facet proposal

This proposal is based on production catalog schema v1: 259 tags and 3,626
projects. It assigns one proposed facet to every tag. It does not propose or
activate parent relationships, and it does not change production.

The proposal applies the definitions in the
[tagging conventions](https://github.com/bestofjs/bestofjs/blob/develop/docs/tagging/conventions.md):
an ecosystem is a technology community or platform, a category is a coherent
project landscape or recognizable project family, a capability is
cross-cutting functionality, and a property is a defining characteristic. A
project may have multiple meaningful category identities, and categories may
form strict broad-to-narrow hierarchies. In particular, `ai` remains a
capability and the stable exclusion anchor for the `noai` deployment.

## Proposed facet counts

| Facet      |    Tags |
| ---------- | ------: |
| Ecosystem  |      39 |
| Category   |      75 |
| Capability |     138 |
| Property   |       7 |
| **Total**  | **259** |

## Reviewed choices

- `test` is the broad Testing category, and `test-framework` is a narrower
  category. The intended `test-framework -> test` relationship will be reviewed
  with the parent proposal before activation.
- `chart` is a category: its catalog meaning is the recognizable family of
  charting and data-visualization libraries, not incidental chart support.
- `fullstack` is a category because its name and catalog meaning are
  “Full-stack framework.” A project may also have another meaningful category,
  such as Node.js framework.
- `design-system` is a capability. In Best of JS it means support for building
  or providing a design system, not a catalog of design-system definitions.
- Category-to-category parents are valid only for strict subset relationships;
  facet compatibility alone never establishes an edge.

## High-confidence assignments

### Ecosystem

`angular`, `astro`, `bootstrap`, `bun`, `d3`, `deno`, `express`, `material`,
`meteor`, `mongodb`, `nextjs`, `node.js`, `react`, `react-native`, `redux`,
`remix`, `rust`, `shadcn`, `solid`, `svelte`, `tailwind`, `vite`, `vue`

### Category

`ai-agents`, `ai-builder`, `ai-coding-agent`, `api`, `baas`, `blog`,
`boilerplate`, `book`, `bot`, `build`, `cad`, `chart`, `cli`, `cms`,
`code-editor`, `code-parser`, `compiler`, `component`, `crm`, `css-lib`,
`css-tool`, `dashboard`, `data-structure`, `db`, `desktop`, `desktop-app`,
`devtool`, `diagram`, `doc`, `ecommerce`, `extension`,
`formatter`, `framework`, `fullstack`, `game`, `hook`, `icon`, `ide`,
`learning`, `lint`, `lowcode`, `md-editor-app`, `middleware`, `module`,
`nodejs-framework`, `orm`, `package`, `playground`, `polyfill`, `presentation`,
`registry`, `rich-text-editor`, `runtime`, `scaffolding`, `sdk`, `ssg`, `state`,
`styleguide`, `template`, `terminal`, `test`, `test-framework`, `viewer`,
`visual-programming`

### Capability

`3d`, `access`, `ai`, `animation`, `archive`, `audio`, `auth`, `autocomplete`,
`automation`, `caching`, `classname`, `color`, `config`, `crdt`, `cron`,
`crypto`, `data-analysis`, `date`, `debug`, `dependencies`, `design-system`,
`di`, `diff`, `dnd`, `dom`, `drawing`, `emoji`, `error`, `filesystem`, `flow`,
`font`, `form`, `format`, `fulltext`, `fuzzy`, `geometry`, `geospatial`, `git`,
`glob`, `graph`,
`highlight`, `http`, `i18n`, `image`, `keyboard`, `layout`, `load`, `log`, `map`,
`mask`, `math`, `menu`, `ml`, `modal`, `money`, `monorepo`, `neural`, `nlp`,
`notify`, `npm-scripts`, `nvm`, `parsing`, `physics`, `prefetch`, `prerender`,
`print`, `process`, `publish`, `pubsub`, `qrcode`, `queue`, `random`, `reactive`,
`regexp`, `routing`, `rpc`, `rss`, `rwd`, `schema`, `scraping`, `screenshot`,
`scrolling`, `search`, `security`, `shell`, `slider`, `spinner`, `spreadsheet`,
`state-machine`, `stats`, `stream`, `string`, `system`, `table`,
`text-processing`, `thread`, `timeline`, `tooltip`, `touch`, `tour`, `tree`,
`types`, `typo`, `upload`, `util`, `validation`, `vdom`, `video`, `virtual`,
`virtual-list`, `window-management`, `workflow`

### Property

`decentralized`, `headless`, `offline`, `self-hosted`, `universal`, `wildcard`

## Ambiguous assignments by proposed facet

These tags still receive a proposed facet, but each deserves human review
before production is changed. Tables lead with the human-readable tag name and
show the stable tag code second. Codes are referenced by other systems and are
therefore significantly harder to change than names or descriptions.

### Ecosystem

| Tag name                | Code              | Plausible alternative | Reason and catalog evidence                                                                                                           |
| ----------------------- | ----------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Blockchain              | `blockchain`      | capability            | Hardhat and Ethereum Remix participate in blockchain communities, while libraries such as ABIType expose blockchain functionality.    |
| Crypto-currency         | `crypto-currency` | capability            | CCXT and BitVision participate in the cryptocurrency ecosystem, although trading and market-data support are capabilities.            |
| GraphQL                 | `graphql`         | capability            | Apollo Server and Altair belong to the GraphQL community; other projects merely add GraphQL support.                                  |
| IoT                     | `iot`             | capability            | Espruino and DeviceScript target the IoT platform/community, while Cylon enables device integration.                                  |
| MCP                     | `mcp`             | capability            | MCP-SDK and MCP-UI participate in the MCP protocol ecosystem; projects can also simply provide MCP integration.                       |
| OpenAPI                 | `openapi`         | capability            | Kubb and Hey API belong to the OpenAPI tooling ecosystem, while projects may merely support OpenAPI generation or consumption.        |
| Protobuf                | `protobuf`        | capability            | Protobuf-ES and protobuf.js belong to the Protobuf tooling ecosystem; serialization is the capability they provide.                   |
| React Server Components | `rsc`             | capability            | Bright and Kotekan participate in React Server Components tooling; other projects simply support RSC.                                 |
| Service Worker          | `serviceworker`   | capability            | Mock Service Worker and next-pwa build on the Service Worker API ecosystem; projects can also merely provide service-worker behavior. |
| SQL                     | `sql`             | capability            | better-sqlite3 and AlaSQL belong to SQL database tooling, while SQL query support is a capability.                                    |
| Web3                    | `web3`            | capability            | ConnectKit and OnchainKit belong to the Web3 community, while projects may only add wallet or chain capabilities.                     |
| Web Assembly            | `webassembly`     | capability            | AssemblyScript and Boa belong to the WebAssembly platform ecosystem; projects may simply compile to or execute WebAssembly.           |
| WebGL                   | `webgl`           | capability            | Babylon.js and Cesium belong to the WebGL rendering ecosystem; projects may simply provide WebGL-based rendering.                     |
| WebRTC                  | `webrtc`          | capability            | Jitsi Meet and MiroTalk build on the WebRTC platform; real-time media transport is the capability.                                    |
| Websocket               | `websocket`       | capability            | Actionhero and Elysia support the WebSocket protocol; messaging over WebSockets is the capability.                                    |
| Web workers             | `webworker`       | capability            | Comlink and Greenlet build on the Web Worker platform API; off-main-thread execution is the capability.                               |

### Category

| Tag name             | Code             | Plausible alternative | Reason and catalog evidence                                                                                                                                        |
| -------------------- | ---------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AI Methodology       | `ai-methodology` | capability            | BMad-Method and Task Master are packaged workflow methods, making this a kind of project; “AI-assisted workflow” could instead be framed as an enabled capability. |
| Atomic CSS           | `atomic-css`     | property              | Panda and Linaria implement an atomic-CSS approach as a tool category; atomic output can also be viewed as a defining property.                                    |
| CSS in JS            | `css-in-js`      | property              | Aphrodite and Compiled are CSS-in-JS tools; generated/styled-through-JavaScript output can also be a project property.                                             |
| HTML template        | `html`           | ecosystem             | Froala Design Blocks and HTML5 Boilerplate are HTML-template artifacts; HTML itself is a web-platform technology.                                                  |
| HTML Tagging         | `html-tagging`   | property              | htmx, Turbo, and Unpoly form an “HTML over the wire” tool family; the approach can also be a project property.                                                     |
| Markup language      | `markup`         | capability            | markdown-it and Asciidoctor.js are markup processors, a recognizable tool kind; rendering markup is also a capability.                                             |
| Meta                 | `meta`           | property              | Best of JS, microjs, and npmx are catalog/discovery projects, suggesting a category; “meta” otherwise reads like an editorial property.                            |
| Plugin / form widget | `plugin`         | capability            | Chosen, Cleave.js, and dual-listbox are form widgets, so the current examples describe a project kind; “plugin” alone could mean extensibility capability.         |
| PWA                  | `pwa`            | property              | PWABuilder and the PWA project are PWA-focused tools; “is a PWA” is a defining application property.                                                               |
| Skills               | `skills`         | capability            | React Best Practices and Modern Web Guidance are packaged agent-skill artifacts; installing instructions also enables agent capabilities.                          |
| Web Components       | `webcomponent`   | ecosystem             | Atomico and Brisa produce Web Components, a recognizable artifact kind; Web Components are also a browser-platform ecosystem.                                      |

### Capability

| Tag name               | Code              | Plausible alternative | Reason and catalog evidence                                                                                                                             |
| ---------------------- | ----------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server-Side Events     | `SSE`             | ecosystem             | better-sse, river.ts, and wayne provide or use an event-streaming capability; the code names the protocol rather than a community.                      |
| Web Analytics          | `analytics`       | category              | Ackee and OpenPanel enable web analytics, while some tagged projects are complete analytics products.                                                   |
| Browser storage        | `browser-storage` | ecosystem             | Dexie.js and LocalForage enable persistence in browser storage APIs; those APIs could be treated as a web-platform ecosystem.                           |
| Canvas                 | `canvas`          | ecosystem             | Atrament and Canvacord enable canvas rendering; the tag is named after the browser platform API.                                                        |
| Chat                   | `chat`            | category              | assistant-ui and Chat SDK enable chat experiences, while Chatpack is a complete chat product.                                                           |
| Browser compatibility  | `compatibility`   | property              | Browserslist and core-js address browser compatibility; compatibility can also describe a project characteristic.                                       |
| CSV                    | `csv`             | ecosystem             | csv-parser and Fast-csv enable CSV processing; CSV itself is a data-format platform rather than a community.                                            |
| Data fetching          | `data`            | category              | Apollo Client and farfetched enable data fetching; the current code/name is broad enough to look like a project category.                               |
| Email                  | `email`           | category              | HEML and JSX email enable email creation, while Haraka is an email server and therefore a different project kind.                                       |
| Event sourcing         | `event-sourcing`  | property              | Booster and reSolve enable event-sourced systems; “event-sourced” can instead characterize an architecture.                                             |
| Flux                   | `flux`            | ecosystem             | Alt and Flummox implement the Flux state-management model, but Flux historically formed a named ecosystem.                                              |
| Functional programming | `fp`              | property              | Effect and crocks enable functional programming; “functional” can also characterize a library’s design.                                                 |
| GPU                    | `gpu`             | ecosystem             | GPU.js and gpu-io enable GPU computation, while WebGPU/GPU runtimes can be viewed as a platform ecosystem.                                              |
| JSON                   | `json`            | ecosystem             | Ajv and devalue process or validate JSON; JSON itself is a data-format platform.                                                                        |
| Key-Value              | `kv`              | category              | Keyv and idb-keyval enable key-value storage, while kvdex is itself a key-value store.                                                                  |
| Markdown               | `md`              | ecosystem             | Catalog and Content Collections process Markdown, while Markdown itself is a format ecosystem.                                                          |
| Micro frontend         | `microfontend`    | category              | single-spa and Piral enable micro-frontends; a “micro-frontend framework” could instead be treated as a project kind.                                   |
| Microservices          | `microservice`    | category              | cote and Claudia.js enable microservice architectures, while Express Gateway is a distinct infrastructure category.                                     |
| Mobile                 | `mobile`          | category              | Capacitor and App Framework enable mobile application development; some tagged projects are mobile UI framework categories.                             |
| PDF                    | `pdf`             | ecosystem             | jsPDF and EmbedPDF enable PDF creation/viewing; PDF itself is a document-format platform.                                                               |
| Performance            | `performance`     | property              | Benchmark.js, Clinic.js, and Bundle Buddy help measure or improve performance; “performant” would instead be a property.                                |
| Real-time              | `realtime`        | property              | better-sse and Colyseus enable real-time updates; “real-time” can also characterize a system.                                                           |
| Social                 | `social`          | category              | The description says social-network integration, which is a capability, but the production catalog currently has no tagged examples to disambiguate it. |
| SVG                    | `svg`             | ecosystem             | beautiful-mermaid and AnyChart generate or render SVG; SVG itself is a web-platform technology.                                                         |
| Webhook                | `webhook`         | category              | @zap-studio/webhooks enables webhook handling, but it is the only example and could represent a webhook-library category.                               |
| XML                    | `xml`             | ecosystem             | fast-xml-parser and xmlbuilder-js process XML; XML itself is a data-format platform.                                                                    |

### Property

| Tag name   | Code         | Plausible alternative | Reason and catalog evidence                                                                                                                               |
| ---------- | ------------ | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Serverless | `serverless` | category              | Architect and Claudia.js target serverless deployment, which characterizes their operating model; “serverless framework” is also a recognizable category. |

## Rename or split review

These recommendations do not alter the proposed facet above. They identify
names whose current wording could keep producing inconsistent assignments.
The code in backticks identifies the existing tag; it is not a proposed new
code. Tag codes are referenced by other systems and should remain stable unless
a separate migration audits consumers and provides compatibility.

- Change the display name of `crypto` to “Cryptography” (capability) so it
  cannot be confused with Crypto-currency.
- Change the display name of `crypto-currency` to “Cryptocurrency” (ecosystem)
  for conventional spelling.
- Keep the stable `data` code, but strengthen the “Data fetching” name and
  description so its narrower capability meaning is unmistakable.
- Change the display name of `format` to “Value formatting” (capability) to
  distinguish it from the Formatter code-formatting category.
- Keep the stable `design-system` code and display name, but add a description
  that makes its “building or providing a design system” capability meaning
  explicit.
- Keep the stable `framework` code and the existing “UI Framework” display name;
  its description should continue to exclude non-UI frameworks.
- Keep the stable `html` code and “HTML template” display name, or merge the tag
  into Template if review finds no meaningful distinction.
- Retire `meta` or change its display name to “Catalog / discovery” (category).
  Its three examples share that meaning, while “Meta” does not communicate it.
- Keep the misspelled `microfontend` code for compatibility for now; the display
  name “Micro frontend” is already correct. Correcting the code requires a
  separate reference migration.
- Split `plugin` into a Form widget category for its present examples and a
  separate extensibility/plugin concept only if projects actually need it. A
  split requires deliberate project reassignment and new stable codes.
- Change the display name of `skills` to “Agent skills” (category) if the
  intended scope remains packaged agent instructions rather than general human
  skills.
- Change the display name of `system` to “OS integration” (capability), matching
  its description.
- Keep the `typo` code for compatibility; the existing “Typography” display
  name is already clear. Correcting the code requires a separate reference
  migration.
- Keep the stable `virtual` code and the existing “Virtual Reality” display
  name.
- Keep the stable `wildcard` code, but rely on its clear “Editor's pick” display
  name (property) in human-facing review.
- Leave `SSE` and `node.js` unchanged. Normalizing these codes would provide
  little taxonomy value compared with the compatibility work it would require.

## Review checkpoint

No production changes should be made from this proposal until a human has
approved the assignments and explicitly listed any deferred tags. Ambiguous
rows should be resolved first; rename and split work can be scheduled
separately if the facet itself is accepted.
