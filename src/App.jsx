import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   THEME SYSTEM — iOS 18 palette
   ═══════════════════════════════════════════ */
const TH = {
  light: {
    bg:"#F2F2F7",card:"rgba(255,255,255,0.78)",cardS:"#FFF",
    text:"#1C1C1E",t2:"#8E8E93",t3:"#C7C7CC",
    acc:"#007AFF",accL:"rgba(0,122,255,0.10)",
    grn:"#34C759",grnL:"rgba(52,199,89,0.10)",
    org:"#FF9500",orgL:"rgba(255,149,0,0.10)",
    red:"#FF3B30",redL:"rgba(255,59,48,0.10)",
    pur:"#AF52DE",purL:"rgba(175,82,222,0.10)",
    brd:"rgba(60,60,67,0.08)",nav:"rgba(249,249,249,0.94)",
    shd:"0 2px 20px rgba(0,0,0,0.06)",inp:"rgba(118,118,128,0.08)",
  },
  dark: {
    bg:"#000",card:"rgba(28,28,30,0.80)",cardS:"#1C1C1E",
    text:"#FFF",t2:"#8E8E93",t3:"#48484A",
    acc:"#0A84FF",accL:"rgba(10,132,255,0.15)",
    grn:"#30D158",grnL:"rgba(48,209,88,0.15)",
    org:"#FF9F0A",orgL:"rgba(255,159,10,0.15)",
    red:"#FF453A",redL:"rgba(255,69,58,0.15)",
    pur:"#BF5AF2",purL:"rgba(191,90,242,0.15)",
    brd:"rgba(84,84,88,0.35)",nav:"rgba(18,18,18,0.94)",
    shd:"0 2px 20px rgba(0,0,0,0.3)",inp:"rgba(118,118,128,0.24)",
  },
};

/* ═══════════════════════════════════════════
   PER-VEHICLE DATA — realistic, differentiated
   ═══════════════════════════════════════════ */
const VEHICLES = [
  {
    id:1, name:"Kia K5", year:2022, plate:"А 777 МР 77", km:47200, nextTO:48400,
    color:"Серебристый", engine:"2.5L, 194 л.с.", drive:"Передний", type:"Седан",
    vin:"XWEF•••NS123456", emoji:"🚗",
    gradient:"linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
    insExpDays:18,
    expenses: [
      {label:"Топливо",value:12400,icon:"fuel"}, {label:"Сервис",value:5600,icon:"wrench"},
      {label:"Страховка",value:3800,icon:"shield"}, {label:"Парковка",value:1800,icon:"park"},
      {label:"Штрафы",value:900,icon:"alert"},
    ],
    monthlyTotal: 24500,
    bars:[{l:"Дек",v:19200},{l:"Янв",v:22800},{l:"Фев",v:17500},{l:"Мар",v:20100},{l:"Апр",v:21400},{l:"Май",v:24500}],
    transactions: [
      {date:"18 мая",desc:"АЗС Лукойл",cat:"Топливо",amount:"2 840 ₽",catKey:"fuel"},
      {date:"15 мая",desc:"Парковка ТЦ Авиапарк",cat:"Парковка",amount:"350 ₽",catKey:"park"},
      {date:"12 мая",desc:"Замена масла",cat:"Сервис",amount:"5 600 ₽",catKey:"wrench"},
      {date:"10 мая",desc:"АЗС Газпром",cat:"Топливо",amount:"3 200 ₽",catKey:"fuel"},
      {date:"07 мая",desc:"Штраф ГИБДД",cat:"Штрафы",amount:"900 ₽",catKey:"alert"},
    ],
    services: [
      {date:"12 мая 2026",km:"47 200",title:"Замена масла и фильтров",place:"Автоцентр «Кристалл»",cost:"5 600 ₽"},
      {date:"28 мар 2026",km:"44 800",title:"Проверка тормозной системы",place:"ТехСервис Про",cost:"2 100 ₽"},
      {date:"15 янв 2026",km:"41 500",title:"Замена свечей зажигания",place:"Автоцентр «Кристалл»",cost:"4 200 ₽"},
      {date:"20 ноя 2025",km:"38 200",title:"Сезонная замена шин",place:"Шиномонтаж «Колёса»",cost:"3 800 ₽"},
      {date:"05 сен 2025",km:"35 000",title:"ТО-3 плановое",place:"Официальный дилер Kia",cost:"12 400 ₽"},
    ],
    docs: [
      {name:"ОСАГО",status:"Истекает через 18 дн",color:"red",icon:"shield",detail:{number:"ТТТ-7234567890",company:"Ингосстрах",validFrom:"05.06.2025",validTo:"05.06.2026",premium:"8 400 ₽"}},
      {name:"СТС",status:"Действителен",color:"grn",icon:"doc",detail:{series:"99 УА",number:"567890",issued:"12.03.2022"}},
      {name:"ПТС",status:"Электронный",color:"grn",icon:"doc",detail:{number:"е-ПТС 174538291",issued:"01.02.2022"}},
      {name:"Диаг. карта",status:"До 12.05.2027",color:"grn",icon:"check",detail:{number:"098765432198765",validTo:"12.05.2027",station:"ТехОсмотр Про"}},
    ],
    aiTips: [
      {text:"Через 1 200 км рекомендуется ТО",color:"org",target:"service"},
      {text:"Расходы на топливо выросли на 12%",color:"acc",target:"expenses"},
      {text:"Страховка истекает через 18 дней",color:"red",target:"profile"},
    ],
  },
  {
    id:2, name:"BMW X3", year:2020, plate:"М 555 КА 99", km:62800, nextTO:65000,
    color:"Чёрный", engine:"2.0L, 190 л.с.", drive:"Полный", type:"Кроссовер",
    vin:"WBAT•••MS789012", emoji:"🚙",
    gradient:"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
    insExpDays:142,
    expenses: [
      {label:"Топливо",value:18700,icon:"fuel"}, {label:"Сервис",value:8200,icon:"wrench"},
      {label:"Страховка",value:6100,icon:"shield"}, {label:"Парковка",value:2400,icon:"park"},
      {label:"Штрафы",value:1500,icon:"alert"},
    ],
    monthlyTotal: 36900,
    bars:[{l:"Дек",v:31500},{l:"Янв",v:28200},{l:"Фев",v:33800},{l:"Мар",v:29400},{l:"Апр",v:35200},{l:"Май",v:36900}],
    transactions: [
      {date:"17 мая",desc:"АЗС Shell",cat:"Топливо",amount:"4 100 ₽",catKey:"fuel"},
      {date:"14 мая",desc:"Мойка «Блеск»",cat:"Сервис",amount:"1 800 ₽",catKey:"wrench"},
      {date:"11 мая",desc:"АЗС BP",cat:"Топливо",amount:"3 900 ₽",catKey:"fuel"},
      {date:"08 мая",desc:"Штраф камера",cat:"Штрафы",amount:"1 500 ₽",catKey:"alert"},
      {date:"05 мая",desc:"Парковка Сити",cat:"Парковка",amount:"600 ₽",catKey:"park"},
    ],
    services: [
      {date:"03 мая 2026",km:"62 800",title:"ТО-5 плановое",place:"BMW Авилон",cost:"28 500 ₽"},
      {date:"18 фев 2026",km:"59 100",title:"Замена тормозных колодок",place:"BMW Авилон",cost:"14 200 ₽"},
      {date:"10 дек 2025",km:"55 600",title:"Замена шин зимних",place:"Шинсервис Про",cost:"5 200 ₽"},
      {date:"20 авг 2025",km:"50 000",title:"ТО-4 плановое",place:"BMW Авилон",cost:"32 100 ₽"},
    ],
    docs: [
      {name:"ОСАГО",status:"До 07.10.2026",color:"grn",icon:"shield",detail:{number:"ККК-9876543210",company:"РЕСО-Гарантия",validFrom:"07.10.2025",validTo:"07.10.2026",premium:"12 600 ₽"}},
      {name:"СТС",status:"Действителен",color:"grn",icon:"doc",detail:{series:"77 ОК",number:"123456",issued:"15.06.2020"}},
      {name:"ПТС",status:"Электронный",color:"grn",icon:"doc",detail:{number:"е-ПТС 098765432",issued:"01.03.2020"}},
      {name:"КАСКО",status:"До 15.08.2026",color:"grn",icon:"shield",detail:{number:"ПОЛ-5551234",company:"Альфастрахование",validFrom:"15.08.2025",validTo:"15.08.2026",premium:"68 000 ₽"}},
    ],
    aiTips: [
      {text:"Через 2 200 км рекомендуется ТО-6",color:"org",target:"service"},
      {text:"Расход топлива стабилен (11.2 л/100км)",color:"grn",target:"expenses"},
      {text:"Проверьте уровень тормозной жидкости",color:"pur",target:"service"},
    ],
  },
];

