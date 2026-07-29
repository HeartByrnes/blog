import { QuartzComponent } from "./types"
import script from "./scripts/simple-search.inline"

export const SimpleSearch: QuartzComponent = () => {
  return (
    <input
      type="text"
      class="simple-search-input"
      placeholder="Search"
      aria-label="Search"
      autocomplete="off"
    />
  )
}

SimpleSearch.afterDOMLoaded = script
