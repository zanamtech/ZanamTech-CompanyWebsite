/**
 * Keyboard-only focus rings, consistently across browsers.
 *
 * Browsers decide on their own when :focus-visible applies, and some show a ring after a mouse click (for example
 * after script-moved focus, inside embedded webviews, or once a key has been pressed earlier). We record the last
 * input type on <html data-modality> and global.css hides the ring for pointer input only. Any navigation key turns
 * keyboard modality back on immediately, so Tab users always see the ring.
 */
const root = document.documentElement;
const KEYBOARD_KEYS = new Set([
  'Tab',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'Enter',
  ' ',
  'Escape',
]);

const setModality = (value: 'pointer' | 'keyboard') => {
  if (root.dataset.modality !== value) root.dataset.modality = value;
};

document.addEventListener('pointerdown', () => setModality('pointer'), { capture: true, passive: true });
document.addEventListener(
  'keydown',
  (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (KEYBOARD_KEYS.has(event.key)) setModality('keyboard');
  },
  { capture: true },
);
