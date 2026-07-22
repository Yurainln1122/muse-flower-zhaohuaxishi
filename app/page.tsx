"use client";

import { useEffect, useMemo, useState } from "react";

type Stamp = "warm" | "thorn" | "doubt";

type Fragment = {
  id: string;
  scene: number;
  mark: string;
  title: string;
  object: string;
  surface: string;
  back: string;
  inquiry: string;
  answer: Stamp;
  nudge: string;
};

const stampMeta: Record<Stamp, { label: string; short: string; seal: string }> = {
  warm: { label: "留温", short: "温", seal: "○" },
  thorn: { label: "留刺", short: "刺", seal: "△" },
  doubt: { label: "存疑", short: "疑", seal: "◇" },
};

const scenes = [
  {
    name: "园门内外",
    kicker: "草木会说话，训诫也会。",
    sign: "草",
    atmosphere: "潮润的墨绿从砖缝里醒来。",
  },
  {
    name: "纸戏长街",
    kicker: "众人喝彩时，更要听见纸背的响动。",
    sign: "戏",
    atmosphere: "纸人沿街站立，笑脸被晚风吹得发皱。",
  },
  {
    name: "药气讲堂",
    kicker: "知识能救人，也可能只换一身制服。",
    sign: "药",
    atmosphere: "药香与粉笔灰混在一盏青灯下。",
  },
  {
    name: "故人水岸",
    kicker: "记一个人，不等于替他下结论。",
    sign: "故",
    atmosphere: "水面压着一封未寄出的信。",
  },
];

