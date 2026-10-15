/** True when the visitor asks for reduced motion. Read at call time, so a settings change applies to the next animation. */
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
