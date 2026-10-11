/* ============================================================
   commit-sim.js — 「处理到哪」vs「提交到哪」交互组件
   用法：
   <div class="cs" data-commit-sim>
     <div class="cs-track"></div>
     <div class="cs-bar">
       <button class="cs-btn" data-act="produce">生产一条</button>
       <button class="cs-btn" data-act="process">处理一条</button>
       <button class="cs-btn" data-act="commit">提交位点</button>
       <button class="cs-btn" data-act="crash">崩溃并重启</button>
       <button class="cs-btn ghost" data-act="reset">重置</button>
     </div>
     <p class="cs-stats">
       日志末端 <b class="cs-total">0</b> ·
       已处理到 <b class="cs-processed">0</b> ·
       已提交到 <b class="cs-committed">0</b> ·
       崩溃会重读 <b class="cs-risk">0</b> 条
     </p>
   </div>

   三色语义：
     绿 = 已提交（崩溃后不会重读）
     黄 = 已处理但未提交（崩溃后会重读 —— 这就是 at-least-once 的窗口）
     灰 = 尚未处理
   ============================================================ */
(function () {
  "use strict";

  var WORDS = ["订单创建", "支付成功", "库存扣减", "发货通知", "物流更新", "确认收货"];

  Array.prototype.slice.call(document.querySelectorAll("[data-commit-sim]")).forEach(function (root) {
    var track = root.querySelector(".cs-track");
    var totalEl = root.querySelector(".cs-total");
    var procEl  = root.querySelector(".cs-processed");
    var commEl  = root.querySelector(".cs-committed");
    var riskEl  = root.querySelector(".cs-risk");

    var total = 0;      // 日志里有多少条
    var processed = 0;  // 这个进程「处理」到哪（内存里的游标，重启即丢）
    var committed = 0;  // broker 里保存的位点（持久，重启后从这里恢复）

    function render() {
      track.innerHTML = "";
      for (var i = 0; i < total; i++) {
        var cls = "cs-cell";
        var mark;
        if (i < committed) {
          cls += " safe";
          mark = "✓ 已提交";
        } else if (i < processed) {
          cls += " risky";
          mark = "! 未提交";
        } else {
          mark = "· 未处理";
        }
        var cell = document.createElement("div");
        cell.className = cls;
        cell.innerHTML = '<span class="cs-off">' + i + '</span>' +
                         '<span class="cs-txt">' + WORDS[i % WORDS.length] + '</span>' +
                         '<span class="cs-mark">' + mark + '</span>';
        track.appendChild(cell);
      }
      if (!total) {
        track.innerHTML = '<div class="cs-empty">日志为空 —— 先生产几条消息</div>';
      }
      totalEl.textContent = total;
      procEl.textContent = processed;
      commEl.textContent = committed;
      riskEl.textContent = processed - committed;
    }

    root.addEventListener("click", function (e) {
      var btn = e.target.closest(".cs-btn");
      if (!btn) return;
      var act = btn.getAttribute("data-act");

      if (act === "produce") {
        total += 1;
      } else if (act === "process") {
        if (processed < total) processed += 1;
      } else if (act === "commit") {
        committed = processed;
      } else if (act === "crash") {
        // 重启：内存里的游标丢了，从 broker 里最后提交的位点恢复
        processed = committed;
      } else if (act === "reset") {
        total = 0; processed = 0; committed = 0;
      }
      render();
    });

    render();
  });
})();
