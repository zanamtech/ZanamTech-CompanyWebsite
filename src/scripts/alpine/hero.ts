import type { Alpine } from 'alpinejs';
import { reducedMotion } from '../motion';

/** Home hero: the "Engagement blueprint" stepper and the scroll cue. */
export function registerHero(Alpine: Alpine) {
  /* ------------------------------------------------ hero blueprint stepper */
  // Loop: each step is active for 1.8s (earlier steps stay ticked) → 2s pause after step 4 (1.3s neutral with every
  // step ticked, then 0.7s while the ticks fade out) → step 1 again. 'off' (reduced motion / before Alpine) shows the static card.
  type StepperPhase = 'off' | 'play' | 'rest' | 'reset';
  const STEPPER_DELAY: Record<StepperPhase, number> = { off: 0, play: 1800, rest: 1300, reset: 700 };

  Alpine.data('blueprintStepper', (steps: number) => ({
    activeStep: 0,
    phase: 'off' as StepperPhase,
    timer: 0,
    isHovered: false,

    init() {
      if (reducedMotion()) return;
      this.phase = 'reset';
      this.schedule();
    },

    destroy() {
      window.clearTimeout(this.timer);
    },

    schedule() {
      window.clearTimeout(this.timer);
      this.timer = window.setTimeout(() => {
        if (!this.isHovered && !document.hidden) this.advance();
        this.schedule();
      }, STEPPER_DELAY[this.phase]);
    },

    advance() {
      if (this.phase === 'reset') {
        this.phase = 'play';
        this.activeStep = 1;
      } else if (this.phase === 'play' && this.activeStep < steps) {
        this.activeStep += 1;
      } else if (this.phase === 'play') {
        this.phase = 'rest';
        this.activeStep = 0;
      } else {
        this.phase = 'reset';
      }
    },

    pause() {
      this.isHovered = true;
      window.clearTimeout(this.timer);
    },

    resume() {
      this.isHovered = false;
      if (this.phase !== 'off') this.schedule();
    },

    /** 'active' (current) | 'done' (ticked, neutral) | 'idle' (upcoming, dimmed, no tick) | 'clear' (neutral, no
     * tick); '' for the static card. */
    stepState(step: number) {
      if (this.phase === 'off') return '';
      if (this.phase === 'rest') return 'done';
      if (this.phase === 'reset') return 'clear';
      if (step === this.activeStep) return 'active';
      return step < this.activeStep ? 'done' : 'idle';
    },
  }));

  /* ---------------------------------------------------- hero scroll cue */
  // The link's href (e.g. #core-services) is the no-JS fallback; with JS, scroll smoothly (instantly under reduced motion)
  // without letting the ClientRouter treat it as a navigation.
  Alpine.data('scrollCue', () => ({
    go(event: MouseEvent) {
      const target = document.querySelector((event.currentTarget as HTMLAnchorElement).hash);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    },
  }));
}
