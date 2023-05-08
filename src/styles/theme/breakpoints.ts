export interface IBreakpoints {
  readonly small: number;
  readonly medium: number;
  readonly large: number;
  readonly extraLarge: number;
}

export const breakpoints: IBreakpoints = {
  small: 640,
  medium: 768,
  large: 1024,
  extraLarge: 1180,
};
