"use client";

import { useEffect, useMemo, useState } from "react";

type Unit = { code:string; title:string; summary:string; keys:string[] };
type Chapter = { id:string; book:"上冊"|"下冊"; no:number; title:string; color:string; units:Unit[] };
type Question = { prompt:string; options:string[]; answer:number; explanation:string };
type ScoreRecord = { unit:string; title:string; score:number; date:string; mock:boolean };
type Account = { username:string; name:string; role:"student"|"teacher" };
const accounts:Account[]=[...Array.from({length:15},(_,i)=>({username:`student${String(i+1).padStart(2,"0")}`,name:`學生 ${String(i+1).padStart(2,"0")}`,role:"student" as const})),{username:"teacher01",name:"新趨勢老師",role:"teacher"}];
const DEFAULT_PASSWORD="Trend2026!";

const chapters:Chapter[] = [
  {id:"u1",book:"上冊",no:1,title:"生命世界與科學方法",color:"#d7f16d",units:[
    {code:"1-1",title:"多彩多姿的生命世界",summary:"辨認生命現象與生物共同特徵，從觀察建立分類與比較的基礎。",keys:["生物會代謝、生長、感應與繁殖","細胞是生物體構造與功能的基本單位","病毒缺乏完整細胞構造，須寄生才能繁殖","生物能維持體內環境的相對穩定"]},
    {code:"1-2",title:"探究自然的科學方法",summary:"從提出問題、建立假說到控制變因，以證據回答自然現象。",keys:["操縱變因是實驗者主動改變的條件","控制變因應保持一致","應變變因是測量或觀察的結果","重複實驗能提高結果的可信度"]},
    {code:"1-3",title:"進入實驗室",summary:"熟悉器材、顯微鏡操作與實驗室安全規範。",keys:["藥品不可直接以鼻靠近聞氣味","加熱試管時管口不可朝向人","複式顯微鏡成像上下左右相反","先用低倍物鏡尋找影像再換高倍"]},
  ]},
  {id:"u2",book:"上冊",no:2,title:"生物體的組成",color:"#8ee8d1",units:[
    {code:"2-1",title:"生物體的基本單位",summary:"由顯微觀察理解細胞學說及不同細胞的形態。",keys:["細胞是生物體構造與功能的基本單位","多數細胞很小，需用顯微鏡觀察","細胞形態常與功能相關","單細胞生物以一個細胞完成生命活動"]},
    {code:"2-2",title:"細胞的構造",summary:"比較植物細胞與動物細胞的共同及特有構造。",keys:["細胞膜控制物質進出","細胞核含遺傳物質並控制生命活動","植物細胞具有細胞壁與大型液胞","葉綠體是植物行光合作用的重要場所"]},
    {code:"2-3",title:"物質進出細胞的方式",summary:"以擴散與滲透理解細胞內外物質移動。",keys:["擴散是粒子由高濃度往低濃度移動","水經選擇性通透膜的移動稱為滲透","植物細胞置於濃食鹽水中可能失水","細胞膜具有選擇性通透性"]},
    {code:"2-4",title:"生物體的組成層次",summary:"建立細胞、組織、器官、器官系統到個體的層次概念。",keys:["細胞組成組織，組織組成器官","胃是由多種組織構成的器官","植物通常以細胞、組織、器官和個體描述","循環系統屬於器官系統層次"]},
  ]},
  {id:"u3",book:"上冊",no:3,title:"生物體的營養",color:"#ffca70",units:[
    {code:"3-1",title:"食物中的養分與能量",summary:"認識養分功能、檢測方法與均衡飲食。",keys:["醣類是人體主要能量來源","碘液可檢測澱粉","本氏液加熱可檢測還原糖","蛋白質是生長修補的重要原料"]},
    {code:"3-2",title:"酵素",summary:"探討酵素專一性及溫度、酸鹼值對活性的影響。",keys:["酵素可加速生物體內化學反應","酵素具有專一性","高溫可能破壞酵素構造","不同酵素有不同最適酸鹼值"]},
    {code:"3-3",title:"植物如何製造養分",summary:"從葉片構造、光合作用與氣孔理解植物製造養分。",keys:["光合作用利用光能製造葡萄糖","葉綠體中的葉綠素可吸收光能","二氧化碳多由氣孔進入葉片","光合作用會釋放氧氣"]},
    {code:"3-4",title:"人體如何獲得養分",summary:"串連消化器官、消化液與小腸吸收。",keys:["消化將大分子養分分解成可吸收的小分子","小腸是消化與吸收的主要場所","膽汁能乳化脂肪但不含消化酵素","絨毛可增加小腸吸收面積"]},
  ]},
  {id:"u4",book:"上冊",no:4,title:"生物體的運輸作用",color:"#ff9b91",units:[
    {code:"4-1",title:"植物的運輸構造",summary:"辨識根、莖、葉的維管束與功能。",keys:["木質部主要運輸水和礦物質","韌皮部主要運輸光合作用產物","根毛可增加吸收面積","維管束連接根、莖與葉"]},
    {code:"4-2",title:"植物體內物質的運輸",summary:"理解蒸散作用與水分上升的關係。",keys:["蒸散作用主要經由葉片氣孔進行","蒸散可促進根部吸水與水分上升","保衛細胞能調節氣孔開閉","水分主要沿木質部向上運輸"]},
    {code:"4-3",title:"人體心血管系統的組成",summary:"掌握心臟、血管與血液成分。",keys:["動脈將血液帶離心臟","靜脈將血液帶回心臟","微血管壁薄，適合物質交換","紅血球中的血紅素可運送氧氣"]},
    {code:"4-4",title:"人體的循環系統",summary:"追蹤肺循環與體循環的路徑及淋巴功能。",keys:["肺循環由右心室送血至肺再回左心房","體循環由左心室送血至全身再回右心房","冠狀動脈供應心肌養分與氧氣","瓣膜可防止血液倒流"]},
  ]},
  {id:"u5",book:"上冊",no:5,title:"生物體的協調作用",color:"#c5a8ff",units:[
    {code:"5-1",title:"刺激與反應",summary:"建立受器、神經與動器形成反應的流程。",keys:["受器能接受環境刺激","動器通常是肌肉或腺體","感覺在大腦皮質形成","反應有助生物適應環境"]},
    {code:"5-2",title:"神經系統",summary:"比較中樞與周圍神經、反射與意識行為。",keys:["腦和脊髓構成中樞神經系統","反射動作可由脊髓先行整合","神經元可傳遞神經訊息","小腦主要協調運動與平衡"]},
    {code:"5-3",title:"內分泌系統",summary:"理解激素經血液運送與回饋調節。",keys:["內分泌腺沒有導管","激素由血液運送至目標器官","胰島素可降低血糖濃度","生長激素與個體生長有關"]},
    {code:"5-4",title:"行為與感應",summary:"比較動物先天與學習行為，以及植物向性。",keys:["向光性是植物對光刺激的生長反應","含羞草閉合屬感應運動","先天行為不需後天學習","學習行為可因經驗而改變"]},
  ]},
  {id:"u6",book:"上冊",no:6,title:"生物體的恆定",color:"#7fd7ff",units:[
    {code:"6-1",title:"呼吸與氣體的恆定",summary:"比較呼吸作用與呼吸運動，理解氣體交換。",keys:["細胞呼吸會釋放養分中的能量","肺泡是肺部氣體交換的主要場所","吸氣時橫膈下降、胸腔體積增大","氧氣由肺泡擴散進入微血管"]},
    {code:"6-2",title:"排泄與水分的恆定",summary:"掌握腎臟、尿液形成及植物水分調節。",keys:["腎臟是形成尿液的主要器官","尿素由蛋白質代謝產生","人體可藉尿液和汗液排出水分","植物可調節氣孔減少水分散失"]},
    {code:"6-3",title:"體溫與血糖的恆定",summary:"以負回饋解釋體溫與血糖調節。",keys:["流汗可藉水分蒸發帶走熱量","皮膚血管擴張有助散熱","胰島素可促使血糖下降","恆定是維持內在環境相對穩定"]},
  ]},
  {id:"d1",book:"下冊",no:1,title:"生殖",color:"#ffb3d1",units:[
    {code:"1-1",title:"細胞的分裂",summary:"比較有絲分裂與減數分裂的目的與結果。",keys:["有絲分裂產生的子細胞染色體數通常不變","減數分裂可形成生殖細胞","減數分裂使染色體數目減半","DNA複製通常發生在細胞分裂前"]},
    {code:"1-2",title:"無性生殖",summary:"比較分裂、出芽、孢子及營養器官繁殖。",keys:["無性生殖通常只需一個親代","無性生殖後代與親代遺傳差異較小","酵母菌可行出芽生殖","馬鈴薯可利用塊莖繁殖"]},
    {code:"1-3",title:"有性生殖",summary:"理解配子、受精、胚胎發育及開花植物生殖。",keys:["精子與卵結合稱為受精","受精卵經細胞分裂與分化形成胚胎","花粉管可將精細胞送至胚珠","果實通常由子房發育而來"]},
  ]},
  {id:"d2",book:"下冊",no:2,title:"遺傳",color:"#9ed8ff",units:[
    {code:"2-1",title:"遺傳、染色體與基因",summary:"用孟德爾實驗理解基因、等位基因與性狀。",keys:["基因是DNA上控制性狀的片段","等位基因位於同源染色體相對位置","顯性性狀不等於較常見性狀","分離律描述成對等位基因形成配子時分離"]},
    {code:"2-2",title:"人類的遺傳",summary:"應用棋盤格分析性別、血型與遺傳機率。",keys:["人類女性性染色體通常為XX","人類男性產生的精子可帶X或Y","ABO血型具有多等位基因","遺傳機率不保證單次結果"]},
    {code:"2-3",title:"突變與遺傳疾病",summary:"區分突變來源、體細胞與生殖細胞影響。",keys:["突變是遺傳物質發生改變","生殖細胞突變可能傳給後代","紫外線可能增加突變機率","突變結果不一定對生物有害"]},
    {code:"2-4",title:"生物技術",summary:"認識育種、基因轉殖、複製與倫理議題。",keys:["人擇是人類選留符合需求的性狀","基因轉殖可跨物種轉入特定基因","複製技術可產生遺傳相似個體","生物技術應同時評估風險與倫理"]},
  ]},
  {id:"d3",book:"下冊",no:3,title:"生物的演化與分類",color:"#d7f16d",units:[
    {code:"3-1",title:"化石與演化",summary:"以化石、同源構造與自然選擇推論演化。",keys:["化石可提供古代生物存在的證據","地層通常越下方年代越早","自然選擇保留較適應環境的個體","演化發生於族群世代間而非個體主動改變"]},
    {code:"3-2",title:"生物的命名與分類",summary:"理解二名法、分類階層與親緣關係。",keys:["學名由屬名和種小名組成","分類階層越接近通常共同特徵越多","種是基本分類單位","學名可避免各地俗名不同造成混淆"]},
    {code:"3-3",title:"原核、原生生物及真菌界",summary:"比較三大類群的細胞特徵與生活方式。",keys:["細菌屬原核生物且無核膜","原生生物多生活在水域或潮濕環境","真菌細胞具有細胞壁但沒有葉綠體","真菌多以吸收方式獲得養分"]},
    {code:"3-4",title:"植物界",summary:"由維管束、種子與花比較植物類群。",keys:["苔蘚植物沒有真正的維管束","蕨類以孢子繁殖","裸子植物的種子不包在果實內","被子植物具有花與果實"]},
    {code:"3-5",title:"動物界",summary:"以對稱、脊椎與生理特徵比較主要動物類群。",keys:["節肢動物具有分節附肢與外骨骼","魚類多以鰓呼吸","鳥類與哺乳類能維持較穩定體溫","脊椎動物具有脊柱"]},
  ]},
  {id:"d4",book:"下冊",no:4,title:"生物與環境",color:"#8ee8d1",units:[
    {code:"4-1",title:"族群、群集與演替",summary:"辨別生態組成層級與族群變化。",keys:["同時間同地區同種生物構成族群","多個族群共同構成群集","演替是群集組成隨時間改變","出生、死亡、遷入與遷出影響族群大小"]},
    {code:"4-2",title:"生物間的互動關係",summary:"比較競爭、捕食、寄生、共生等關係。",keys:["競爭雙方都消耗資源","捕食者獲益而獵物受害","寄生者獲益而寄主受害","互利共生的雙方都獲益"]},
    {code:"4-3",title:"生態系",summary:"分析能量流動、食物網與物質循環。",keys:["生產者將光能轉為化學能","能量沿食物鏈傳遞時逐級減少","分解者可促進物質循環","食物網比單一食物鏈更接近真實關係"]},
    {code:"4-4",title:"生態系的類型",summary:"比較陸域與水域生態系的環境特徵。",keys:["沙漠生物需適應缺水環境","河口鹽度變化大且養分豐富","海洋表層光照較足適合藻類生長","森林垂直分層可提供多樣棲地"]},
  ]},
  {id:"d5",book:"下冊",no:5,title:"生物多樣性與保育",color:"#ffca70",units:[
    {code:"5-1",title:"生物多樣性",summary:"理解遺傳、物種與生態系三層次多樣性。",keys:["生物多樣性包含遺傳、物種與生態系多樣性","遺傳多樣性有助族群面對環境變化","生態系服務包含授粉與水土保持","高多樣性常提高生態系韌性"]},
    {code:"5-2",title:"多樣性面臨的危機",summary:"分析棲地破壞、外來種、污染與過度利用。",keys:["棲地破壞是多樣性下降的重要原因","外來種可能因缺少天敵而快速擴張","生物累積使污染物在個體內增加","過度捕撈可能使族群無法恢復"]},
    {code:"5-3",title:"保育的落實",summary:"比較就地保育、移地保育與永續利用。",keys:["設立自然保留區屬就地保育","種子庫與動物園可協助移地保育","保育需兼顧生態、社會與經濟","避免購買野生動物製品是個人可行行動"]},
  ]},
];

