export const getNibble = (opcode: number, nibbleIndex: number): number => {
  return (opcode >> ((3 - nibbleIndex) * 4)) & 0xf;
};

export const getNibblesFromOpcode = (opcode: number): number[] => {
  return [
    getNibble(opcode, 0),
    getNibble(opcode, 1),
    getNibble(opcode, 2),
    getNibble(opcode, 3),
  ];
};
