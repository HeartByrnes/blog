import { resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentProps } from "./types"

export const HomeButton: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (fileData.slug === "index") return null

  return (
    <a href={resolveRelative(fileData.slug!, "index" as any)} class="home-button" aria-label="Back to home">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    </a>
  )
}
