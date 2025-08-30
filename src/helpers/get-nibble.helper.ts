export const getNibble = (opcode: number, nibbleIndex: number): number => {
  return (opcode >> ((3 - nibbleIndex) * 4)) & 0xf;
};

export const setNibble = (
  opcode: number,
  nibbleIndex: number,
  newNibble: number
): number => {
  const mask = 0xf << ((3 - nibbleIndex) * 4);
  opcode &= ~mask;

  return opcode | ((newNibble & 0xf) << ((3 - nibbleIndex) * 4));
};

export const getNibblesFromOpcode = (opcode: number): number[] => {
  return [
    getNibble(opcode, 0),
    getNibble(opcode, 1),
    getNibble(opcode, 2),
    getNibble(opcode, 3),
  ];
};

export const divide16BitsTo8Bits = (value: number): [number, number] => {
  const high = (value >> 8) & 0xff;
  const low = value & 0xff;
  return [high, low];
};