const allUnits = chapters.flatMap(c=>c.units.map(u=>({...u,chapter:c})));
const chapterArt:Record<string,{src:string;label:string}>={u1:{src:"/lesson-images/cells.png",label:"顯微觀察"},u2:{src:"/lesson-images/cells.png",label:"細胞構造"},u3:{src:"/lesson-images/diffusion.png",label:"養分作用"},u4:{src:"/specimens/red-blood-cells.jpg",label:"物質運輸"},u5:{src:"/lesson-images/cells.png",label:"訊息協調"},u6:{src:"/specimens/red-blood-cells.jpg",label:"體內恆定"},d1:{src:"/specimens/fern-sori.jpg",label:"生殖繁衍"},d2:{src:"/lesson-images/cells.png",label:"遺傳物質"},d3:{src:"/specimens/ammonite.jpg",label:"演化分類"},d4:{src:"/lesson-images/food-web.png",label:"生態關係"},d5:{src:"/lesson-images/food-web.png",label:"多樣性保育"}};
const distractors = ["只在動物細胞中發生","過程不受環境影響","結果必定對生物有利","所有生物的情況都完全相同","主要功能是產生光能","發生後無法再被調節"];
function makeQuiz(unit:Unit):Question[]{
  const stems=["下列關於此概念的敘述，何者正確？","某同學整理重點，哪一項最合理？","依據生物學原理判斷，何者可作為正確結論？","若要向同學說明本單元，應選哪一項？","進行探究後，哪一項推論最符合科學證據？"];
  return Array.from({length:25},(_,i)=>{const answer=i%4; const fact=unit.keys[i%unit.keys.length]; const wrong=[...distractors.slice(i%3),...unit.keys.filter(k=>k!==fact).map(k=>`所有情況下，${k}`)].slice(0,3); const opts=[...wrong];opts.splice(answer,0,fact);return{prompt:`${i+1}. ${stems[i%stems.length]}`,options:opts,answer,explanation:`答案是「${fact}」。判斷時先找出適用的構造、作用或條件，避免把生物現象說成毫無例外。`}});
}

