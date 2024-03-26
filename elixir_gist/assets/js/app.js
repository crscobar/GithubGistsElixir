// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")

let Hooks = {}

Hooks.UpdateLineNumbers = {
  mounted() {
    const lineNumberText = document.querySelector("#gist-line-numbers")

    this.el.addEventListener("input", () => {
      this.updateLineNumbers()
    })

    this.el.addEventListener("scroll", () => {
      lineNumberText.scrollTop = this.el.scrollTop
    })

    this.el.addEventListener("keydown", (e) => {
      if (e.key == "Tab") {
        e.preventDefault();
        var start = this.el.selectionStart
        var end = this.el.selectionEnd
        this.el.value = this.el.value.substring(0, start) + "\t" + this.el.value.substring(end)
        this.el.selectionStart = this.el.selectionEnd = start + 1
      }
    })

    this.handleEvent("clear-textareas", () => {
      this.el.value = ""
      lineNumberText.value = "1\n"
    })

    this.updateLineNumbers()
  },

  updateLineNumbers() {
    const lineNumberText = document.querySelector("#gist-line-numbers")
    console.log("In updateLineNumbers")
    if (!lineNumberText) return

    const lines = this.el.value.split("\n")
    const numbers = lines.map((_, index) => index + 1).join("\n") + "\n"

    return lineNumberText.value = numbers
  }
};

let liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  params: {_csrf_token: csrfToken},
  hooks: Hooks
})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

