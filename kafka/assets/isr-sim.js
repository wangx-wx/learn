/* ============================================================
   isr-sim.js — 副本 / ISR / HW / acks 交互模拟器
   用法：
   <div class="isr" data-isr-sim>
     <div class="isr-brokers"></div>
     <div class="isr-ctl">
       <label>acks <select data-acks>
         <option value="0">0</option><option value="1">1</option><option value="all">all</option>
       </select></label>
       <label>min.insync.replicas <select data-minisr>
         <option value="1">1</option><option value="2">2</option>
       </select></label>
     </div>
     <div class="isr-bar">
       <button class="isr-btn" data-act="produce">发送一条消息</button>
       <button class="isr-btn" data-act="sync">让副本追上来</button>
       <button class="isr-btn ghost" data-act="reset">重置</button>
     </div>
     <p class="isr-stats">
       leader <b class="isr-leader">-</b> · ISR <b class="isr-isr">-</b> ·
       HW <b class="isr-hw">0</b> · 生产者已确认 <b class="isr-acked">0</b> 条
     </p>
     <p class="isr-verdict"></p>
   </div>

   关键设计：副本不会自动追上 —— 必须点「让副本追上来」。
   这样「leader 写入后、副本同步前」这个危险窗口才看得见，
   acks=1 的丢数据风险才有意义。
   ============================================================ */
