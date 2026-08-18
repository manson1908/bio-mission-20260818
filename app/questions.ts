export type Question={id:string;chapter:string;stage:string;type:"choice"|"input";question:string;options?:string[];answer:string;explanation:string;points:number;difficulty:number};
export const questions:Question[]=[
{id:"1-1-001",chapter:"1-1",stage:"science",type:"choice",question:"『感染人數減少，可能與孩童更常洗手有關。』屬於哪一步？",options:["觀察","提出假說","進行實驗","提出結論"],answer:"提出假說",explanation:"這是尚待實驗驗證的可能解釋，因此是提出假說。",points:100,difficulty:1},
{id:"1-2-001",chapter:"1-2",stage:"life",type:"choice",question:"人體吃下食物後進行消化與吸收。",options:["代謝","生長與發育","生殖","感應與運動"],answer:"代謝",explanation:"消化與吸收是生物體內物質與能量轉換的代謝活動。",points:100,difficulty:1},
{id:"1-2-002",chapter:"1-2",stage:"life",type:"choice",question:"種子萌芽後逐漸長成植物。",options:["代謝","生長與發育","生殖","感應與運動"],answer:"生長與發育",explanation:"體型增加並逐漸成熟，屬於生長與發育。",points:100,difficulty:1},
{id:"1-2-003",chapter:"1-2",stage:"life",type:"choice",question:"手碰到燙的東西立刻縮回。",options:["代謝","生長與發育","生殖","感應與運動"],answer:"感應與運動",explanation:"感受刺激並產生縮手反應。",points:100,difficulty:1},
{id:"1-2-004",chapter:"1-2",stage:"life",type:"choice",question:"仙人掌的針狀葉主要有什麼功能？",options:["增加光合作用","減少水分散失","儲存大量養分","捕捉昆蟲"],answer:"減少水分散失",explanation:"針狀葉面積小，可降低水分散失。",points:100,difficulty:1},
{id:"1-2-005",chapter:"1-2",stage:"microscope",type:"input",question:"目鏡 10×、物鏡 40×，總倍率是多少？",answer:"400",explanation:"總倍率＝目鏡倍率×物鏡倍率＝400 倍。",points:100,difficulty:1},
{id:"1-3-001",chapter:"1-3",stage:"cell",type:"choice",question:"控制物質進出細胞的是？",options:["細胞膜","細胞核","粒線體","細胞壁"],answer:"細胞膜",explanation:"細胞膜能選擇性控制物質進出。",points:100,difficulty:1},
{id:"1-3-002",chapter:"1-3",stage:"cell",type:"choice",question:"洋蔥鱗片表皮細胞是否一定具有葉綠體？",options:["是","否"],answer:"否",explanation:"並非所有植物細胞都有葉綠體，洋蔥鱗片表皮通常沒有。",points:100,difficulty:2},
{id:"1-4-001",chapter:"1-4",stage:"osmosis",type:"choice",question:"物質自然由高濃度移向低濃度，稱為？",options:["擴散","蒸散","呼吸","消化"],answer:"擴散",explanation:"擴散使粒子由高濃度往低濃度移動，最後趨向均勻。",points:100,difficulty:1},
{id:"2-1-001",chapter:"2-1",stage:"nutrition",type:"choice",question:"下列何種養分每公克提供的熱量最高？",options:["醣類","蛋白質","脂質","維生素"],answer:"脂質",explanation:"脂質每公克約提供 9 大卡，醣類與蛋白質約 4 大卡。",points:100,difficulty:1},
{id:"2-1-002",chapter:"2-1",stage:"nutrition",type:"input",question:"蛋白質5g、脂質10g、醣類20g，共多少 kcal？",answer:"190",explanation:"5×4＋10×9＋20×4＝190 kcal。",points:100,difficulty:2},
{id:"2-1-003",chapter:"2-1",stage:"nutrition",type:"choice",question:"碘液遇到澱粉會呈現什麼顏色？",options:["藍黑色","磚紅色","淡藍色","無色"],answer:"藍黑色",explanation:"碘液可檢測澱粉，陽性反應為藍黑色。",points:100,difficulty:1},
{id:"2-2-001",chapter:"2-2",stage:"enzyme",type:"choice",question:"酵素只能與特定受質作用，這種特性稱為？",options:["專一性","擴散性","恆定性","生殖性"],answer:"專一性",explanation:"酵素的作用部位只適合特定受質。",points:100,difficulty:1},
{id:"2-2-002",chapter:"2-2",stage:"enzyme",type:"choice",question:"溫度越高，酵素活性一定越高嗎？",options:["是","不是"],answer:"不是",explanation:"過高溫度可能破壞酵素構造，使活性下降。",points:100,difficulty:1},
{id:"1-5-001",chapter:"1-5",stage:"boss",type:"choice",question:"植物體的組成層次不包含哪一項？",options:["細胞","組織","器官系統","個體"],answer:"器官系統",explanation:"植物為細胞→組織→器官→個體，不列器官系統。",points:100,difficulty:2}
];
