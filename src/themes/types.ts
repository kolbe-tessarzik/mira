export type ThemeColors = Record<string, string>;

export interface Theme {
  name: string;
  author: string;
  colors: ThemeColors;
}
