"use client";

import { useEffect, useMemo, useState } from "react";

type Mission = {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  questions: Question[];
};

type Question = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

const missions: Mission[] = [
  {
    id: "life", code: "1-1", title: "生命訊號", subtitle: "辨識生命現象", icon: "🧬", color: "lime",
    questions: [
      { prompt: "下列何者不是一般生物共同具有的生命現象？", options: ["代謝", "生長與發育", "主動遷移", "生殖"], answer: 2, explanation: "植物通常不會主動遷移，但仍是生物。共同生命現象包括代謝、生長與發育、感應與運動、生殖。" },
      { prompt: "仙人掌的針狀葉主要能幫助它……", options: ["吸收更多陽光", "減少水分散失", "加速養分輸送", "吸收空氣中的水"], answer: 1, explanation: "針狀葉的表面積較小，能減少蒸散，適應乾燥環境。" },
    ],
  },
  {
    id: "method", code: "1-2", title: "變因解碼", subtitle: "破解科學方法", icon: "🧪", color: "cyan",
    questions: [
      { prompt: "研究溫度對麵包發霉速度的影響，操作變因是什麼？", options: ["麵包大小", "溫度", "密封方式", "觀察天數"], answer: 1, explanation: "操作變因是實驗者刻意改變的因素；此題中刻意改變的是溫度。" },
      { prompt: "科學方法的合理順序為何？", options: ["觀察→提問→假說→實驗→結論", "提問→結論→觀察→實驗", "實驗→假說→提問→結論", "假說→觀察→結論→實驗"], answer: 0, explanation: "從觀察發現問題，形成可驗證的假說，再設計實驗並分析結果、提出結論。" },
    ],
  },
  {
    id: "safety", code: "1-3", title: "安全警報", subtitle: "實驗室危機處理", icon: "⚠️", color: "amber",
    questions: [
      { prompt: "酒精燈使用完畢後，正確熄火方式是？", options: ["用嘴吹熄", "用水澆熄", "以燈罩蓋熄", "等待酒精燒完"], answer: 2, explanation: "應以燈罩蓋熄，不能用嘴吹，以免火焰或酒精蒸氣造成危險。" },
      { prompt: "量筒最適合用來做什麼？", options: ["加熱溶液", "測量液體體積", "調配藥品", "研磨固體"], answer: 1, explanation: "量筒用來測量液體體積，不可直接加熱或作為調配藥品的容器。" },
    ],
  },
  {
    id: "micro", code: "LAB", title: "顯微操控", subtitle: "校準複式顯微鏡", icon: "🔬", color: "violet",
    questions: [
      { prompt: "由低倍物鏡換成高倍物鏡後，視野會如何改變？", options: ["範圍變大、變亮", "範圍變小、變暗", "細胞變小、變多", "完全不變"], answer: 1, explanation: "高倍鏡下物像較大，但視野範圍較小、亮度較暗、看到的細胞數較少。" },
      { prompt: "複式顯微鏡下物像偏左，要把物像移到中央，玻片應往哪裡移？", options: ["左", "右", "上", "下"], answer: 0, explanation: "複式顯微鏡的物像上下顛倒、左右相反；物像偏左時，玻片同樣往左移，物像會向右移。" },
    ],
  },
  {
    id: "cell", code: "2-1", title: "細胞檔案", subtitle: "辨認形態與功能", icon: "🦠", color: "pink",
    questions: [
      { prompt: "哪一種細胞的外形為雙凹圓盤狀，能運送氧氣？", options: ["神經細胞", "保衛細胞", "紅血球", "肌肉細胞"], answer: 2, explanation: "紅血球呈雙凹圓盤狀，有利於氣體交換，主要負責運送氧氣。" },
      { prompt: "虎克觀察軟木栓薄片時，看到的是……", options: ["活的完整細胞", "死植物細胞留下的細胞壁", "動物細胞", "細菌"], answer: 1, explanation: "虎克看到蜂窩狀小格子，實際上是死植物細胞留下的細胞壁。" },
    ],
  },
  {
    id: "structure", code: "2-2", title: "胞器配對", subtitle: "修復細胞核心", icon: "🧫", color: "orange",
    questions: [
      { prompt: "控制細胞代謝作用，並含有遺傳物質的構造是？", options: ["細胞膜", "細胞質", "細胞核", "細胞壁"], answer: 2, explanation: "細胞核內含遺傳物質，是控制細胞代謝作用的重要構造。" },
      { prompt: "下列何者是植物細胞特有、具有保護與維持形狀功能的構造？", options: ["粒線體", "細胞壁", "細胞膜", "細胞核"], answer: 1, explanation: "細胞壁由纖維素構成，位於植物細胞膜外側；動物細胞沒有細胞壁。" },
    ],
  },
];