/* ═══════════════════════════════════════════
   ICON SYSTEM
   ═══════════════════════════════════════════ */
const Ic = ({n,s=22,co}) => {
  const p = {fill:"none",stroke:co,strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round"};
  const map = {
    home:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    wallet:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>,
    plus:<svg width={s} height={s} viewBox="0 0 24 24" {...p} strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    bell:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    gear:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    fuel:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="12" height="18" rx="1"/><path d="M15 8h2a2 2 0 012 2v4a2 2 0 002 2M21 10v6M7 8h4"/></svg>,
    wrench:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
    shield:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    qr:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/><line x1="21" y1="14" x2="21" y2="14.01"/><line x1="21" y1="21" x2="21" y2="21.01"/></svg>,
    dl:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    clock:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    chev:<svg width={s} height={s} viewBox="0 0 24 24" {...p} strokeWidth={2}><polyline points="9 18 15 12 9 6"/></svg>,
    spark:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    moon:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
    sun:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    check:<svg width={s} height={s} viewBox="0 0 24 24" {...p} strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>,
    doc:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    park:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><text x="12" y="17" textAnchor="middle" fill={co} stroke="none" fontSize="14" fontWeight="600">P</text></svg>,
    alert:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    back:<svg width={s} height={s} viewBox="0 0 24 24" {...p} strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>,
    car:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17v2m14-2v2"/><circle cx="7.5" cy="13.5" r="1.5"/><circle cx="16.5" cy="13.5" r="1.5"/></svg>,
    share:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    camera:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    x:<svg width={s} height={s} viewBox="0 0 24 24" {...p} strokeWidth={2.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    grid:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    copy:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
    star:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    crown:<svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M2 20h20M4 16l2-12 6 6 6-6 2 12z"/></svg>,
  };
  return map[n]||null;
};

/* ═══════════════════════════════════════════
   CHARTS
   ═══════════════════════════════════════════ */
const Pie = ({data,sz=120,c}) => {
  const total = data.reduce((s,d) => s + d.value, 0);
  const colors = [c.acc, c.org, c.grn, c.pur, c.red];
  let acc = 0;
  return <svg width={sz} height={sz}>
    {data.map((d,i) => {
      const st = acc/total; acc += d.value; const en = acc/total;
      const sa = st*Math.PI*2-Math.PI/2, ea = en*Math.PI*2-Math.PI/2;
      const la = en-st>.5?1:0, r = sz/2-4, ir = r*.55, cx = sz/2, cy = sz/2;
      return <path key={i} d={`M${cx+r*Math.cos(sa)},${cy+r*Math.sin(sa)} A${r},${r} 0 ${la} 1 ${cx+r*Math.cos(ea)},${cy+r*Math.sin(ea)} L${cx+ir*Math.cos(ea)},${cy+ir*Math.sin(ea)} A${ir},${ir} 0 ${la} 0 ${cx+ir*Math.cos(sa)},${cy+ir*Math.sin(sa)} Z`} fill={colors[i]} opacity=".9"/>;
    })}
    <text x={sz/2} y={sz/2-6} textAnchor="middle" fill={c.text} fontSize="15" fontWeight="700">{(total/1000).toFixed(1)}к</text>
    <text x={sz/2} y={sz/2+12} textAnchor="middle" fill={c.t2} fontSize="10">₽ / мес</text>
  </svg>;
};

const Bars = ({data,c}) => {
  const mx = Math.max(...data.map(d=>d.v));
  return <div style={{display:"flex",alignItems:"flex-end",gap:4,height:48}}>
    {data.map((d,i) => <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
      <div style={{width:18,borderRadius:4,height:Math.max(6,(d.v/mx)*40),background:i===data.length-1?c.acc:c.accL,transition:"height .5s"}}/>
      <span style={{fontSize:9,color:c.t2}}>{d.l}</span>
    </div>)}
  </div>;
};

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function App() {
  const [dk, setDk] = useState(false);
  const [scr, setScr] = useState("onboarding");
  const [showAdd, setShowAdd] = useState(false);
  const [carIdx, setCarIdx] = useState(0);
  const [hist, setHist] = useState(["onboarding"]);
  const [onbStep, setOnbStep] = useState(0);
  const [expCat, setExpCat] = useState(null);
  const [toast, setToast] = useState(null);
  const [docIdx, setDocIdx] = useState(null);
  const scrollRef = useRef(null);

  const c = dk ? TH.dark : TH.light;
  const car = VEHICLES[carIdx];
  const totalKmToService = car.nextTO - car.km;
  const colorMap = {acc:c.acc,grn:c.grn,org:c.org,red:c.red,pur:c.pur};

  const go = useCallback((s) => { setHist(h => [...h, s]); setScr(s); }, []);
  const back = useCallback(() => { setHist(h => { if (h.length <= 1) return h; const n = h.slice(0,-1); setScr(n[n.length-1]); return n; }); }, []);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [scr]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  // Which root tab is active?
  const rootTab = ["home","profile","garage","service","qrShare","addVehicle","docDetail"].includes(scr) ? "home"
    : ["expenses","addExpense"].includes(scr) ? "expenses"
    : ["notifications"].includes(scr) ? "notifications"
    : ["settings","subscription"].includes(scr) ? "settings" : "home";

  /* ─── SHARED UI COMPONENTS ─── */
  const G = {background:c.card,backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",borderRadius:16,border:`0.5px solid ${c.brd}`,boxShadow:c.shd};
  const Row = ({children,first,last,single,onClick,style:st}) => <div onClick={onClick} style={{...G,padding:"13px 16px",marginBottom:1,borderRadius:single?14:first?"14px 14px 2px 2px":last?"2px 2px 14px 14px":2,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:onClick?"pointer":"default",...st}}>{children}</div>;
  const Hdr = ({title,onBack,right}) => <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0 16px"}}><div style={{display:"flex",alignItems:"center",gap:8}}>{onBack&&<div onClick={onBack} style={{cursor:"pointer",padding:4}}><Ic n="back" s={22} co={c.acc}/></div>}<span style={{fontSize:17,fontWeight:600,color:c.text}}>{title}</span></div>{right}</div>;
  const Title = ({t}) => <div style={{fontSize:32,fontWeight:700,color:c.text,padding:"12px 4px 20px"}}>{t}</div>;
  const Pill = ({co,bg,text}) => <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:6,background:bg,fontSize:11,color:co,fontWeight:500}}>{text}</span>;
  const Btn = ({label,onClick,gradient,color:cl}) => <div onClick={onClick} style={{width:"100%",padding:"16px",borderRadius:14,background:gradient||c.acc,color:cl||"#fff",fontSize:17,fontWeight:600,textAlign:"center",cursor:"pointer",boxSizing:"border-box"}}>{label}</div>;

  const notifs = [
    {icon:"wrench",color:c.org,title:`Плановое ТО через ${totalKmToService.toLocaleString("ru")} км`,desc:"Рекомендуем записаться заранее",time:"Сегодня",unread:true},
    {icon:"shield",color:car.insExpDays<=30?c.red:c.grn,title:`Страховка: ${car.insExpDays} дней`,desc:car.insExpDays<=30?"Скоро истекает — продлите заранее":"Действует, всё в порядке",time:"Сегодня",unread:car.insExpDays<=30},
    {icon:"spark",color:c.acc,title:car.aiTips[1]?.text,desc:"AI-аналитика расходов",time:"Вчера",unread:true},
    {icon:"doc",color:c.grn,title:"Диагностическая карта обновлена",desc:"Действительна до 12.05.2027",time:"2 дня назад",unread:false},
    {icon:"spark",color:c.pur,title:car.aiTips[2]?.text||"Проверьте тормозные колодки",desc:"Рекомендация AI на основе пробега",time:"3 дня назад",unread:false},
    {icon:"car",color:c.acc,title:`Пробег: ${car.km.toLocaleString("ru")} км`,desc:`Обновление ${car.services[0]?.date?.split(" ").slice(0,2).join(" ")}`,time:"5 дней назад",unread:false},
  ];
  const unreadCount = notifs.filter(n => n.unread).length;

  const StatusBar = () => <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 24px 4px",fontSize:14,fontWeight:600,color:c.text}}>
    <span>9:41</span>
    <div style={{display:"flex",gap:5,alignItems:"center"}}>
      <svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="4" width="3" height="8" rx=".5" fill={c.text}/><rect x="4.5" y="2.5" width="3" height="9.5" rx=".5" fill={c.text}/><rect x="9" y=".5" width="3" height="11.5" rx=".5" fill={c.text}/></svg>
      <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0" y="1" width="22" height="10" rx="2" stroke={c.text} strokeWidth="1" fill="none"/><rect x="23" y="4" width="2" height="4" rx=".5" fill={c.text} opacity=".4"/><rect x="1.5" y="2.5" width="15" height="7" rx="1" fill={c.grn}/></svg>
    </div>
  </div>;

  /* ═══════════════════════════════════════════
     SCREEN: ONBOARDING
     ═══════════════════════════════════════════ */
  const Onboarding = () => {
    const slides = [
      {emoji:"🚗",title:"Цифровой паспорт",desc:"Все документы, расходы и история обслуживания — в одном месте"},
      {emoji:"🔔",title:"Умные напоминания",desc:"AI-ассистент подскажет, когда пора на ТО, что истекает и как оптимизировать расходы"},
      {emoji:"📱",title:"QR-паспорт",desc:"Покажите полную историю автомобиля покупателю через QR-код — прозрачность и доверие"},
    ];
    return <div style={{padding:"0 24px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",textAlign:"center"}}>
      <div style={{fontSize:72,marginBottom:24,animation:"fIn .5s ease"}} key={onbStep}>{slides[onbStep].emoji}</div>
      <div style={{fontSize:28,fontWeight:700,color:c.text,lineHeight:1.2,marginBottom:12}} key={`t${onbStep}`}>{slides[onbStep].title}</div>
      <div style={{fontSize:15,color:c.t2,lineHeight:1.5,maxWidth:280,marginBottom:40}}>{slides[onbStep].desc}</div>
      <div style={{display:"flex",gap:8,marginBottom:32}}>{slides.map((_,i) => <div key={i} style={{width:i===onbStep?24:8,height:8,borderRadius:4,background:i===onbStep?c.acc:c.inp,transition:"all .3s"}}/>)}</div>
      {onbStep < 2
        ? <Btn label="Далее" onClick={() => setOnbStep(onbStep+1)}/>
        : <Btn label="Добавить автомобиль" onClick={() => go("addVehicle")} gradient={car.gradient}/>}
      {onbStep < 2 && <div onClick={() => go("addVehicle")} style={{marginTop:16,color:c.t2,fontSize:14,cursor:"pointer"}}>Пропустить</div>}
    </div>;
  };

  /* ═══════════════════════════════════════════
     SCREEN: ADD VEHICLE
     ═══════════════════════════════════════════ */
  const AddVehicle = () => {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    if (loading) return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:16}}>
      <div style={{width:64,height:64,borderRadius:32,border:`3px solid ${c.brd}`,borderTopColor:c.acc,animation:"spin 1s linear infinite"}}/>
      <div style={{fontSize:17,fontWeight:600,color:c.text}}>Создаём цифровой паспорт...</div>
      <div style={{fontSize:14,color:c.t2}}>Это займёт пару секунд</div>
    </div>;
    const fields0 = ["Марка и модель","Год выпуска","Госномер","Текущий пробег (км)","VIN (необязательно)"];
    const vals0 = ["Kia K5","2022","А 777 МР 77","47 200",""];
    if (step === 0) return <div style={{padding:"0 20px"}}>
      <Hdr title="Новый автомобиль" onBack={hist.length>1?back:null}/>
      <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:64,marginBottom:8}}>🚗</div><div style={{fontSize:14,color:c.t2}}>Заполните данные вашего автомобиля</div></div>
      {fields0.map((ph,i) => <div key={i} style={{marginBottom:10}}>
        <input readOnly placeholder={ph} value={vals0[i]} style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1px solid ${c.brd}`,background:c.inp,fontSize:15,color:c.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
      </div>)}
      <Btn label="Далее" onClick={() => setStep(1)}/>
    </div>;
    const docs = [{n:"ОСАГО",done:true},{n:"СТС",done:true},{n:"ПТС",done:false},{n:"Диагностическая карта",done:false}];
    return <div style={{padding:"0 20px"}}>
      <Hdr title="Документы" onBack={() => setStep(0)}/>
      <div style={{fontSize:14,color:c.t2,marginBottom:20,paddingLeft:4}}>Добавьте документы автомобиля (можно позже)</div>
      {docs.map((d,i,a) => <Row key={i} first={i===0} last={i===a.length-1}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:d.done?c.grnL:c.inp,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n={d.done?"check":"doc"} s={18} co={d.done?c.grn:c.t2}/></div>
          <span style={{fontSize:15,color:c.text}}>{d.n}</span>
        </div>
        <span style={{fontSize:13,color:d.done?c.grn:c.acc}}>{d.done?"Добавлен":"Добавить"}</span>
      </Row>)}
      <div style={{marginTop:24}}>
        <Btn label="Создать паспорт" onClick={() => {setLoading(true);setTimeout(() => go("home"),1500);}} gradient={car.gradient}/>
      </div>
      <div onClick={() => {setLoading(true);setTimeout(() => go("home"),1500);}} style={{textAlign:"center",marginTop:14,color:c.t2,fontSize:14,cursor:"pointer"}}>Пропустить, добавлю позже</div>
    </div>;
  };

  /* ═══════════════════════════════════════════
     SCREEN: HOME DASHBOARD
     ═══════════════════════════════════════════ */
  const Home = () => <div style={{padding:"0 16px 20px"}}>
    {/* Header */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 4px 8px"}}>
      <div><div style={{fontSize:28,fontWeight:700,color:c.text,letterSpacing:-.5}}>Car Passport</div><div style={{fontSize:13,color:c.t2,marginTop:2}}>Добрый день 👋</div></div>
      <div style={{display:"flex",gap:8}}>
        <div onClick={() => go("garage")} style={{width:36,height:36,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",background:c.inp,cursor:"pointer"}}><Ic n="grid" s={18} co={c.t2}/></div>
        <div onClick={() => setDk(!dk)} style={{width:36,height:36,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",background:c.inp,cursor:"pointer"}}><Ic n={dk?"sun":"moon"} s={18} co={c.t2}/></div>
      </div>
    </div>
    {/* Multi-car switcher */}
    <div style={{display:"flex",gap:8,marginBottom:14,padding:"0 4px",overflowX:"auto"}}>
      {VEHICLES.map((cr,i) => <div key={i} onClick={() => setCarIdx(i)} style={{padding:"8px 14px",borderRadius:12,background:i===carIdx?c.accL:c.inp,border:`1.5px solid ${i===carIdx?c.acc:"transparent"}`,cursor:"pointer",display:"flex",alignItems:"center",gap:8,flexShrink:0,transition:"all .2s"}}>
        <span style={{fontSize:18}}>{cr.emoji}</span><span style={{fontSize:13,fontWeight:i===carIdx?600:400,color:i===carIdx?c.acc:c.t2}}>{cr.name}</span>
      </div>)}
      <div onClick={() => go("addVehicle")} style={{padding:"8px 14px",borderRadius:12,background:c.inp,cursor:"pointer",display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
        <Ic n="plus" s={14} co={c.t2}/><span style={{fontSize:13,color:c.t2}}>Добавить</span>
      </div>
    </div>
    {/* Vehicle card */}
    <div onClick={() => go("profile")} style={{...G,padding:20,cursor:"pointer",background:car.gradient,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-30,right:-20,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative"}}>
        <div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:1.2,fontWeight:600}}>Мой автомобиль</div>
          <div style={{fontSize:22,fontWeight:700,color:"#fff",marginTop:6}}>{car.name}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginTop:4}}>{car.year} · {car.plate}</div>
        </div>
        <div style={{fontSize:42}}>{car.emoji}</div>
      </div>
      <div style={{display:"flex",gap:20,marginTop:16,position:"relative"}}>
        <div><div style={{fontSize:10,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:.8}}>Пробег</div><div style={{fontSize:17,fontWeight:600,color:"#fff",marginTop:2}}>{car.km.toLocaleString("ru")} км</div></div>
        <div><div style={{fontSize:10,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:.8}}>Следующее ТО</div><div style={{fontSize:17,fontWeight:600,color:"#fff",marginTop:2}}>{car.nextTO.toLocaleString("ru")} км</div></div>
      </div>
    </div>
    {/* Status cards */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:14}}>
      {[{ic:"wrench",co:c.org,bg:c.orgL,lb:"До ТО",vl:totalKmToService.toLocaleString("ru"),un:"км",tap:() => go("service")},
        {ic:"shield",co:car.insExpDays<=30?c.red:c.grn,bg:car.insExpDays<=30?c.redL:c.grnL,lb:"ОСАГО",vl:String(car.insExpDays),un:"дней",tap:() => go("profile")},
        {ic:"wallet",co:c.acc,bg:c.accL,lb:"Май",vl:(car.monthlyTotal/1000).toFixed(1),un:" т₽",tap:() => go("expenses")},
        {ic:"doc",co:c.grn,bg:c.grnL,lb:"Документы",vl:String(car.docs.length),un:"акт.",tap:() => go("profile")}
      ].map((x,i) => <div key={i} onClick={x.tap} style={{...G,padding:"14px 16px",cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <div style={{width:28,height:28,borderRadius:8,background:x.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n={x.ic} s={15} co={x.co}/></div>
          <span style={{fontSize:12,color:c.t2}}>{x.lb}</span>
        </div>
        <div style={{fontSize:22,fontWeight:700,color:c.text}}>{x.vl}<span style={{fontSize:13,fontWeight:500,color:c.t2}}> {x.un}</span></div>
      </div>)}
    </div>
    {/* Quick actions */}
    <div style={{marginTop:20}}>
      <div style={{fontSize:17,fontWeight:600,color:c.text,marginBottom:14,paddingLeft:4}}>Быстрые действия</div>
      <div style={{display:"flex",justifyContent:"space-between",padding:"0 4px"}}>
        {[{ic:"wallet",l:"Расход",co:c.acc,bg:c.accL,tap:() => {setExpCat(null);go("addExpense")}},{ic:"wrench",l:"ТО",co:c.org,bg:c.orgL,tap:() => go("addService")},{ic:"qr",l:"QR-код",co:c.pur,bg:c.purL,tap:() => go("qrShare")},{ic:"dl",l:"PDF",co:c.grn,bg:c.grnL,tap:() => showToast("PDF экспортирован ✓")}].map((a,i) => (
          <div key={i} onClick={a.tap} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer"}}>
            <div style={{width:52,height:52,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",background:a.bg}}><Ic n={a.ic} s={22} co={a.co}/></div>
            <span style={{fontSize:11,color:c.t2}}>{a.l}</span>
          </div>))}
      </div>
    </div>
    {/* AI Assistant — contextual per vehicle */}
    <div style={{...G,padding:"16px 18px",marginTop:18}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#AF52DE,#007AFF)",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="spark" s={14} co="#fff"/></div>
        <span style={{fontSize:14,fontWeight:600,color:c.text}}>AI Ассистент</span>
        <Pill co={c.acc} bg={c.accL} text={`${car.aiTips.length} совета`}/>
      </div>
      {car.aiTips.map((tip,i) => (
        <div key={i} onClick={() => go(tip.target)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,background:c.inp,marginBottom:i<car.aiTips.length-1?8:0,cursor:"pointer"}}>
          <div style={{width:6,height:6,borderRadius:3,background:colorMap[tip.color]||c.acc,flexShrink:0}}/><span style={{fontSize:13,color:c.text,flex:1}}>{tip.text}</span><Ic n="chev" s={14} co={c.t2}/>
        </div>))}
    </div>
    {/* Monthly chart */}
    <div style={{...G,padding:"16px 18px",marginTop:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <span style={{fontSize:14,fontWeight:600,color:c.text}}>Расходы за полгода</span>
        <span style={{fontSize:12,color:c.acc,cursor:"pointer"}} onClick={() => go("expenses")}>Подробнее</span>
      </div>
      <Bars data={car.bars} c={c}/>
    </div>
    {/* Last service */}
    <div style={{...G,padding:"16px 18px",marginTop:14,cursor:"pointer"}} onClick={() => go("service")}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:14,fontWeight:600,color:c.text}}>Последнее ТО</span><Ic n="chev" s={16} co={c.t2}/>
      </div>
      <div style={{fontSize:14,color:c.text}}>{car.services[0]?.title}</div>
      <div style={{fontSize:12,color:c.t2,marginTop:4}}>{car.services[0]?.date} · {car.services[0]?.km} км · {car.services[0]?.cost}</div>
    </div>
  </div>;

  /* ═══════════════════════════════════════════
     SCREEN: GARAGE (multi-vehicle)
     ═══════════════════════════════════════════ */
  const Garage = () => <div style={{padding:"0 16px 20px"}}>
    <Hdr title="Гараж" onBack={back} right={<div onClick={() => go("addVehicle")} style={{padding:"6px 14px",borderRadius:10,background:c.accL,color:c.acc,fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Ic n="plus" s={14} co={c.acc}/>Добавить</div>}/>
    <div style={{fontSize:13,color:c.t2,marginBottom:16,paddingLeft:4}}>{VEHICLES.length} транспортных средства</div>
    {VEHICLES.map((cr,i) => <div key={i} onClick={() => {setCarIdx(i);go("home");}} style={{...G,padding:20,marginBottom:12,cursor:"pointer",border:i===carIdx?`2px solid ${c.acc}`:`2px solid transparent`}}>
      <div style={{display:"flex",gap:14,alignItems:"center"}}>
        <div style={{fontSize:40}}>{cr.emoji}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:18,fontWeight:700,color:c.text}}>{cr.name}</div>{i===carIdx&&<Pill co={c.acc} bg={c.accL} text="Активный"/>}</div>
          <div style={{fontSize:13,color:c.t2,marginTop:2}}>{cr.year} · {cr.plate}</div>
          <div style={{fontSize:13,color:c.t2,marginTop:2}}>{cr.km.toLocaleString("ru")} км</div>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:14}}>
        <div style={{flex:1,padding:"8px 0",borderRadius:8,background:c.orgL,textAlign:"center",fontSize:12,color:c.org,fontWeight:500}}>ТО: {(cr.nextTO-cr.km).toLocaleString("ru")} км</div>
        <div style={{flex:1,padding:"8px 0",borderRadius:8,background:cr.insExpDays<=30?c.redL:c.grnL,textAlign:"center",fontSize:12,color:cr.insExpDays<=30?c.red:c.grn,fontWeight:500}}>ОСАГО: {cr.insExpDays} дн</div>
      </div>
    </div>)}
  </div>;

  /* ═══════════════════════════════════════════
     SCREEN: VEHICLE PROFILE
     ═══════════════════════════════════════════ */
  const Profile = () => <div style={{padding:"0 16px 20px"}}>
    <Hdr title="Цифровой паспорт" onBack={back}/>
    <div style={{...G,padding:20,textAlign:"center"}}>
      <div style={{fontSize:64,marginBottom:10}}>{car.emoji}</div>
      <div style={{fontSize:24,fontWeight:700,color:c.text}}>{car.name}</div>
      <div style={{fontSize:14,color:c.t2,marginTop:4}}>{car.year} · {car.type} · {car.engine}</div>
      <div style={{display:"inline-block",marginTop:12,padding:"6px 16px",borderRadius:8,background:c.inp,fontWeight:600,fontSize:16,color:c.text,letterSpacing:2}}>{car.plate}</div>
    </div>
    <div style={{marginTop:14,fontSize:15,fontWeight:600,color:c.text,paddingLeft:4,marginBottom:10}}>Информация</div>
    {[{l:"Пробег",v:`${car.km.toLocaleString("ru")} км`},{l:"VIN",v:car.vin},{l:"Цвет",v:car.color},{l:"Двигатель",v:car.engine},{l:"Привод",v:car.drive}].map((x,i,a) => <Row key={i} first={i===0} last={i===a.length-1}><span style={{fontSize:14,color:c.text}}>{x.l}</span><span style={{fontSize:14,color:c.t2}}>{x.v}</span></Row>)}
    <div style={{marginTop:18,fontSize:15,fontWeight:600,color:c.text,paddingLeft:4,marginBottom:10}}>Документы</div>
    {car.docs.map((d,i,a) => <Row key={i} first={i===0} last={i===a.length-1} onClick={() => {setDocIdx(i);go("docDetail");}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><Ic n={d.icon} s={16} co={c[d.color]}/><span style={{fontSize:14,color:c.text}}>{d.name}</span></div>
      <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,color:c[d.color]}}>{d.status}</span><Ic n="chev" s={14} co={c.t2}/></div>
    </Row>)}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:18}}>
      <div onClick={() => go("qrShare")} style={{...G,padding:"16px",textAlign:"center",cursor:"pointer"}}><Ic n="qr" s={28} co={c.pur}/><div style={{fontSize:13,fontWeight:600,color:c.text,marginTop:8}}>QR-паспорт</div></div>
      <div onClick={() => go("service")} style={{...G,padding:"16px",textAlign:"center",cursor:"pointer"}}><Ic n="clock" s={28} co={c.org}/><div style={{fontSize:13,fontWeight:600,color:c.text,marginTop:8}}>История ТО</div></div>
    </div>
    <div onClick={() => showToast("PDF экспортирован ✓")} style={{...G,padding:"14px 20px",marginTop:14,display:"flex",justifyContent:"center",alignItems:"center",gap:8,cursor:"pointer",color:c.acc,fontSize:15,fontWeight:600}}><Ic n="dl" s={18} co={c.acc}/> Экспорт PDF</div>
  </div>;

  /* ═══════════════════════════════════════════
     SCREEN: DOCUMENT DETAIL
     ═══════════════════════════════════════════ */
  const DocDetail = () => {
    const doc = car.docs[docIdx] || car.docs[0];
    const det = doc.detail || {};
    return <div style={{padding:"0 16px 20px"}}>
      <Hdr title={doc.name} onBack={back}/>
      <div style={{...G,padding:24,textAlign:"center"}}>
        <div style={{width:56,height:56,borderRadius:16,background:`${c[doc.color]}18`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Ic n={doc.icon} s={28} co={c[doc.color]}/></div>
        <div style={{fontSize:20,fontWeight:700,color:c.text}}>{doc.name}</div>
        <div style={{marginTop:8}}><Pill co={c[doc.color]} bg={`${c[doc.color]}18`} text={doc.status}/></div>
      </div>
      <div style={{marginTop:16}}>
        {Object.entries(det).map(([key,val],i,a) => {
          const labels = {number:"Номер",company:"Компания",validFrom:"Действует с",validTo:"Действует до",premium:"Стоимость",series:"Серия",issued:"Выдан",station:"Пункт ТО"};
          return <Row key={i} first={i===0} last={i===a.length-1}>
            <span style={{fontSize:14,color:c.t2}}>{labels[key]||key}</span>
            <span style={{fontSize:14,fontWeight:500,color:c.text}}>{val}</span>
          </Row>;
        })}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:18}}>
        <div onClick={() => showToast("Фото сохранено ✓")} style={{...G,padding:14,textAlign:"center",cursor:"pointer"}}><Ic n="camera" s={22} co={c.acc}/><div style={{fontSize:12,color:c.text,marginTop:6}}>Фото документа</div></div>
        <div onClick={() => showToast("PDF экспортирован ✓")} style={{...G,padding:14,textAlign:"center",cursor:"pointer"}}><Ic n="dl" s={22} co={c.acc}/><div style={{fontSize:12,color:c.text,marginTop:6}}>Скачать PDF</div></div>
      </div>
      {doc.color === "red" && <div style={{marginTop:18}}>
        <Btn label="Продлить страховку" onClick={() => showToast("Запрос отправлен ✓")}/>
      </div>}
    </div>;
  };

  /* ═══════════════════════════════════════════
     SCREEN: QR SHARE
     ═══════════════════════════════════════════ */
  const QRShare = () => <div style={{padding:"0 16px 20px",display:"flex",flexDirection:"column",alignItems:"center"}}>
    <Hdr title="QR-паспорт" onBack={back}/>
    <div style={{...G,padding:32,textAlign:"center",width:"100%",boxSizing:"border-box"}}>
      <div style={{width:180,height:180,margin:"0 auto",background:c.inp,borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}><Ic n="qr" s={96} co={c.t2}/></div>
      <div style={{fontSize:20,fontWeight:700,color:c.text}}>{car.name}</div>
      <div style={{fontSize:14,color:c.t2,marginTop:4}}>{car.year} · {car.plate}</div>
      <div style={{fontSize:13,color:c.t2,marginTop:12,lineHeight:1.5}}>Отсканируйте QR-код, чтобы увидеть полную историю автомобиля</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:18,width:"100%"}}>
      {[{ic:"share",l:"Поделиться"},{ic:"copy",l:"Скопировать"},{ic:"dl",l:"Сохранить"}].map((a,i) => <div key={i} onClick={() => showToast(`${a.l} ✓`)} style={{...G,padding:"14px 8px",textAlign:"center",cursor:"pointer"}}><Ic n={a.ic} s={22} co={c.acc}/><div style={{fontSize:11,color:c.text,marginTop:6,fontWeight:500}}>{a.l}</div></div>)}
    </div>
    <div style={{...G,padding:16,marginTop:18,width:"100%",boxSizing:"border-box"}}>
      <div style={{fontSize:14,fontWeight:600,color:c.text,marginBottom:10}}>Что видит получатель</div>
      {["Марка, модель, год выпуска","Пробег и история обновлений","Полная история обслуживания","Статус всех документов"].map((x,i) => <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:i<3?8:0}}><Ic n="check" s={14} co={c.grn}/><span style={{fontSize:13,color:c.text}}>{x}</span></div>)}
    </div>
  </div>;

  /* ═══════════════════════════════════════════
     SCREEN: EXPENSES
     ═══════════════════════════════════════════ */
  const Expenses = () => <div style={{padding:"0 16px 20px"}}>
    <Title t="Расходы"/>
    <div style={{...G,padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:12,color:c.t2,textTransform:"uppercase",letterSpacing:.8}}>Май 2026</div>
          <div style={{fontSize:28,fontWeight:700,color:c.text,marginTop:4}}>{car.monthlyTotal.toLocaleString("ru")} ₽</div>
          <div style={{fontSize:12,color:c.red,marginTop:4}}>+12% к прошлому месяцу</div>
        </div>
        <Pie data={car.expenses} c={c}/>
      </div>
    </div>
    <div style={{marginTop:18,fontSize:15,fontWeight:600,color:c.text,paddingLeft:4,marginBottom:12}}>По категориям</div>
    {car.expenses.map((e,i,a) => {
      const colors = [c.acc,c.org,c.grn,c.pur,c.red];
      const total = a.reduce((s,d) => s+d.value,0);
      return <Row key={i} first={i===0} last={i===a.length-1}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:34,height:34,borderRadius:10,background:`${colors[i]}18`,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n={e.icon} s={16} co={colors[i]}/></div>
          <span style={{fontSize:15,color:c.text}}>{e.label}</span>
        </div>
        <div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:600,color:c.text}}>{e.value.toLocaleString("ru")} ₽</div><div style={{fontSize:11,color:c.t2}}>{Math.round(e.value/total*100)}%</div></div>
      </Row>;
    })}
    <div style={{...G,padding:20,marginTop:18}}><div style={{fontSize:14,fontWeight:600,color:c.text,marginBottom:14}}>Динамика расходов</div><Bars data={car.bars} c={c}/></div>
    <div style={{marginTop:18,fontSize:15,fontWeight:600,color:c.text,paddingLeft:4,marginBottom:12}}>Последние операции</div>
    {car.transactions.map((t,i,a) => {
      const catColors = {fuel:c.acc,wrench:c.org,shield:c.grn,park:c.pur,alert:c.red};
      return <Row key={i} first={i===0} last={i===a.length-1}>
        <div><div style={{fontSize:14,color:c.text}}>{t.desc}</div><div style={{fontSize:11,color:c.t2,marginTop:2}}>{t.date} · {t.cat}</div></div>
        <span style={{fontSize:14,fontWeight:600,color:catColors[t.catKey]||c.acc}}>−{t.amount}</span>
      </Row>;
    })}
    <div style={{marginTop:18}}><Btn label="+ Добавить расход" onClick={() => {setExpCat(null);go("addExpense");}}/></div>
  </div>;

  /* ═══════════════════════════════════════════
     SCREEN: ADD EXPENSE
     ═══════════════════════════════════════════ */
  const AddExpense = () => {
    const cats = [{l:"Топливо",ic:"fuel",co:c.acc},{l:"Сервис",ic:"wrench",co:c.org},{l:"Страховка",ic:"shield",co:c.grn},{l:"Парковка",ic:"park",co:c.pur},{l:"Штрафы",ic:"alert",co:c.red}];
    const [cat, setCat] = useState(expCat || "Топливо");
    const [saved, setSaved] = useState(false);
    if (saved) return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:12}}>
      <div style={{width:64,height:64,borderRadius:32,background:c.grnL,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="check" s={32} co={c.grn}/></div>
      <div style={{fontSize:20,fontWeight:700,color:c.text}}>Расход сохранён</div>
      <div style={{fontSize:14,color:c.t2}}>Запись добавлена в дневник расходов</div>
      <div onClick={back} style={{padding:"12px 32px",borderRadius:12,background:c.acc,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",marginTop:8}}>Готово</div>
    </div>;
    return <div style={{padding:"0 20px"}}>
      <Hdr title="Новый расход" onBack={back}/>
      <div style={{fontSize:13,color:c.t2,marginBottom:16,paddingLeft:4}}>Категория</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {cats.map((ct,i) => <div key={i} onClick={() => setCat(ct.l)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:12,background:cat===ct.l?`${ct.co}20`:c.inp,border:`1.5px solid ${cat===ct.l?ct.co:"transparent"}`,cursor:"pointer",transition:"all .2s"}}>
          <Ic n={ct.ic} s={16} co={cat===ct.l?ct.co:c.t2}/><span style={{fontSize:13,fontWeight:cat===ct.l?600:400,color:cat===ct.l?ct.co:c.t2}}>{ct.l}</span>
        </div>)}
      </div>
      {[{ph:"Сумма (₽)",val:cat==="Топливо"?"2 840":cat==="Парковка"?"350":""},
        {ph:"Описание",val:cat==="Топливо"?"АЗС Лукойл, АИ-95":""},
        {ph:"Дата",val:"18 мая 2026"}
      ].map((f,i) => <div key={i} style={{marginBottom:10}}><input readOnly placeholder={f.ph} value={f.val} style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1px solid ${c.brd}`,background:c.inp,fontSize:15,color:c.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/></div>)}
      {cat==="Топливо"&&<><div style={{marginBottom:10}}><input readOnly placeholder="Литры" value="42" style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1px solid ${c.brd}`,background:c.inp,fontSize:15,color:c.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/></div>
      <div style={{marginBottom:10}}><input readOnly placeholder="Пробег (км)" value={car.km.toLocaleString("ru")} style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1px solid ${c.brd}`,background:c.inp,fontSize:15,color:c.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/></div></>}
      <div style={{marginTop:8}}><Btn label="Сохранить" onClick={() => setSaved(true)}/></div>
    </div>;
  };

  /* ═══════════════════════════════════════════
     SCREEN: SERVICE HISTORY
     ═══════════════════════════════════════════ */
  const ServiceH = () => <div style={{padding:"0 16px 20px"}}>
    <Hdr title="История обслуживания" onBack={back} right={<div onClick={() => go("addService")} style={{padding:"6px 14px",borderRadius:10,background:c.accL,color:c.acc,fontSize:13,fontWeight:600,cursor:"pointer"}}>+ Запись</div>}/>
    {/* Upcoming */}
    <div style={{...G,padding:16,marginBottom:18,border:`1px solid ${c.org}30`}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <div style={{width:28,height:28,borderRadius:8,background:c.orgL,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="clock" s={14} co={c.org}/></div>
        <span style={{fontSize:14,fontWeight:600,color:c.org}}>Предстоящее ТО</span>
      </div>
      <div style={{fontSize:15,color:c.text,fontWeight:500}}>Плановое ТО</div>
      <div style={{fontSize:13,color:c.t2,marginTop:4}}>~{car.nextTO.toLocaleString("ru")} км · через ~{totalKmToService.toLocaleString("ru")} км</div>
      <div style={{display:"flex",gap:10,marginTop:12}}>
        <div onClick={() => showToast("Запись создана ✓")} style={{flex:1,padding:"10px 0",textAlign:"center",borderRadius:10,background:c.orgL,color:c.org,fontSize:14,fontWeight:600,cursor:"pointer"}}>Записаться</div>
        <div style={{flex:1,padding:"10px 0",textAlign:"center",borderRadius:10,background:c.inp,color:c.text,fontSize:14,fontWeight:500,cursor:"pointer"}}>Подробнее</div>
      </div>
    </div>
    {/* AI tip */}
    <div style={{...G,padding:14,marginBottom:18,display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#AF52DE,#007AFF)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n="spark" s={16} co="#fff"/></div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:c.text}}>Рекомендация AI</div><div style={{fontSize:12,color:c.t2,marginTop:2}}>{car.aiTips[0]?.text}</div></div>
    </div>
    {/* Timeline */}
    {car.services.map((s,i) => <div key={i} style={{display:"flex",gap:14,marginBottom:2}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:20,flexShrink:0}}>
        <div style={{width:12,height:12,borderRadius:6,marginTop:6,background:c.grn,border:`2px solid ${dk?"#000":"#fff"}`,boxShadow:`0 0 0 2px ${c.grn}40`}}/>
        {i<car.services.length-1&&<div style={{width:1.5,flex:1,background:c.brd,marginTop:4,marginBottom:4}}/>}
      </div>
      <div style={{...G,padding:"14px 16px",flex:1,marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div><div style={{fontSize:15,fontWeight:600,color:c.text}}>{s.title}</div><div style={{fontSize:12,color:c.t2,marginTop:4}}>{s.place}</div><div style={{fontSize:12,color:c.t2,marginTop:2}}>{s.date} · {s.km} км</div></div>
          <div style={{fontSize:15,fontWeight:600,color:c.text}}>{s.cost}</div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <Pill co={c.grn} bg={c.grnL} text="✓ Выполнено"/><Pill co={c.t2} bg={c.inp} text="Чек"/>
        </div>
      </div>
    </div>)}
  </div>;

  /* ═══════════════════════════════════════════
     SCREEN: ADD SERVICE
     ═══════════════════════════════════════════ */
  const AddService = () => {
    const [saved, setSaved] = useState(false);
    if (saved) return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:12}}>
      <div style={{width:64,height:64,borderRadius:32,background:c.grnL,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="check" s={32} co={c.grn}/></div>
      <div style={{fontSize:20,fontWeight:700,color:c.text}}>Запись добавлена</div>
      <div style={{fontSize:14,color:c.t2}}>Обслуживание сохранено в историю</div>
      <div onClick={back} style={{padding:"12px 32px",borderRadius:12,background:c.acc,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",marginTop:8}}>Готово</div>
    </div>;
    return <div style={{padding:"0 20px"}}>
      <Hdr title="Новая запись ТО" onBack={back}/>
      {[{ph:"Тип работ",val:"Замена масла и фильтров"},{ph:"Автосервис",val:"Автоцентр «Кристалл»"},{ph:"Дата",val:"18 мая 2026"},{ph:"Пробег (км)",val:car.km.toLocaleString("ru")},{ph:"Стоимость (₽)",val:"5 600"},{ph:"Комментарий",val:"Масло Castrol 5W-30"}].map((f,i) => <div key={i} style={{marginBottom:10}}>
        <input readOnly placeholder={f.ph} value={f.val} style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1px solid ${c.brd}`,background:c.inp,fontSize:15,color:c.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
      </div>)}
      <div style={{...G,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,marginTop:4}}>
        <Ic n="camera" s={20} co={c.acc}/><span style={{fontSize:14,color:c.acc,fontWeight:500}}>Прикрепить чек или фото</span>
      </div>
      <div style={{marginTop:20}}><Btn label="Сохранить" onClick={() => setSaved(true)}/></div>
    </div>;
  };

  /* ═══════════════════════════════════════════
     SCREEN: NOTIFICATIONS
     ═══════════════════════════════════════════ */
  const Notifs = () => {
    const [tab, setTab] = useState(0);
    const filtered = tab===0 ? notifs : tab===1 ? notifs.filter(n => n.unread) : notifs.filter(n => !n.unread);
    return <div style={{padding:"0 16px 20px"}}>
      <Title t="Уведомления"/>
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        {["Все","Срочные","Информация"].map((t,i) => <div key={i} onClick={() => setTab(i)} style={{padding:"7px 16px",borderRadius:20,background:i===tab?c.acc:c.inp,color:i===tab?"#fff":c.t2,fontSize:13,fontWeight:500,cursor:"pointer",transition:"all .2s"}}>{t}{i===1&&unreadCount>0?` (${unreadCount})`:""}</div>)}
      </div>
      {filtered.length===0 && <div style={{textAlign:"center",padding:40}}><div style={{fontSize:48,marginBottom:12}}>🔔</div><div style={{fontSize:15,color:c.t2}}>Нет уведомлений в этой категории</div></div>}
      {filtered.map((n,i,a) => <Row key={i} first={i===0} last={i===a.length-1} onClick={() => {
        if(n.icon==="wrench"||n.icon==="clock") go("service");
        else if(n.icon==="shield") go("profile");
        else go("expenses");
      }} style={{gap:12,alignItems:"flex-start",justifyContent:"flex-start",borderLeft:n.unread?`3px solid ${n.color}`:"3px solid transparent"}}>
        <div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:`${n.color}18`,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n={n.icon} s={18} co={n.color}/></div>
        <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:n.unread?600:400,color:c.text}}>{n.title}</div><div style={{fontSize:12,color:c.t2,marginTop:3}}>{n.desc}</div><div style={{fontSize:11,color:c.t2,marginTop:5}}>{n.time}</div></div>
        {n.unread&&<div style={{width:8,height:8,borderRadius:4,background:n.color,marginTop:6,flexShrink:0}}/>}
      </Row>)}
    </div>;
  };

  /* ═══════════════════════════════════════════
     SCREEN: SETTINGS
     ═══════════════════════════════════════════ */
  const Settings = () => <div style={{padding:"0 16px 20px"}}>
    <Title t="Настройки"/>
    {[
      {t:"Внешний вид",items:[{l:dk?"Тёмная тема":"Светлая тема",ic:dk?"moon":"sun",act:() => setDk(!dk),tog:true,on:dk}]},
      {t:"Данные",items:[{l:"Экспорт данных",ic:"dl",act:() => showToast("Данные экспортированы ✓")},{l:"Резервная копия",ic:"doc",act:() => showToast("Бэкап создан ✓")}]},
      {t:"Подписка",items:[{l:"Car Passport Pro",ic:"crown",act:() => go("subscription"),badge:"Бесплатно"}]},
      {t:"AI Ассистент",items:[{l:"Рекомендации",ic:"spark",tog:true,on:true},{l:"Уведомления AI",ic:"bell",tog:true,on:true}]},
      {t:"Автомобили",items:[{l:"Управление гаражом",ic:"car",act:() => go("garage"),badge:`${VEHICLES.length} авто`}]},
      {t:"Приложение",items:[{l:"Язык",ic:"gear",badge:"Русский"},{l:"О приложении",ic:"car",badge:"v1.0.0"}]},
    ].map((sec,si) => <div key={si} style={{marginBottom:22}}>
      <div style={{fontSize:13,fontWeight:500,color:c.t2,paddingLeft:16,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>{sec.t}</div>
      {sec.items.map((it,ii,arr) => <Row key={ii} first={ii===0&&arr.length>1} last={ii===arr.length-1&&arr.length>1} single={arr.length===1} onClick={it.act}>
        <div style={{display:"flex",alignItems:"center",gap:12}}><Ic n={it.ic} s={18} co={c.acc}/><span style={{fontSize:15,color:c.text}}>{it.l}</span></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {it.badge&&<span style={{fontSize:13,color:c.t2}}>{it.badge}</span>}
          {it.tog ? <div style={{width:44,height:26,borderRadius:13,background:it.on?c.grn:c.inp,position:"relative",transition:"background .3s",cursor:"pointer"}}><div style={{width:22,height:22,borderRadius:11,background:"#fff",position:"absolute",top:2,left:it.on?20:2,transition:"left .3s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/></div> : <Ic n="chev" s={16} co={c.t2}/>}
        </div>
      </Row>)}
    </div>)}
  </div>;

  /* ═══════════════════════════════════════════
     SCREEN: SUBSCRIPTION / PRO PAYWALL
     ═══════════════════════════════════════════ */
  const Subscription = () => <div style={{padding:"0 16px 20px"}}>
    <Hdr title="" onBack={back}/>
    <div style={{textAlign:"center",marginBottom:24}}>
      <div style={{width:64,height:64,borderRadius:20,background:"linear-gradient(135deg,#FFD700,#FF8C00)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Ic n="crown" s={32} co="#fff"/></div>
      <div style={{fontSize:28,fontWeight:700,color:c.text}}>Car Passport Pro</div>
      <div style={{fontSize:15,color:c.t2,marginTop:8,lineHeight:1.5}}>Полный контроль над вашими автомобилями</div>
    </div>
    {[
      {ic:"car",t:"Безлимит авто",d:"Любое количество транспортных средств"},
      {ic:"spark",t:"AI-аналитика",d:"Прогноз расходов и рекомендации по ТО"},
      {ic:"doc",t:"Экспорт отчётов",d:"PDF, Excel — полная история за любой период"},
      {ic:"qr",t:"QR-паспорт PRO",d:"Расширенная версия с фото и чеками"},
      {ic:"bell",t:"Приоритетные напоминания",d:"SMS и push за неделю до дедлайна"},
    ].map((f,i) => <div key={i} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:i<4?`1px solid ${c.brd}`:"none"}}>
      <div style={{width:40,height:40,borderRadius:12,background:c.accL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n={f.ic} s={20} co={c.acc}/></div>
      <div><div style={{fontSize:15,fontWeight:600,color:c.text}}>{f.t}</div><div style={{fontSize:13,color:c.t2,marginTop:2}}>{f.d}</div></div>
    </div>)}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:24}}>
      <div style={{...G,padding:16,textAlign:"center",border:`2px solid transparent`}}>
        <div style={{fontSize:13,color:c.t2}}>Месяц</div>
        <div style={{fontSize:24,fontWeight:700,color:c.text,marginTop:4}}>299 ₽</div>
        <div style={{fontSize:11,color:c.t2,marginTop:2}}>в месяц</div>
      </div>
      <div style={{...G,padding:16,textAlign:"center",border:`2px solid ${c.acc}`,position:"relative"}}>
        <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",padding:"2px 10px",borderRadius:6,background:c.acc,color:"#fff",fontSize:10,fontWeight:600}}>Выгодно</div>
        <div style={{fontSize:13,color:c.t2}}>Год</div>
        <div style={{fontSize:24,fontWeight:700,color:c.text,marginTop:4}}>2 490 ₽</div>
        <div style={{fontSize:11,color:c.t2,marginTop:2}}>208 ₽/мес · −30%</div>
      </div>
    </div>
    <div style={{marginTop:20}}><Btn label="Попробовать бесплатно — 7 дней" onClick={() => {showToast("Пробный период активирован ✓");back();}} gradient="linear-gradient(135deg,#FFD700,#FF8C00)"/></div>
    <div onClick={back} style={{textAlign:"center",marginTop:14,color:c.t2,fontSize:14,cursor:"pointer"}}>Продолжить бесплатно</div>
  </div>;

  /* ═══════════════════════════════════════════
     ADD MODAL (bottom sheet)
     ═══════════════════════════════════════════ */
  const Modal = () => <div style={{position:"absolute",inset:0,zIndex:100,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end"}} onClick={() => setShowAdd(false)}>
    <div onClick={e => e.stopPropagation()} style={{width:"100%",background:c.cardS,borderRadius:"24px 24px 0 0",padding:"16px 20px 36px",animation:"sUp .3s ease"}}>
      <div style={{width:36,height:4,borderRadius:2,background:c.brd,margin:"0 auto 16px"}}/>
      <div style={{fontSize:20,fontWeight:700,color:c.text,marginBottom:6}}>Добавить</div>
      <div style={{fontSize:13,color:c.t2,marginBottom:16}}>{car.name} · {car.plate}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[{ic:"fuel",l:"Заправка",co:c.acc,bg:c.accL,tap:() => {setShowAdd(false);setExpCat("Топливо");go("addExpense")}},
          {ic:"wrench",l:"ТО / Сервис",co:c.org,bg:c.orgL,tap:() => {setShowAdd(false);go("addService")}},
          {ic:"shield",l:"Страховка",co:c.grn,bg:c.grnL,tap:() => {setShowAdd(false);setExpCat("Страховка");go("addExpense")}},
          {ic:"park",l:"Парковка",co:c.pur,bg:c.purL,tap:() => {setShowAdd(false);setExpCat("Парковка");go("addExpense")}},
          {ic:"alert",l:"Штраф",co:c.red,bg:c.redL,tap:() => {setShowAdd(false);setExpCat("Штрафы");go("addExpense")}},
          {ic:"doc",l:"Документ",co:c.acc,bg:c.accL,tap:() => {setShowAdd(false);go("profile")}}
        ].map((a,i) => <div key={i} onClick={a.tap} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:14,background:a.bg,cursor:"pointer"}}>
          <Ic n={a.ic} s={20} co={a.co}/><span style={{fontSize:14,fontWeight:500,color:c.text}}>{a.l}</span>
        </div>)}
      </div>
    </div>
  </div>;

  /* ═══════════════════════════════════════════
     SCREEN ROUTER
     ═══════════════════════════════════════════ */
  const SCREENS = {
    onboarding:<Onboarding/>, addVehicle:<AddVehicle/>,
    home:<Home/>, garage:<Garage/>,
    profile:<Profile/>, docDetail:<DocDetail/>, qrShare:<QRShare/>,
    expenses:<Expenses/>, addExpense:<AddExpense/>,
    service:<ServiceH/>, addService:<AddService/>,
    notifications:<Notifs/>,
    settings:<Settings/>, subscription:<Subscription/>,
  };
  const hideNav = ["onboarding","addVehicle","addExpense","addService","qrShare","subscription","docDetail"].includes(scr);

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */
  return <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",padding:16,background:dk?"#111":"#E5E5EA",fontFamily:"-apple-system,'SF Pro Display','SF Pro Text','Helvetica Neue',sans-serif",transition:"background .4s"}}>
    <div style={{width:393,height:852,position:"relative",background:c.bg,borderRadius:44,overflow:"hidden",boxShadow:"0 20px 80px rgba(0,0,0,.25)",border:`4px solid ${dk?"#222":"#ddd"}`,transition:"background .4s,border-color .4s"}}>
      {/* Status bar */}
      <div style={{position:"sticky",top:0,zIndex:50,background:c.bg,paddingTop:8,transition:"background .4s"}}><StatusBar/></div>

      {/* Content area */}
      <div ref={scrollRef} style={{height:hideNav?"calc(100% - 44px)":"calc(100% - 44px - 80px)",overflowY:"auto",overflowX:"hidden",WebkitOverflowScrolling:"touch"}}>
        <div key={scr} style={{animation:"fIn .3s ease"}}>{SCREENS[scr]||<Home/>}</div>
      </div>

      {/* Bottom navigation */}
      {!hideNav && <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,zIndex:60,background:c.nav,backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",borderTop:`0.5px solid ${c.brd}`,display:"flex",alignItems:"flex-start",justifyContent:"space-around",paddingTop:8,paddingBottom:20,transition:"background .4s"}}>
        {[{id:"home",ic:"home",l:"Главная"},{id:"expenses",ic:"wallet",l:"Расходы"},{id:"add",ic:"plus",l:""},{id:"notifications",ic:"bell",l:"Центр"},{id:"settings",ic:"gear",l:"Ещё"}].map(tab => <div key={tab.id} onClick={() => {
          if (tab.id === "add") { setShowAdd(true); return; }
          setHist([tab.id]); setScr(tab.id);
        }} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",flex:1}}>
          {tab.id === "add"
            ? <div style={{width:48,height:48,borderRadius:16,background:car.gradient,display:"flex",alignItems:"center",justifyContent:"center",marginTop:-20,boxShadow:"0 4px 16px rgba(102,126,234,.4)"}}><Ic n="plus" s={24} co="#fff"/></div>
            : <><div style={{position:"relative"}}>
                <Ic n={tab.ic} s={22} co={rootTab===tab.id?c.acc:c.t2}/>
                {tab.id==="notifications"&&unreadCount>0&&<div style={{position:"absolute",top:-4,right:-8,width:16,height:16,borderRadius:8,background:c.red,color:"#fff",fontSize:10,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>{unreadCount}</div>}
              </div>
              <span style={{fontSize:10,fontWeight:rootTab===tab.id?600:400,color:rootTab===tab.id?c.acc:c.t2}}>{tab.l}</span></>}
        </div>)}
      </div>}

      {/* Add modal */}
      {showAdd && <Modal/>}

      {/* Toast */}
      {toast && <div style={{position:"absolute",top:60,left:"50%",transform:"translateX(-50%)",zIndex:200,padding:"12px 24px",borderRadius:14,background:dk?"rgba(60,60,60,0.95)":"rgba(0,0,0,0.85)",color:"#fff",fontSize:14,fontWeight:500,backdropFilter:"blur(20px)",animation:"fIn .2s ease",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>{toast}</div>}

      {/* Home indicator */}
      <div style={{position:"absolute",bottom:6,left:"50%",transform:"translateX(-50%)",width:134,height:5,borderRadius:3,background:dk?"rgba(255,255,255,.2)":"rgba(0,0,0,.15)",zIndex:70}}/>

      <style>{`
        @keyframes fIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *{-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{display:none}
      `}</style>
    </div>
  </div>;
}
