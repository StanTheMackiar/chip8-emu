import { CPU_PC_START, CPU_REGISTERS } from "../helpers/const/cpu.const";
import { FONTSET_START_ADDRESS, RAM_SIZE } from "../helpers/const/memory.const";
import { getNibblesFromOpcode } from "../helpers/get-nibble.helper";
import type { Display } from "./display";
import type { KeyPad } from "./keypad";
import type { Memory } from "./memory";

export class CPU {
  private registers: Uint8Array;
  private PC: number;
  private I: number;
  private stack: number[];
  private delayTimer: number;
  private soundTimer: number;
  public halted: boolean;

  constructor(
    private readonly memory: Memory,
    private readonly display: Display,
    private readonly keypad: KeyPad
  ) {
    this.registers = new Uint8Array(CPU_REGISTERS);
    this.PC = CPU_PC_START;
    this.I = 0x0;
    this.stack = [];
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.halted = false;
  }

  public reset() {
    this.PC = CPU_PC_START;
    this.I = 0x0;
    this.halted = false;
    this.stack = [];
    this.delayTimer = 0;
    this.soundTimer = 0;

    this.keypad.reset();
    this.display.clear();
    this.registers.fill(0);
  }

  public fetchOpcode(): number {
    return this.memory.readWord(this.PC);
  }

  public step() {
    if (!this.memory.hasROMLoaded()) {
      console.warn("No hay ROM cargada");
      this.halted = true;
      return;
    }

    if (this.PC < 0x200 || this.PC >= RAM_SIZE) {
      console.error(`PC fuera de rango: 0x${this.PC.toString(16)}`);
      this.halted = true; // bandera para frenar ejecución
      return;
    }

    const opcode = this.fetchOpcode();
    const { shouldIncrementPC } = this.executeOpcode(opcode);

    if (shouldIncrementPC) {
      this.PC += 2;
    }
  }

  public updateTimers() {
    if (this.delayTimer > 0) this.delayTimer--;
    if (this.soundTimer > 0) this.soundTimer--;
  }

