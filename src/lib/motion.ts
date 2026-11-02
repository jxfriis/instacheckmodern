// InstaCheck's motion language, ported from the Friis app (which took it from Offload's Motion.cs):
// things squash when pressed and spring back with a little overshoot. The curves are WPF's own
// ElasticEase / BackEase formulas. Scale and translate are animated as separate CSS properties, so a
// squash never wipes out a slide (and never fights the `transform` that motion/react writes).
//
// Everything here runs at 75% of Friis's strength. Where we choose how far something travels (press
// depth, pop size, slide offset, shake) the distance is scaled, and the unchanged curve then overshoots
// 25% less too. Where the layout decides the distance (sliding pill, switch knob, progress fill) the
// curve itself is softened instead.
export const STRENGTH = 0.75;

type Curve = (t: number) => number;

const elasticIn =
  (oscillations: number, springiness: number): Curve =>
  (t) => {
    const expo =
      springiness === 0
        ? t
        : (Math.exp(springiness * t) - 1) / (Math.exp(springiness) - 1);
    return expo * Math.sin((Math.PI * 2 * oscillations + Math.PI / 2) * t);
  };
const backIn =
  (amplitude: number): Curve =>
  (t) =>
    t * t * t - t * amplitude * Math.sin(Math.PI * t);
const easeOut =
  (f: Curve): Curve =>
  (t) =>
    1 - f(1 - t);

/** Scales everything the curve does past its first arrival at 1, keeping it continuous. */
function soften(f: Curve): Curve {
  let arrival = 1;
  for (let i = 1; i <= 1000; i++) {
    if (f(i / 1000) >= 1) {
      arrival = i / 1000;
      break;
    }
  }
  return (t) => (t < arrival ? f(t) : 1 + (f(t) - 1) * STRENGTH);
}

const sample = (f: Curve, n = 72) =>
  `linear(${Array.from({ length: n + 1 }, (_, i) => +f(i / n).toFixed(4)).join(", ")})`;

export const Curves = {
  spring: easeOut(elasticIn(2, 6)), // ElasticEase { Oscillations = 2, Springiness = 6 }
  bouncy: easeOut(elasticIn(1, 4)), // ElasticEase { Oscillations = 1, Springiness = 4 }
  wobble: easeOut(elasticIn(5, 2)), // the "no" shake
  softSpring: soften(easeOut(elasticIn(2, 6))),
  softSettle: soften(easeOut(backIn(0.22))), // BackEase { Amplitude = 0.22 }
};

export const Ease = {
  spring: sample(Curves.spring, 96),
  bouncy: sample(Curves.bouncy),
  wobble: sample(Curves.wobble, 120),
  softSpring: sample(Curves.softSpring, 96),
  softSettle: sample(Curves.softSettle),
  quick: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // QuadraticEase out
};

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A scale resting at 1: how deep it goes at this app's strength. */
const depth = (scale: number) => String(1 - (1 - scale) * STRENGTH);

/** Animate one CSS property from wherever it is right now (mid-animation included) to `value`. */
function to(el: HTMLElement, prop: string, value: string, ms: number, easing: string) {
  if (reduced()) {
    el.style.setProperty(prop, value);
    return;
  }
  const from = getComputedStyle(el).getPropertyValue(prop);
  for (const a of el.getAnimations()) {
    if (a.id === prop) {
      a.commitStyles();
      a.cancel();
    }
  }
  const a = el.animate([{ [prop]: from }, { [prop]: value }], {
    duration: ms,
    easing,
    fill: "forwards",
    id: prop,
  });
  a.onfinish = () => {
    el.style.setProperty(prop, value);
    a.cancel();
  };
}

function fromTo(
  el: HTMLElement,
  prop: string,
  from: string,
  value: string,
  ms: number,
  easing: string,
  delay = 0
) {
  if (reduced()) return;
  for (const a of el.getAnimations()) if (a.id === prop) a.cancel();
  el.style.setProperty(prop, value);
  el.animate([{ [prop]: from }, { [prop]: value }], {
    duration: ms,
    easing,
    delay,
    fill: "backwards",
    id: prop,
  });
}

const press = (el: HTMLElement) => to(el, "scale", depth(0.94), 90, Ease.quick);
const springBack = (el: HTMLElement) => to(el, "scale", "1", 650, Ease.spring);

export const Motion = {
  /** Squash to `from`, then spring back to full size. */
  pop: (el: HTMLElement, from = 0.94) =>
    fromTo(el, "scale", depth(from), "1", 700, Ease.spring),

  /** Scale up from small with an elastic overshoot (cards, badges). */
  popIn(el: HTMLElement, delay = 0) {
    fromTo(el, "opacity", "0", "1", 180, "linear", delay);
    fromTo(el, "scale", depth(0.82), "1", 700, Ease.spring, delay);
  },

  /** Fade in while springing in from an offset (panels, rows). */
  enter(el: HTMLElement, dx: number, dy: number, delay = 0) {
    fromTo(el, "opacity", "0", "1", 220, "linear", delay);
    fromTo(
      el,
      "translate",
      `${dx * STRENGTH}px ${dy * STRENGTH}px`,
      "0px 0px",
      650,
      Ease.bouncy,
      delay
    );
  },

  shake: (el: HTMLElement) =>
    fromTo(el, "translate", `${12 * STRENGTH}px 0px`, "0px 0px", 800, Ease.wobble),

  /** Spring a width or position the layout decides. gentle = one small overshoot. */
  size: (el: HTMLElement, prop: string, value: string, gentle = false) =>
    to(el, prop, value, gentle ? 360 : 750, gentle ? Ease.softSettle : Ease.softSpring),
};

/**
 * Every button and link (and anything marked .press) squashes on press and springs back on release,
 * installed once at document level so nothing needs per-element wiring.
 */
export function installMotion() {
  for (const [k, v] of Object.entries(Ease)) {
    document.documentElement.style.setProperty(`--ease-${k}`, v);
  }

  let held: HTMLElement | null = null;
  const onDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    const el = (e.target as Element).closest<HTMLElement>("button, a[href], .press");
    if (!el || el.matches(":disabled") || el.classList.contains("no-press")) return;
    held = el;
    press(el);
  };
  const release = () => {
    if (held) springBack(held);
    held = null;
  };
  const onOut = (e: PointerEvent) => {
    if (held && e.target === held && !held.contains(e.relatedTarget as Node)) release();
  };

  document.addEventListener("pointerdown", onDown, true);
  window.addEventListener("pointerup", release, true);
  window.addEventListener("pointercancel", release, true);
  document.addEventListener("pointerout", onOut, true);
  return () => {
    document.removeEventListener("pointerdown", onDown, true);
    window.removeEventListener("pointerup", release, true);
    window.removeEventListener("pointercancel", release, true);
    document.removeEventListener("pointerout", onOut, true);
  };
}
