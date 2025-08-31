import {
  VIDEO_HEIGHT,
  VIDEO_SCALE,
  VIDEO_WIDTH,
} from "../helpers/const/display.const";

export class Display {
  private display: Uint8Array;
  private imageData: ImageData;
  private ctx: CanvasRenderingContext2D;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly scale = VIDEO_SCALE,
    private readonly onColor: [number, number, number] = [0xff, 0xff, 0xff],
    private readonly offColor: [number, number, number] = [0x00, 0x00, 0x00]
  ) {
    this.display = new Uint8Array(VIDEO_WIDTH * VIDEO_HEIGHT);
    this.imageData = new ImageData(VIDEO_WIDTH * scale, VIDEO_HEIGHT * scale);
    this.canvas.width = VIDEO_WIDTH * scale;
    this.canvas.height = VIDEO_HEIGHT * scale;
    this.ctx = this.canvas.getContext("2d")!;
  }

  public fill(value: number) {
    this.display.fill(value);
  }

  public getDisplay(): Uint8Array {
    return this.display;
  }

  public getPixel(x: number, y: number): number {
    x = x % VIDEO_WIDTH;
    y = y % VIDEO_HEIGHT;
    const index = y * VIDEO_WIDTH + x;
    return this.display[index];
  }

  public xorPixel(x: number, y: number, value: number): { collision: boolean } {
    // wrap-around en Chip-8
    x = x % VIDEO_WIDTH;
    y = y % VIDEO_HEIGHT;

    const address = y * VIDEO_WIDTH + x;

    // pixel antes de aplicar XOR
    const prev = this.display[address];

    // aplicar XOR
    this.display[address] ^= value & 1;

    // si había un 1 y ahora quedó 0 → hubo colisión
    return {
      collision: prev === 1 && this.display[address] === 0,
    };
  }

  public clear() {
    this.display.fill(0);
  }

  public render() {
    const data = this.imageData.data;

    for (let y = 0; y < VIDEO_HEIGHT; y++) {
      for (let x = 0; x < VIDEO_WIDTH; x++) {
        const pixel = this.getPixel(x, y);
        const [r, g, b] = pixel ? this.onColor : this.offColor;

        // Escalar el píxel en bloques de `scale x scale`
        for (let dy = 0; dy < this.scale; dy++) {
          for (let dx = 0; dx < this.scale; dx++) {
            const px =
              (y * this.scale + dy) * (VIDEO_WIDTH * this.scale) +
              (x * this.scale + dx);
            const idx = px * 4;
            data[idx] = r; // R
            data[idx + 1] = g; // G
            data[idx + 2] = b; // B
            data[idx + 3] = 0xff; // A
          }
        }
      }
    }

    this.ctx.putImageData(this.imageData, 0, 0);
  }
}
