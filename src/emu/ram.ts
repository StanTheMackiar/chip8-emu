import { CHIP_8_FONT_SET, RAM_SIZE } from "../helpers/const/ram.const";

export class RAM {
  private memory: Uint8Array;

  constructor() {
    this.memory = new Uint8Array(RAM_SIZE);
    this.memory.set(CHIP_8_FONT_SET, 0x0);
  }

  public readByte(address: number): number {
    return this.memory[address];
  }

  public writeByte(address: number, value: number): void {
    this.memory[address] = value;
  }
}
