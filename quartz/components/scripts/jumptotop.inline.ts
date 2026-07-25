function setupJumpToTop() {
  const button = document.querySelector(".jump-to-top") as HTMLButtonElement | null
  if (!button) return

  const SHOW_AFTER_PX = 400

  function onScroll() {
    if (window.scrollY > SHOW_AFTER_PX) {
      button!.classList.add("visible")
    } else {
      button!.classList.remove("visible")
    }
  }

  function onClick() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  onScroll()
  window.addEventListener("scroll", onScroll, { passive: true })
  button.addEventListener("click", onClick)

  window.addCleanup?.(() => {
    window.removeEventListener("scroll", onScroll)
    button.removeEventListener("click", onClick)
  })
}

document.addEventListener("nav", setupJumpToTop)
