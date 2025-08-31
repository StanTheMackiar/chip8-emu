import { KEYPAD_QUANTITY } from "../helpers/const/keypad.const";
import { keyMap } from "../helpers/maps/key-map";

export class KeyPad {
  private keys: Uint8Array;

  constructor() {
    this.keys = new Uint8Array(KEYPAD_QUANTITY);
    this.initListeners();
  }

  private initListeners() {
    document.addEventListener("keydown", (e) => {
      const key = keyMap[e.code];
      if (key !== undefined) this.keys[key] = 1;
    });

    document.addEventListener("keyup", (e) => {
      const key = keyMap[e.code];
      if (key !== undefined) this.keys[key] = 0;
    });
  }

  public isKeyPressed(key: number): boolean {
    this.validateKey(key);
    return this.keys[key] === 1;
  }

  public getFirstKeyPress(): number | null {
    for (let i = 0; i < KEYPAD_QUANTITY; i++) {
      if (this.keys[i] === 1) return i;
    }
    return null;
  }

  public reset() {
    this.keys.fill(0);
  }

  private validateKey(key: number) {
    if (key < 0 || key >= KEYPAD_QUANTITY) {
      throw new Error(`Invalid key: ${key}`);
    }
  }
}
