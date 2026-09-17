/* ============================================================
   quiz.js — 检索练习组件
   用法（HTML）：
   <div class="quiz" data-quiz>
     <p class="quiz-q"><span class="num">检索 1</span>问题文字？</p>
     <ul class="quiz-opts">
       <li><button class="quiz-btn" data-correct="false">选项 A</button></li>
       <li><button class="quiz-btn" data-correct="true">选项 B</button></li>
     </ul>
     <div class="quiz-feedback">
       <span class="verdict"></span>
       <p class="why">解析文字</p>
     </div>
   </div>

   行为：点选即判分、禁用该题所有按钮、显示解析。整页统计答对题数。
   ============================================================ */
(function () {
  "use strict";

  var quizzes = Array.prototype.slice.call(document.querySelectorAll("[data-quiz]"));
  if (!quizzes.length) return;

  var stats = { answered: 0, correct: 0, total: quizzes.length };

  function renderScoreboard() {
    var board = document.querySelector("[data-scoreboard]");
    if (!board) return;
    if (stats.answered < stats.total) {
      board.textContent = "已完成 " + stats.answered + " / " + stats.total + " 题";
    } else {
      var verdict =
        stats.correct === stats.total ? "全部答对 —— 可以进入下一课。" :
        stats.correct >= stats.total - 1 ? "基本掌握 —— 把答错的那题重讲一遍给自己听。" :
        "建议回到上文，重新读一遍相关段落再答一次。";
      board.textContent = "得分 " + stats.correct + " / " + stats.total + " —— " + verdict;
    }
  }

  quizzes.forEach(function (quiz) {
    var buttons = Array.prototype.slice.call(quiz.querySelectorAll(".quiz-btn"));
    var feedback = quiz.querySelector(".quiz-feedback");
    var verdictEl = feedback ? feedback.querySelector(".verdict") : null;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var isCorrect = btn.getAttribute("data-correct") === "true";

        buttons.forEach(function (b) {
          b.disabled = true;
          if (b.getAttribute("data-correct") === "true") b.classList.add("correct");
        });
        if (!isCorrect) btn.classList.add("wrong");

        if (verdictEl) {
          verdictEl.textContent = isCorrect ? "✓ 正确" : "✗ 再看一眼解析";
          verdictEl.className = "verdict " + (isCorrect ? "correct" : "wrong");
        }
        if (feedback) feedback.classList.add("show");

        stats.answered += 1;
        if (isCorrect) stats.correct += 1;
        renderScoreboard();
      });
    });
  });

  renderScoreboard();
})();
