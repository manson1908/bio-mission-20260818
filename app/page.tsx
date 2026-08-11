"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Question = { prompt: string; options: string[]; answer: number; explanation: string };
type Mission = { id: string; code: string; title: string; subtitle: string; icon: string; color: string; fieldTask: string; questions: Question[] };
type Group = { id: number; code: string; name: string; score: number; combo: number; completedModules: string; updatedAt: number };
type Submission = { id: number; groupId: number; groupName: string; missionTitle: string; content: string; status: string; teacherScore: number; feedback: string; createdAt: number };

const missions: Mission[] = [
  { id:"life", code:"1-1", title:"生命訊號", subtitle:"辨識生命現象與環境適應", icon:"🧬", color:"lime", fieldTask:"請在教室找出一項「生物」與一項「非生物」，用至少兩個生命現象說明你的判斷。", questions:[
    {prompt:"下列何者不是一般生物共同具有的生命現象？",options:["代謝","生長與發育","主動遷移","生殖"],answer:2,explanation:"植物通常不會主動遷移。生物共同生命現象包括代謝、生長與發育、感應與運動、生殖。"},
    {prompt:"仙人掌的針狀葉主要能幫助它……",options:["吸收更多陽光","減少水分散失","加速養分輸送","吸收空氣中的水"],answer:1,explanation:"針狀葉表面積較小，可減少蒸散，適應乾燥環境。"},
    {prompt:"地球上的生物與其生存區域合稱為？",options:["大氣圈","水圈","生物圈","岩石圈"],answer:2,explanation:"地球上所有生物及其賴以生存的區域合稱生物圈。"},
    {prompt:"枯葉蝶翅膀外形像枯葉，最可能有什麼好處？",options:["增加體溫","躲避天敵","吸收水分","製造養分"],answer:1,explanation:"與環境相似的外形可形成保護效果，降低被天敵發現的機會。"}]},
  { id:"method", code:"1-2", title:"變因解碼", subtitle:"從問題到可驗證的結論", icon:"🧪", color:"cyan", fieldTask:"設計「光照時間是否影響綠豆苗高度」的實驗，寫出操作變因、控制變因與應變變因。", questions:[
    {prompt:"研究溫度對麵包發霉速度的影響，操作變因是？",options:["麵包大小","溫度","密封方式","觀察天數"],answer:1,explanation:"操作變因是實驗者刻意改變的因素，此處為溫度。"},
    {prompt:"科學方法的合理順序為何？",options:["觀察→提問→假說→實驗→結論","提問→結論→觀察→實驗","實驗→假說→提問→結論","假說→觀察→結論→實驗"],answer:0,explanation:"先觀察並提出問題，再形成可驗證假說、設計實驗、分析並提出結論。"},
    {prompt:"實驗組與對照組中必須保持相同的因素稱為？",options:["操作變因","控制變因","應變變因","隨機變因"],answer:1,explanation:"控制變因需保持相同，才能公平比較操作變因造成的影響。"},
    {prompt:"實驗結果不支持假說時，最合適的做法是？",options:["修改數據","直接宣布假說正確","檢視假說並重新實驗","停止研究"],answer:2,explanation:"科學允許假說被修正；應檢視設計、修正假說並再次驗證。"}]},
  { id:"safety", code:"1-3A", title:"安全警報", subtitle:"實驗室危機判斷", icon:"⚠️", color:"amber", fieldTask:"觀察教室或實驗室，找出兩個可能的安全風險，提出具體改善方式。", questions:[
    {prompt:"酒精燈使用完畢後，正確熄火方式是？",options:["用嘴吹熄","用水澆熄","以燈罩蓋熄","等待燒完"],answer:2,explanation:"應以燈罩蓋熄，不可用嘴吹，以免火焰或蒸氣造成危險。"},
    {prompt:"量筒最適合用來做什麼？",options:["加熱溶液","測量液體體積","調配藥品","研磨固體"],answer:1,explanation:"量筒用於測量液體體積，不可直接加熱。"},
    {prompt:"長髮同學進行加熱實驗前應先？",options:["戴帽子即可","將頭髮束好","站遠一點","關閉所有窗戶"],answer:1,explanation:"束好長髮可避免頭髮接觸火焰或器材。"},
    {prompt:"實驗室內打破玻璃器材，第一步應？",options:["徒手撿起","踢到角落","立即告知老師","倒入水槽"],answer:2,explanation:"應先告知老師並依指示使用適當工具處理，避免割傷。"}]},
  { id:"micro", code:"1-3B", title:"顯微操控", subtitle:"校準與追蹤微小目標", icon:"🔬", color:"violet", fieldTask:"向老師口頭示範：如何從低倍找到目標，再切換高倍觀察。請寫下你們最容易犯錯的步驟。", questions:[
    {prompt:"由低倍換成高倍物鏡後，視野如何改變？",options:["範圍變大、變亮","範圍變小、變暗","細胞變小、變多","完全不變"],answer:1,explanation:"高倍下物像較大，但範圍較小、亮度較暗、細胞數較少。"},
    {prompt:"複式顯微鏡物像偏左，要移到中央，玻片應往哪裡移？",options:["左","右","上","下"],answer:0,explanation:"物像與玻片移動方向相反，因此玻片往左，物像會向右。"},
    {prompt:"鏡頭有灰塵時應使用？",options:["衛生紙","抹布","拭鏡紙","手指"],answer:2,explanation:"拭鏡紙可避免刮傷精密鏡頭。"},
    {prompt:"放大倍率如何計算？",options:["目鏡＋物鏡","目鏡×物鏡","物鏡÷目鏡","只看物鏡"],answer:1,explanation:"標本放大倍率等於目鏡倍率乘以物鏡倍率。"}]},
  { id:"cell", code:"2-1", title:"細胞檔案", subtitle:"形態、功能與細胞學說", icon:"🦠", color:"pink", fieldTask:"選一種人體細胞，用「形態如何配合功能」完成 30 秒口頭報告，並把重點寫下來。", questions:[
    {prompt:"呈雙凹圓盤狀、能運送氧氣的是？",options:["神經細胞","保衛細胞","紅血球","肌肉細胞"],answer:2,explanation:"紅血球的雙凹圓盤外形有利於氣體交換。"},
    {prompt:"虎克觀察軟木栓薄片時看到的是？",options:["活的完整細胞","死植物細胞留下的細胞壁","動物細胞","細菌"],answer:1,explanation:"虎克看到蜂窩狀小格子，是死植物細胞留下的細胞壁。"},
    {prompt:"細胞被稱為生物體的什麼單位？",options:["只有構造單位","只有功能單位","構造與功能基本單位","分類單位"],answer:2,explanation:"細胞是生物體構造與功能的基本單位。"},
    {prompt:"細長且有許多突起、適合傳遞訊息的是？",options:["神經細胞","表皮細胞","紅血球","保衛細胞"],answer:0,explanation:"神經細胞的長突起有利於將訊息傳到遠處。"}]},
  { id:"structure", code:"2-2", title:"胞器配對", subtitle:"修復細胞核心構造", icon:"🧫", color:"orange", fieldTask:"畫出動物細胞與植物細胞，至少標示五個構造；拿給老師檢查後，再提交你們畫圖時最難分辨的構造。", questions:[
    {prompt:"含遺傳物質並控制細胞代謝的是？",options:["細胞膜","細胞質","細胞核","細胞壁"],answer:2,explanation:"細胞核內含遺傳物質，能控制細胞代謝。"},
    {prompt:"植物細胞特有、可維持形狀的是？",options:["粒線體","細胞壁","細胞膜","細胞核"],answer:1,explanation:"細胞壁由纖維素構成，位於細胞膜外側。"},
    {prompt:"進行呼吸作用、釋放能量的胞器是？",options:["液胞","葉綠體","粒線體","細胞核"],answer:2,explanation:"粒線體利用養分進行呼吸作用，產生細胞所需能量。"},
    {prompt:"控制物質進出細胞的是？",options:["細胞壁","細胞膜","細胞質","液胞"],answer:1,explanation:"細胞膜能區隔內外環境並選擇性控制物質進出。"}]},
  { id:"osmosis", code:"2-3", title:"滲透危機", subtitle:"追蹤水分子的移動", icon:"💧", color:"cyan", fieldTask:"解釋醃小黃瓜為什麼會出水。回答中必須使用「細胞膜、濃度、水分子」三個詞。", questions:[
    {prompt:"物質由高濃度往低濃度移動稱為？",options:["呼吸作用","擴散作用","光合作用","消化作用"],answer:1,explanation:"物質由高濃度向低濃度移動並逐漸均勻，稱為擴散。"},
    {prompt:"水分子通過細胞膜的擴散稱為？",options:["蒸散","滲透作用","吸收作用","排泄"],answer:1,explanation:"特指水分子通過細胞膜的擴散現象稱為滲透作用。"},
    {prompt:"動物細胞放入純水中可能？",options:["萎縮","維持不變","膨脹甚至破裂","形成細胞壁"],answer:2,explanation:"水進入細胞；動物細胞沒有細胞壁支撐，可能膨脹破裂。"},
    {prompt:"雞排香味逐漸充滿車廂主要是？",options:["滲透","擴散","光合作用","蒸發"],answer:1,explanation:"氣味分子由高濃度處往低濃度處擴散。"}]},
  { id:"levels", code:"2-4", title:"層次建構", subtitle:"從細胞組成完整個體", icon:"🧩", color:"lime", fieldTask:"用班上一位同學當例子，依序說明細胞、組織、器官、器官系統、個體，並各舉一例。", questions:[
    {prompt:"人體的組成層次由小到大正確的是？",options:["細胞→器官→組織→個體","細胞→組織→器官→器官系統→個體","組織→細胞→器官→個體","器官→細胞→組織→個體"],answer:1,explanation:"動物由細胞、組織、器官、器官系統組成個體。"},
    {prompt:"植物比動物缺少哪一個組成層次？",options:["細胞","組織","器官","器官系統"],answer:3,explanation:"植物由器官直接組成個體，沒有器官系統層次。"},
    {prompt:"血液屬於哪一個層次？",options:["細胞","組織","器官","器官系統"],answer:1,explanation:"血液由多種細胞與液態細胞間質構成，屬於組織。"},
    {prompt:"下列何者是植物的生殖器官？",options:["根","莖","葉","種子"],answer:3,explanation:"花、果實、種子與繁殖有關，屬於生殖器官。"}]},
  { id:"scale", code:"跨科", title:"尺度之眼", subtitle:"微觀、巨觀與仿生科技", icon:"📏", color:"amber", fieldTask:"選擇蓮葉、芒刺或壁虎其中一項，向老師說明它啟發了哪一種仿生科技。", questions:[
    {prompt:"肉眼不可見的微小事物屬於？",options:["微觀尺度","巨觀尺度","光年尺度","生物圈尺度"],answer:0,explanation:"肉眼不可見的微小事物屬於微觀尺度。"},
    {prompt:"奈米是什麼？",options:["時間單位","長度單位","溫度單位","重量單位"],answer:1,explanation:"奈米是描述微小尺度的長度單位。"},
    {prompt:"芒刺的鉤狀構造啟發了？",options:["防水塗料","魔鬼氈","壁虎膠帶","顯微鏡"],answer:1,explanation:"芒刺前端的鉤狀構造啟發魔鬼氈。"},
    {prompt:"圖上標示比例尺主要能幫助我們？",options:["改變物體大小","知道實際大小","增加解析度","判斷生命現象"],answer:1,explanation:"比例尺能將圖中大小與物體實際大小連結。"}]},
  { id:"boss", code:"BOSS", title:"核心復原戰", subtitle:"跨單元情境整合", icon:"🚨", color:"pink", fieldTask:"全組用 60 秒向老師報告：如何證明一個未知樣本是生物？老師將依證據、表達與合作給分。", questions:[
    {prompt:"未知樣本會增大，但無法確認是否為生物，下一步最適合？",options:["直接判定是生物","尋找更多生命現象證據","只看顏色","測量重量一次"],answer:1,explanation:"單一現象可能不足，應尋找代謝、感應、生殖等多項證據。"},
    {prompt:"觀察細胞前先使用低倍鏡的主要理由？",options:["視野較大，容易找目標","物像最大","視野最暗","不需調焦"],answer:0,explanation:"低倍鏡視野範圍較大，較容易先定位標本。"},
    {prompt:"洋蔥表皮細胞與口腔皮膜細胞共同具有？",options:["細胞壁","葉綠體","細胞膜","大型液胞"],answer:2,explanation:"兩者都有細胞膜、細胞質與細胞核；口腔皮膜細胞無細胞壁。"},
    {prompt:"一項好的科學結論最重要的是？",options:["符合原本猜測","有實驗證據支持","文字很長","只有老師能懂"],answer:1,explanation:"科學結論必須根據可重複觀察與實驗證據。"}]},
];

