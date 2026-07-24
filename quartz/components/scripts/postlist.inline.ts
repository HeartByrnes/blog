function setupPostList() {
  const container = document.querySelector(".postlist") as HTMLElement | null
  if (!container) return

  const pageSize = parseInt(container.dataset.pageSize ?? "10", 10)
  const items = Array.from(container.querySelectorAll(".postlist-li")) as HTMLElement[]
  const sentinel = container.querySelector(".postlist-sentinel") as HTMLElement | null

  let shown = 0
  let observer: IntersectionObserver | null = null

  function revealNext() {
    const next = items.slice(shown, shown + pageSize)
    for (const el of next) {
      el.style.display = ""
    }
    shown += next.length

    if (shown >= items.length) {
      observer?.disconnect()
      if (sentinel) sentinel.style.display = "none"
    }
  }

  // Hide everything, then reveal the first page immediately
  for (const el of items) {
    el.style.display = "none"
  }
  revealNext()

  if (sentinel && shown < items.length) {
    observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        revealNext()
      }
    })
    observer.observe(sentinel)
  }
}

document.addEventListener("nav", setupPostList)