const mockQuestions:Question[] = [
  {prompt:"校園池塘午後常見水草葉片冒出氣泡。研究者改變燈距並記錄每分鐘氣泡數。此實驗最適合探討什麼？",options:["光照強度與光合作用速率的關係","水溫與呼吸作用的關係","水草種類與蒸散作用的關係","氣泡大小與滲透作用的關係"],answer:0,explanation:"改變燈距是在改變光照強度，氣泡數可作為光合作用產氧速率的指標。"},
  {prompt:"小安把相同大小的馬鈴薯條分別放入清水與濃鹽水，30 分鐘後濃鹽水中的馬鈴薯條變軟。最合理的解釋是？",options:["鹽進入細胞並分解細胞壁","水由細胞內經滲透作用移出","細胞吸收鹽後進行光合作用","細胞核因高溫而遭破壞"],answer:1,explanation:"外界溶液濃度較高時，水分由細胞內移出，膨壓下降而變軟。"},
  {prompt:"某人小腸絨毛嚴重受損，即使飲食正常，仍可能營養不良。主要原因為何？",options:["膽汁無法製造","食道無法蠕動","養分吸收面積減少","胃酸完全消失"],answer:2,explanation:"絨毛大幅增加小腸表面積，受損會降低養分吸收效率。"},
  {prompt:"運動後心跳加快，對身體最直接的幫助是？",options:["讓紅血球製造更多基因","使所有靜脈變成動脈","停止細胞產生二氧化碳","加速氧氣與養分運送並帶走代謝物"],answer:3,explanation:"心輸出量增加，可加速物質運輸以滿足肌肉代謝需求。"},
  {prompt:"手碰到熱鍋立刻縮回，之後才感到疼痛。這最能說明什麼？",options:["反射可先由脊髓整合，再傳至大腦形成感覺","疼痛由肌肉產生，與神經無關","大腦完全沒有參與此事件","感覺神經只會傳到心臟"],answer:0,explanation:"縮手反射可由脊髓快速整合；訊息再傳到大腦形成痛覺。"},
  {prompt:"健康人餐後血糖升高，身體通常會增加哪一種激素的分泌？",options:["腎上腺素","胰島素","生長激素","甲狀腺素"],answer:1,explanation:"胰島素促進細胞利用葡萄糖與肝糖合成，使血糖下降。"},
  {prompt:"某植物莖的韌皮部被環狀剝除，一段時間後剝除處上方膨大。最合理原因為何？",options:["水分只能向下運輸","木質部無法運輸氧氣","葉片製造的養分向下運輸受阻","根部吸收的礦物質全部累積於葉片"],answer:2,explanation:"韌皮部負責運輸光合作用產物，受阻後養分累積在上方。"},
  {prompt:"一對表現正常的父母生下具有隱性性狀的孩子。若以 A、a 表示等位基因，父母最可能的基因型皆為？",options:["AA","aa","AA 或 aa","Aa"],answer:3,explanation:"孩子為 aa，父母各需提供 a；父母表現正常表示皆可能為 Aa。"},
  {prompt:"抗生素使用一段時間後，細菌族群中抗藥性個體比例增加。下列解釋何者最合理？",options:["原有差異經抗生素篩選，抗藥個體留下較多後代","每隻細菌為了生存主動產生相同突變","抗生素使細菌全部變成另一物種","沒有抗藥性的細菌學會抵抗藥物"],answer:0,explanation:"抗藥性變異可能原已存在，抗生素形成選汰壓力，使其比例上升。"},
  {prompt:"食物鏈為草→蝗蟲→青蛙→蛇。若青蛙因疾病大量減少，短期內最可能出現何種變化？",options:["草立即消失","蝗蟲增加、蛇的食物減少","蛇增加、蝗蟲減少","所有族群數量完全不變"],answer:1,explanation:"青蛙減少使其獵物蝗蟲受捕食壓力下降，也使蛇的食物來源減少。"},
  {prompt:"海洋大型魚體內的某污染物濃度常高於海水，且高於小型魚。這現象最可能涉及？",options:["蒸散與呼吸","遺傳與突變","生物累積與食物鏈放大","受精與胚胎發育"],answer:2,explanation:"難分解污染物會在個體累積，並沿食物鏈在高階消費者體內放大。"},
  {prompt:"保育瀕危蛙類時，下列哪一方案最能同時維護其長期生存與生態關係？",options:["大量捕捉製成標本","只在網路發布照片","把所有個體長期關在室內","保護原棲地並控制污染與外來種"],answer:3,explanation:"就地保育可同時保存棲地、族群與生物間互動，是長期保育核心。"},
];