const fragments: Fragment[] = [
  {
    id: "mouse",
    scene: 0,
    mark: "鼠",
    title: "隐鼠的旧闻",
    object: "一只空竹笼",
    surface: "儿时有人断言：隐鼠是被猫吃掉的。这个说法在记忆里待得太久，边缘已经发硬。",
    back: "当年的悲愤是真的；但悲愤抓住的那个‘凶手’，未必是真的。",
    inquiry: "翻查另一张旧纸，你发现隐鼠其实被长妈妈一脚踏死。记忆保存了情感，却改写了因果。",
    answer: "doubt",
    nudge: "情感可信，不代表案情已经结清。",
  },
  {
    id: "shanhai",
    scene: 0,
    mark: "图",
    title: "粗纸山海",
    object: "四册《山海经》",
    surface: "一个不识字、规矩很多的人，偏偏买回了孩子求而不得的异兽图册。",
    back: "粗拙的纸和木刻并不漂亮，那份费心却比体面的训话更重。",
    inquiry: "你摸到封角的毛边：礼物珍贵，不因赠予者完美，而因她听见了孩子没被别人听见的愿望。",
    answer: "warm",
    nudge: "保留复杂之后，仍可承认一份具体的善意。",
  },
  {
    id: "trap",
    scene: 0,
    mark: "雪",
    title: "雪地竹筛",
    object: "秕谷与长绳",
    surface: "支起竹筛，撒下秕谷，远远牵绳。捕鸟靠的不是追逐，而是等待。",
    back: "百草园并非无忧仙境；正因为自由短暂，动作与气味才显得异常清楚。",
    inquiry: "你没有立即拉绳。雪声慢下来，童年的乐趣显出它的边界：它会结束，所以值得记住。",
    answer: "warm",
    nudge: "温柔并不要求把旧日涂成无瑕。",
  },
  {
    id: "filial",
    scene: 1,
    mark: "孝",
    title: "孝图的刀口",
    object: "一页夸张的孝子图",
    surface: "画面用奇迹、牺牲和恐惧教孩子顺从，台下却报以整齐掌声。",
    back: "讽刺不是把传统一概推倒，而是让残酷的训诫失去漂亮外壳。",
    inquiry: "纸页旁另有一条校注：旧传说中的恶名常在转述中走样。批判也需要证据，不能复制自己反对的武断。",
    answer: "thorn",
    nudge: "对伤人的道德表演，温吞的纪念会替它遮羞。",
  },
  {
    id: "jianlue",
    scene: 1,
    mark: "背",
    title: "临行前的背书",
    object: "一册《鉴略》",
    surface: "迎神赛会就在门外，孩子却被要求背完艰涩文字才能出门。",
    back: "大人或许自认是在教育；对孩子而言，快乐被权威突然冻结，而且无人解释。",
    inquiry: "街上的锣鼓越响，书页越沉。伤害未必来自恶意，也可能来自不肯理解另一种尺度。",
    answer: "thorn",
    nudge: "看见动机，不等于抹去造成的压迫。",
  },
  {
    id: "wuchang",
    scene: 1,
    mark: "常",
    title: "无常的活气",
    object: "一顶纸糊高帽",
    surface: "阴间的无常反而有人情味；活人世界里自命正经的人，却常常冷硬。",
    back: "民间想象借鬼神说人事，让被压低的愿望暂时有了脸和声音。",
    inquiry: "高帽内侧留着汗渍。真正使形象活起来的，不是神谱，而是普通人对公平与体恤的需要。",
    answer: "warm",
    nudge: "这份温度属于人的愿望，不等于相信所有迷信。",
  },
  {
    id: "medicine",
    scene: 2,
    mark: "药",
    title: "奇方与药引",
    object: "成对的蟋蟀与陈年芦根",
    surface: "药方越离奇，诊断越威严；家属奔波付钱，病人却一天天衰弱。",
    back: "玄妙术语制造了权力差：病家不敢追问，失败也总能被下一味药引推迟。",
    inquiry: "你把药渣摊平，发现其中最稳定的不是疗效，而是收费、推诿和不可质疑。",
    answer: "thorn",
    nudge: "这里需要留下警醒，而不是替权威保存体面。",
  },
  {
    id: "deathcall",
    scene: 2,
    mark: "呼",
    title: "临终的呼喊",
    object: "床沿一串指印",
    surface: "众人依礼不断呼唤将死之人，把‘尽孝’做得响亮而齐全。",
    back: "后来回看，那呼喊也可能延长了父亲最后的痛苦；悔意无法被仪式抵消。",
    inquiry: "房间忽然静下来。你听见的不是责备，而是一种迟到的自问：体面是否夺走了安宁？",
    answer: "thorn",
    nudge: "刺不是用来惩罚少年，而是刺破不容质疑的礼法。",
  },
  {
    id: "notes",
    scene: 2,
    mark: "藤",
    title: "红笔讲义",
    object: "被添改过的笔记",
    surface: "异乡课堂里，一位老师认真改正每一幅血管图，关心这个弱国学生是否跟得上。",
    back: "后来改变道路，并不使那份教诲失效。被平等对待的经验，成为另一种前行动力。",
    inquiry: "红墨水不是奖状，而是具体、耐心、逐页发生的帮助。告别医学之后，它仍留在行动里。",
    answer: "warm",
    nudge: "感念一个人，不等于必须复制他替你设想的道路。",
  },
  {
    id: "anonymous",
    scene: 3,
    mark: "匿",
    title: "匿名的箭",
    object: "一封没有署名的信",
    surface: "信里断言中国学生作弊，并要求他退出队伍；证据空缺，偏见却写得笃定。",
    back: "个人羞辱与时代处境叠在一起，逼人重新选择自己要做的事。",
    inquiry: "纸上没有签名，只有群体成见借来的胆量。它不配被淡化成一次普通误会。",
    answer: "thorn",
    nudge: "准确记住伤害，才能看清后来选择的重量。",
  },
  {
    id: "flag",
    scene: 3,
    mark: "旗",
    title: "白旗后的冷眼",
    object: "一张时事幻灯片",
    surface: "围观者在影像里看同胞受刑，神情麻木；课堂里的喝彩比画面更刺耳。",
    back: "这一刻并非完整解释，却成为转向文艺的触发点：要改变的还有观看与感受的方式。",
    inquiry: "你把幻灯片倒扣，欢呼仍没有停。身体强健并不能自动医治冷漠。",
    answer: "thorn",
    nudge: "不要把震动磨成一段励志口号。",
  },
  {
    id: "fanaiai",
    scene: 3,
    mark: "范",
    title: "水边的范爱农",
    object: "一顶旧毡帽",
    surface: "故人清醒、倔强，也困顿失意；最后落水而死，旁人给出各自方便的解释。",
    back: "是失足，还是自尽？叙述者无法替死者作证。能确认的，是一个时代怎样慢慢挤窄人的去路。",
    inquiry: "帽檐沾着水，却没有遗书。你只能保存关系、处境和疑问，不能把空白冒充答案。",
    answer: "doubt",
    nudge: "尊重一个人，有时正是拒绝替他补写结局。",
  },
];

