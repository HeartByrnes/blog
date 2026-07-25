import { resolveRelative } from "../util/path"
import { Date as DateComponent, getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import script from "./scripts/postlist.inline"

const PAGE_SIZE = 10

// Renders the chronological post list. Only active on the homepage (slug === "index") —
// returns nothing on every other page, so it's safe to attach to every "content" page
// without a separate condition system.
export const PostList: QuartzComponent = ({ cfg, fileData, allFiles }: QuartzComponentProps) => {
  if (fileData.slug !== "index") return null

  const posts = allFiles
    .filter((f) => f.slug?.startsWith("posts/") && f.slug !== "posts/index")
    .sort((a, b) => {
      const da = a.dates ? getDate(a)!.getTime() : 0
      const db = b.dates ? getDate(b)!.getTime() : 0
      return db - da
    })

  return (
    <div class="postlist" data-page-size={PAGE_SIZE}>
      <ul class="postlist-ul section-ul">
        {posts.map((page) => {
          const title = page.frontmatter?.title ?? page.slug
          const description = page.description ?? page.frontmatter?.description ?? ""
          return (
            <li class="postlist-li section-li">
              <div class="section">
                <p class="meta">
                  {page.dates && <DateComponent date={getDate(page)!} locale={cfg.locale} />}
                </p>
                <div class="desc">
                  <h2>
                    <a
                      href={resolveRelative(fileData.slug!, page.slug!)}
                      class="internal internal-link"
                    >
                      {title}
                    </a>
                  </h2>
                  {description && <p class="postlist-excerpt">{description}</p>}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <div class="postlist-sentinel" aria-hidden="true"></div>
    </div>
  )
}

PostList.css = `
.postlist-excerpt {
  margin: 0.35rem 0 0 0;
  color: var(--darkgray);
}
.postlist-li {
  margin-bottom: 1.75rem;
}
.postlist h2 {
  margin: 0;
}
.postlist-sentinel {
  height: 1px;
}
`
PostList.afterDOMLoaded = script