function InteractiveLab({unit}:{unit:Unit}){
 const [value,setValue]=useState(50); const [step,setStep]=useState(0); const name=unit.title;
 const mode=name.includes("物質進出")?"osmosis":name.includes("酵素")?"enzyme":name.includes("光")||name.includes("製造養分")?"photo":name.includes("循環")||name.includes("心血管")?"blood":name.includes("神經")||name.includes("刺激")?"nerve":name.includes("呼吸")?"breath":name.includes("遺傳")||name.includes("人類的遺傳")?"gene":name.includes("生態系")||name.includes("互動關係")?"food":name.includes("細胞的分裂")?"division":name.includes("顯微")||name.includes("實驗室")?"scope":"cards";
 const labels:{[k:string]:[string,string,string]}={osmosis:["外液濃度","細胞吸水膨脹","細胞失水萎縮"],enzyme:["溫度","反應較慢","高溫使酵素失去活性"],photo:["光照強度","產氧速率較低","產氧速率較高"],blood:["運動強度","心跳較慢","心跳加快、供氧增加"],nerve:["刺激強度","尚未引發明顯反應","訊息經神經傳遞至動器"],breath:["活動強度","呼吸較慢","呼吸頻率加快"],gene:["顯性等位基因比例","隱性表現較常出現","顯性表現較常出現"],food:["生產者數量","高階消費者可用能量較少","食物網獲得較多能量來源"]};
 if(mode==="cards")return <section className="interactive"><div className="interactive-head"><div><p className="kicker">INTERACTIVE CONCEPT</p><h2>點擊觀念，建立因果連結</h2></div><span>互動觀念卡</span></div><div className="concept-tabs">{unit.keys.map((k,i)=><button className={step===i?"active":""} onClick={()=>setStep(i)} key={k}>{i+1}</button>)}</div><div className="reveal"><b>觀念 {step+1}</b><p>{unit.keys[step]}</p><small>想一想：如果改變其中的條件，結果是否仍然成立？科學敘述要留意適用範圍。</small></div></section>;
 if(mode==="scope")return <section className="interactive"><div className="interactive-head"><div><p className="kicker">VIRTUAL MICROSCOPE</p><h2>虛擬顯微鏡</h2></div><span>{value<50?"低倍視野":"高倍視野"}</span></div><div className="scope-lab"><div className={`scope-view ${value>=50?"zoom":""}`}>{Array.from({length:9},(_,i)=><i key={i}/>)}</div><div><label>拖曳倍率：{value<50?"40×":"400×"}</label><input type="range" value={value} onChange={e=>setValue(+e.target.value)}/><p>{value<50?"低倍：視野較亮、範圍較大，適合先尋找標本。":"高倍：視野較暗、範圍較小，可觀察更多細節。"}</p></div></div></section>;
 if(mode==="division")return <section className="interactive"><div className="interactive-head"><div><p className="kicker">CELL DIVISION</p><h2>細胞分裂步驟</h2></div><span>第 {step+1} 階段</span></div><div className="division"><div className={`cell-stage s${step}`}><i/><i/><b/></div><div><div className="step-buttons">{["複製","排列","分離","形成兩細胞"].map((x,i)=><button className={step===i?"active":""} onClick={()=>setStep(i)} key={x}>{x}</button>)}</div><p>{["分裂前先複製 DNA，讓遺傳物質準備分配。","染色體排列在細胞中央。","複製後的染色體分向兩側。","細胞質分裂，形成兩個子細胞。 "][step]}</p></div></div></section>;
 const lab=labels[mode]||labels.osmosis; const result=value<50?lab[1]:lab[2];
 return <section className="interactive"><div className="interactive-head"><div><p className="kicker">LIVE BIO SIMULATOR</p><h2>{name}模擬器</h2></div><span>拖曳看看</span></div><div className={`sim ${mode}`}><div className="sim-visual"><div className="particle p1"/><div className="particle p2"/><div className="particle p3"/><div className="organism" style={{transform:`scale(${.8+value/250})`}}><i/></div></div><div className="sim-control"><label>{lab[0]}：{value}%</label><input aria-label={lab[0]} type="range" min="0" max="100" value={value} onChange={e=>setValue(+e.target.value)}/><div className="result"><small>觀察結果</small><b>{result}</b></div><p>把滑桿移到兩端，比較條件改變前後的差異，再用本單元觀念解釋結果。</p></div></div></section>
}

