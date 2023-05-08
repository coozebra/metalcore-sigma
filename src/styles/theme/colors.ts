export interface IColors {
  readonly [key: string]: string;
}

const alias: IColors = {
  black: '#0B0D0C',
  darkBlack: '#000',
  darkGray: '#3F3F3F',
  darkGreen: '#001B15',
  darkGreenBackground: '#0B0D0C',
  gray: '#737373',
  green: '#00FFC5',
  lightGray: '#AEAEAE',
  darkBlue: '#003B99',
  red: '#FE6C65',
  white: '#EAEFED',
};

export const colors: IColors = {
  black: alias.black,
  darkBlack: alias.darkBlack,
  darkGray: alias.darkGray,
  darkGreen: alias.darkGreen,
  darkGreenBackground: alias.darkGreenBackground,
  gray: alias.gray,
  green: alias.green,
  lightGray: alias.lightGray,
  darkBlue: alias.darkBlue,
  red: alias.red,
  white: alias.white,
};