(function () {
  "use strict";

  Array.prototype.slice.call(document.querySelectorAll("[data-isr-sim]")).forEach(function (root) {
    var brokersEl = root.querySelector(".isr-brokers");
    var acksSel   = root.querySelector("[data-acks]");
    var minSel    = root.querySelector("[data-minisr]");
    var leaderEl  = root.querySelector(".isr-leader");
    var isrEl     = root.querySelector(".isr-isr");
    var hwEl      = root.querySelector(".isr-hw");
    var ackedEl   = root.querySelector(".isr-acked");
    var verdictEl = root.querySelector(".isr-verdict");

    var alive = [true, true, true];
    var leo   = [0, 0, 0];
    var hw    = 0;
    var acked = 0;

    function isr() {
      var out = [];
      for (var i = 0; i < alive.length; i++) if (alive[i]) out.push(i);
      return out;
    }
    function leader() { var a = isr(); return a.length ? a[0] : -1; }
    function minIsr() { return parseInt(minSel.value, 10); }

    function render() {
      var a = isr(), l = leader();
      brokersEl.innerHTML = "";
      for (var i = 0; i < alive.length; i++) {
        var d = document.createElement("div");
        var cls = "isr-broker";
        var role;
        if (!alive[i]) { cls += " dead"; role = "已挂掉"; }
        else if (i === l) { cls += " is-leader"; role = "LEADER"; }
        else if (a.indexOf(i) !== -1) { cls += " in-sync"; role = "ISR 副本"; }
        else { role = "已踢出 ISR"; }
        d.className = cls;
        d.setAttribute("data-idx", String(i));
        d.innerHTML = '<span class="isr-name">broker-' + i + '</span>' +
                      '<span class="isr-role">' + role + '</span>' +
                      '<span class="isr-leo">LEO ' + leo[i] + '</span>';
        brokersEl.appendChild(d);
      }
      leaderEl.textContent = l === -1 ? "无" : "broker-" + l;
      isrEl.textContent = a.length ? "[" + a.join(", ") + "]" : "空";
      hwEl.textContent = hw;
      ackedEl.textContent = acked;
    }

    function say(text, kind) {
      verdictEl.textContent = text || "";
      verdictEl.className = "isr-verdict" + (kind ? " " + kind : "");
    }

    function advanceHw() {
      var a = isr();
      hw = a.length ? Math.min.apply(null, a.map(function (x) { return leo[x]; })) : 0;
    }

    function produce() {
      var l = leader(), a = isr();
      if (l === -1) { say("集群无 leader，消息无处可写 —— 这正是 CDC 管道最怕的场景。", "bad"); return; }

      var acks = acksSel.value;

      // acks=all 时先做 min.insync.replicas 检查：不够就拒收
      if (acks === "all" && a.length < minIsr()) {
        say("拒绝写入。ISR 只有 " + a.length + " 个，小于 min.insync.replicas=" + minIsr() +
            "。broker 宁可让生产者收到错误，也不接受这条消息 —— 「不丢」的代价是牺牲可用性。", "bad");
        return;
      }

      leo[l] += 1;   // 只写进 leader；副本要等「让副本追上来」

      if (acks === "0") {
        acked += 1;
        say("acks=0：不等任何确认就返回成功。这条消息此刻只躺在 leader 的日志里，副本还没有它。" +
            "现在若 leader 挂掉，这条消息永久丢失 —— 而生产者以为自己发成功了。", "bad");
      } else if (acks === "1") {
        acked += 1;
        say("acks=1：leader 写入即确认。但 HW 仍停在 " + hw + " —— 副本还没追上。" +
            "现在若 leader 挂掉，这条消息会丢，而生产者已经收到成功。", "warn");
      } else {
        // acks=all：要等 ISR 全体副本确认
        say("acks=all：等待 ISR 全部 " + a.length + " 个副本确认…… 点「让副本追上来」看后续。", "warn");
      }
      advanceHw();
      render();
    }

    function sync() {
      var a = isr(), l = leader();
      if (l === -1) { say("没有 leader，副本无处可追。", "bad"); return; }
      if (a.length < 2) { say("ISR 里只有 leader 自己，没有副本需要追。", "warn"); }

      var before = hw;
      for (var i = 0; i < a.length; i++) leo[a[i]] = leo[l];
      advanceHw();

      var acks = acksSel.value;
      if (acks === "all") {
        // 此刻才真正确认
        var pending = leo[l] - acked;
        acked = leo[l];
        say("ISR 全体副本已追上 leader（LEO=" + leo[l] + "），HW 从 " + before + " 推进到 " + hw +
            "。acks=all 的消息现在才收到确认（本次确认 " + pending + " 条）—— 此时 leader 挂掉也不丢。", "ok");
      } else {
        say("副本追上来了，HW 从 " + before + " 推进到 " + hw + "。注意：acks=" + acks +
            " 的消息早就被确认了，刚才那个窗口里 leader 挂掉就会丢 —— 确认得早，不代表存得稳。", "warn");
      }
      render();
    }

    brokersEl.addEventListener("click", function (e) {
      var card = e.target.closest(".isr-broker");
      if (!card) return;
      var idx = parseInt(card.getAttribute("data-idx"), 10);
      alive[idx] = !alive[idx];

      if (!alive[idx]) {
        var wasLeader = idx === leader();
        say("broker-" + idx + " 挂掉，立即从 ISR 移除" +
            (wasLeader ? "。它原本是 leader —— 控制器要从 ISR 里选一个新 leader。" : "") +
            " 若 ISR 因此缩到小于 min.insync.replicas，acks=all 的写入会被拒绝。", "warn");
      } else {
        var l = leader();
        if (l !== -1) leo[idx] = leo[l];
        say("broker-" + idx + " 恢复。注意：它必须先追上 leader 的 LEO，才有资格重新进入 ISR —— " +
            "「活着」和「在 ISR 里」是两件事。", "ok");
      }
      advanceHw();
      render();
    });

    root.addEventListener("click", function (e) {
      var btn = e.target.closest(".isr-btn");
      if (!btn) return;
      var act = btn.getAttribute("data-act");
      if (act === "produce") produce();
      else if (act === "sync") sync();
      else { alive = [true, true, true]; leo = [0, 0, 0]; hw = 0; acked = 0; say(""); render(); }
    });

    acksSel.addEventListener("change", function () {
      say("acks 切换为 " + acksSel.value + "，下一条消息按新语义判定。");
    });
    minSel.addEventListener("change", function () {
      say("min.insync.replicas 切换为 " + minSel.value + "。试试把某个 broker 点挂，再用 acks=all 发送。");
    });

    render();
  });
})();