function tone(counts: Record<Stamp, number>) {
  const highest = Math.max(counts.warm, counts.thorn, counts.doubt);
  if (highest === 0) return "neutral";
  const leaders = (Object.keys(counts) as Stamp[]).filter((key) => counts[key] === highest);
  return leaders.length > 1 ? "balanced" : leaders[0];
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [maxScene, setMaxScene] = useState(0);
  const [selectedId, setSelectedId] = useState("mouse");
  const [flipped, setFlipped] = useState<string[]>([]);
  const [investigated, setInvestigated] = useState<string[]>([]);
  const [stamps, setStamps] = useState<Record<string, Stamp>>({});
  const [charged, setCharged] = useState<string[]>([]);
  const [twilight, setTwilight] = useState(6);
  const [message, setMessage] = useState("先翻开一张残片，再决定它该留下什么。 ");
  const [showHelp, setShowHelp] = useState(false);
  const [showEnding, setShowEnding] = useState(false);
  const [muted, setMuted] = useState(false);

  const sceneFragments = fragments.filter((item) => item.scene === sceneIndex);
  const selected = fragments.find((item) => item.id === selectedId) ?? sceneFragments[0];
  const counts = useMemo(
    () =>
      Object.values(stamps).reduce(
        (acc, stamp) => ({ ...acc, [stamp]: acc[stamp] + 1 }),
        { warm: 0, thorn: 0, doubt: 0 } as Record<Stamp, number>,
      ),
    [stamps],
  );
  const allStamped = fragments.every((item) => stamps[item.id]);
  const allCorrect = fragments.every((item) => stamps[item.id] === item.answer);
  const sceneStamped = sceneFragments.every((item) => stamps[item.id]);
  const mouseBackflow = stamps.shanhai === "warm";
  const currentTone = tone(counts);

  useEffect(() => {
    document.documentElement.dataset.gameState = showEnding
      ? allCorrect
        ? "complete-clear"
        : "complete-biased"
      : started
        ? `scene-${sceneIndex + 1}`
        : "intro";
  }, [allCorrect, sceneIndex, showEnding, started]);

  function sound(kind: "paper" | "seal" | "open") {
    if (muted || typeof window === "undefined") return;
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    const context = new AudioCtor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = kind === "seal" ? "triangle" : "sine";
    oscillator.frequency.value = kind === "paper" ? 180 : kind === "seal" ? 115 : 260;
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.14);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.14);
    oscillator.addEventListener("ended", () => void context.close());
  }

  function chooseFragment(id: string) {
    setSelectedId(id);
    setMessage(stamps[id] ? "印记可以更改；已经付出的暮色不会退回。" : "先看纸面，再翻到纸背。 ");
    sound("paper");
  }

  function flipSelected() {
    if (!flipped.includes(selected.id)) setFlipped((items) => [...items, selected.id]);
    setMessage("纸背补上了另一层意思。现在可以校勘，或直接落印。 ");
    sound("paper");
  }

  function investigateSelected() {
    if (investigated.includes(selected.id) || twilight === 0) return;
    setInvestigated((items) => [...items, selected.id]);
    setTwilight((value) => Math.max(0, value - 1));
    setMessage("你花去一瓣暮色，细节浮上纸面。 ");
    sound("open");
  }

  function applyStamp(stamp: Stamp) {
    if (!flipped.includes(selected.id)) return;
    const correct = selected.answer === stamp;
    setStamps((items) => {
      const next = { ...items, [selected.id]: stamp };
      if (selected.id === "shanhai" && correct && items.mouse) delete next.mouse;
      return next;
    });
    if (!correct && !charged.includes(selected.id)) {
      setCharged((items) => [...items, selected.id]);
      setTwilight((value) => Math.max(0, value - 1));
    }
    if (correct) {
      setMessage(
        selected.id === "shanhai"
          ? "印记落稳了。远处那只空竹笼忽然响了一声——旧证词正在回流。"
          : "印泥吃进纸纹，残片与周围的景物彼此应和。",
      );
    } else {
      setMessage(`此签压不住抵牾：${selected.nudge}`);
    }
    if (selected.id === "shanhai" && correct && stamps.mouse) setSelectedId("mouse");
    sound("seal");
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!started || showEnding || showHelp || !flipped.includes(selected.id)) return;
      const keyMap: Record<string, Stamp> = { "1": "warm", "2": "thorn", "3": "doubt" };
      if (keyMap[event.key]) applyStamp(keyMap[event.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function goToScene(index: number) {
    if (index > maxScene) return;
    setSceneIndex(index);
    setSelectedId(fragments.find((item) => item.scene === index)?.id ?? "mouse");
    setMessage("新的纸景已经展开。 ");
    sound("open");
  }

  function advanceScene() {
    const next = Math.min(3, sceneIndex + 1);
    setMaxScene((value) => Math.max(value, next));
    setSceneIndex(next);
    setSelectedId(fragments.find((item) => item.scene === next)?.id ?? "mouse");
    setMessage("新的纸景已经展开。 ");
    sound("open");
  }

  function restart() {
    setStarted(true);
    setSceneIndex(0);
    setMaxScene(0);
    setSelectedId("mouse");
    setFlipped([]);
    setInvestigated([]);
    setStamps({});
    setCharged([]);
    setTwilight(6);
    setMessage("先翻开一张残片，再决定它该留下什么。 ");
    setShowEnding(false);
  }

  if (!started) {
    return (
      <main className="intro-shell" data-testid="intro-screen">
        <div className="intro-grain" aria-hidden="true" />
        <section className="intro-card">
          <p className="eyebrow">一册不按原路重演的《朝花夕拾》互动改编</p>
          <div className="title-lockup" aria-label="暮色拾花">
            <span className="title-small">暮色</span>
            <h1>拾花</h1>
          </div>
          <p className="intro-lede">
            你不是鲁迅，也不是书中任何旧人。你是一名初次上任的<strong>拾花校勘员</strong>，要在天黑前整理一册会自行改写的旧事。
          </p>
          <div className="intro-rule">
            <span>翻证</span><i>→</i><span>细察</span><i>→</i><span>落印</span><i>→</i><span>修订</span>
          </div>
          <button className="primary-button" data-testid="start-game" onClick={() => { setStarted(true); sound("open"); }}>
            推开园门
          </button>
          <p className="time-note">完整一局约 15 分钟 · 可用鼠标、触屏或键盘</p>
        </section>
        <div className="intro-seal" aria-hidden="true">校</div>
      </main>
    );
  }

  const endingTitle = allCorrect ? "清醒成册" : "偏色之册";
  const endingText = allCorrect
    ? "你没有把旧日泡成甜梦，也没有把所有人钉在罪名上。温情、锋芒与空白各归其位，这册旧事终于能在矛盾中保持清醒。"
    : currentTone === "warm"
      ? "纸园过于明亮，伤人的权威和麻木被乡愁盖住了。旧日很温暖，却不再诚实。"
      : currentTone === "thorn"
        ? "满纸都是锋口，具体的人情与迟疑无处安放。批判变得响亮，也变得单薄。"
        : currentTone === "doubt"
          ? "你把太多事实悬在半空。谨慎本来是美德，此刻却让可以确认的温情与伤害一起失焦。"
          : "三种印记看似均衡，仍有几处证据与判断互相抵牾。册页拒绝被草率装订。";

  return (
    <main className={`game-shell tone-${currentTone}`} data-testid="game-screen">
      <header className="game-header">
        <button className="brand" onClick={() => goToScene(0)} aria-label="回到第一景">
          <span>暮色</span><b>拾花</b>
        </button>
        <nav className="scene-nav" aria-label="纸景进度">
          {scenes.map((scene, index) => (
            <button
              key={scene.name}
              className={index === sceneIndex ? "active" : ""}
              disabled={index > maxScene}
              onClick={() => goToScene(index)}
              aria-current={index === sceneIndex ? "step" : undefined}
              data-testid={`scene-tab-${index + 1}`}
            >
              <span>{index + 1}</span>{scene.name}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button onClick={() => setMuted((value) => !value)} aria-label={muted ? "开启声音" : "关闭声音"}>{muted ? "静" : "声"}</button>
          <button onClick={() => setShowHelp(true)}>玩法</button>
        </div>
      </header>

      <section className="world-panel" aria-labelledby="scene-title">
        <div className="world-sun" aria-hidden="true" />
        <div className="world-cut world-cut-a" aria-hidden="true">{scenes[sceneIndex].sign}</div>
        <div className="world-cut world-cut-b" aria-hidden="true">{scenes[sceneIndex].sign}</div>
        <div className="scene-heading">
          <p>第 {sceneIndex + 1} 景 · {scenes[sceneIndex].atmosphere}</p>
          <h2 id="scene-title">{scenes[sceneIndex].name}</h2>
          <blockquote>{scenes[sceneIndex].kicker}</blockquote>
        </div>
        <div className="fragment-row" aria-label="本景记忆残片">
          {sceneFragments.map((fragment) => {
            const stamped = stamps[fragment.id];
            const isCorrect = stamped === fragment.answer;
            return (
              <button
                key={fragment.id}
                onClick={() => chooseFragment(fragment.id)}
                className={`fragment-card ${selected.id === fragment.id ? "selected" : ""} ${stamped ? `stamped stamp-${stamped}` : ""} ${stamped && !isCorrect ? "resisting" : ""}`}
                aria-pressed={selected.id === fragment.id}
                data-testid={`fragment-${fragment.id}`}
              >
                <span className="fragment-mark">{fragment.mark}</span>
                <span className="fragment-object">{fragment.object}</span>
                <strong>{fragment.title}</strong>
                <small>{flipped.includes(fragment.id) ? "纸背已显" : "尚未翻证"}</small>
                {stamped && <span className="corner-stamp" aria-label={`已盖${stampMeta[stamped].label}`}>{stampMeta[stamped].short}</span>}
              </button>
            );
          })}
        </div>
        <div className="ink-landscape" aria-hidden="true"><i /><i /><i /><i /></div>
      </section>

      <section className="desk" aria-label="校勘桌">
        <aside className="desk-status">
          <p className="desk-label">暮色余量</p>
          <div className="petals" aria-label={`剩余 ${twilight} 瓣暮色`} data-testid="twilight-count">
            {Array.from({ length: 6 }, (_, index) => <i key={index} className={index < twilight ? "full" : "spent"} />)}
          </div>
          <p className="status-copy">细察与首次误判会消耗暮色；耗尽仍可继续，只是少了线索。</p>
          <div className="ledger">
            {(Object.keys(stampMeta) as Stamp[]).map((stamp) => (
              <span key={stamp} className={`ledger-${stamp}`}><b>{stampMeta[stamp].seal}</b>{stampMeta[stamp].label}<em>{counts[stamp]}</em></span>
            ))}
          </div>
        </aside>

        <article className="evidence-sheet" data-testid="evidence-sheet">
          <div className="sheet-number">{String(fragments.indexOf(selected) + 1).padStart(2, "0")}</div>
          <p className="desk-label">当前残片</p>
          <h3>{selected.title}</h3>
          <p className="surface-copy">{selected.surface}</p>
          {flipped.includes(selected.id) ? (
            <div className="reverse-copy" data-testid="reverse-copy">
              <span>纸背</span>
              <p>{selected.id === "mouse" && mouseBackflow ? "阿长那一页送回了新证词：隐鼠并非死于猫口，而是被长妈妈误踏。儿时归罪于猫的愤怒仍是真的，事实却需要改签。" : selected.back}</p>
              {selected.id === "mouse" && mouseBackflow && <strong className="backflow-note">证据回流：请重新判断这张残片</strong>}
            </div>
          ) : (
            <button className="flip-button" data-testid="flip-fragment" onClick={flipSelected}>翻到纸背</button>
          )}
          {investigated.includes(selected.id) && <p className="inquiry-copy" data-testid="inquiry-copy">细察：{selected.inquiry}</p>}
        </article>

        <aside className="stamp-tray">
          <p className="desk-label">落下你的判断</p>
          <div className="stamp-buttons">
            {(Object.keys(stampMeta) as Stamp[]).map((stamp, index) => (
              <button
                key={stamp}
                className={`stamp-button ${stamps[selected.id] === stamp ? "chosen" : ""} stamp-${stamp}`}
                disabled={!flipped.includes(selected.id)}
                onClick={() => applyStamp(stamp)}
                aria-pressed={stamps[selected.id] === stamp}
                data-testid={`stamp-${stamp}`}
              >
                <b>{stampMeta[stamp].short}</b><span>{stampMeta[stamp].label}</span><small>键 {index + 1}</small>
              </button>
            ))}
          </div>
          <button
            className="inquire-button"
            disabled={!flipped.includes(selected.id) || investigated.includes(selected.id) || twilight === 0}
            onClick={investigateSelected}
            data-testid="investigate"
          >
            {investigated.includes(selected.id) ? "已经细察" : twilight === 0 ? "暮色已尽" : "花一瓣暮色细察"}
          </button>
          <p className={`message ${stamps[selected.id] && stamps[selected.id] !== selected.answer ? "warning" : ""}`} aria-live="polite" data-testid="feedback-message">{message}</p>
          {sceneIndex < 3 ? (
            <button className="next-button" disabled={!sceneStamped} onClick={advanceScene} data-testid="next-scene">收拢本景，继续</button>
          ) : (
            <button className="next-button bind-button" disabled={!allStamped} onClick={() => setShowEnding(true)} data-testid="bind-book">装帧这册旧事</button>
          )}
        </aside>
      </section>

      <footer>
        <span>原创互动改编 · 取材自鲁迅散文集《朝花夕拾》</span>
        <span>{Object.keys(stamps).length} / 12 残片已校勘</span>
      </footer>

      {showHelp && (
        <div className="modal-backdrop" role="presentation">
          <section className="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title">
            <button className="modal-close" onClick={() => setShowHelp(false)} aria-label="关闭玩法说明">×</button>
            <p className="eyebrow">校勘守则</p>
            <h2 id="help-title">不是考原文，是判断如何记忆</h2>
            <ol>
              <li><b>翻证</b>：先读纸面，再翻到纸背。</li>
              <li><b>细察</b>：可花一瓣暮色换取额外线索。</li>
              <li><b>落印</b>：用“留温、留刺、存疑”判断残片应如何进入记忆。</li>
              <li><b>修订</b>：错误会令纸景抵牾；印记随时可改，证据还可能跨页回流。</li>
            </ol>
            <p>键盘玩家可在翻证后按 1、2、3 落印。</p>
            <button className="primary-button" onClick={() => setShowHelp(false)}>明白了</button>
          </section>
        </div>
      )}

      {showEnding && (
        <div className="modal-backdrop ending-backdrop" role="presentation">
          <section className={`ending-card ${allCorrect ? "clear" : "biased"}`} role="dialog" aria-modal="true" aria-labelledby="ending-title" data-testid="ending-screen">
            <div className="ending-orbit" aria-hidden="true"><i /><i /><i /></div>
            <p className="eyebrow">校勘结果</p>
            <h2 id="ending-title">{endingTitle}</h2>
            <p>{endingText}</p>
            <div className="ending-ledger">
              <span>留温 <b>{counts.warm}</b></span><span>留刺 <b>{counts.thorn}</b></span><span>存疑 <b>{counts.doubt}</b></span>
            </div>
            {allCorrect ? (
              <>
                <blockquote>“回忆不是复原过去，而是对今天仍愿承担什么，作一次清醒的选择。”</blockquote>
                <button className="primary-button" onClick={restart} data-testid="restart-game">从另一场暮色重开</button>
              </>
            ) : (
              <>
                <p className="revision-hint">仍有 {fragments.filter((item) => stamps[item.id] !== item.answer).length} 处抵牾。回到纸园，寻找发颤的红边。</p>
                <button className="primary-button" onClick={() => setShowEnding(false)} data-testid="revise-book">返回修订</button>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
