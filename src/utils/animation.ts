const STAGGER_STEP_MS = 30;
const STAGGER_MAX_MS = 300;

/** 항목당 30ms 지연, 전체 0.3초 이내 */
export const getStaggerDelayMs = (index: number): number =>
  Math.min(index * STAGGER_STEP_MS, STAGGER_MAX_MS);
