import { QuartzComponent } from "./types"
import script from "./scripts/jumptotop.inline"

export const JumpToTop: QuartzComponent = () => {
  return (
    <button class="jump-to-top" aria-label="Jump to top" title="Jump to top">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}

JumpToTop.afterDOMLoaded = script
