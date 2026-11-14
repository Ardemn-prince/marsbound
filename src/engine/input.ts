export class InputManager {
  private held = new Set<string>();
  private pressed = new Set<string>();
  private down = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement)?.closest('input,textarea,select,[contenteditable=true]')) return;
    const key=e.key.toLowerCase();
    if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(key)) e.preventDefault();
    if (!this.held.has(key)) this.pressed.add(key);
    this.held.add(key);
  };
  private up = (e: KeyboardEvent) => { this.held.delete(e.key.toLowerCase()); };
  clear = () => { this.held.clear(); this.pressed.clear(); };
  constructor() { window.addEventListener('keydown',this.down);window.addEventListener('keyup',this.up);window.addEventListener('blur',this.clear);document.addEventListener('visibilitychange',this.clear); }
  isDown(...keys: string[]) { return keys.some(k=>this.held.has(k)); }
  consume(key: string) { const has=this.pressed.has(key);this.pressed.delete(key);return has; }
  set(key: string, held: boolean) { if(held){if(!this.held.has(key))this.pressed.add(key);this.held.add(key);}else this.held.delete(key); }
  dispose() {window.removeEventListener('keydown',this.down);window.removeEventListener('keyup',this.up);window.removeEventListener('blur',this.clear);document.removeEventListener('visibilitychange',this.clear);this.clear();}
}
