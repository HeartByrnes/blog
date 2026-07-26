import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as builtinPlugins from "./quartz/plugins/index"
import Flex from "./quartz/components/Flex"
import { Search } from "@quartz-community/search"
import { Darkmode } from "@quartz-community/darkmode"
import { PostList } from "./quartz/components/PostList"
import { JumpToTop } from "./quartz/components/JumpToTop"
import { HomeButton } from "./quartz/components/HomeButton"

// loadQuartzConfig() builds its own PageTypeDispatcher internally from an unmodified
// layout, so a separately-mutated `layout` export is never actually consulted by the
// build. To inject custom components, we load layout ourselves, splice them in, then
// swap out the dispatcher the config already has for one built from our layout.
const config = await loadQuartzConfig()
const layout = await loadQuartzLayout()

// Rebuild the toolbar as HomeButton + Search + Darkmode, in that order, so the back
// arrow sits to the left of the search box. Search/Darkmode are disabled in the YAML
// config and constructed directly here instead, since the YAML grouping system
// resolves into a flat, already-merged component and can't be joined after the fact.
const Toolbar = Flex({
  components: [
    { Component: HomeButton, grow: false },
    { Component: Search(), grow: true },
    { Component: Darkmode(), grow: false },
  ],
  gap: "0.5rem",
})

// Every entry in byPageType already has its own (often empty) beforeBody/afterBody
// array, which fully replaces layout.defaults for that page type rather than falling
// back to it — so Toolbar/JumpToTop have to be appended per page type individually.
layout.defaults.beforeBody = [Toolbar, ...(layout.defaults.beforeBody ?? [])]
layout.defaults.afterBody = [...(layout.defaults.afterBody ?? []), JumpToTop]
for (const pageType of Object.keys(layout.byPageType)) {
  const entry = layout.byPageType[pageType]
  entry.beforeBody = [Toolbar, ...(entry.beforeBody ?? [])]
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
