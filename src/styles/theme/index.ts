import { breakpoints, IBreakpoints } from './breakpoints';
import { colors, IColors } from './colors';
import { zIndex, IZIndex } from './zIndex';

export { fadeIn } from './animations';

export interface ITheme {
  breakpoints: IBreakpoints;
  colors: IColors;
  zIndex: IZIndex;
}

export const theme: ITheme = {
  breakpoints,
  colors,
  zIndex,
};