function lessonKind(unit:Unit){const n=unit.title;if(/構造|組成|類型|分類|植物界|動物界/.test(n))return "構造比較";if(/方式|運輸|循環|分裂|生殖|獲得|製造|呼吸|排泄/.test(n))return "作用流程";if(/方法|酵素|遺傳|突變|互動|危機|保育/.test(n))return "條件判讀";return "觀念統整"}
function VisualExample({unit}:{unit:Unit}){let src="/lesson-images/cells.png",title="植物細胞與動物細胞比較",tip="先找共同構造，再辨認植物細胞特有的細胞壁、葉綠體與大型液胞。",labels=["細胞壁｜支撐保護","大型液胞｜儲存水分","細胞核｜控制生命活動","粒線體｜釋放能量"];if(/物質進出|擴散|滲透|運輸|呼吸/.test(unit.title)){src="/lesson-images/diffusion.png";title="物質跨膜移動示意";tip="觀察膜兩側粒子密度與箭頭方向：擴散的淨移動方向是由高濃度往低濃度。";labels=["高濃度區｜粒子較密集","細胞膜｜選擇性通透","移動方向｜高濃度往低濃度","平衡狀態｜兩側均勻分布"]}else if(/生態|互動|族群|多樣性|保育|危機/.test(unit.title)){src="/lesson-images/food-web.png";title="草地生態系食物網";tip="箭頭代表能量流向取食者；一種生物通常同時連接多條食物鏈。";labels=["草｜生產者","昆蟲與鼠｜初級消費者","蛙與蛇｜較高階消費者","真菌｜分解者"]}return <section className="visual-example"><div className="visual-copy"><p className="kicker">VISUAL EXAMPLE</p><h2>{title}</h2><p>{tip}</p><ol className="annotation-key">{labels.map((x,i)=>{const [a,b]=x.split("｜");return <li key={x}><i>{i+1}</i><span><b>{a}</b><small>{b}</small></span></li>})}</ol></div><figure className="annotated"><img src={src} alt={title}/>{labels.map((_,i)=><span key={i} className={`pin pin-${i+1}`}>{i+1}</span>)}<figcaption>依編號對照左側標註</figcaption></figure></section>}

const specimenBank=[
 {match:/原核|原生|真菌|分類|命名/,src:"/specimens/black-bread-mold.jpg",name:"黑黴菌（根黴菌）",note:"圓球狀孢子囊位在孢子囊梗頂端；菌絲以吸收方式取得養分。",url:"https://commons.wikimedia.org/wiki/File:Rhizopus_stolonifer3.jpg"},
 {match:/原核|原生|真菌|分類|命名|生態系/,src:"/specimens/diatoms.jpg",name:"顯微鏡下的矽藻",note:"單細胞藻類，矽質細胞壁形成多樣幾何外形，也是水域食物網的重要生產者。",url:"https://commons.wikimedia.org/wiki/File:Diatoms_through_the_microscope.jpg"},
 {match:/心血管|循環|血糖|呼吸/,src:"/specimens/red-blood-cells.jpg",name:"顯微鏡下的紅血球",note:"成熟紅血球呈雙凹圓盤狀，有助增加氣體交換面積；血紅素負責攜帶氧氣。",url:"https://commons.wikimedia.org/wiki/File:Red_blood_cells.jpg"},
 {match:/植物界|生殖|無性|分類/,src:"/specimens/fern-sori.jpg",name:"蕨類葉背的孢子囊群",note:"葉背成排的褐色小點是孢子囊群；蕨類不產生種子，以孢子繁殖。",url:"https://commons.wikimedia.org/wiki/File:Fern_sori_pattern.jpg"}
 ,{match:/植物界|生殖|分類/,src:"/specimens/moss-sporophytes.jpg",name:"苔蘚與孢蒴",note:"細長柄頂端的孢蒴可產生孢子；苔蘚沒有真正的維管束，常見於潮濕環境。",url:"https://commons.wikimedia.org/wiki/File:Moss_with_sporophytes_-_geograph.org.uk_-_1170910.jpg"}
 ,{match:/化石|演化/,src:"/specimens/ammonite.jpg",name:"菊石化石",note:"生物遺體或活動痕跡保存在地層中，可提供古代生物外形與環境的證據。",url:"https://commons.wikimedia.org/wiki/File:Ammonite.600pix.jpg"}
];
function specimenLabels(name:string){if(name.includes("黑黴菌"))return ["孢子囊：內含孢子","孢子囊梗：支撐孢子囊","菌絲：吸收養分"];if(name.includes("矽藻"))return ["矽質細胞壁","多樣幾何外形","單細胞個體"];if(name.includes("紅血球"))return ["雙凹圓盤外形","中央較薄區","大量紅血球"];if(name.includes("蕨類"))return ["孢子囊群","葉脈","葉片下表皮"];if(name.includes("苔蘚"))return ["孢蒴","蒴柄","配子體"];return ["化石外形","殼體紋路","保存於岩層"]}
function SpecimenGallery({unit}:{unit:Unit}){const items=specimenBank.filter(x=>x.match.test(unit.title));if(!items.length)return null;return <section className="specimens"><div className="specimen-head"><div><p className="kicker">REAL SPECIMENS</p><h2>真實影像圖鑑</h2></div><span>{items.length} 張觀察範例</span></div><p className="gallery-guide">圖中編號是辨識提示；照片顏色可能受染色、光源或拍攝方式影響。</p><div className={`specimen-grid count-${items.length}`}>{items.map(x=>{const labs=specimenLabels(x.name);return <figure key={x.name}><div className="specimen-photo"><img src={x.src} alt={x.name}/>{labs.map((_,i)=><span className={`photo-pin photo-pin-${i+1}`} key={i}>{i+1}</span>)}</div><figcaption><b>{x.name}</b><ul>{labs.map((l,i)=><li key={l}><i>{i+1}</i>{l}</li>)}</ul><p>{x.note}</p><a href={x.url} target="_blank" rel="noreferrer">圖片來源與授權：Wikimedia Commons</a></figcaption></figure>})}</div></section>}
function LessonText({unit}:{unit:Unit}){
 const kind=lessonKind(unit); const tags=["核心定義","構造／條件","功能／結果","會考判讀"];
 return <article className="lesson compact"><div className="lesson-title"><div><p className="kicker">ONE-PAGE REVIEW</p><h2>一頁式重點整理</h2></div><span>{kind}・考前速讀</span></div>
  <div className="summary-strip"><b>本節主軸</b><p>{unit.summary}</p></div>
  <section className="review-block"><div className="block-heading"><span>01</span><div><small>MASTER TABLE</small><h3>核心重點總表</h3></div></div><div className="table-wrap"><table className="review-table"><thead><tr><th>整理面向</th><th>必背內容</th><th>作答時怎麼判斷</th></tr></thead><tbody>{unit.keys.map((k,i)=><tr id={`lesson-${i}`} key={k}><th><i>{i+1}</i>{tags[i]}</th><td>{k}</td><td>{i===0?"先確認題目問的是定義或特徵":i===1?"對照題目中的構造、位置或實驗條件":i===2?"順著箭頭判讀功能、物質或訊息的去向":"檢查敘述是否用了『一定、全部、完全』等過度用語"}</td></tr>)}</tbody></table></div></section>
  <section className="review-block"><div className="block-heading"><span>02</span><div><small>{kind==="作用流程"?"PROCESS":"COMPARE"}</small><h3>{kind==="作用流程"?"作用流程圖":"快速比較與分類"}</h3></div></div>{kind==="作用流程"?<div className="flow-row">{unit.keys.map((k,i)=><div key={k}><b>STEP {i+1}</b><span>{k}</span>{i<unit.keys.length-1&&<i>→</i>}</div>)}</div>:<div className="compare-grid"><div><b>要看什麼？</b><p>構造、位置、條件、物質移動方向</p></div><div><b>怎麼比較？</b><p>先找共同點，再標出只有其中一方具備的特徵</p></div><div><b>如何下結論？</b><p>只根據題目資料作答，不把可能誤寫成必然</p></div><div><b>關鍵證據</b><p>{unit.keys[0]}</p></div></div>}</section>
  <section className="review-block"><div className="block-heading"><span>03</span><div><small>EXAM TRAPS</small><h3>常考辨析</h3></div></div><div className="trap-table"><div><b>容易誤選</b><span>只看到熟悉名詞就選，忽略題目指定的條件或方向。</span></div><div><b>正確做法</b><span>圈出題幹的比較對象、改變條件與觀察結果，再對照總表。</span></div><div><b>一句記憶</b><span>{unit.keys.join("；")}</span></div></div></section>
  <details className="detail-reading"><summary>需要完整理解？展開課文補充</summary><div>{unit.keys.map((k,i)=><section key={k}><h3>{i+1}. {k}</h3><p>{k}。學習時要同時確認發生的位置、必要條件及造成的結果。遇到圖表或實驗題，先讀取題目提供的證據，再判斷結論是否合理。</p></section>)}</div></details>
 </article>
}

