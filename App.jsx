import { useState, useEffect } from "react";

/* ════════════════════════════════════════════════
   칭찬 일기 — 1차 배포 버전 (가벼운 버전)
   - AI API 호출 없음 (샘플 100개)
   - localStorage 저장 (로컬 영구 저장)
   - 쿠팡파트너스 배너 포함
   - PWA 지원
════════════════════════════════════════════════ */

/* ────── COLORS ────── */
const C = {
  coral:"#FF7B54", orange:"#FF9F43", yellow:"#FFD166",
  pink:"#FF85C2", purple:"#9B59B6", blue:"#54A0FF", mint:"#26DE81",
  cream:"#FFFAF7", dark:"#3D2314", mid:"#A0806A", light:"#FFE0C8",
  bg:"#FFF7F0", coupang:"#FF4D4D",
  grad:(a,b)=>`linear-gradient(135deg,${a},${b})`,
};

/* ────── 칭찬 샘플 (100개+) ────── */
const PRAISES = {
  ko: {
    infant: [
      "오늘도 세상에서 가장 눈부신 웃음을 보여줘서 고마워. 네 미소 하나로 엄마는 세상을 다 가진 것 같아.",
      "아직 말은 못 해도, 네 눈빛이 엄마한테 모든 걸 전해줘. 넌 정말 놀라운 아이야.",
      "오늘도 작은 손으로 엄마를 꽉 잡아줘서 고마워. 그 작은 손이 엄마한테는 우주야.",
      "네 숨소리만 들어도 행복해져. 엄마는 너로 인해 진짜 어른이 되어가고 있어.",
      "낮잠 잘 자준 너, 오늘도 잘 컸어. 잘 먹고 잘 자는 게 얼마나 큰 일인지 알아?",
    ],
    toddler: [
      "오늘 넘어져도 울지 않고 다시 일어난 거 봤어. 그 씩씩함이 엄마는 너무 자랑스러워.",
      "\"엄마\"라고 부를 때마다 엄마 심장이 쿵 내려앉아. 네 목소리가 세상에서 제일 좋아.",
      "오늘 혼자 신발 신어보려 한 거 봤어. 그 노력하는 모습이 엄마한테 큰 감동이야.",
      "낯선 아이한테 장난감 나눠준 거, 엄마 다 봤어. 따뜻한 마음을 가졌구나.",
      "어려운 단어도 따라하려 노력하는 너, 매일매일 자라는 게 보여.",
    ],
    preschool: [
      "오늘 그림에 네 마음을 다 담았지? 엄마는 그 그림이 세상에서 제일 아름다운 작품이야.",
      "모르는 것도 끝까지 해보려 한 오늘, 엄마 눈엔 네가 제일 멋진 사람이었어.",
      "친구가 슬플 때 안아준 너, 그 따뜻한 마음 정말 자랑스러워.",
      "오늘 새로운 단어를 배운 너, 매일 한 뼘씩 자라고 있어.",
      "혼자서 옷 입은 너, 정말 큰 사람이 되고 있구나. 엄마가 도와주고 싶었지만 잘 참았어.",
    ],
    child: [
      "오늘 힘들었던 거 엄마도 알아. 그래도 포기 안 한 네가 엄마는 정말 자랑스러워.",
      "틀려도 다시 해보는 네 모습이 엄마한텐 성공보다 훨씬 값져. 넌 이미 충분해.",
      "친구를 도와준 네 마음, 그게 엄마가 가장 자랑하고 싶은 것이야.",
      "오늘 책 한 권 끝까지 읽은 너, 그 끈기가 평생 너를 이끌 거야.",
      "어려운 문제 풀이 포기 안 한 너, 그 자체가 이미 답이야.",
    ],
    teen: [
      "네가 스스로 결정을 내리는 모습을 볼 때마다 엄마는 정말 대단하다고 생각해.",
      "힘든 하루였어도 포기하지 않은 너, 그게 얼마나 대단한 건지 알아? 엄마는 알아.",
      "네 의견을 분명히 말한 오늘, 엄마는 네가 자라는 게 보여서 뿌듯해.",
      "가끔 답답해도, 네 길을 가는 너를 응원해. 엄마는 항상 네 편이야.",
      "오늘 친구한테 솔직하게 마음 열어본 너, 그 용기가 멋져.",
    ],
  },
  en: {
    infant: ["Thank you for that radiant smile today. Just one smile and I feel like I have the whole world.","Even without words, your eyes say everything to me. You are truly remarkable."],
    toddler: ["I saw you fall and get right back up without crying. That bravery makes me so proud.","Every time you call for me, my heart melts. Your voice is my favorite sound in the world."],
    preschool: ["You put your whole heart into that drawing. To me it's the most beautiful artwork in the world.","The way you kept trying even when you didn't know how — you were amazing today."],
    child: ["I know today was hard. But you didn't give up and that makes me so proud.","Getting it wrong and trying again is worth more to me than any success. You are enough."],
    teen: ["Every time I see you make your own decisions I think — wow, look how far you've come.","Even after a hard day you didn't quit. Do you realize how remarkable that is?"],
  },
  ja: {
    infant: ["今日もこんなにきれいな笑顔を見せてくれてありがとう。あなたの笑顔でママは幸せいっぱいだよ。","まだ話せなくても、あなたの目が全部伝えてくれる。本当にすごい子だね。"],
    toddler: ["転んでも泣かずに立ち上がったの、見てたよ。その強さ、ママ誇りに思ってるよ。","「ママ」って呼んでくれるたびに胸がキュンってなるよ。あなたの声が世界で一番好き。"],
    preschool: ["今日の絵、心を全部込めて描いてたね。ママには世界一きれいな作品だよ。","わからなくても最後まで諦めなかった今日のあなた、本当にかっこよかったよ。"],
    child: ["今日は大変だったよね。でも諦めなかったあなたが、ママはすごく誇らしいよ。","間違えてまた挑戦するあなたの姿、どんな成功よりも価値があるよ。"],
    teen: ["自分で決断しているあなたを見るたびに、本当にすごいなって思うよ。","辛い一日でも諦めなかったね。それがどれだけすごいことか、ママはわかってるよ。"],
  },
};

