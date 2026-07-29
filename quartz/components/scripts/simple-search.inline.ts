function setupSimpleSearch() {
  const input = document.querySelector(".simple-search-input") as HTMLInputElement | null
  if (!input) return

  async function runSearch() {
    const query = input!.value.trim().toLowerCase()
    if (!query) return

    // fetchData is a global promise set up by Quartz core on every page,
    // resolving static/contentIndex.json — the same data the full search
    // component uses. Reusing it avoids re-fetching or reimplementing indexing.
    const index = await (window as any).fetchData
    const words = query.split(/\s+/).filter(Boolean)

    let bestSlug: string | null = null
    let bestScore = 0

    for (const slug of Object.keys(index)) {
      const entry = index[slug]
      const title = (entry.title ?? "").toLowerCase()
      const content = (entry.content ?? "").toLowerCase()

      let score = 0
      if (title.includes(query)) score += 10
      if (content.includes(query)) score += 3
      for (const word of words) {
        if (title.includes(word)) score += 2
        if (content.includes(word)) score += 1
      }

      if (score > bestScore) {
        bestScore = score
        bestSlug = slug
      }
    }

    if (bestSlug) {
      window.location.href = "/" + bestSlug
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      runSearch()
    }
  }

  input.addEventListener("keydown", onKeydown)
  window.addCleanup?.(() => input.removeEventListener("keydown", onKeydown))
}

document.addEventListener("nav", setupSimpleSearch)
