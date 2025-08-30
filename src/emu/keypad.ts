import { KEYPAD_QUANTITY } from "../helpers/const/keypad.const";

export class KeyPad {
  private keys: Uint8Array;

  constructor() {
    this.keys = new Uint8Array(KEYPAD_QUANTITY);
  }

  private validateKey(key: number) {
    if (key < 0 || key >= KEYPAD_QUANTITY) {
      throw new Error(`Invalid key: ${key}`);
    }
  }

  public pressKey(key: number) {
    this.validateKey(key);
    this.keys[key] = 1;
  }

  public releaseKey(key: number) {
    this.validateKey(key);
    this.keys[key] = 0;
  }

  public isKeyPressed(key: number): boolean {
    return this.keys[key] === 1;
  }

  public reset() {
    this.keys.fill(0);
  }

  public getFirstKeyPress(): number | null {
    for (let i = 0; i < KEYPAD_QUANTITY; i++) {
      if (this.keys[i] === 1) return i;
    }
    return null;
  }
}