/* ────── 도장 이모지 ────── */
const STAMPS = ['🌸','⭐','🌟','💛','🌈','🦋','🌺','🍀','🎀','✨','🏅','🎖','🥇','🏆','💎','👑'];

/* ────── 쿠팡 배너 (인라인) ────── */
const COUPANG_IFRAME = "https://ads-partners.coupang.com/widgets.html?id=985253&template=banner&trackingCode=AF1554935&subId=&width=320&height=50";

/* ────────────────────────────────────────────
   메인 앱
──────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState("loading");  // loading | onboarding | main
  const [lang, setLang] = useState("ko");
  const [childName, setChildName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [tab, setTab] = useState("home");
  const [praise, setPraise] = useState("");
  const [stamps, setStamps] = useState({});
  const [todayDone, setTodayDone] = useState(false);
  const [ck, setCk] = useState({ praise: false, hug: false });

  /* 시작 시 로컬 데이터 불러오기 */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("praise_diary") || "{}");
      if (saved.childName && saved.ageGroup) {
        setChildName(saved.childName);
        setAgeGroup(saved.ageGroup);
        setLang(saved.lang || "ko");
        setStamps(saved.stamps || {});
        const today = new Date().toDateString();
        setTodayDone(!!(saved.stamps?.[today]));
        setScreen("main");
        setPraise(getRandomPraise(saved.lang || "ko", saved.ageGroup));
      } else {
        setScreen("onboarding");
      }
    } catch {
      setScreen("onboarding");
    }
  }, []);

  /* 자동 저장 */
  useEffect(() => {
    if (screen === "main") {
      localStorage.setItem("praise_diary", JSON.stringify({
        childName, ageGroup, lang, stamps,
      }));
    }
  }, [childName, ageGroup, lang, stamps, screen]);

  function getRandomPraise(l, ag) {
    const list = (PRAISES[l] || PRAISES.ko)[ag] || PRAISES.ko.preschool;
    return list[Math.floor(Math.random() * list.length)];
  }

  function startApp() {
    if (!childName.trim() || !ageGroup) return;
    setPraise(getRandomPraise(lang, ageGroup));
    setScreen("main");
  }

  function regeneratePraise() {
    setPraise(getRandomPraise(lang, ageGroup));
  }

  function toggleCheck(key) {
    if (todayDone) return;
    setCk(p => ({ ...p, [key]: !p[key] }));
  }

  function doStamp() {
    if (!ck.praise || !ck.hug || todayDone) return;
    const today = new Date().toDateString();
    const stampEmoji = STAMPS[Object.keys(stamps).length % STAMPS.length];
    setStamps(p => ({ ...p, [today]: { stamp: stampEmoji, praise } }));
    setTodayDone(true);
  }

  /* 로딩 화면 */
  if (screen === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 40 }}>🌸</div>
      </div>
    );
  }

  /* 온보딩 */
  if (screen === "onboarding") {
    return <Onboarding {...{ lang, setLang, childName, setChildName, ageGroup, setAgeGroup, startApp }} />;
  }

  /* 메인 화면 */
  const streak = Object.keys(stamps).length;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", maxWidth: 430, margin: "0 auto", paddingBottom: 90, position: "relative" }}>
      <GlobalStyles />

      {tab === "home" && (
        <HomeTab {...{ childName, ageGroup, lang, setLang, streak, praise, regeneratePraise, ck, toggleCheck, todayDone, doStamp, stamps }} />
      )}
      {tab === "more" && <MoreTab childName={childName} />}
      {tab === "me" && <MeTab {...{ childName, ageGroup, lang, setLang, stamps, streak }} />}

      <NavBar tab={tab} setTab={setTab} />
    </div>
  );
}