const members = ["首席研究員", "樣本分析員", "安全觀察員", "紀錄操作員"];

export default function Home() {
  const [team, setTeam] = useState("銀河細胞隊");
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState<Mission | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [teacher, setTeacher] = useState(false);
  const [sound, setSound] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("bio-lab-progress");
    if (saved) {
      try {
        const value = JSON.parse(saved);
        setTeam(value.team || "銀河細胞隊");
        setScore(value.score || 0);
        setCombo(value.combo || 0);
        setCompleted(value.completed || []);
      } catch { /* ignore invalid local data */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bio-lab-progress", JSON.stringify({ team, score, combo, completed }));
  }, [team, score, combo, completed]);

  const progress = Math.round((completed.length / missions.length) * 100);
  const rank = useMemo(() => score >= 1000 ? "星際研究員" : score >= 500 ? "進階觀察員" : "實習研究員", [score]);

  function openMission(mission: Mission) {
    setActive(mission); setQuestionIndex(0); setSelected(null); setNotice("");
  }

  function answer(index: number) {
    if (selected !== null || !active) return;
    setSelected(index);
    const correct = index === active.questions[questionIndex].answer;
    if (correct) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore((s) => s + 100 + Math.min(nextCombo, 5) * 10);
      setNotice(`答對了！連擊 ×${nextCombo}`);
    } else {
      setCombo(0);
      setNotice("訊號不穩定，查看解析再試下一題！");
    }
  }

  function nextQuestion() {
    if (!active) return;
    if (questionIndex < active.questions.length - 1) {
      setQuestionIndex((i) => i + 1); setSelected(null); setNotice("");
    } else {
      setCompleted((list) => list.includes(active.id) ? list : [...list, active.id]);
      setScore((s) => s + 200);
      setActive(null); setSelected(null); setNotice("");
    }
  }

  function resetProgress() {
    setScore(0); setCombo(0); setCompleted([]); setActive(null);
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <div className="brand">
          <img src="/logo.png" alt="新趨勢文理補習班火箭太空人標誌" />
          <div><span>新趨勢文理補習班</span><strong>BIO LAB 生物任務站</strong></div>
        </div>
        <div className="top-actions">
          <button className="icon-button" onClick={() => setSound(!sound)} aria-label={sound ? "關閉音效" : "開啟音效"}>{sound ? "🔊" : "🔇"}</button>
          <button className="teacher-button" onClick={() => setTeacher(true)}>教師控制台</button>
        </div>
      </header>

      {!started ? (
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><i /> MISSION 01 · 國一生物</div>
            <h1>生物實驗室<br/><em>核心系統失衡</em></h1>
            <p>研究員，生命資料正在消失。組成你的四人小隊，完成科學方法、實驗安全與細胞任務，恢復 BIO LAB！</p>
            <div className="team-form">
              <label htmlFor="team-name">小隊代號</label>
              <div><input id="team-name" value={team} maxLength={12} onChange={(e) => setTeam(e.target.value)} /><button onClick={() => setStarted(true)}>啟動任務 <span>→</span></button></div>
            </div>
            <div className="class-tags"><span>👥 4–5 人合作</span><span>⏱ 45–90 分鐘</span><span>⌨ 支援鍵盤與觸控</span></div>
          </div>
          <div className="reactor" aria-label="生物實驗室核心系統示意">
            <div className="orbit orbit-one"><span>DNA</span></div><div className="orbit orbit-two"><span>細胞</span></div>
            <div className="core"><small>SYSTEM</small><b>23%</b><span>生命訊號</span></div>
            <div className="scan-line" />
          </div>
          <div className="scroll-cue">向下查看任務情報 <span>↓</span></div>
        </section>
      ) : (
        <>
          <section className="mission-head">
            <div><div className="eyebrow"><i /> RESEARCH TEAM ONLINE</div><h1>{team}，<em>開始修復！</em></h1><p>依序完成六個核心艙。答對可累積連擊加成，每完成一艙再獲得 200 分。</p></div>
            <div className="hud">
              <div><small>TOTAL SCORE</small><strong>{score.toLocaleString()}</strong></div>
              <div><small>COMBO</small><strong className="combo">×{combo}</strong></div>
              <div><small>RANK</small><strong>{rank}</strong></div>
            </div>
          </section>

          <section className="progress-panel">
            <div className="progress-label"><span>LAB RESTORE</span><strong>{progress}%</strong></div>
            <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          </section>

          <section className="mission-grid" aria-label="生物任務列表">
            {missions.map((mission, index) => {
              const done = completed.includes(mission.id);
              return <button key={mission.id} className={`mission-card ${mission.color} ${done ? "done" : ""}`} onClick={() => openMission(mission)}>
                <span className="card-number">0{index + 1}</span><span className="mission-icon">{mission.icon}</span>
                <span className="mission-code">MODULE {mission.code}</span><strong>{mission.title}</strong><small>{mission.subtitle}</small>
                <span className="card-status">{done ? "✓ 已完成" : "進入任務 →"}</span>
              </button>;
            })}
          </section>

          <section className="crew-panel">
            <div><div className="eyebrow"><i /> ROLE ROTATION</div><h2>研究小隊分工</h2><p>每完成一個模組就順時針輪替角色，讓每位同學都有操作與表達的機會。</p></div>
            <div className="roles">{members.map((m, i) => <div key={m}><span>{["🚀","🔍","🛡️","📋"][i]}</span><small>MEMBER {i + 1}</small><strong>{m}</strong></div>)}</div>
          </section>
        </>
      )}

      <footer><span>© 2026 新趨勢文理補習班</span><strong>探索生命 · 培養科學思考</strong></footer>

      {active && (
        <div className="modal-backdrop" role="presentation">
          <section className="question-modal" role="dialog" aria-modal="true" aria-labelledby="question-title">
            <button className="close" onClick={() => setActive(null)} aria-label="關閉任務">×</button>
            <div className="question-top"><span>{active.icon}</span><div><small>MODULE {active.code} · QUESTION {questionIndex + 1}/{active.questions.length}</small><h2 id="question-title">{active.title}</h2></div><b>+100</b></div>
            <div className="question-progress"><span style={{width: `${((questionIndex + 1) / active.questions.length) * 100}%`}} /></div>
            <h3>{active.questions[questionIndex].prompt}</h3>
            <div className="options">{active.questions[questionIndex].options.map((option, i) => {
              const isAnswer = i === active.questions[questionIndex].answer;
              const state = selected === null ? "" : isAnswer ? "correct" : selected === i ? "wrong" : "muted";
              return <button key={option} className={state} onClick={() => answer(i)} disabled={selected !== null}><kbd>{String.fromCharCode(65 + i)}</kbd><span>{option}</span>{selected !== null && isAnswer ? <b>✓</b> : null}</button>;
            })}</div>
            {selected !== null && <div className={`feedback ${selected === active.questions[questionIndex].answer ? "good" : "bad"}`}><strong>{notice}</strong><p>{active.questions[questionIndex].explanation}</p><button onClick={nextQuestion}>{questionIndex === active.questions.length - 1 ? "完成模組" : "下一題"} →</button></div>}
          </section>
        </div>
      )}

      {teacher && (
        <div className="modal-backdrop"><section className="teacher-modal" role="dialog" aria-modal="true" aria-labelledby="teacher-title">
          <button className="close" onClick={() => setTeacher(false)} aria-label="關閉教師控制台">×</button>
          <div className="eyebrow"><i /> TEACHER MODE</div><h2 id="teacher-title">課堂控制台</h2><p>快速掌握本機小隊進度，並依課堂時間挑選任務。</p>
          <div className="teacher-stats"><div><small>小隊</small><strong>{team}</strong></div><div><small>完成模組</small><strong>{completed.length} / {missions.length}</strong></div><div><small>總分</small><strong>{score}</strong></div></div>
          <label>建議課堂節奏</label><div className="time-pills"><button>15 分鐘｜暖身</button><button>30 分鐘｜單元挑戰</button><button>45 分鐘｜完整任務</button></div>
          <div className="teacher-actions"><button onClick={() => {setTeacher(false); setStarted(true);}}>回到學生畫面</button><button className="danger" onClick={resetProgress}>重設本機進度</button></div>
        </section></div>
      )}
    </main>
  );
}
