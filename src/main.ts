import { CPU } from "./emu/cpu";
import { Display } from "./emu/display";
import { KeyPad } from "./emu/keypad";
import { Memory } from "./emu/memory";
import "./events";
import { EmulationStatusEnum } from "./helpers/enum/emulation-status.enum";

const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;

export const keypad = new KeyPad();
export const memory = new Memory();
export const display = new Display(canvas);
export const cpu = new CPU(memory, display, keypad);

// ----------------- CONFIG -----------------
const CPU_HZ = 500; // CHIP-8 típico ~500Hz
const TIMER_HZ = 60; // timers a 60Hz

let lastCycleTime = performance.now();
let lastTimerUpdate = performance.now();

const noRunStatuses = [EmulationStatusEnum.PAUSED, EmulationStatusEnum.STOPPED];

function loop() {
  if (noRunStatuses.includes(cpu.status)) return;

  const now = performance.now();
  const delta = now - lastCycleTime;
  const stepsToRun = Math.floor((CPU_HZ / 1000) * delta);

  for (let i = 0; i < stepsToRun; i++) {
    const { status } = cpu.step();
    if (noRunStatuses.includes(status)) break;
  }

  lastCycleTime = now;

  // Actualizar timers 60Hz
  if (now - lastTimerUpdate >= 1000 / TIMER_HZ) {
    cpu.updateTimers();
    lastTimerUpdate = now;
  }

  display.render();
  requestAnimationFrame(loop);
}

loop();

export default loop;
