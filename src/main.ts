import { CPU, Display, KeyPad, Memory, ROM, Speaker } from "./emu";
import "./events";
import { CPUStatusEnum } from "./helpers/enum/cpu-status.enum";

const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;

export const keypad = new KeyPad();
export const rom = new ROM();
export const memory = new Memory(rom);
export const display = new Display(canvas);
export const speaker = new Speaker();
export const cpu = new CPU(memory, display, keypad, rom, speaker);

// ----------------- CONFIG -----------------
const STEPS_BY_FRAME = 10;
const TIMER_HZ = 60; // timers a 60Hz

let lastTimerUpdate = performance.now();

function loop() {
  if (cpu.status !== CPUStatusEnum.RUNNING) {
    lastTimerUpdate = performance.now();
    requestAnimationFrame(loop);
    return;
  }

  const now = performance.now();

  for (let i = 0; i < STEPS_BY_FRAME; i++) {
    const { status } = cpu.step();
    if (status !== CPUStatusEnum.RUNNING) break;
  }

  // Actualizar timers 60Hz
  if (now - lastTimerUpdate >= 1000 / TIMER_HZ) {
    cpu.updateTimers();
    lastTimerUpdate = now;

    cpu.playSound();
  }

  display.render();
  requestAnimationFrame(loop);
}

loop();

export default loop;
