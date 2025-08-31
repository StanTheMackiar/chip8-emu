import {
  CHIP_8_FONT_SET,
  FONTSET_START_ADDRESS,
  RAM_SIZE,
  ROM_LOAD_START_ADDRESS,
} from "../helpers/const/memory.const";
import type { ROM } from "./rom";

export class Memory {
  private memory: Uint8Array;

  constructor(private readonly rom: ROM) {
    this.memory = new Uint8Array(RAM_SIZE);
    this.loadFontSet();
  }

  public loadFontSet() {
    this.memory.set(CHIP_8_FONT_SET, FONTSET_START_ADDRESS);
  }

  public reset() {
    this.memory.fill(0);
    this.loadFontSet();
    this.loadROM();
  }

  public loadROM() {
    const rom = this.rom.get();
    if (!rom) return;

    if (rom.length + ROM_LOAD_START_ADDRESS > RAM_SIZE) {
      throw new Error("ROM too big for CHIP-8 memory");
    }

    this.memory.set(rom, ROM_LOAD_START_ADDRESS);
  }

  public hasROMLoaded() {
    return this.memory.slice(ROM_LOAD_START_ADDRESS).some((byte) => byte !== 0);
  }

  public readByte(address: number): number {
    return this.memory[address];
  }

  public writeByte(address: number, value: number): void {
    this.memory[address] = value;
  }

  public readWord(address: number): number {
    return (this.readByte(address) << 8) | this.readByte(address + 1);
  }
}
