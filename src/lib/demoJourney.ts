import { useSyncExternalStore } from "react";

/** 孙德强 · 贯穿全端的演示患者旅程 */
export const JOURNEY_STAGES = [
  { key: "admit", label: "入院首评", day: 0, desc: "今日入院 · 医/治/护完成首次评估" },
  { key: "goal", label: "康复目标", day: 2, desc: "评估确认 · AI 生成 4 周康复目标" },
  { key: "plan", label: "方案处方", day: 3, desc: "团队确认方案 · AI 处方待签发" },
  { key: "exec", label: "住院训练", day: 14, desc: "PT/OT/ST 执行中 · 护理与宣教" },
  { key: "discharge", label: "出院转介", day: 26, desc: "满足出院条件 · 二级方案转社区" },
  { key: "community", label: "社区康复", day: 33, desc: "社区医生接收 · 随访与上门指导" },
  { key: "home", label: "居家康复", day: 45, desc: "用户端自评打卡 · AI 管家陪伴" },
] as const;

export type JourneyKey = (typeof JOURNEY_STAGES)[number]["key"];

let stage = 0;
const listeners = new Set<() => void>();
const patchers: ((s: number) => void)[] = [];

/** 各端在模块加载时注册，用于按阶段改写自身演示数据中的孙德强 */
export const registerJourney = (fn: (s: number) => void) => {
  patchers.push(fn);
  fn(stage);
};

export const setJourneyStage = (s: number) => {
  stage = s;
  patchers.forEach((fn) => fn(s));
  listeners.forEach((l) => l());
};

export const getJourneyStage = () => stage;
export const journeyKey = (s = stage): JourneyKey => JOURNEY_STAGES[s].key;

export const useJourneyStage = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => stage,
  );

export const SUN = { name: "孙德强", sex: "男", age: 60, bed: "315", dx: "急性缺血性脑卒中（左侧基底节）· 右侧偏瘫" };

/** 从数组中移除孙德强旧条目，并按需插入新条目（置顶） */
export const replaceSun = <T,>(arr: T[], isSun: (x: T) => boolean, items: T[]) => {
  for (let i = arr.length - 1; i >= 0; i--) if (isSun(arr[i])) arr.splice(i, 1);
  arr.unshift(...items);
};
