// 密码验证模块 —— 所有看板页面共用
(function() {
  var HASH = "3cc14e5c15b91cc22b1fece291c79b3404d9d5aff2a20a487272dcab3af204b3";
  var KEY = "ecom_dash_auth";

  async function sha256(msg) {
    var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(msg));
    return Array.from(new Uint8Array(buf)).map(function(b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  function showGate() {
    var overlay = document.createElement("div");
    overlay.id = "auth-overlay";
    overlay.innerHTML = '<div style="max-width:360px;width:100%;text-align:center">'
      + '<div style="font-size:48px;margin-bottom:16px">🔒</div>'
      + '<h2 style="font-size:20px;margin-bottom:8px;color:#f8fafc">经营数据看板</h2>'
      + '<p style="color:#94a3b8;font-size:14px;margin-bottom:24px">请输入访问密码</p>'
      + '<input id="auth-pwd" type="password" placeholder="输入密码" '
      + 'style="width:100%;padding:12px 16px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f8fafc;font-size:16px;outline:none;text-align:center">'
      + '<button id="auth-btn" style="width:100%;margin-top:12px;padding:12px;border-radius:8px;border:none;background:#3b82f6;color:#fff;font-size:16px;font-weight:600;cursor:pointer">进入看板</button>'
      + '<p id="auth-err" style="color:#ef4444;font-size:13px;margin-top:12px;display:none">密码错误，请重试</p>'
      + '</div>';
    overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#0f172a;display:flex;justify-content:center;align-items:center;z-index:99999";
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    var inp = document.getElementById("auth-pwd");
    var btn = document.getElementById("auth-btn");
    var err = document.getElementById("auth-err");

    async function tryAuth() {
      var h = await sha256(inp.value);
      if (h === HASH) {
        sessionStorage.setItem(KEY, "1");
        overlay.remove();
        document.body.style.overflow = "";
      } else {
        err.style.display = "block";
        inp.value = "";
        inp.focus();
      }
    }
    btn.addEventListener("click", tryAuth);
    inp.addEventListener("keydown", function(e) { if (e.key === "Enter") tryAuth(); });
    setTimeout(function() { inp.focus(); }, 100);
  }

  if (sessionStorage.getItem(KEY) !== "1") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showGate);
    } else {
      showGate();
    }
  }
})();
