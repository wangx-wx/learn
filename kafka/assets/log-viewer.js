/* ============================================================
   log-viewer.js — 日志 / 游标 交互组件
   用法：
   <div class="lv" data-log-viewer>
     <div class="lv-track"></div>
     <div class="lv-bar">
       <button class="lv-btn" data-act="append">追加一条消息</button>
       <button class="lv-btn" data-act="read">读取一条</button>
       <button class="lv-btn ghost" data-act="reset">重置</button>
     </div>
     <p class="lv-stats">
       日志长度 <b class="lv-len">0</b> 条 ·
       下一条待读 <b class="lv-cursor">0</b> ·
       本消费者已读 <b class="lv-read">0</b> 条
     </p>
   </div>
   ============================================================ */
(function () {
  "use strict";

  var WORDS = ["订单创建", "支付成功", "库存扣减", "发货通知", "物流更新", "确认收货"];

  Array.prototype.slice.call(document.querySelectorAll("[data-log-viewer]")).forEach(function (root) {
    var track  = root.querySelector(".lv-track");
    var lenEl  = root.querySelector(".lv-len");
    var curEl  = root.querySelector(".lv-cursor");
    var readEl = root.querySelector(".lv-read");

    var total = 0;   // 日志里有多少条
    var cursor = 0;  // 这个消费者下一条要读的 offset

    function render() {
      track.innerHTML = "";
      for (var i = 0; i < total; i++) {
        var cell = document.createElement("div");
        cell.className = "lv-cell" + (i < cursor ? " read" : "");
        cell.innerHTML = '<span class="lv-off">' + i + '</span>' +
                         '<span class="lv-txt">' + WORDS[i % WORDS.length] + '</span>';
        track.appendChild(cell);
      }
      if (!total) {
        track.innerHTML = '<div class="lv-empty">日志为空 —— 先追加几条消息</div>';
      } else if (cursor < total) {
        var mk = document.createElement("div");
        mk.className = "lv-marker";
        mk.style.left = "calc(" + (cursor / total * 100) + "% - 1px)";
        track.appendChild(mk);
      }
      lenEl.textContent = total;
      curEl.textContent = cursor;
      readEl.textContent = cursor;
    }

    root.addEventListener("click", function (e) {
      var btn = e.target.closest(".lv-btn");
      if (!btn) return;
      var act = btn.getAttribute("data-act");
      if (act === "append") {
        total += 1;
      } else if (act === "read") {
        if (cursor < total) cursor += 1;
      } else if (act === "reset") {
        total = 0; cursor = 0;
      }
      render();
    });

    render();
  });
})();
