import { QuartzComponent } from "./types"
import script from "./scripts/simple-search.inline"

export const SimpleSearch: QuartzComponent = () => {
  return (
    <div class="simple-search-wrapper">
      <input
        type="text"
        class="simple-search-input"
        placeholder="Search"
        aria-label="Search"
        autocomplete="off"
      />
      <ul class="simple-search-results"></ul>
    </div>
  )
}

SimpleSearch.afterDOMLoaded = script
