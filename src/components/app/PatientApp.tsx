import { useState } from "react";
import { ScreenShell, TabBar, type TabBarItem } from "@/components/app/TabBar";
import { PhoneSheet } from "@/components/app/Sheet";
import {
  Home as HomeIcon,
  HeartPulse,
  ClipboardList,
  User as UserIcon,
  Sparkles,
  ChevronRight,
  Clock,
  Check,
  CheckCircle2,
  Dumbbell,
  Footprints,
  Pill,
  Activity,
  Brain,
  Hand,
  Stethoscope,
  Bell,
  Play,
  FileText,
  Radio,
  Bookmark,
  TrendingUp,
  Target,
  CalendarDays,
  Trophy,
  ShieldAlert,
  MessageSquare,
  QrCode,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import rehabGait from "@/assets/rehab-gait.jpg";
import rehabHand from "@/assets/rehab-hand.jpg";

/* =========================================================
 * 康复用户端（患者移动端）
 *  · 设计复用「鼓e佳」用户端：极光 Hero + 今日任务票据卡 + 分层信息流
 *  · 主题：physio（橙）· 数据：康复科（脑卒中偏瘫康复全流程）
 * =======================================================*/

const TABS: TabBarItem[] = [
  { key: "home", label: "首页", icon: HomeIcon },
  { key: "care", label: "康复方案", icon: HeartPulse },
  { key: "scales", label: "康复评估", icon: ClipboardList },
  { key: "me", label: "我的", icon: UserIcon },
];

const AI_QUICK = ["训练后肩膀疼怎么办", "今天能加量吗", "居家怎么防跌倒"];

type Todo = {
  icon: JSX.Element;
  category: string;
  name: string;
  advice: string;
  dose: string;
  time: string;
};

const TODOS: Todo[] = [
  {
    icon: <Footprints className="size-[18px]" />,
    category: "步行训练",
    name: "平行杠内步行训练",
    advice: "治疗师陪同 · 注意重心转移与患侧支撑",
    dose: "3 组 × 10 分钟",
    time: "09:30",
  },
  {
    icon: <Hand className="size-[18px]" />,
    category: "作业治疗",
    name: "手功能精细动作训练",
    advice: "捏取插板 + 治疗泥，疲劳即休息",
    dose: "20 分钟",
    time: "11:00",
  },
  {
    icon: <Pill className="size-[18px]" />,
    category: "康复用药",
    name: "巴氯芬（缓解痉挛）",
    advice: "饭后服用，出现嗜睡请告知护士",
    dose: "5mg × 1 片",
    time: "12:30",
  },
  {
    icon: <Activity className="size-[18px]" />,
    category: "疼痛记录",
    name: "训练后 VAS 疼痛自评",
    advice: "训练结束 30 分钟内记录最准确",
    dose: "0–10 分",
    time: "15:00",
  },
  {
    icon: <Dumbbell className="size-[18px]" />,
    category: "居家训练",
    name: "床边桥式运动",
    advice: "臀部抬起保持 5 秒，腰部勿代偿",
    dose: "3 组 × 12 次",
    time: "19:30",
  },
];

export const PatientApp = () => {
  const [tab, setTab] = useState("home");
  const [sheet, setSheet] = useState<null | "ai" | "scale" | "plan">(null);

  return (
    <ScreenShell
      tabBar={<TabBar active={tab} accent="physio" onChange={setTab} items={TABS} />}
    >
      <div className="relative min-h-full bg-background text-foreground pb-6">
        {tab === "home" && <HomeScreen onAI={() => setSheet("ai")} onScale={() => setSheet("scale")} onPlan={() => setSheet("plan")} />}
        {tab === "care" && <CareScreen onPlan={() => setSheet("plan")} />}
        {tab === "scales" && <ScalesScreen onOpen={() => setSheet("scale")} />}
        {tab === "me" && <MeScreen />}
      </div>

      <PhoneSheet open={sheet === "ai"} title="AI 康复管家" accent="physio" onClose={() => setSheet(null)}>
        <AISheetBody />
      </PhoneSheet>
      <PhoneSheet open={sheet === "scale"} title="Fugl-Meyer 上肢自评" accent="physio" onClose={() => setSheet(null)}>
        <ScaleSheetBody onDone={() => setSheet(null)} />
      </PhoneSheet>
      <PhoneSheet open={sheet === "plan"} title="我的康复方案" accent="physio" onClose={() => setSheet(null)}>
        <PlanSheetBody />
      </PhoneSheet>
    </ScreenShell>
  );
};

/* ============================== 首页 ============================== */

const HomeScreen = ({ onAI, onScale, onPlan }: { onAI: () => void; onScale: () => void; onPlan: () => void }) => {
  const [todoIdx, setTodoIdx] = useState(0);
  const [doneMap, setDoneMap] = useState<Record<number, boolean>>({ 0: true });
  const current = TODOS[todoIdx];
  const doneCount = Object.values(doneMap).filter(Boolean).length;
  const remaining = TODOS.length - doneCount;

  const checkIn = () => {
    setDoneMap((m) => ({ ...m, [todoIdx]: true }));
    toast.success(`已完成：${current.name}`);
    setTimeout(() => {
      setTodoIdx((idx) => {
        for (let i = 1; i <= TODOS.length; i++) {
          const j = (idx + i) % TODOS.length;
          if (!doneMap[j] && j !== idx) return j;
        }
        return idx;
      });
    }, 400);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60 gradient-mesh"
      />
      <div className="relative">
        {/* Layer 1: AI 康复管家 Hero */}
        <section className="px-4 pt-3">
          <article className="relative rounded-[28px] p-5 overflow-hidden text-white gradient-physio shadow-lg">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 animate-shimmer"
            />
            <div aria-hidden className="absolute -top-16 -right-12 size-48 rounded-full blur-3xl bg-white/25" />

            <div className="relative flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-white/95 text-[10px] font-bold ring-1 ring-white/25">
                <Sparkles className="size-2.5" /> 康复之家 · 今日任务
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toast("已生成病区康复群二维码")}
                  className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-white/15 text-white text-[11px] font-bold ring-1 ring-white/25 active:scale-95"
                >
                  <QrCode className="size-3" /> 入群
                </button>
                <button
                  onClick={() => toast("3 条新消息：治疗师留言 · 复评提醒")}
                  className="relative inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-white text-role-physio text-[11px] font-bold shadow-md active:scale-95"
                >
                  <Bell className="size-3" /> 消息
                  <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 rounded-full bg-destructive text-white text-[9px] font-bold grid place-items-center">
                    3
                  </span>
                </button>
              </div>
            </div>

            <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="size-3 text-white/90" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/85">
                    AI 康复管家 · 康复第 26 天
                  </p>
                </div>
                <p className="mt-2 text-[20px] font-bold leading-snug">
                  王先生，今日还有 {remaining} 项康复任务
                </p>
                <p className="mt-1.5 text-[12px] text-white/90 leading-relaxed">
                  PT 步行 · OT 手功能 · 用药 · 疼痛自评
                </p>
              </div>
              <button
                onClick={onAI}
                aria-label="进入 AI 康复管家"
                className="shrink-0 relative active:scale-95 transition-transform"
              >
                <div className="size-[72px] rounded-2xl bg-white/20 ring-[3px] ring-white/50 grid place-items-center backdrop-blur">
                  <Sparkles className="size-8" />
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-white text-role-physio text-[10px] font-bold shadow">
                  问一问
                </span>
              </button>
            </div>

            {/* 今日任务票据卡 */}
            <div className="relative mt-6 rounded-[20px] bg-card p-4 shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center size-7 rounded-lg bg-warning-soft text-warning">
                    <Clock className="size-4" />
                  </span>
                  <span className="text-[14px] font-bold text-foreground">今日康复任务</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-role-physio bg-warning-soft px-2 py-1 rounded-full">
                    {todoIdx + 1}/{TODOS.length}
                  </span>
                  <button
                    onClick={() => setTodoIdx((i) => (i - 1 + TODOS.length) % TODOS.length)}
                    className="size-7 rounded-full bg-muted grid place-items-center text-foreground/70 active:scale-95"
                    aria-label="上一项"
                  >
                    <ChevronRight className="size-3.5 rotate-180" />
                  </button>
                  <button
                    onClick={() => setTodoIdx((i) => (i + 1) % TODOS.length)}
                    className="size-7 rounded-full bg-muted grid place-items-center text-foreground/70 active:scale-95"
                    aria-label="下一项"
                  >
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl grid place-items-center bg-warning-soft text-role-physio shrink-0">
                  {current.icon}
                </div>
                <p
                  className={`flex-1 min-w-0 text-[15px] font-bold leading-snug truncate ${
                    doneMap[todoIdx] ? "text-foreground/40 line-through" : "text-foreground"
                  }`}
                >
                  {current.name}
                </p>
                <span
                  className={`shrink-0 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    doneMap[todoIdx] ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
                  }`}
                >
                  {doneMap[todoIdx] ? "已完成" : "待完成"}
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-warning-soft text-role-physio font-bold">
                  <Clock className="size-3" /> {current.time}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-foreground/[0.06] text-foreground/70 font-semibold">
                  {current.category} · {current.dose}
                </span>
              </div>

              <div className="mt-2.5 flex items-end justify-between gap-3">
                <p className="flex-1 min-w-0 text-[12px] text-foreground/75 leading-snug">{current.advice}</p>
                {doneMap[todoIdx] ? (
                  <span className="shrink-0 h-8 px-3 rounded-full bg-success-soft text-success text-[12px] font-bold inline-flex items-center gap-1">
                    <Check className="size-3.5" /> 已打卡
                  </span>
                ) : (
                  <button
                    onClick={checkIn}
                    className="shrink-0 h-8 px-4 rounded-full gradient-physio text-white text-[12px] font-bold inline-flex items-center active:scale-95 shadow-sm"
                  >
                    打卡
                  </button>
                )}
              </div>
            </div>

            {/* AI 快捷提问 */}
            <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {AI_QUICK.map((q) => (
                <button
                  key={q}
                  onClick={onAI}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-white/15 text-white/95 text-[11px] font-semibold ring-1 ring-white/25 active:scale-95"
                >
                  {q}
                </button>
              ))}
            </div>
          </article>

          {/* 主管治疗团队入口 */}
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <button
              onClick={() => toast("已进入与主管康复团队的会话")}
              className="flex items-center justify-between rounded-2xl bg-card px-3.5 py-2.5 ring-1 ring-border active:scale-[0.99] transition-transform text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-xl grid place-items-center bg-warning-soft">
                  <Stethoscope className="size-4 text-role-physio" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-bold leading-tight">咨询我的康复团队？</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    张主任（康复医师）· 李治疗师（PT）· 陈护士
                  </div>
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground shrink-0" />
            </button>
            <button
              onClick={() => toast("本周复评：Fugl-Meyer / Berg 平衡")}
              className="flex flex-col items-center justify-center rounded-2xl bg-card px-3 ring-1 ring-border active:scale-[0.97]"
            >
              <CalendarDays className="size-4 text-role-physio" />
              <span className="text-[10px] font-bold mt-0.5">复评</span>
            </button>
          </div>
        </section>

        {/* Layer 2: 本周康复进展 */}
        <section className="mt-8 px-5">
          <SectionHeader
            title="本周康复进展"
            badge={<Pill2 tone="success">较上周 +12%</Pill2>}
            actionLabel="查看趋势"
            onAction={() => toast("Fugl-Meyer 42→48 · Berg 34→39")}
          />
          <div className="grid grid-cols-3 gap-2">
            <MetricCard label="训练完成率" value="86" unit="%" tone="success" trend="+9%" />
            <MetricCard label="步行距离" value="120" unit="m" tone="primary" trend="+35m" />
            <MetricCard label="疼痛 VAS" value="3" unit="/10" tone="warning" trend="-1" />
          </div>
          <div className="mt-2.5 rounded-2xl bg-card ring-1 ring-border p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-bold">近 7 日打卡</span>
              <span className="text-[10px] text-muted-foreground">连续 12 天 · 康复积分 860</span>
            </div>
            <div className="flex items-end gap-2 h-20">
              {[60, 75, 45, 88, 92, 70, 96].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-md gradient-physio" style={{ height: `${v}%` }} />
                  <span className="text-[9px] text-muted-foreground">{["一", "二", "三", "四", "五", "六", "日"][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Layer 3: 评估中心 */}
        <section className="mt-8 px-5">
          <SectionHeader
            title="康复评估中心"
            badge={<Pill2 tone="primary">量表自评 + 复评提醒</Pill2>}
            actionLabel="全部 8 项"
            onAction={onScale}
          />
          <button
            onClick={onScale}
            className="w-full text-left block rounded-2xl bg-card ring-1 ring-border p-4 active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">
                    待完成 2
                  </span>
                  <span className="text-[10px] text-muted-foreground">本月 6/8 项</span>
                </div>
                <p className="text-[14px] font-semibold leading-tight truncate">
                  Fugl-Meyer 上肢运动功能 · 本周复评
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  10 题 · 约 3 分钟，结果同步主管治疗师
                </p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full gradient-physio text-white text-xs font-bold shrink-0">
                去填写
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Berg 平衡 / MBI 日常生活能力可自选</span>
              <span className="inline-flex items-center gap-0.5 text-role-physio font-semibold">
                进入评估中心 <ChevronRight className="size-3" />
              </span>
            </div>
          </button>
        </section>

        {/* Layer 4: 康复学堂 */}
        <section className="mt-8">
          <div className="px-5">
            <SectionHeader
              title="康复学堂"
              badge={<Pill2 tone="warning">看完得康复积分</Pill2>}
              actionLabel="进入学堂"
              onAction={() => toast("康复学堂：偏瘫康复 32 讲")}
            />
          </div>
          <div className="px-5 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {[
              { k: "all", label: "全部", active: true },
              { k: "video", label: "视频", icon: <Play className="size-3" /> },
              { k: "article", label: "图文", icon: <FileText className="size-3" /> },
              { k: "live", label: "直播", icon: <Radio className="size-3" /> },
            ].map((c) => (
              <span
                key={c.k}
                className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ring-1 ${
                  c.active ? "gradient-physio text-white ring-transparent" : "bg-card text-foreground/70 ring-border"
                }`}
              >
                {c.icon}
                {c.label}
              </span>
            ))}
          </div>
          <div className="px-5 mt-3 space-y-2.5">
            <AcademyItem
              img={rehabGait}
              title="偏瘫步行训练：重心转移与患侧负重要点"
              meta="李治疗师 · 5 分钟"
              stat="8.6k 学习"
              points={50}
              tag="必看"
              tone="primary"
            />
            <AcademyItem
              img={rehabHand}
              title="居家手功能训练 8 式：从被动到主动"
              meta="OT 治疗师 · 6 分钟"
              stat="1.2k 赞"
              points={30}
              tag="居家"
              tone="success"
            />
            <AcademyItem
              img={rehabGait}
              title="本周四 19:30 · 卒中后康复答疑直播"
              meta="张主任 · 直播预约"
              stat="216 已预约"
              points={80}
              tag="预约"
              tone="warning"
            />
          </div>
        </section>

        {/* Layer 5: 康复服务包 */}
        <section className="mt-8 px-5 mb-2">
          <SectionHeader title="康复服务包" badge={<Pill2 tone="success">治疗师甄选</Pill2>} />
          <button
            onClick={onPlan}
            className="w-full text-left block rounded-3xl p-5 ring-1 ring-border relative overflow-hidden text-white gradient-physio active:scale-[0.99] transition-transform"
          >
            <Dumbbell className="absolute -right-4 -bottom-6 size-28 opacity-20" />
            <div className="flex items-center gap-2 text-[11px] opacity-90">
              <Sparkles className="size-3.5" /> 康复医师 & 治疗师联合定制
            </div>
            <div className="text-lg font-bold mt-1">出院过渡康复包</div>
            <div className="text-[11px] opacity-85 mt-1">居家训练视频 · 上门 PT · 辅具租赁 · 社区随访</div>
            <div className="flex items-center gap-3 mt-3 text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-white/20">已服务 3,268 位康复患者</span>
              <span className="inline-flex items-center gap-1 ml-auto font-semibold">
                查看方案 <ChevronRight className="size-3.5" />
              </span>
            </div>
          </button>
        </section>
      </div>
    </div>
  );
};

/* ============================== 康复方案 ============================== */

const CareScreen = ({ onPlan }: { onPlan: () => void }) => (
  <div>
    <div className="gradient-physio px-5 pt-4 pb-8 text-white relative overflow-hidden">
      <div className="absolute -top-10 -right-8 w-44 h-44 rounded-full bg-white/15 blur-2xl" />
      <div className="relative">
        <div className="text-[11px] opacity-85">康复方案 · 第 4 周（共 8 周）</div>
        <div className="text-[19px] font-bold mt-1">脑卒中后偏瘫综合康复方案</div>
        <div className="text-[11px] opacity-85 mt-1">张主任 签发 · 2026-08-10 更新 · V3</div>
        <div className="mt-4 rounded-2xl bg-white/15 backdrop-blur p-3 ring-1 ring-white/20">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span>阶段目标完成度</span>
            <span className="font-bold">68%</span>
          </div>
          <div className="h-2 rounded-full bg-white/25 overflow-hidden">
            <div className="h-full rounded-full bg-white" style={{ width: "68%" }} />
          </div>
        </div>
      </div>
    </div>

    <div className="px-5 -mt-4 relative space-y-3">
      <div className="rounded-2xl bg-card ring-1 ring-border p-4 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Target className="size-4 text-role-physio" />
          <span className="text-[13px] font-bold">近期康复目标</span>
        </div>
        <div className="space-y-2.5">
          <GoalRow name="独立步行 100 米" now="120m（助行器）" target="100m 独立" pct={70} />
          <GoalRow name="Fugl-Meyer 上肢 ≥ 55" now="48 分" target="55 分" pct={62} />
          <GoalRow name="Barthel 日常生活 ≥ 85" now="75 分" target="85 分" pct={78} />
        </div>
      </div>

      <SectionHeader title="本周训练安排" actionLabel="全部" onAction={onPlan} />
      <div className="space-y-2">
        <PlanRow icon={<Footprints className="size-4" />} title="PT 运动治疗" detail="步行 / 平衡 / 下肢肌力 · 45 分钟" freq="5 次/周" tone="primary" />
        <PlanRow icon={<Hand className="size-4" />} title="OT 作业治疗" detail="手功能 + ADL 穿衣进食训练 · 30 分钟" freq="5 次/周" tone="success" />
        <PlanRow icon={<MessageSquare className="size-4" />} title="ST 言语治疗" detail="构音训练 + 吞咽功能训练 · 30 分钟" freq="3 次/周" tone="warning" />
        <PlanRow icon={<Activity className="size-4" />} title="物理因子治疗" detail="低频电刺激（患侧上肢）· 20 分钟" freq="5 次/周" tone="primary" />
        <PlanRow icon={<Brain className="size-4" />} title="认知康复训练" detail="注意力 / 记忆策略训练 · 20 分钟" freq="2 次/周" tone="success" />
      </div>

      <SectionHeader title="居家训练处方" actionLabel="查看视频" onAction={onPlan} />
      <div className="space-y-2">
        <PlanRow icon={<Dumbbell className="size-4" />} title="床边桥式运动" detail="3 组 × 12 次 · 强化核心与臀肌" freq="每日" tone="primary" />
        <PlanRow icon={<Footprints className="size-4" />} title="坐站转移训练" detail="3 组 × 10 次 · 家属旁护" freq="每日" tone="success" />
        <PlanRow icon={<Hand className="size-4" />} title="握力球抓握训练" detail="每次 5 分钟 · 感疲劳即停" freq="每日 2 次" tone="warning" />
      </div>

      <div className="rounded-2xl p-4 bg-destructive/5 ring-1 ring-destructive/20">
        <div className="flex items-center gap-2 mb-1.5">
          <ShieldAlert className="size-4 text-destructive" />
          <span className="text-[13px] font-bold text-destructive">安全注意事项</span>
        </div>
        <ul className="text-[11.5px] text-foreground/75 leading-relaxed list-disc pl-4 space-y-0.5">
          <li>训练中出现头晕、胸闷、血压升高请立即停止并呼叫护士</li>
          <li>患侧肩关节禁止牵拉，转移时避免拉扯上肢</li>
          <li>夜间起床遵循「起床三部曲」，家属陪同、留夜灯</li>
        </ul>
      </div>
    </div>
  </div>
);

/* ============================== 康复评估 ============================== */

const SCALES = [
  { name: "Fugl-Meyer 上肢运动功能", tag: "本周复评", desc: "10 题 · 约 3 分钟", status: "待完成", last: "上次 42 分（8-10）", icon: Hand, tone: "danger" as const },
  { name: "Berg 平衡量表（简版）", tag: "本周复评", desc: "8 题 · 约 3 分钟", status: "待完成", last: "上次 34 分（8-09）", icon: Activity, tone: "danger" as const },
  { name: "Barthel 日常生活活动 MBI", tag: "每周", desc: "10 题 · 约 3 分钟", status: "已完成", last: "75 分 · 轻度依赖", icon: HeartPulse, tone: "done" as const },
  { name: "VAS 疼痛自评", tag: "每日", desc: "1 题 · 30 秒", status: "已完成", last: "3 分 · 轻度", icon: Activity, tone: "done" as const },
  { name: "改良 Ashworth 痉挛自评", tag: "每周", desc: "4 题 · 约 2 分钟", status: "已完成", last: "患侧肘 1+ 级", icon: Dumbbell, tone: "done" as const },
  { name: "Morse 跌倒风险自评", tag: "安全", desc: "6 题 · 约 2 分钟", status: "已完成", last: "45 分 · 高风险", icon: ShieldAlert, tone: "warn" as const },
  { name: "洼田饮水试验（吞咽）", tag: "每周", desc: "5 题 · 约 1 分钟", status: "已完成", last: "Ⅱ 级 · 需慢饮", icon: MessageSquare, tone: "done" as const },
  { name: "PHQ-2 情绪筛查", tag: "心理", desc: "2 题 · 约 1 分钟", status: "已完成", last: "2 分 · 情绪平稳", icon: Brain, tone: "done" as const },
];

const ScalesScreen = ({ onOpen }: { onOpen: () => void }) => (
  <div>
    <div className="gradient-physio px-5 pt-4 pb-8 text-white relative overflow-hidden">
      <div className="absolute -top-10 -right-8 w-44 h-44 rounded-full bg-white/15 blur-2xl" />
      <div className="relative">
        <div className="text-[11px] opacity-85">康复评估中心</div>
        <div className="text-[19px] font-bold mt-1">本月已完成 6 / 8 项</div>
        <div className="text-[11px] opacity-85 mt-1">评估结果实时同步主管医师与治疗师</div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <HeroStat label="待完成" value="2" />
          <HeroStat label="本周复评" value="2" />
          <HeroStat label="综合评分" value="良好" />
        </div>
      </div>
    </div>

    <div className="px-5 -mt-4 relative space-y-2.5">
      <div className="rounded-2xl bg-ai-soft ring-1 ring-ai/20 p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="size-4 text-ai" />
          <span className="text-[13px] font-bold">AI 评估解读</span>
        </div>
        <p className="text-[12px] text-foreground/80 leading-relaxed">
          近 2 周上肢 Fugl-Meyer 由 42 → 48，平衡功能同步改善；跌倒风险仍为高风险，建议夜间起身由家属陪同，并优先完成本周 2 项复评。
        </p>
      </div>

      {SCALES.map((s) => {
        const Icon = s.icon;
        const done = s.status === "已完成";
        return (
          <button
            key={s.name}
            onClick={onOpen}
            className="w-full text-left rounded-2xl bg-card ring-1 ring-border p-3.5 flex items-start gap-3 active:scale-[0.99]"
          >
            <div
              className={`size-10 rounded-xl grid place-items-center shrink-0 ${
                s.tone === "danger" ? "bg-destructive/10 text-destructive" : s.tone === "warn" ? "bg-warning-soft text-warning" : "bg-success-soft text-success"
              }`}
            >
              <Icon className="size-[18px]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-semibold truncate">{s.name}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">{s.tag}</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</div>
              <div className="text-[11px] text-foreground/70 mt-1">{s.last}</div>
            </div>
            <span
              className={`shrink-0 self-center px-3 py-1.5 rounded-full text-[11px] font-bold ${
                done ? "bg-muted text-muted-foreground" : "gradient-physio text-white"
              }`}
            >
              {done ? "查看" : "去填写"}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

/* ============================== 我的 ============================== */

const MeScreen = () => (
  <div>
    <div className="gradient-physio px-5 pt-5 pb-10 text-white relative overflow-hidden">
      <div className="absolute -top-10 -right-8 w-44 h-44 rounded-full bg-white/15 blur-2xl" />
      <div className="relative flex items-center gap-3">
        <div className="size-14 rounded-2xl bg-white/20 ring-2 ring-white/40 grid place-items-center text-xl font-bold">王</div>
        <div className="min-w-0">
          <div className="text-[17px] font-bold">王建国 · 68 岁</div>
          <div className="text-[11px] opacity-90 mt-0.5">脑梗死恢复期 · 右侧偏瘫 · 康复三区 12 床</div>
          <div className="text-[11px] opacity-85 mt-0.5">住院第 26 天 · 主管医师 张明</div>
        </div>
      </div>
      <div className="relative mt-4 grid grid-cols-3 gap-2">
        <HeroStat label="连续打卡" value="12 天" />
        <HeroStat label="康复积分" value="860" />
        <HeroStat label="完成任务" value="184" />
      </div>
    </div>

    <div className="px-5 -mt-5 relative space-y-3">
      <div className="rounded-2xl bg-card ring-1 ring-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="size-4 text-warning" />
          <span className="text-[13px] font-bold">康复成就</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Footprints, label: "首次独走" },
            { icon: Award, label: "打卡 10 天" },
            { icon: TrendingUp, label: "FMA +6" },
            { icon: CheckCircle2, label: "全勤一周" },
          ].map((a) => (
            <div key={a.label} className="rounded-xl bg-warning-soft p-2.5 flex flex-col items-center gap-1">
              <a.icon className="size-4 text-role-physio" />
              <span className="text-[9.5px] font-semibold text-foreground/75 text-center leading-tight">{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-card ring-1 ring-border divide-y divide-border overflow-hidden">
        {[
          { icon: FileText, label: "我的康复档案", hint: "评估记录 · 训练日志" },
          { icon: CalendarDays, label: "治疗预约与排程", hint: "本周 13 次治疗" },
          { icon: HeartPulse, label: "出院与随访计划", hint: "预计 9 月 6 日出院" },
          { icon: Bookmark, label: "收藏的康复课程", hint: "9 个视频" },
          { icon: Bell, label: "提醒设置", hint: "训练 / 用药提醒已开启" },
        ].map((r) => (
          <button
            key={r.label}
            onClick={() => toast(`${r.label}：${r.hint}`)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-muted/60"
          >
            <div className="size-8 rounded-xl bg-warning-soft grid place-items-center">
              <r.icon className="size-4 text-role-physio" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold">{r.label}</div>
              <div className="text-[11px] text-muted-foreground">{r.hint}</div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* ============================== Sheets ============================== */

const AISheetBody = () => (
  <div className="p-4 space-y-3">
    <div className="rounded-2xl bg-ai-soft ring-1 ring-ai/20 p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <Sparkles className="size-4 text-ai" />
        <span className="text-[13px] font-bold">AI 康复管家</span>
      </div>
      <p className="text-[12.5px] text-foreground/80 leading-relaxed">
        您好王先生，今日已完成 1/5 项任务。结合昨日训练后 VAS 3 分与睡眠情况，建议今天步行训练维持 3 组 × 10 分钟，不加量；训练后冰敷患侧肩 10 分钟。
      </p>
    </div>
    {[
      { q: "训练后肩膀疼怎么办", a: "先暂停患侧上肢主动抬举，改为无痛范围内的被动活动；疼痛 > 4 分请联系李治疗师调整强度。" },
      { q: "今天能加量吗", a: "本周完成率 86%、疼痛稳定，建议下周起步行组数由 3 组增至 4 组，本周先保持。" },
      { q: "居家怎么防跌倒", a: "移除地面杂物与门槛、卫生间加装扶手与防滑垫、夜间留一盏地灯，起身遵循「起床三部曲」。" },
    ].map((m) => (
      <div key={m.q} className="space-y-1.5">
        <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-sm gradient-physio text-white px-3.5 py-2 text-[12.5px]">
          {m.q}
        </div>
        <div className="w-fit max-w-[88%] rounded-2xl rounded-tl-sm bg-card ring-1 ring-border px-3.5 py-2 text-[12.5px] leading-relaxed">
          {m.a}
        </div>
      </div>
    ))}
  </div>
);

const FMA_ITEMS = [
  { id: "q1", q: "患侧肩部能否主动前屈至 90°？", options: ["不能", "部分完成", "充分完成"] },
  { id: "q2", q: "肘关节能否主动屈伸自如？", options: ["不能", "部分完成", "充分完成"] },
  { id: "q3", q: "前臂能否完成旋前/旋后？", options: ["不能", "部分完成", "充分完成"] },
  { id: "q4", q: "腕关节能否背伸并保持？", options: ["不能", "部分完成", "充分完成"] },
  { id: "q5", q: "能否完成对指（拇指对小指）？", options: ["不能", "部分完成", "充分完成"] },
];

const ScaleSheetBody = ({ onDone }: { onDone: () => void }) => {
  const [ans, setAns] = useState<Record<string, number>>({});
  const score = Object.values(ans).reduce((a, b) => a + b, 0);
  const all = Object.keys(ans).length === FMA_ITEMS.length;
  return (
    <div className="p-4 space-y-3">
      <div className="rounded-2xl bg-warning-soft p-4">
        <div className="text-[13px] font-bold text-role-physio">Fugl-Meyer 上肢运动功能（自评简版）</div>
        <div className="text-[11.5px] text-foreground/70 mt-1">
          共 5 题 · 上次得分 42 分（8-10）。请在治疗师指导下如实作答。
        </div>
      </div>
      {FMA_ITEMS.map((it, i) => (
        <div key={it.id} className="rounded-2xl bg-card ring-1 ring-border p-3.5">
          <div className="text-[12.5px] font-semibold mb-2.5">
            {i + 1}. {it.q}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {it.options.map((o, v) => {
              const active = ans[it.id] === v;
              return (
                <button
                  key={o}
                  onClick={() => setAns((a) => ({ ...a, [it.id]: v }))}
                  className={`py-2 rounded-xl text-[11.5px] font-semibold transition-all ${
                    active ? "gradient-physio text-white" : "bg-muted text-foreground/70"
                  }`}
                >
                  {o}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="rounded-2xl bg-card ring-1 ring-border p-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-muted-foreground">当前得分</div>
          <div className="text-[20px] font-bold text-role-physio">{score} / 10</div>
        </div>
        <button
          disabled={!all}
          onClick={() => {
            toast.success("评估已提交，结果已同步治疗师");
            onDone();
          }}
          className={`px-5 py-2.5 rounded-full text-[13px] font-bold ${
            all ? "gradient-physio text-white" : "bg-muted text-muted-foreground"
          }`}
        >
          提交评估
        </button>
      </div>
    </div>
  );
};

const PlanSheetBody = () => (
  <div className="p-4 space-y-3">
    <div className="rounded-2xl bg-warning-soft p-4">
      <div className="text-[13px] font-bold text-role-physio">脑卒中后偏瘫综合康复方案 V3</div>
      <div className="text-[11.5px] text-foreground/70 mt-1">张主任 签发 · 康复第 4 周 · 每周三团队会议复核</div>
    </div>
    <PlanRow icon={<Footprints className="size-4" />} title="PT 运动治疗" detail="步行 / 平衡 / 下肢肌力" freq="5 次/周 · 45min" tone="primary" />
    <PlanRow icon={<Hand className="size-4" />} title="OT 作业治疗" detail="手功能 + ADL 训练" freq="5 次/周 · 30min" tone="success" />
    <PlanRow icon={<MessageSquare className="size-4" />} title="ST 言语治疗" detail="构音 + 吞咽训练" freq="3 次/周 · 30min" tone="warning" />
    <PlanRow icon={<Activity className="size-4" />} title="物理因子治疗" detail="低频电刺激（患侧上肢）" freq="5 次/周 · 20min" tone="primary" />
    <div className="rounded-2xl bg-card ring-1 ring-border p-4">
      <div className="text-[12.5px] font-bold mb-2">出院过渡康复包（可选）</div>
      <ul className="text-[11.5px] text-foreground/75 leading-relaxed list-disc pl-4 space-y-0.5">
        <li>居家训练视频课 32 讲 + 每周治疗师在线答疑</li>
        <li>上门 PT 4 次 / 月，含居家环境无障碍评估</li>
        <li>助行器 / 踝足矫形器租赁与适配</li>
        <li>社区康复站随访对接，每月复评一次</li>
      </ul>
    </div>
  </div>
);

/* ============================== 小组件 ============================== */

const SectionHeader = ({
  title,
  badge,
  actionLabel,
  onAction,
}: {
  title: string;
  badge?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <div className="flex justify-between items-center mb-3">
    <div className="flex items-center gap-2">
      <h3 className="text-[16px] font-semibold tracking-tight">{title}</h3>
      {badge}
    </div>
    {actionLabel && (
      <button onClick={onAction} className="text-xs font-medium text-role-physio flex items-center gap-0.5 active:opacity-60">
        {actionLabel}
        <ChevronRight className="size-3.5" />
      </button>
    )}
  </div>
);

const Pill2 = ({ tone, children }: { tone: "primary" | "success" | "warning"; children: React.ReactNode }) => {
  const cls = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
  }[tone];
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${cls}`}>{children}</span>;
};

const MetricCard = ({
  label,
  value,
  unit,
  tone,
  trend,
}: {
  label: string;
  value: string;
  unit: string;
  tone: "primary" | "success" | "warning";
  trend: string;
}) => {
  const cls = { primary: "text-primary", success: "text-success", warning: "text-warning" }[tone];
  return (
    <div className="rounded-2xl bg-card ring-1 ring-border p-3">
      <div className="text-[10px] text-muted-foreground font-semibold">{label}</div>
      <div className={`mt-1 text-[20px] font-bold ${cls}`} style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
        <span className="text-[11px] font-semibold ml-0.5 text-muted-foreground">{unit}</span>
      </div>
      <div className="text-[10px] text-success font-semibold flex items-center gap-0.5 mt-0.5">
        <ArrowUpRight className="size-3" /> {trend}
      </div>
    </div>
  );
};

const HeroStat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-white/15 backdrop-blur p-2.5 ring-1 ring-white/20">
    <div className="text-[10px] opacity-85">{label}</div>
    <div className="text-[15px] font-bold mt-0.5">{value}</div>
  </div>
);

const GoalRow = ({ name, now, target, pct }: { name: string; now: string; target: string; pct: number }) => (
  <div>
    <div className="flex items-center justify-between text-[12px] mb-1">
      <span className="font-semibold truncate">{name}</span>
      <span className="text-[10.5px] text-muted-foreground shrink-0 ml-2">
        {now} → {target}
      </span>
    </div>
    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
      <div className="h-full rounded-full gradient-physio" style={{ width: `${pct}%` }} />
    </div>
  </div>
);

const PlanRow = ({
  icon,
  title,
  detail,
  freq,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  freq: string;
  tone: "primary" | "success" | "warning";
}) => {
  const cls = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
  }[tone];
  return (
    <div className="rounded-2xl bg-card ring-1 ring-border p-3.5 flex items-center gap-3">
      <div className={`size-9 rounded-xl grid place-items-center shrink-0 ${cls}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold truncate">{title}</div>
        <div className="text-[11px] text-muted-foreground truncate">{detail}</div>
      </div>
      <span className="text-[10.5px] font-bold text-role-physio bg-warning-soft px-2 py-1 rounded-full shrink-0">{freq}</span>
    </div>
  );
};

const AcademyItem = ({
  img,
  title,
  meta,
  stat,
  points,
  tag,
  tone,
}: {
  img: string;
  title: string;
  meta: string;
  stat: string;
  points: number;
  tag: string;
  tone: "primary" | "success" | "warning";
}) => {
  const cls = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
  }[tone];
  return (
    <button className="w-full text-left rounded-2xl bg-card ring-1 ring-border p-2.5 flex gap-3 active:scale-[0.99]">
      <div className="relative w-[92px] aspect-[1.6/1] rounded-xl overflow-hidden bg-muted shrink-0">
        <img src={img} alt={title} loading="lazy" width={800} height={512} className="w-full h-full object-cover" />
        <span className="absolute bottom-1 left-1 size-6 rounded-full bg-white/85 grid place-items-center text-role-physio">
          <Play className="size-3 fill-current" />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${cls}`}>{tag}</span>
          <span className="text-[10px] text-muted-foreground truncate">{meta}</span>
        </div>
        <p className="text-[12.5px] font-semibold leading-snug line-clamp-2">{title}</p>
        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
          <span>{stat}</span>
          <span className="text-warning font-bold">+{points} 积分</span>
        </div>
      </div>
    </button>
  );
};