function LoginPage({onLogin}:{onLogin:(a:Account)=>void}){const [username,setUsername]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState("");function submit(e:React.FormEvent){e.preventDefault();const a=accounts.find(x=>x.username===username.trim().toLowerCase());const changed=JSON.parse(localStorage.getItem("bio-account-passwords")||"{}");if(!a||password!==(changed[a.username]||DEFAULT_PASSWORD)){setError("帳號或密碼錯誤，請重新確認。");return}localStorage.setItem("bio-current-user",a.username);onLogin(a)}return <main className="login-page"><section className="login-brand"><div className="login-brand-top"><img src="/logo.png" alt="新趨勢文理補習班 logo"/><span>新趨勢文理補習班</span></div><div><p className="kicker">STUDENT LEARNING PORTAL</p><h1>登入你的<br/><em>生物複習基地</em></h1><p>課文圖表、互動圖解、單元測驗與個人成績，都會跟著你的帳號保存。</p></div><div className="login-features"><span>41 單元</span><span>1,025 題</span><span>個人進度</span></div></section><section className="login-box"><form onSubmit={submit}><p className="kicker">WELCOME BACK</p><h2>學生／老師登入</h2><p className="login-note">僅限新趨勢文理補習班師生使用</p><label>帳號<input autoFocus value={username} onChange={e=>setUsername(e.target.value)} placeholder="例如：student01" autoComplete="username"/></label><label>密碼<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="請輸入密碼" autoComplete="current-password"/></label>{error&&<div className="login-error">{error}</div>}<button type="submit">登入學習系統 →</button><small>第一次登入請使用補習班提供的初始密碼，登入後可自行修改。</small></form></section></main>}

function AccountPanel({user,onClose,onLogout}:{user:Account;onClose:()=>void;onLogout:()=>void}){const [oldPw,setOldPw]=useState(""),[newPw,setNewPw]=useState(""),[confirm,setConfirm]=useState(""),[message,setMessage]=useState("");function change(e:React.FormEvent){e.preventDefault();const saved=JSON.parse(localStorage.getItem("bio-account-passwords")||"{}");if(oldPw!==(saved[user.username]||DEFAULT_PASSWORD)){setMessage("目前密碼不正確。");return}if(newPw.length<8){setMessage("新密碼至少需要 8 個字元。");return}if(newPw!==confirm){setMessage("兩次輸入的新密碼不一致。");return}saved[user.username]=newPw;localStorage.setItem("bio-account-passwords",JSON.stringify(saved));setOldPw("");setNewPw("");setConfirm("");setMessage("密碼已更新，下次登入請使用新密碼。")}return <div className="account-overlay" onClick={onClose}><section className="account-panel" onClick={e=>e.stopPropagation()}><button className="account-close" onClick={onClose}>×</button><div className="account-id"><span>{user.role==="teacher"?"師":"生"}</span><div><small>{user.role==="teacher"?"TEACHER":"STUDENT"}</small><h2>{user.name}</h2><p>@{user.username}</p></div></div><form onSubmit={change}><h3>修改密碼</h3><label>目前密碼<input type="password" value={oldPw} onChange={e=>setOldPw(e.target.value)}/></label><label>新密碼<input type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="至少 8 個字元"/></label><label>再次輸入新密碼<input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)}/></label>{message&&<p className="password-message">{message}</p>}<button className="change-password">儲存新密碼</button></form><button className="logout" onClick={onLogout}>登出此帳號</button></section></div>}

