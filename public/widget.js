(function () {
  function getCurrentScript() {
    if (document.currentScript) return document.currentScript;
    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1] || null;
  }

  function qs(sel) {
    try {
      return document.querySelector(sel);
    } catch (e) {
      return null;
    }
  }

  function mount(opts) {
    opts = opts || {};
    var baseUrl = opts.baseUrl || "";
    var container =
      typeof opts.container === "string" ? qs(opts.container) : opts.container;
    if (!container) throw new Error("DMVHeatPumpsWidget: container not found");

    var mode = opts.mode || "sizing";
    var src = baseUrl.replace(/\/$/, "") + "/widget/embed?mode=" + encodeURIComponent(mode);

    var iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = "DMV Heat Pumps Widget";
    iframe.style.width = "100%";
    iframe.style.border = "0";
    iframe.style.display = "block";
    iframe.style.background = "transparent";
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    iframe.setAttribute("allow", "clipboard-write");

    // Start with a reasonable height; the embed will postMessage resize events.
    iframe.style.height = "540px";

    var token = "dmvheatpumps-" + Math.random().toString(36).slice(2);
    iframe.dataset.dmvheatpumpsToken = token;

    function onMessage(ev) {
      try {
        if (!ev || !ev.data || ev.data.type !== "dmvheatpumps:resize") return;
        if (typeof ev.data.height !== "number") return;
        // Only accept from same origin if baseUrl provided; otherwise accept all (for local dev).
        if (baseUrl) {
          var expectedOrigin = new URL(baseUrl, window.location.href).origin;
          if (ev.origin !== expectedOrigin) return;
        }
        var h = Math.max(220, Math.min(2000, Math.round(ev.data.height)));
        iframe.style.height = h + "px";
      } catch (e) {}
    }

    window.addEventListener("message", onMessage);

    // Replace contents (idempotent)
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(iframe);

    return {
      iframe: iframe,
      unmount: function () {
        window.removeEventListener("message", onMessage);
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }
    };
  }

  // Auto-mount when included with data-dmvheatpumps
  try {
    var s = getCurrentScript();
    if (s && (s.hasAttribute("data-dmvheatpumps") || s.getAttribute("data-dmvheatpumps") === "")) {
      var containerSel = s.getAttribute("data-container") || "#dmv-heatpumps";
      var baseUrl = s.getAttribute("data-base-url") || "";
      var mode = s.getAttribute("data-mode") || "sizing";
      mount({ container: containerSel, baseUrl: baseUrl, mode: mode });
    }
  } catch (e) {
    // swallow
  }

  window.DMVHeatPumpsWidget = { mount: mount };
})();

