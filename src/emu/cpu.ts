import { CPU_PC_START, CPU_REGISTERS } from "../helpers/const/cpu.const";
import { getNibble } from "../helpers/get-nibble.helper";
import type { RAM } from "./ram";

export class CPU {
  private registers: Uint8Array;
  public PC: number;
  public I: number;
  public stack: number[];
  private delayTimer: number;
  private soundTimer: number;

  constructor() {
    this.registers = new Uint8Array(CPU_REGISTERS);
    this.PC = CPU_PC_START;
    this.I = 0x0;
    this.stack = [];
    this.delayTimer = 0;
    this.soundTimer = 0;
  }

  public reset() {
    this.registers.fill(0);
    this.PC = CPU_PC_START;
    this.I = 0x0;
  }

  public fetchOpcode(memory: RAM): number {
    const high = memory.readByte(this.PC);
    const low = memory.readByte(this.PC + 1);
    return (high << 8) | low;
  }

  public executeOpcode(opcode: number) {
    const firstNibble = getNibble(opcode, 0);

    switch (firstNibble) {
      case 0x0:
        // 00E0 = CLS, 00EE = RET
        break;
      case 0x1:
        // 1NNN = JP addr
        break;
      case 0x6:
        // 6XNN = LD Vx, byte
        break;
      // ...
      default:
        throw new Error(`Unknown opcode: 0x${opcode.toString(16)}`);
    }
  }
}
