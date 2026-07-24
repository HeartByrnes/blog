import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as builtinPlugins from "./quartz/plugins/index"
import { PostList } from "./quartz/components/PostList"

// loadQuartzConfig() builds its own PageTypeDispatcher internally from an unmodified
// layout, so a separately-mutated `layout` export is never actually consulted by the
// build. To inject a custom component, we load layout ourselves, splice PostList into
// it, then swap out the dispatcher the config already has for one built from our layout.
const config = await loadQuartzConfig()

const layout = await loadQuartzLayout()
const contentLayout = layout.byPageType.content ?? {}
contentLayout.afterBody = [
  ...(contentLayout.afterBody ?? layout.defaults.afterBody ?? []),
  PostList,
]
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