const roles = ["首席研究員","樣本分析員","安全觀察員","紀錄操作員"];

export default function Home() {
  const [team,setTeam]=useState("銀河細胞隊"), [joinCode,setJoinCode]=useState("");
  const [group,setGroup]=useState<Group|null>(null), [started,setStarted]=useState(false);
  const [active,setActive]=useState<Mission|null>(null), [questionIndex,setQuestionIndex]=useState(0), [selected,setSelected]=useState<number|null>(null);
  const [score,setScore]=useState(0), [combo,setCombo]=useState(0), [completed,setCompleted]=useState<string[]>([]);
  const [leaderboard,setLeaderboard]=useState<Group[]>([]), [submissions,setSubmissions]=useState<Submission[]>([]);
  const [fieldAnswer,setFieldAnswer]=useState(""), [submitState,setSubmitState]=useState("");
  const [teacher,setTeacher]=useState(false), [teacherCode,setTeacherCode]=useState(""), [teacherUnlocked,setTeacherUnlocked]=useState(false);
  const [busy,setBusy]=useState(false), [notice,setNotice]=useState("");

  const loadClassroom=useCallback(async(code?:string)=>{ try{const r=await fetch(`/api/classroom${code?`?teacherCode=${encodeURIComponent(code)}`:""}`,{cache:"no-store"});const d=await r.json();setLeaderboard(d.groups||[]);if(d.submissions)setSubmissions(d.submissions);}catch{} },[]);
  useEffect(()=>{const saved=localStorage.getItem("bio-lab-cloud-group");if(saved){try{const v=JSON.parse(saved);setGroup(v.group);setTeam(v.group.name);setScore(v.score||v.group.score||0);setCombo(v.combo||0);setCompleted(v.completed||[]);setStarted(true);}catch{}}loadClassroom();},[loadClassroom]);
  useEffect(()=>{const timer=setInterval(()=>loadClassroom(teacherUnlocked?teacherCode:undefined),5000);return()=>clearInterval(timer);},[loadClassroom,teacherUnlocked,teacherCode]);
  useEffect(()=>{if(!group)return;localStorage.setItem("bio-lab-cloud-group",JSON.stringify({group,score,combo,completed}));const timer=setTimeout(()=>fetch("/api/classroom",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"sync",groupId:group.id,score,combo,completedModules:completed})}).then(()=>loadClassroom()).catch(()=>{}),500);return()=>clearTimeout(timer);},[group,score,combo,completed,loadClassroom]);

  const progress=Math.round(completed.length/missions.length*100);
  const rank=useMemo(()=>score>=3500?"首席生物學家":score>=1800?"進階研究員":score>=700?"觀察員":"實習研究員",[score]);

  async function join(){setBusy(true);setNotice("");try{const r=await fetch("/api/classroom",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"join",name:team,code:joinCode})});const d=await r.json();if(!r.ok)throw new Error(d.error);setGroup(d.group);setTeam(d.group.name);setScore(d.group.score||0);setCompleted(JSON.parse(d.group.completedModules||"[]"));setStarted(true);setNotice(`雲端小隊代碼：${d.group.code}`);}catch(e){setNotice(e instanceof Error?e.message:"連線失敗");}finally{setBusy(false)}}
  function openMission(m:Mission){setActive(m);setQuestionIndex(0);setSelected(null);setFieldAnswer("");setSubmitState("");}
  function answer(i:number){if(selected!==null||!active)return;setSelected(i);if(i===active.questions[questionIndex].answer){const c=combo+1;setCombo(c);setScore(s=>s+100+Math.min(c,5)*10);setNotice(`答對了！連擊 ×${c}`);}else{setCombo(0);setNotice("訊號不穩定，先閱讀解析！");}}
  function next(){if(!active)return;if(questionIndex<active.questions.length-1){setQuestionIndex(i=>i+1);setSelected(null);setNotice("");}else{setQuestionIndex(active.questions.length);setSelected(null);}}
  async function submitField(){if(!active||!group)return;setSubmitState("送出中…");const r=await fetch("/api/classroom",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"submit",groupId:group.id,missionId:active.id,missionTitle:active.title,content:fieldAnswer})});const d=await r.json();if(!r.ok){setSubmitState(d.error||"送出失敗");return;}setCompleted(list=>list.includes(active.id)?list:[...list,active.id]);setScore(s=>s+200);setSubmitState("已送交老師評分！完成模組 +200");}
  async function unlockTeacher(){await loadClassroom(teacherCode);if(teacherCode==="2580")setTeacherUnlocked(true);else setNotice("教師碼錯誤");}
  async function grade(id:number,points:number,feedback:string){await fetch("/api/classroom",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"grade",teacherCode,submissionId:id,teacherScore:points,feedback})});await loadClassroom(teacherCode);}

  return <main className="site-shell">
    <header className="topbar"><div className="brand"><img src="/logo.png" alt="新趨勢文理補習班標誌"/><div><span>新趨勢文理補習班</span><strong>BIO LAB 生物任務站</strong></div></div><div className="top-actions">{group&&<span className="cloud-chip">● 雲端同步 · {group.code}</span>}<button className="teacher-button" onClick={()=>setTeacher(true)}>📊 教師即時台</button></div></header>
    {!started?<section className="hero"><div className="hero-copy"><div className="eyebrow"><i/> LIVE CLASSROOM · 國一生物</div><h1>組隊登入<br/><em>生物實驗室</em></h1><p>建立新小隊，或輸入老師提供的小隊代碼繼續任務。所有分數與老師評語都會同步到雲端。</p><div className="join-card"><label>小隊名稱</label><input value={team} maxLength={20} onChange={e=>setTeam(e.target.value)}/><label>已有小隊代碼（選填）</label><input value={joinCode} maxLength={8} placeholder="例如 A7K2P" onChange={e=>setJoinCode(e.target.value.toUpperCase())}/><button onClick={join} disabled={busy}>{busy?"連線中…":"進入實驗室 →"}</button>{notice&&<small>{notice}</small>}</div></div><div className="reactor"><div className="orbit orbit-one"><span>LIVE</span></div><div className="orbit orbit-two"><span>DB</span></div><div className="core"><small>TEAMS</small><b>{leaderboard.length}</b><span>ONLINE LAB</span></div></div></section>:<>
      <section className="mission-head"><div><div className="eyebrow"><i/> TEAM {group?.code}</div><h1>{team}，<em>任務開始</em></h1><p>完成選擇題後進行實作挑戰，再提交給老師評分。排行榜每 5 秒自動更新。</p></div><div className="hud"><div><small>TOTAL SCORE</small><strong>{score.toLocaleString()}</strong></div><div><small>COMBO</small><strong className="combo">×{combo}</strong></div><div><small>RANK</small><strong>{rank}</strong></div></div></section>
      <section className="live-board"><div><div className="progress-label"><span>LAB RESTORE</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{width:`${progress}%`}}/></div></div><div className="mini-ranking"><strong>即時排行</strong>{leaderboard.slice(0,5).map((g,i)=><span key={g.id}><b>#{i+1}</b>{g.name}<em>{g.score}</em></span>)}</div></section>
      <section className="mission-grid">{missions.map((m,i)=><button key={m.id} className={`mission-card ${m.color} ${completed.includes(m.id)?"done":""}`} onClick={()=>openMission(m)}><span className="card-number">{String(i+1).padStart(2,"0")}</span><span className="mission-icon">{m.icon}</span><span className="mission-code">MODULE {m.code} · 4 題＋實作</span><strong>{m.title}</strong><small>{m.subtitle}</small><span className="card-status">{completed.includes(m.id)?"✓ 已送交":"進入任務 →"}</span></button>)}</section>
      <section className="crew-panel"><div><div className="eyebrow"><i/> ROLE ROTATION</div><h2>研究小隊分工</h2><p>每完成一關順時針輪替，讓每位同學都操作、觀察、記錄與向老師說明。</p></div><div className="roles">{roles.map((r,i)=><div key={r}><span>{["🚀","🔍","🛡️","📋"][i]}</span><small>MEMBER {i+1}</small><strong>{r}</strong></div>)}</div></section>
    </>}
    <footer><span>© 2026 新趨勢文理補習班</span><strong>雲端課堂 · 即時回饋 · 科學思考</strong></footer>

    {active&&<div className="modal-backdrop"><section className="question-modal" role="dialog" aria-modal="true"><button className="close" onClick={()=>setActive(null)}>×</button><div className="question-top"><span>{active.icon}</span><div><small>MODULE {active.code}</small><h2>{active.title}</h2></div><b>{questionIndex<active.questions.length?`${questionIndex+1}/4`:"實作"}</b></div><div className="question-progress"><span style={{width:`${Math.min(questionIndex+1,5)/5*100}%`}}/></div>
      {questionIndex<active.questions.length?<><h3>{active.questions[questionIndex].prompt}</h3><div className="options">{active.questions[questionIndex].options.map((o,i)=>{const ans=i===active.questions[questionIndex].answer;const state=selected===null?"":ans?"correct":selected===i?"wrong":"muted";return <button key={o} className={state} onClick={()=>answer(i)} disabled={selected!==null}><kbd>{String.fromCharCode(65+i)}</kbd><span>{o}</span>{selected!==null&&ans&&<b>✓</b>}</button>})}</div>{selected!==null&&<div className={`feedback ${selected===active.questions[questionIndex].answer?"good":"bad"}`}><strong>{notice}</strong><p>{active.questions[questionIndex].explanation}</p><button onClick={next}>{questionIndex===3?"前往老師互動題":"下一題"} →</button></div>}</>:<div className="field-task"><div className="field-badge">🤝 老師互動關卡 · 最高 +200</div><h3>{active.fieldTask}</h3><ol><li>全組先討論並完成實作或口頭任務。</li><li>由紀錄員輸入小隊的答案或觀察結果。</li><li>送出後，老師可用手機評分並留下回饋。</li></ol><textarea value={fieldAnswer} onChange={e=>setFieldAnswer(e.target.value)} placeholder="在這裡輸入小隊答案、觀察結果或向老師報告的重點…"/><button className="submit-teacher" onClick={submitField} disabled={submitState.includes("已送交")}>送交老師評分 →</button>{submitState&&<p className="submit-state">{submitState}</p>}</div>}
    </section></div>}

    {teacher&&<div className="modal-backdrop"><section className="teacher-modal live-teacher" role="dialog" aria-modal="true"><button className="close" onClick={()=>setTeacher(false)}>×</button><div className="eyebrow"><i/> TEACHER LIVE MODE</div><h2>教師即時控制台</h2>{!teacherUnlocked?<div className="teacher-login"><p>用手機開啟同一網址，輸入教師碼即可查看所有組別分數與待評任務。</p><input type="password" inputMode="numeric" value={teacherCode} placeholder="輸入教師碼" onChange={e=>setTeacherCode(e.target.value)}/><button onClick={unlockTeacher}>進入控制台</button><small>預設教師碼：2580</small></div>:<><div className="teacher-stats"><div><small>參與組別</small><strong>{leaderboard.length}</strong></div><div><small>待評任務</small><strong>{submissions.filter(s=>s.status==="pending").length}</strong></div><div><small>資料更新</small><strong>每 5 秒</strong></div></div><div className="teacher-columns"><section><h3>即時排行榜</h3>{leaderboard.map((g,i)=><div className="rank-row" key={g.id}><b>#{i+1}</b><span>{g.name}<small>{g.code}</small></span><strong>{g.score}</strong></div>)}</section><section><h3>學生提交</h3>{submissions.length===0&&<p className="empty">目前還沒有提交內容。</p>}{submissions.map(s=><GradeCard key={s.id} item={s} onGrade={grade}/>)}</section></div></>}</section></div>}
  </main>;
}

function GradeCard({item,onGrade}:{item:Submission;onGrade:(id:number,points:number,feedback:string)=>Promise<void>}){
  const [points,setPoints]=useState(item.teacherScore||100),[feedback,setFeedback]=useState(item.feedback||"");
  return <article className={`grade-card ${item.status}`}><div><strong>{item.groupName}</strong><span>{item.missionTitle}</span></div><p>{item.content}</p>{item.status==="graded"?<div className="graded-label">✓ 已評 {item.teacherScore} 分 · {item.feedback||"完成任務"}</div>:<div className="grade-controls"><select value={points} onChange={e=>setPoints(Number(e.target.value))}><option value="50">50 分</option><option value="100">100 分</option><option value="150">150 分</option><option value="200">200 分</option></select><input value={feedback} placeholder="給小隊一句回饋" onChange={e=>setFeedback(e.target.value)}/><button onClick={()=>onGrade(item.id,points,feedback)}>送出評分</button></div>}</article>
}