/* ════════════════════════════════════════════════
   온보딩
════════════════════════════════════════════════ */
function Onboarding({ lang, setLang, childName, setChildName, ageGroup, setAgeGroup, startApp }) {
  const ages = [
    { id:"infant",    label:"0~12개월", emoji:"🍼" },
    { id:"toddler",   label:"1~3세",    emoji:"🐣" },
    { id:"preschool", label:"4~7세",    emoji:"🌱" },
    { id:"child",     label:"8~12세",   emoji:"⭐" },
    { id:"teen",      label:"13세+",    emoji:"🌟" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.grad("#FFF7F0", "#FFF0E6"),
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", maxWidth: 430, margin: "0 auto",
    }}>
      <GlobalStyles />
      {/* 언어 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {[["ko","🇰🇷 한국어"],["en","🇺🇸 English"],["ja","🇯🇵 日本語"]].map(([l,name]) => (
          <button key={l} onClick={() => setLang(l)}
            style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
              border: `2px solid ${lang === l ? C.coral : C.light}`,
              background: lang === l ? "#FFF0E6" : C.cream,
              color: lang === l ? C.coral : C.mid, cursor: "pointer",
            }}>
            {name}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 68, marginBottom: 8 }}>🌸</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: C.dark, textAlign: "center", lineHeight: 1.35, marginBottom: 8 }}>
        우리 아이<br/>성장 칭찬 일기
      </div>
      <div style={{ fontSize: 14, color: C.mid, textAlign: "center", lineHeight: 1.75, marginBottom: 32 }}>
        매일 칭찬하고, 기록하고<br/>함께 성장해요 🌸
      </div>

      <div style={{
        background: C.cream, borderRadius: 28, padding: "28px 22px",
        boxShadow: "0 12px 40px rgba(255,123,84,.12)", border: `1.5px solid ${C.light}`,
        width: "100%",
      }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: "#7A5544", marginBottom: 8, display: "block" }}>
          아이 이름 ✏️
        </label>
        <input value={childName} onChange={e => setChildName(e.target.value)}
          placeholder="예) 하은, 준서..."
          style={{
            width: "100%", padding: "13px 16px", borderRadius: 14, border: `2px solid ${C.light}`,
            background: "#FFFDF9", fontSize: 15, color: C.dark, marginBottom: 20, outline: "none",
            fontFamily: "inherit", boxSizing: "border-box",
          }} />

        <label style={{ fontSize: 13, fontWeight: 700, color: "#7A5544", marginBottom: 8, display: "block" }}>
          연령대 👶
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          {ages.map((a, i) => (
            <button key={a.id} onClick={() => setAgeGroup(a.id)}
              style={{
                padding: "12px 8px", borderRadius: 14, cursor: "pointer", textAlign: "center",
                border: `2px solid ${ageGroup === a.id ? C.coral : C.light}`,
                background: ageGroup === a.id ? "#FFF0E6" : C.cream,
                gridColumn: i === 4 ? "span 2" : "auto",
                fontFamily: "inherit",
              }}>
              <div style={{ fontSize: 22, marginBottom: 2 }}>{a.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.dark }}>{a.label}</div>
            </button>
          ))}
        </div>

        <button onClick={startApp} disabled={!childName.trim() || !ageGroup}
          style={{
            width: "100%", padding: 15, borderRadius: 20, border: "none",
            background: childName.trim() && ageGroup ? C.grad(C.coral, C.orange) : "#EDE0D8",
            color: "#fff", fontSize: 16, fontWeight: 800,
            cursor: childName.trim() && ageGroup ? "pointer" : "not-allowed",
            fontFamily: "inherit",
          }}>
          🌸 시작하기
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   홈 탭
════════════════════════════════════════════════ */
function HomeTab({ childName, lang, setLang, streak, praise, regeneratePraise, ck, toggleCheck, todayDone, doStamp, stamps }) {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      {/* 헤더 */}
      <div style={{
        background: C.grad(C.coral, C.orange), padding: "42px 18px 18px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -25, right: -25, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,.1)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.85)", fontWeight: 700, marginBottom: 3 }}>
              🔥 {streak}일 연속 · {streak}개 도장
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: 1.3 }}>
              {childName}에게<br/>오늘의 칭찬 💛
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[["ko","한"],["en","EN"],["ja","日"]].map(([l,t]) => (
              <button key={l} onClick={() => setLang(l)}
                style={{
                  width: 26, height: 26, borderRadius: "50%",
                  border: `2px solid ${lang === l ? "#fff" : "rgba(255,255,255,.3)"}`,
                  background: lang === l ? "rgba(255,255,255,.3)" : "transparent",
                  color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit",
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 쿠팡 배너 ① — 작은 카드 */}
      <CoupangSmallBanner />

      {/* 칭찬 카드 */}
      <div style={{
        margin: "11px 13px 0", background: C.cream, borderRadius: 16, padding: "14px 15px",
        border: `1px solid ${C.light}`, boxShadow: "0 3px 10px rgba(200,100,50,.06)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 5, right: 11, fontSize: 38, color: "#FFD6B8",
          fontFamily: "Georgia", opacity: 0.4, lineHeight: 1, pointerEvents: "none",
        }}>"</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.coral, marginBottom: 5 }}>
          오늘의 칭찬
        </div>
        <div style={{ fontSize: 14, color: C.dark, lineHeight: 1.85, fontWeight: 500, minHeight: 50, animation: "fadeUp .5s ease" }} key={praise}>
          {praise}
        </div>
      </div>

      {/* 버튼 */}
      <div style={{ display: "flex", gap: 6, margin: "9px 13px 0" }}>
        <button onClick={() => setSaved(!saved)}
          style={{
            flex: 1, padding: "10px 11px", borderRadius: 11, fontSize: 11, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            border: `1.5px solid ${saved ? "#FFD166" : C.light}`,
            background: saved ? "#FFFBE6" : C.cream,
            color: saved ? "#C4940A" : C.mid,
          }}>
          {saved ? "💛 저장됨" : "🤍 저장"}
        </button>
        <button onClick={regeneratePraise}
          style={{
            flex: 1, padding: "10px 11px", borderRadius: 11, fontSize: 11, fontWeight: 700,
            border: "none", background: C.grad(C.coral, C.orange), color: "#fff",
            cursor: "pointer", fontFamily: "inherit",
          }}>
          ✨ 다른 칭찬
        </button>
      </div>

      {/* 음성 듣기 */}
      <button onClick={() => speakText(praise, lang)}
        style={{
          margin: "8px 13px 0", display: "block", width: "calc(100% - 26px)",
          padding: 11, borderRadius: 12, border: "none",
          background: C.grad(C.coral, C.orange), color: "#fff",
          fontSize: 12, fontWeight: 700, cursor: "pointer",
          fontFamily: "inherit",
        }}>
        ▶️ 따뜻한 목소리로 듣기
      </button>

      {/* 체크리스트 */}
      <div style={{
        margin: "11px 13px 0", background: C.cream, borderRadius: 16, padding: "14px 15px",
        border: `1px solid ${C.light}`, boxShadow: "0 3px 10px rgba(200,100,50,.06)",
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.dark, marginBottom: 10 }}>
          📋 오늘의 체크
        </div>
        <CheckRow icon="💛" label="칭찬을 전했어요" checked={ck.praise} onClick={() => toggleCheck("praise")} disabled={todayDone} />
        <CheckRow icon="🤗" label="오늘 안아줬어요" checked={ck.hug} onClick={() => toggleCheck("hug")} disabled={todayDone} />

        {!todayDone ? (
          <button onClick={doStamp} disabled={!ck.praise || !ck.hug}
            style={{
              width: "100%", marginTop: 11, padding: 13, borderRadius: 14, border: "none",
              background: (ck.praise && ck.hug) ? C.grad(C.coral, C.orange) : "#EDE0D8",
              color: (ck.praise && ck.hug) ? "#fff" : C.mid,
              fontSize: 13, fontWeight: 800,
              cursor: (ck.praise && ck.hug) ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              animation: (ck.praise && ck.hug) ? "pulse 1.6s infinite" : "none",
            }}>
            {(ck.praise && ck.hug) ? "🌸 오늘 완료 & 도장받기" : "✅ 칭찬+포옹 완료 후 도장받기"}
          </button>
        ) : (
          <div style={{ textAlign: "center", padding: "12px 0", marginTop: 8 }}>
            <div style={{ fontSize: 48, animation: "stampIn .5s ease", marginBottom: 4 }}>
              {stamps[new Date().toDateString()]?.stamp || "🌸"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.coral }}>
              오늘 완료! 🎉
            </div>
            <div style={{ fontSize: 11, color: C.mid, marginTop: 4 }}>
              내일 다시 만나요 💛
            </div>
          </div>
        )}
      </div>

      {/* 일반 광고 자리 */}
      <div style={{
        margin: "11px 13px 0", background: "#F8F4EF", borderRadius: 12, padding: "8px 11px",
        border: `1px solid ${C.light}`, display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ fontSize: 9, color: C.mid, background: "#EDE0D8", borderRadius: 4, padding: "2px 5px" }}>
          광고
        </div>
        <div style={{
          flex: 1, background: C.grad("#FFE0C8", "#FFD6B8"), borderRadius: 7, height: 38,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.mid,
        }}>
          📢 광고 영역 (애드센스 추후 연동)
        </div>
      </div>

      <div style={{ height: 14 }} />
    </div>
  );
}

/* ════════════════════════════════════════════════
   더보기 탭
════════════════════════════════════════════════ */
function MoreTab({ childName }) {
  const menus = [
    { id:"coach",     emoji:"👩‍⚕️", name:"AI 육아 코치",     desc:"24시간 발달 전문가 상담",  color:C.grad("#667eea","#764ba2"), soon: true },
    { id:"self",      emoji:"💜",   name:"엄마, 아빠도 칭찬받자", desc:"매일 자신을 돌보는 시간",   color:C.grad(C.purple, C.pink),   soon: true },
    { id:"challenge", emoji:"🏆",   name:"칭찬 챌린지",         desc:"매주 새로운 주제로 +300P",  color:C.grad(C.mint, "#26DE81cc"),soon: true },
    { id:"art",       emoji:"🎨",   name:"작품 보관함",         desc:"AI 그림 분석 + 평생 보관",  color:C.grad(C.blue, C.purple),    soon: true },
    { id:"book",      emoji:"📚",   name:"추억 포토북 주문 ⭐",  desc:"1년의 칭찬을 책 한 권으로",  color:C.grad(C.coral, "#FF6B6B"),  soon: true, highlight: true },
    { id:"review",    emoji:"📖",   name:"1년 회고 리포트",     desc:"AI가 정리하는 1년 성장",   color:C.grad(C.yellow, C.orange),  soon: true },
  ];

  return (
    <div>
      <div style={{
        background: C.grad(C.coral, C.orange), padding: "42px 18px 18px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -25, right: -25, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,.1)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.85)", fontWeight: 700, marginBottom: 3 }}>
            MORE 📚
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>
            더 많은 기능
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.85)", marginTop: 3 }}>
            추가 기능 곧 출시 예정! 🌸
          </div>
        </div>
      </div>

      <div style={{ padding: "11px 0 0" }}>
        {menus.map(m => (
          <button key={m.id} disabled={m.soon}
            style={{
              margin: "0 13px 8px", padding: "12px 13px", borderRadius: 13,
              border: `${m.highlight ? 1.5 : 1}px solid ${m.highlight ? C.coral : C.light}`,
              background: m.highlight ? "#FFF7F0" : C.cream,
              cursor: m.soon ? "default" : "pointer",
              display: "flex", alignItems: "center", gap: 11,
              width: "calc(100% - 26px)", textAlign: "left", opacity: m.soon ? 0.7 : 1,
              fontFamily: "inherit",
            }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11, background: m.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 21, color: "#fff", flexShrink: 0,
            }}>
              {m.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>
                {m.name} {m.soon && <span style={{ fontSize: 9, color: C.mid, fontWeight: 500 }}>(준비중)</span>}
              </div>
              <div style={{ fontSize: 10, color: m.highlight ? C.coral : C.mid, marginTop: 2, fontWeight: m.highlight ? 700 : 400 }}>
                {m.desc}
              </div>
            </div>
            <div style={{ color: m.highlight ? C.coral : C.mid }}>›</div>
          </button>
        ))}
      </div>

      {/* 섹션 구분선 */}
      <div style={{ margin: "18px 13px 11px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, height: 0.5, background: C.light }} />
        <span style={{ fontSize: 10, color: C.mid, fontWeight: 700, letterSpacing: 1 }}>
          RECOMMEND
        </span>
        <div style={{ flex: 1, height: 0.5, background: C.light }} />
      </div>

      {/* 쿠팡 배너 ② — 큰 카드 */}
      <CoupangBigBanner childName={childName} />

      <div style={{ height: 20 }} />
    </div>
  );
}

/* ════════════════════════════════════════════════
   내 정보 탭
════════════════════════════════════════════════ */
function MeTab({ childName, ageGroup, lang, setLang, stamps, streak }) {
  const ageEmoji = { infant:"🍼", toddler:"🐣", preschool:"🌱", child:"⭐", teen:"🌟" }[ageGroup] || "🌸";
  const today = new Date();

  function clearAllData() {
    if (confirm("모든 데이터를 삭제할까요? (도장, 이름 모두 사라져요)")) {
      localStorage.removeItem("praise_diary");
      window.location.reload();
    }
  }

  return (
    <div>
      <div style={{
        background: C.grad(C.coral, C.orange), padding: "42px 18px 22px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -25, right: -25, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,.1)" }} />
        <div style={{
          width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, margin: "0 auto 10px", position: "relative", zIndex: 1,
        }}>{ageEmoji}</div>
        <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", position: "relative", zIndex: 1 }}>
          {childName}의 부모
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.85)", marginTop: 2, position: "relative", zIndex: 1 }}>
          칭찬 일기 🌸
        </div>
      </div>

      {/* 통계 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "13px 13px 0" }}>
        <StatBox emoji="📅" val={streak} label="총 칭찬일" />
        <StatBox emoji="🌸" val={streak} label="총 도장" />
        <StatBox emoji="🔥" val={streak} label="최고 연속" />
      </div>

      {/* 달력 */}
      <div style={{
        margin: "11px 13px 0", background: C.cream, borderRadius: 16, padding: "14px 15px",
        border: `1px solid ${C.light}`,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.dark, marginBottom: 10 }}>
          📅 칭찬 달력 (최근 28일)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {Array.from({ length: 28 }).map((_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - 27 + i);
            const k = d.toDateString();
            const stamp = stamps[k];
            const isToday = k === today.toDateString();
            return (
              <div key={i} style={{
                aspectRatio: "1", borderRadius: 8,
                background: stamp ? C.grad("#FFE8D6", "#FFD0BA") : isToday ? "#FFF0E6" : "#EDE0D8",
                border: isToday ? `1.5px solid ${C.coral}` : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: stamp ? 16 : 9, color: stamp ? C.dark : C.mid, fontWeight: 700,
              }}>
                {stamp ? stamp.stamp : d.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {/* 언어 */}
      <div style={{
        margin: "11px 13px 0", background: C.cream, borderRadius: 16, padding: "14px 15px",
        border: `1px solid ${C.light}`,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.dark, marginBottom: 10 }}>
          🌍 언어
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[["ko","🇰🇷 한국어"],["en","🇺🇸 English"],["ja","🇯🇵 日本語"]].map(([l,name]) => (
            <button key={l} onClick={() => setLang(l)}
              style={{
                flex: 1, padding: "9px 5px", borderRadius: 12, fontSize: 11, fontWeight: 700,
                border: `2px solid ${lang === l ? C.coral : C.light}`,
                background: lang === l ? "#FFF0E6" : C.cream,
                color: lang === l ? C.coral : C.mid, cursor: "pointer",
                fontFamily: "inherit",
              }}>
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* 데이터 초기화 */}
      <div style={{ margin: "16px 13px 0", textAlign: "center" }}>
        <button onClick={clearAllData}
          style={{
            padding: "8px 16px", borderRadius: 10, border: `1px solid ${C.light}`,
            background: "transparent", color: C.mid, fontSize: 11, cursor: "pointer",
            fontFamily: "inherit",
          }}>
          🗑 모든 데이터 초기화
        </button>
        <div style={{ fontSize: 9, color: C.mid, marginTop: 6 }}>
          v1.0.0 · made with 💛
        </div>
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}

/* ════════════════════════════════════════════════
   쿠팡 배너 — 작은 (홈)
════════════════════════════════════════════════ */
function CoupangSmallBanner() {
  return (
    <div style={{
      margin: "11px 13px 0", background: C.cream, borderRadius: 14, padding: "12px 12px",
      border: `1px solid ${C.light}`, boxShadow: "0 3px 10px rgba(200,100,50,.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
        <span style={{ fontSize: 15 }}>🛍</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.dark, flex: 1 }}>
          오늘의 추천
        </span>
        <span style={{
          fontSize: 8, background: "#FFEEEE", color: C.coupang,
          padding: "2px 6px", borderRadius: 5, fontWeight: 700, letterSpacing: 0.3,
        }}>
          쿠팡파트너스
        </span>
      </div>
      <div style={{
        display: "flex", justifyContent: "center",
        background: "#FFF7F0", borderRadius: 9, padding: "8px 0",
        border: `1px solid ${C.light}`, overflow: "hidden",
      }}>
        <iframe
          src={COUPANG_IFRAME}
          width="320" height="50"
          frameBorder="0" scrolling="no" referrerPolicy="unsafe-url"
          title="쿠팡파트너스 추천"
        />
      </div>
      <div style={{
        fontSize: 8, color: C.mid, marginTop: 6, lineHeight: 1.5, textAlign: "center",
      }}>
        ⓘ 쿠팡파트너스 활동의 일환으로 일정액의 수수료를 제공받습니다.
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   쿠팡 배너 — 큰 (더보기)
════════════════════════════════════════════════ */
function CoupangBigBanner({ childName }) {
  return (
    <div style={{
      margin: "0 13px", background: C.grad(C.cream, "#FFF0E6"),
      borderRadius: 14, padding: "14px 14px", border: `1px solid #FFD6B8`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>🛍</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>
            육아 필수템 추천
          </div>
          <div style={{ fontSize: 10, color: C.mid, marginTop: 1 }}>
            {childName}를 위한 베스트 아이템
          </div>
        </div>
        <span style={{
          fontSize: 9, background: "#FFEEEE", color: C.coupang,
          padding: "2px 7px", borderRadius: 6, fontWeight: 700, letterSpacing: 0.3, flexShrink: 0,
        }}>
          쿠팡파트너스
        </span>
      </div>
      <div style={{
        display: "flex", justifyContent: "center",
        background: "#fff", borderRadius: 9, padding: "8px 0",
        border: `1px solid ${C.light}`,
      }}>
        <iframe
          src={COUPANG_IFRAME}
          width="320" height="50"
          frameBorder="0" scrolling="no" referrerPolicy="unsafe-url"
          title="쿠팡파트너스 육아 필수템"
        />
      </div>
      <div style={{
        fontSize: 9, color: C.mid, marginTop: 7, lineHeight: 1.5, textAlign: "center",
        padding: "6px 8px", background: "rgba(255,255,255,.6)", borderRadius: 7,
      }}>
        ⓘ 이 영역은 쿠팡파트너스 활동의 일환으로,<br/>일정액의 수수료를 제공받습니다.
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   공통 컴포넌트들
════════════════════════════════════════════════ */
function CheckRow({ icon, label, checked, onClick, disabled }) {
  return (
    <div onClick={!disabled ? onClick : undefined}
      style={{
        display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 11,
        marginBottom: 6, cursor: disabled ? "default" : "pointer",
        background: checked ? "#FFF0E6" : "#FAF5F0",
        border: `1px solid ${checked ? C.light : "transparent"}`,
        transition: "all .2s",
      }}>
      <div style={{
        width: 22, height: 22, borderRadius: 7, flexShrink: 0,
        border: `2px solid ${checked ? C.coral : C.mid}`,
        background: checked ? C.coral : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {checked && <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>✓</span>}
      </div>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 600, flex: 1, color: checked ? C.dark : C.mid }}>
        {label}
      </span>
    </div>
  );
}

function StatBox({ emoji, val, label }) {
  return (
    <div style={{
      background: C.cream, borderRadius: 14, padding: "13px 8px",
      textAlign: "center", border: `1px solid ${C.light}`,
    }}>
      <div style={{ fontSize: 20, marginBottom: 2 }}>{emoji}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: C.coral }}>{val}</div>
      <div style={{ fontSize: 9, color: C.mid, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function NavBar({ tab, setTab }) {
  const tabs = [
    { id: "home", icon: "🏠", label: "홈" },
    { id: "more", icon: "📚", label: "더보기" },
    { id: "me",   icon: "👤", label: "내 정보" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430, background: "rgba(255,252,248,.97)",
      backdropFilter: "blur(10px)", borderTop: `1px solid ${C.light}`,
      display: "flex", padding: "8px 0 18px", zIndex: 80,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            background: "none", border: "none", cursor: "pointer", padding: "3px 0",
            color: tab === t.id ? C.coral : C.mid,
            fontSize: 9, fontWeight: tab === t.id ? 800 : 500,
            fontFamily: "inherit",
          }}>
          <span style={{ fontSize: 18 }}>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ────── 음성 듣기 ────── */
function speakText(text, lang) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === "en" ? "en-US" : lang === "ja" ? "ja-JP" : "ko-KR";
  u.rate = 0.95;
  u.pitch = 1.05;
  window.speechSynthesis.speak(u);
}

/* ────── 글로벌 스타일 (애니메이션) ────── */
function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      html, body, #root {
        margin: 0; padding: 0;
        font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        background: ${C.bg};
        -webkit-font-smoothing: antialiased;
      }
      * { -webkit-tap-highlight-color: transparent; }
      input:focus, button:focus { outline: none; }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 rgba(255,123,84,0); transform: scale(1); }
        50%      { box-shadow: 0 0 18px rgba(255,123,84,.4); transform: scale(1.02); }
      }
      @keyframes stampIn {
        0%  { transform: scale(2.5) rotate(-15deg); opacity: 0; }
        55% { transform: scale(.9) rotate(3deg); opacity: 1; }
        100%{ transform: scale(1) rotate(0); opacity: 1; }
      }
    `}</style>
  );
}
