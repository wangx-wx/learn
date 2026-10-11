/* ============================================================
   fail-model.js — 失败模型阶梯：副本数 × 物理机数 → 能扛住哪一档失败
   用法：
   <div class="fail" data-fail-model>
     <div class="fail-ctl">
       <label>副本数 <select data-rf>
         <option>1</option><option>2</option><option selected>3</option>
       </select></label>
       <label>物理机台数 <select data-machines>
         <option value="1">1 台（你的 Docker 实验环境）</option>
         <option value="3">3 台（生产环境）</option>
       </select></label>
     </div>
     <p class="fail-out"></p>
     <ul class="fail-ladder"></ul>
   </div>

   模型：副本按机器轮询分布。失败单位越大，被一锅端的副本越多。
   「进程挂」只带走 1 个副本；「机器/磁盘挂」带走那台机器上的全部副本。
   ============================================================ */
(function () {
  "use strict";

  var LEVELS = [
    { key: "process",   lvl: "① 进程挂",       en: "process kill",   unit: "process" },
    { key: "power",     lvl: "② 机器断电",     en: "power loss",     unit: "machine" },
    { key: "disk",      lvl: "③ 磁盘坏",       en: "disk failure",   unit: "machine" },
    { key: "datacent",  lvl: "④ 机房整个没了", en: "datacenter loss", unit: "all" }
  ];

  Array.prototype.slice.call(document.querySelectorAll("[data-fail-model]")).forEach(function (root) {
    var rfSel   = root.querySelector("[data-rf]");
    var machSel = root.querySelector("[data-machines]");
    var outEl   = root.querySelector(".fail-out");
    var ladderEl = root.querySelector(".fail-ladder");

    function replicas() {
      var rf = parseInt(rfSel.value, 10);
      var machines = parseInt(machSel.value, 10);
      var arr = [];
      for (var i = 0; i < rf; i++) arr.push(machines === 1 ? 0 : i % 3);
      return arr;
    }

    // 某一档失败后，还有几份完整副本留在别的机器上
    function survivors(level, rep) {
      if (level.unit === "process") return Math.max(0, rep.length - 1);
      if (level.unit === "all") return 0;
      // 机器级失败：机器 0 上的副本全没了
      var onM0 = rep.filter(function (m) { return m === 0; }).length;
      return Math.max(0, rep.length - onM0);
    }

    function render() {
      var rep = replicas();
      var machines = parseInt(machSel.value, 10);
      var onM0 = rep.filter(function (m) { return m === 0; }).length;

      var map = rep.map(function (m) { return "机器" + m; }).join(" · ");
      outEl.innerHTML = "副本分布：" + map +
        "（" + rep.length + " 份副本，摆在 " + machines + " 台物理机上）";

      ladderEl.innerHTML = "";
      LEVELS.forEach(function (level) {
        var left = survivors(level, rep);
        var li = document.createElement("li");
        var tag, cls, note;

        if (level.key === "power") {
          // 断电：磁盘还在，但这台机器上的副本暂时读不到；未刷盘的最新几条可能丢
          cls = "warn";
          tag = "警告";
          note = "磁盘还在，机器重启后能回来 —— 但默认不 fsync，最后几条可能丢";
        } else if (left >= 1) {
          cls = "survives";
          tag = "数据在";
          note = "还剩 " + left + " 份完整副本在别的机器上";
        } else {
          cls = "loses";
          tag = "数据没了";
          note = level.unit === "all" ? "所有副本一起消失" : "唯一的副本随机器一起没了";
        }

        li.className = cls;
        li.innerHTML =
          '<span class="lvl">' + level.lvl + '<span class="lvl-en">' + level.en + "</span></span>" +
          '<span class="verdict-tag">' + tag + "</span>" +
          '<span class="note">' + note + "</span>";
        ladderEl.appendChild(li);
      });

      // 一句话结论
      var oneMachine = machines === 1;
      if (oneMachine && rep.length > 1) {
        outEl.innerHTML += "<br><b>注意：</b>" + rep.length +
          " 份副本全在<strong>同一台物理机</strong>上 —— 机器一挂（②③④），它们一起消失。" +
          "这就是你的 Docker 实验环境：它能演示「进程挂」，演示不了「机器报废」。";
      } else if (machines === 3) {
        outEl.innerHTML += "<br><b>这才是生产的样子：</b>副本分散在 3 台物理机上，" +
          "任意一台整机报废，其余副本仍在。CDC 要的「不可容忍丢失」，指的就是扛住这一档。";
      }
    }

    rfSel.addEventListener("change", render);
    machSel.addEventListener("change", render);
    render();
  });
})();
