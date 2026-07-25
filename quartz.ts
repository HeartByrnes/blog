import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as builtinPlugins from "./quartz/plugins/index"
import { PostList } from "./quartz/components/PostList"
import { JumpToTop } from "./quartz/components/JumpToTop"

// loadQuartzConfig() builds its own PageTypeDispatcher internally from an unmodified
// layout, so a separately-mutated `layout` export is never actually consulted by the
// build. To inject custom components, we load layout ourselves, splice them in, then
// swap out the dispatcher the config already has for one built from our layout.
const config = await loadQuartzConfig()

const layout = await loadQuartzLayout()

// Every entry in byPageType already has its own (often empty) afterBody array, which
// fully replaces layout.defaults.afterBody for that page type rather than falling back
// to it — so JumpToTop has to be appended to each page type individually, and to
// defaults too, to actually show up everywhere.
layout.defaults.afterBody = [...(layout.defaults.afterBody ?? []), JumpToTop]
for (const pageType of Object.keys(layout.byPageType)) {
  const entry = layout.byPageType[pageType]
  entry.afterBody = [...(entry.afterBody ?? []), JumpToTop]
}

// PostList only renders on the homepage (it self-checks fileData.slug === "index"),
// so it's safe to add to "content" specifically without affecting other post pages.
const contentLayout = layout.byPageType.content ?? {}
contentLayout.afterBody = [...(contentLayout.afterBody ?? []), PostList]
layout.byPageType.content = contentLayout

config.plugins.emitters = config.plugins.emitters.filter(
  (e) => e.name !== "PageTypeDispatcher",
)
config.plugins.emitters.push(
  builtinPlugins.PageTypes.PageTypeDispatcher({
    defaults: layout.defaults,
    byPageType: layout.byPageType,
  }),
)

export default config
export { layout }
