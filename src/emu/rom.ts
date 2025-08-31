export class ROM {
  private data: Uint8Array | null = null;

  constructor() {}

  public set(rom: Uint8Array) {
    this.data = rom;
  }

  public clear() {
    this.data = null;
  }

  public get(): Uint8Array | null {
    return this.data;
  }
}
