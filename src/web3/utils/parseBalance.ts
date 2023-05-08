import type { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';

export const parseBalance = (value: BigNumberish, decimals = 18, decimalsToDisplay = 4) =>
  parseFloat(formatUnits(value, decimals)).toFixed(decimalsToDisplay);
