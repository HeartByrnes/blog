// fetchData is a classic (non-module) global set up by Quartz core in its own
// <script> tag on every page — a top-level `const`, which creates a shared lexical
// binding across classic scripts on the page but does NOT attach to `window`.
// Referencing it as window.fetchData (as an earlier version of this file did)
// silently resolved to undefined and failed with no visible error.
declare const fetchData: Promise<Record<string, any>>

type ScoredResult = {
  slug: string
  title: string
  excerpt: string
  score: number
}

// Only actual posts and individual tag pages should be searchable — not the
// homepage, the auto-generated posts/ or tags/ folder listings, or anything else.
function isSearchable(slug: string): boolean {
  if (slug.startsWith("posts/") && slug !== "posts/index") return true
  if (slug.startsWith("tags/") && slug !== "tags/index") return true
  return false
}

// Only posts and tag pages should be searchable — not the homepage, the auto-generated
// posts/index or tags/index folder listings, or anything else.
function isSearchable(slug: string): boolean {
  const parts = slug.split("/")
  if (parts.length < 2) return false
  const [section] = parts
  const last = parts[parts.length - 1]
  if (section !== "posts" && section !== "tags") return false
  if (last === "index") return false
  return true
}

function scoreEntries(index: Record<string, any>, query: string): ScoredResult[] {
  const q = query.toLowerCase()
  const words = q.split(/\s+/).filter(Boolean)
  const results: ScoredResult[] = []

  for (const slug of Object.keys(index)) {
    if (!isSearchable(slug)) continue
    const entry = index[slug]
    const title = (entry.title ?? "").toString()
    const content = (entry.content ?? "").toString()
    const titleLower = title.toLowerCase()
    const contentLower = content.toLowerCase()

    let score = 0
    if (titleLower.includes(q)) score += 10
    if (contentLower.includes(q)) score += 3
    for (const word of words) {
      if (titleLower.includes(word)) score += 2
      if (contentLower.includes(word)) score += 1
    }

    if (score > 0) {
      const matchIdx = contentLower.indexOf(words[0] ?? q)
      const start = Math.max(0, matchIdx - 30)
      const excerpt = content.slice(start, start + 100).trim()
      results.push({ slug, title, excerpt, score })
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 6)
}

function setupSimpleSearch() {
  const wrapper = document.querySelector(".simple-search-wrapper") as HTMLElement | null
  const input = wrapper?.querySelector(".simple-search-input") as HTMLInputElement | null
  const resultsList = wrapper?.querySelector(".simple-search-results") as HTMLElement | null
  if (!wrapper || !input || !resultsList) return

  let index: Record<string, any> | null = null
  let currentResults: ScoredResult[] = []

  async function ensureIndex() {
    if (!index) {
      index = await fetchData
    }
    return index!
  }

  function renderResults(results: ScoredResult[]) {
    currentResults = results
    resultsList!.innerHTML = ""

    if (results.length === 0) {
      wrapper!.classList.remove("has-results")
      return
    }

    for (const r of results) {
      const li = document.createElement("li")
      li.className = "simple-search-result"
      const titleEl = document.createElement("div")
      titleEl.className = "simple-search-result-title"
      titleEl.textContent = r.title
      const excerptEl = document.createElement("div")
      excerptEl.className = "simple-search-result-excerpt"
      excerptEl.textContent = r.excerpt
      li.appendChild(titleEl)
      li.appendChild(excerptEl)
      li.addEventListener("mousedown", (e) => {
        // mousedown (not click) so this fires before the input's blur hides the list
        e.preventDefault()
        window.location.href = "/" + r.slug
      })
      resultsList!.appendChild(li)
    }

    wrapper!.classList.add("has-results")
  }

  async function onInput() {
    const query = input!.value.trim()
    if (!query) {
      renderResults([])
      return
    }
    const idx = await ensureIndex()
    renderResults(scoreEntries(idx, query))
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && currentResults.length > 0) {
      window.location.href = "/" + currentResults[0].slug
    } else if (e.key === "Escape") {
      renderResults([])
      input!.blur()
    }
  }

  function onBlur() {
    // small delay so mousedown on a result can still register
    setTimeout(() => wrapper!.classList.remove("has-results"), 100)
  }

  function onFocus() {
    if (currentResults.length > 0) wrapper!.classList.add("has-results")
  }

  input.addEventListener("input", onInput)
  input.addEventListener("keydown", onKeydown)
  input.addEventListener("blur", onBlur)
  input.addEventListener("focus", onFocus)

  window.addCleanup?.(() => {
    input!.removeEventListener("input", onInput)
    input!.removeEventListener("keydown", onKeydown)
    input!.removeEventListener("blur", onBlur)
    input!.removeEventListener("focus", onFocus)
  })
}

document.addEventListener("nav", setupSimpleSearch)