  public executeOpcode(opcode: number): { shouldIncrementPC: boolean } {
    const [n1, n2, n3, n4] = getNibblesFromOpcode(opcode);

    const n3n4 = (n3 << 4) | n4;
    const n2n3n4 = (n2 << 8) | n3n4;

    let shouldIncrementPC = true;

    switch (n1) {
      case 0x0: {
        switch (n3n4) {
          case 0xe0: {
            // CLS (clear screen)
            this.display.clear();
            break;
          }
          case 0xee: {
            // RET (return from subroutine)
            if (this.stack.length === 0) throw new Error("Stack underflow");
            this.PC = this.stack.pop()!;
            shouldIncrementPC = false;
            break;
          }
        }

        break;
      }
      case 0x1: {
        // JP addr (1NNN)
        this.PC = n2n3n4;
        shouldIncrementPC = false;
        break;
      }

      case 0x2: {
        // CALL addr (2NNN)
        this.stack.push(this.PC); // guarda PC actual
        this.PC = n2n3n4;
        shouldIncrementPC = false;
        break;
      }

      case 0x3: {
        // SE Vx, byte (3XNN)
        if (this.registers[n2] === n3n4) {
          this.PC += 2;
        }
        break;
      }

      case 0x4: {
        // SNE Vx, byte (4XNN)
        if (this.registers[n2] !== n3n4) {
          this.PC += 2;
        }
        break;
      }

      case 0x5: {
        // SE Vx, Vy (5XY0)
        if (this.registers[n2] === this.registers[n3]) {
          this.PC += 2;
        }
        break;
      }

      case 0x6: {
        // LD Vx, byte (6XNN)
        this.registers[n2] = n3n4;
        break;
      }

      case 0x7: {
        // ADD Vx, byte (7XNN)
        this.registers[n2] = (this.registers[n2] + n3n4) & 0xff;
        break;
      }

      case 0x8: {
        switch (n4) {
          case 0x0: {
            //Set Vx = Vy.
            this.registers[n2] = this.registers[n3];
            break;
          }
          case 0x1: {
            //Set Vx = Vx OR Vy.
            this.registers[n2] |= this.registers[n3];
            break;
          }
          case 2: {
            //Set Vx = Vx AND Vy.
            this.registers[n2] &= this.registers[n3];
            break;
          }
          case 0x3: {
            //Set Vx = Vx XOR Vy.
            this.registers[n2] ^= this.registers[n3];
            break;
          }
          case 0x4: {
            //Set Vx = Vx + Vy, set VF = carry.
            const sum = this.registers[n2] + this.registers[n3];

            if (sum > 0xff) {
              this.registers[0xf] = 1; // Set carry flag
            } else {
              this.registers[0xf] = 0;
            }

            this.registers[n2] = sum & 0xff;

            break;
          }
          case 0x5: {
            //Set Vx = Vx - Vy, set VF = NOT borrow.
            this.registers[0xf] =
              this.registers[n2] > this.registers[n3] ? 1 : 0; // NOT borrow

            this.registers[n2] =
              (this.registers[n2] - this.registers[n3]) & 0xff;

            break;
          }
          case 0x6: {
            //Set Vx = Vx SHR 1.
            this.registers[0xf] = this.registers[n2] & 0x1; // LSB before shift
            this.registers[n2] >>= 1;
            break;
          }
          case 0x7: {
            //Set Vx = Vy - Vx, set VF = NOT borrow.
            this.registers[0xf] =
              this.registers[n3] > this.registers[n2] ? 1 : 0; // NOT borrow

            this.registers[n2] =
              (this.registers[n3] - this.registers[n2]) & 0xff;
            break;
          }
          case 0xe: {
            //Set Vx = Vx SHL 1.
            this.registers[0xf] = (this.registers[n2] & 0x80) >> 7;
            this.registers[n2] <<= 1;
            break;
          }
        }

        break;
      }
      case 0x9: {
        //Skip next instruction if Vx != Vy.
        if (this.registers[n2] !== this.registers[n3]) {
          this.PC += 2;
        }
        break;
      }
      case 0xa: {
        //Set I = nnn.
        this.I = n2n3n4;
        break;
      }
      case 0xb: {
        //Jump to location nnn + V0.
        this.PC = n2n3n4 + this.registers[0x0];
        shouldIncrementPC = false;
        break;
      }
      case 0xc: {
        //Cxkk - RND Vx, byte
        //Set Vx = random byte and KK.
        this.registers[n2] = Math.floor(Math.random() * 0x100) & n3n4;
        break;
      }
      case 0xd: {
        // Dxyn - DRW Vx, Vy, nibble
        const x = this.registers[n2];
        const y = this.registers[n3];
        const height = n4;
        const width = 8;

        this.registers[0xf] = 0; // reset collision flag

        for (let row = 0; row < height; row++) {
          const spriteByte = this.memory.readByte(this.I + row);

          for (let col = 0; col < width; col++) {
            const isOn = (spriteByte & (0x80 >> col)) !== 0;

            if (isOn) {
              const { collision } = this.display.xorPixel(x + col, y + row, 1);

              if (collision) {
                this.registers[0xf] = 1; // hubo colisión
              }
            }
          }
        }

        break;
      }
      case 0xe: {
        const key = this.registers[n2];

        switch (n3n4) {
          case 0x9e: {
            // SKP Vx (skip next instruction if key with the value of Vx is pressed)
            if (this.keypad.isKeyPressed(key)) {
              this.PC += 2;
            }
            break;
          }
          case 0xa1: {
            // SKNP Vx (skip next instruction if key with the value of Vx is not pressed)
            if (!this.keypad.isKeyPressed(key)) {
              this.PC += 2;
            }
            break;
          }
          default:
            break;
        }

        break;
      }
      case 0xf: {
        switch (n3n4) {
          case 0x07: {
            //Set Vx = delay timer value.
            this.registers[n2] = this.delayTimer;
            break;
          }
          case 0x0a: {
            // Wait for a key press, store the value of the key in Vx.
            const pressedKey = this.keypad.getFirstKeyPress();

            if (pressedKey === null) {
              shouldIncrementPC = false; // Espera tecla
            } else {
              this.registers[n2] = pressedKey;
            }

            break;
          }
          case 0x15: {
            //Set delay timer = Vx.
            this.delayTimer = this.registers[n2];
            break;
          }
          case 0x18: {
            //Set sound timer = Vx.
            this.soundTimer = this.registers[n2];
            break;
          }
          case 0x1e: {
            //Set I = I + Vx.
            this.I += this.registers[n2];
            break;
          }
          case 0x29: {
            //Set I = location of sprite for digit Vx.
            const vx = this.registers[n2];
            this.I = FONTSET_START_ADDRESS + vx * 5;
            break;
          }
          case 0x33: {
            //Store BCD representation of Vx in memory locations I, I+1, and I+2.
            let value = this.registers[n2];

            // Ones-place
            this.memory.writeByte(this.I + 2, value % 10);
            value = Math.floor(value / 10);

            // Tens-place
            this.memory.writeByte(this.I + 1, value % 10);
            value = Math.floor(value / 10);

            // Hundreds-place
            this.memory.writeByte(this.I, value % 10);
            break;
          }
          case 0x55: {
            //Store registers V0 through Vx in memory starting at location I.
            const vx = n2;
            for (let i = 0; i <= vx; i++) {
              this.memory.writeByte(this.I + i, this.registers[i]);
            }

            break;
          }
          case 0x65: {
            //Read registers V0 through Vx from memory starting at location I.
            const vx = n2;
            for (let i = 0; i <= vx; i++) {
              this.registers[i] = this.memory.readByte(this.I + i);
            }

            break;
          }

          default:
            break;
        }

        break;
      }
      case 0x10: {
        break;
      }

      default: {
        console.warn(`Unknown opcode: 0x${opcode.toString(16)}`);
      }
    }

    return { shouldIncrementPC };
  }
}