function App(){
 const [currentUser,setCurrentUser]=useState<Account|null>(null); const [accountOpen,setAccountOpen]=useState(false); const [authReady,setAuthReady]=useState(false);
 const [view,setView]=useState<"home"|"unit"|"quiz"|"mock"|"progress">("home");
 const [selected,setSelected]=useState(allUnits[0]); const [book,setBook]=useState<"全部"|"上冊"|"下冊">("全部");
 const [answers,setAnswers]=useState<Record<number,number>>({}); const [submitted,setSubmitted]=useState(false);
 const [done,setDone]=useState<string[]>([]); const [read,setRead]=useState<string[]>([]); const [records,setRecords]=useState<ScoreRecord[]>([]); const [query,setQuery]=useState(""); const [searchOpen,setSearchOpen]=useState(false);
 useEffect(()=>{try{const uname=localStorage.getItem("bio-current-user");setCurrentUser(accounts.find(a=>a.username===uname)||null)}catch{}finally{setAuthReady(true)}},[]);
 useEffect(()=>{if(!currentUser)return;const k=currentUser.username;try{setDone(JSON.parse(localStorage.getItem(`bio-review-done-${k}`)||"[]"));setRead(JSON.parse(localStorage.getItem(`bio-review-read-${k}`)||"[]"));setRecords(JSON.parse(localStorage.getItem(`bio-review-scores-${k}`)||"[]"))}catch{setDone([]);setRead([]);setRecords([])}},[currentUser]);
 const quiz=useMemo(()=>view==="mock"?Array.from({length:25},(_,i)=>mockQuestions[i%mockQuestions.length]):makeQuiz(selected),[view,selected]);
 const shown=chapters.filter(c=>book==="全部"||c.book===book).map(c=>({...c,units:c.units.filter(u=>!query||`${u.code}${u.title}${u.summary}${u.keys.join("")}`.toLowerCase().includes(query.toLowerCase()))})).filter(c=>c.units.length);
 const searchResults=query?allUnits.filter(u=>`${u.code}${u.title}${u.summary}${u.keys.join("")}${u.chapter.title}`.toLowerCase().includes(query.toLowerCase())):[];
 const score=Object.entries(answers).filter(([i,a])=>quiz[+i]?.answer===a).length;
 function openUnit(u:Unit,c:Chapter){setSelected({...u,chapter:c});setView("unit");setAnswers({});setSubmitted(false);scrollTo(0,0)}
 function startQuiz(mock=false){setAnswers({});setSubmitted(false);setView(mock?"mock":"quiz");scrollTo(0,0)}
 function markRead(){const id=`${selected.chapter.id}-${selected.code}`;const n=read.includes(id)?read.filter(x=>x!==id):[...read,id];setRead(n);localStorage.setItem(`bio-review-read-${currentUser!.username}`,JSON.stringify(n))}
 function finish(){setSubmitted(true);const isMock=view==="mock",id=isMock?"mock":`${selected.chapter.id}-${selected.code}`;const rec:ScoreRecord={unit:id,title:isMock?"會考生物模考":selected.title,score,date:new Date().toLocaleString("zh-TW",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}),mock:isMock};const nr=[rec,...records].slice(0,100);setRecords(nr);localStorage.setItem(`bio-review-scores-${currentUser!.username}`,JSON.stringify(nr));if(!isMock&&score>=15&&!done.includes(id)){const n=[...done,id];setDone(n);localStorage.setItem(`bio-review-done-${currentUser!.username}`,JSON.stringify(n));}scrollTo(0,0)}
 if(!authReady)return <main className="auth-loading">載入登入系統…</main>;
 if(!currentUser)return <LoginPage onLogin={setCurrentUser}/>;
 return <main>
  <header className="topbar"><button className="brand" onClick={()=>setView("home")}><img src="/logo.png" alt="新趨勢文理補習班 logo"/><span><b>新趨勢文理補習班</b><small>生物全攻略・BIOLOGY REVIEW</small></span></button><nav><button className={view!=="mock"&&view!=="progress"?"active":""} onClick={()=>setView("home")}>章節複習</button><button onClick={()=>setSearchOpen(true)}>⌕ 全站檢索</button><button className={view==="progress"?"active":""} onClick={()=>setView("progress")}>我的進度</button><button className={view==="mock"?"active":""} onClick={()=>startQuiz(true)}>會考模考</button></nav><button className="user-chip" onClick={()=>setAccountOpen(true)}><span>{currentUser.role==="teacher"?"師":"生"}</span><b>{currentUser.name}</b></button></header>
  {accountOpen&&<AccountPanel user={currentUser} onClose={()=>setAccountOpen(false)} onLogout={()=>{localStorage.removeItem("bio-current-user");setCurrentUser(null);setAccountOpen(false)}}/>}
  {searchOpen&&<div className="search-overlay" onClick={()=>setSearchOpen(false)}><div className="search-panel" onClick={e=>e.stopPropagation()}><div className="search-top"><div><p className="kicker">KNOWLEDGE SEARCH</p><h2>搜尋生物觀念</h2></div><button aria-label="關閉搜尋" onClick={()=>setSearchOpen(false)}>×</button></div><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="輸入關鍵字，例如：擴散、胰島素、食物鏈…"/><p className="search-count">{query?`找到 ${searchResults.length} 個相關單元`:"可搜尋單元名稱、課文重點與關鍵概念"}</p><div className="search-results">{searchResults.map(u=><button key={`${u.chapter.id}-${u.code}`} onClick={()=>{openUnit(u,u.chapter);setSearchOpen(false)}}><span style={{background:u.chapter.color}}>{u.code}</span><div><small>{u.chapter.book}・{u.chapter.title}</small><b>{u.title}</b><p>{u.keys.find(k=>k.includes(query))||u.summary}</p></div><i>直接複習 →</i></button>)}</div></div></div>}
  {view==="home"&&<>
   <section className="hero"><div><p className="kicker">114 學年度・七年級生物總複習</p><h1>把整學年的生物，<br/><em>收進一張清楚的地圖。</em></h1><p className="lead">從細胞到生態系，41 個單元重點、每單元 25 題練習，加上一回會考式素養模考。</p><div className="hero-actions"><button className="primary" onClick={()=>openUnit(allUnits[0],allUnits[0].chapter)}>開始複習 <span>→</span></button><button className="ghost" onClick={()=>startQuiz(true)}>直接挑戰模考</button></div></div><div className="hero-card"><div className="orb"><b>{Math.round(done.length/allUnits.length*100)}%</b><span>複習進度</span></div><div className="stat-row"><div><b>11</b><span>章節</span></div><div><b>41</b><span>單元</span></div><div><b>1,025</b><span>練習題</span></div></div></div></section>
   <section className="catalog"><div className="section-head"><div><p className="kicker">CHAPTER MAP</p><h2>選一個章節，今天就從這裡攻下</h2></div><div className="filters"><div>{(["全部","上冊","下冊"] as const).map(x=><button key={x} className={book===x?"on":""} onClick={()=>setBook(x)}>{x}</button>)}</div><input aria-label="搜尋單元" value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜尋：細胞、遺傳、生態…"/></div></div>
   <div className="chapters">{shown.map(c=>{const art=chapterArt[c.id];return <article className="chapter" key={c.id} style={{"--accent":c.color} as React.CSSProperties}><div className="chapter-no"><span>{c.book}</span><b>{String(c.no).padStart(2,"0")}</b></div><div className="chapter-art"><img src={art.src} alt={`${c.title}代表圖：${art.label}`}/><span>{art.label}</span></div><div className="chapter-body"><div className="chapter-title"><h3>{c.title}</h3><span>{c.units.length} 單元</span></div><div className="unit-list">{c.units.map(u=>{const isDone=done.includes(`${c.id}-${u.code}`);return <button key={u.code} onClick={()=>openUnit(u,c)}><span className="unit-thumb"><img src={art.src} alt=""/></span><span className="unit-code">{isDone?"✓":u.code}</span><span><b>{u.title}</b><small>{u.summary}</small></span><i className="image-enter">看圖複習 →</i></button>})}</div></div></article>})}</div></section>
  </>}
  {view==="progress"&&<section className="progress-page"><button className="back" onClick={()=>setView("home")}>← 回章節地圖</button><div className="progress-hero"><div><p className="kicker">MY LEARNING RECORD</p><h1>我的學習進度</h1><p>「已讀」由自己標記；單元測驗達 15／25 題以上才會顯示「通過」。</p></div><div className="progress-rings"><div><b>{read.length}</b><span>已讀單元</span></div><div><b>{done.length}</b><span>測驗通過</span></div><div><b>{records.length?Math.max(...records.map(r=>r.score)):0}</b><span>最高分</span></div></div></div><div className="record-layout"><article><div className="record-title"><h2>單元進度表</h2><span>{Math.round(done.length/allUnits.length*100)}% 完成</span></div><div className="master-progress"><i style={{width:`${done.length/allUnits.length*100}%`}}/></div><div className="unit-records">{allUnits.map(u=>{const id=`${u.chapter.id}-${u.code}`,best=Math.max(0,...records.filter(r=>r.unit===id).map(r=>r.score));return <button key={id} onClick={()=>openUnit(u,u.chapter)}><span className="record-code" style={{background:u.chapter.color}}>{u.code}</span><div><small>{u.chapter.book}・{u.chapter.title}</small><b>{u.title}</b></div><em className={read.includes(id)?"yes":""}>{read.includes(id)?"✓ 已讀":"○ 未讀"}</em><em className={done.includes(id)?"pass":""}>{done.includes(id)?"✓ 通過":best?`${best}/25 未通過`:"尚未測驗"}</em></button>})}</div></article><aside className="score-history"><h2>成績紀錄</h2>{records.length===0?<div className="empty-record">完成測驗後，成績會出現在這裡。</div>:records.map((r,i)=><div key={`${r.date}-${i}`}><span className={r.score>=15?"good":""}>{r.score}</span><div><b>{r.title}</b><small>{r.date}・{r.mock?"模擬考":"單元測驗"}</small></div></div>)}</aside></div></section>}
  {view==="unit"&&<section className="unit-page"><button className="back" onClick={()=>setView("home")}>← 回章節地圖</button><div className="unit-hero" style={{"--accent":selected.chapter.color} as React.CSSProperties}><div><p className="kicker">{selected.chapter.book}・第 {selected.chapter.no} 章</p><h1><span>{selected.code}</span> {selected.title}</h1><p>{selected.summary}</p><button className={`read-button ${read.includes(`${selected.chapter.id}-${selected.code}`)?"marked":""}`} onClick={markRead}>{read.includes(`${selected.chapter.id}-${selected.code}`)?"✓ 已標記讀完":"○ 標記為已讀完"}</button></div><button className="primary" onClick={()=>startQuiz()}>開始 25 題測驗 →</button></div><div className="study-grid"><article className="concept-card"><p className="kicker">CORE CONCEPTS</p><h2>四個一定要會的觀念</h2>{selected.keys.map((k,i)=><a className="key" href={`#lesson-${i}`} key={k}><b>{String(i+1).padStart(2,"0")}</b><p>{k}</p></a>)}</article><aside><div className="exam-tip"><span>會考攻略</span><h3>先找題幹中的「改變條件」</h3><p>圖表題先看橫軸、縱軸與單位；實驗題先分出操縱、應變及控制變因，再判斷結論是否超出證據。</p></div><div className="quick-check"><p>本單元完成條件</p><b>自行標記已讀＋測驗至少 15 題</b><span>進度會自動保存在這台裝置</span></div></aside></div><VisualExample unit={selected}/><SpecimenGallery unit={selected}/><LessonText unit={selected}/><InteractiveLab unit={selected}/><div className="lesson-cta"><div><p className="kicker">READY?</p><h2>讀完了，趁記憶還新鮮去測驗</h2></div><button className="primary" onClick={()=>startQuiz()}>開始 25 題測驗 →</button></div></section>}
  {(view==="quiz"||view==="mock")&&<section className="quiz-page"><button className="back" onClick={()=>setView(view==="mock"?"home":"unit")}>← {view==="mock"?"回首頁":"回單元"}</button><div className="quiz-head"><div><p className="kicker">{view==="mock"?"CAP-STYLE MOCK EXAM":`${selected.code} UNIT QUIZ`}</p><h1>{view==="mock"?"國中會考・生物素養模考":selected.title}</h1><p>{view==="mock"?"25 題・建議 35 分鐘・題目依歷屆會考素養導向重新命題":"每題只有一個最適合的答案，送出後可查看解析。"}</p></div>{submitted&&<div className="score"><b>{score}</b><span>/ 25</span><small>{score>=20?"觀念很穩！":score>=15?"再訂正幾題就更好了":"回到重點卡補強一下"}</small></div>}</div><div className="question-list">{quiz.map((q,i)=><article className={`question ${submitted?(answers[i]===q.answer?"correct":"wrong"):""}`} key={i}><div className="qnum">{String(i+1).padStart(2,"0")}</div><div><h3>{q.prompt.replace(/^\d+\.\s*/,"")}</h3><div className="options">{q.options.map((o,j)=><button disabled={submitted} onClick={()=>setAnswers(a=>({...a,[i]:j}))} className={`${answers[i]===j?"chosen":""} ${submitted&&j===q.answer?"right":""}`} key={j}><i>{String.fromCharCode(65+j)}</i>{o}</button>)}</div>{submitted&&<div className="explain"><b>{answers[i]===q.answer?"答對了":"正確答案："+String.fromCharCode(65+q.answer)}</b><p>{q.explanation}</p></div>}</div></article>)}</div>{!submitted?<button className="submit" disabled={Object.keys(answers).length<25} onClick={finish}>送出答案・查看成績</button>:<div className="finish-bar"><div><b>完成！你答對 {score} 題</b><span>錯題解析已顯示在題目下方</span></div><button onClick={()=>startQuiz(view==="mock")}>再測一次</button></div>}</section>}
  <footer><b>新趨勢文理補習班・生物全攻略</b><span>章節課文・互動圖解・單元測驗・會考模考</span></footer>
 </main>
}
export default App;
