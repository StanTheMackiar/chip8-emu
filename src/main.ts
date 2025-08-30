import { CPU } from './emu/cpu';
import { RAM } from './emu/ram';
import './style.css';

const canvas = document.querySelector<HTMLCanvasElement>('canvas')!
export const canvasCtx = canvas.getContext('2d')!

const cpu = new CPU();
const ram = new RAM();

console.log(cpu)
console.log(ram)