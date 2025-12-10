import { PaletteMode } from '@mui/material';

export const lightPaletteText = {
  primary: 'rgb(17, 24, 39)',
  secondary: '#2c2c42',
  disabled: 'rgb(149, 156, 169)',
};

export const darkPaletteText = {
  primary: 'rgb(255,255,255)',
  secondary: '#2c2c42',
  disabled: 'rgb(156, 163, 175)',
};

export const testHarborColorConfig = {
  primary: '#2563eb',
  grey: '#6b7280',
  styledTab: '#423737',
  navbarGroupTitle: '#494747',
  cardDescription: '#423742',
  tourBeacon: '#fe5621',
};

export interface ThemeConfig {
  palette: {
    mode: PaletteMode;
    divider?: string;
    text: typeof lightPaletteText | typeof darkPaletteText;
    common?: {
      black: string;
      white: string;
    };
    primary?: {
      light: string;
      main: string;
      dark: string;
      contrastText: string;
    };
    secondary?: {
      light: string;
      main: string;
      dark: string;
      contrastText: string;
    };
    info?: {
      light: string;
      main: string;
      dark: string;
      contrastText: string;
    };
    success?: {
      light: string;
      main: string;
      dark: string;
      contrastText: string;
    };
    warning?: {
      light?: string;
      main?: string;
      dark?: string;
      contrastText?: string;
    };
    error?: {
      light: string;
      main: string;
      dark: string;
      contrastText?: string;
    };
    background?: {
      paper: string;
      default: string;
    };
    action?: {
      active: string;
      hover: string;
      hoverOpacity: number;
      selected: string;
      disabled: string;
      disabledBackground: string;
      focus: string;
      focusOpacity: number;
      activatedOpacity: number;
    };
  };
}

export const themesConfig: Record<string, ThemeConfig> = {
  light: {
    palette: {
      mode: 'light',
      divider: '#f0f0f0',
      text: lightPaletteText,
      common: {
        black: 'rgb(17, 24, 39)',
        white: 'rgb(255, 255, 255)',
      },
      primary: {
        light: '#eff6ff',
        main: '#2563eb',
        dark: '#374151',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#f3f4f6',
        main: '#2563eb',
        dark: '#3730a3',
        contrastText: darkPaletteText.primary,
      },
      info: {
        light: '#fafafa',
        main: '#16a34a',
        dark: '#4CAF50',
        contrastText: '#FFF',
      },
      success: {
        light: '#d1fae5',
        main: '#10b981',
        dark: '#047857',
        contrastText: '#FFF',
      },
      warning: {
        light: '#fff4e5',
        main: '#ffb300',
        dark: '#b27500',
        contrastText: '#000',
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
        contrastText: darkPaletteText.primary,
      },
      background: {
        paper: '#FFFFFF',
        default: '#f6f7f9',
      },
      action: {
        active: '#000',
        hover: '#00000008',
        hoverOpacity: 0.08,
        selected: '#00000014',
        disabled: '#00000061',
        disabledBackground: '#0000001f',
        focus: '#0000001f',
        focusOpacity: 0.12,
        activatedOpacity: 0.24,
      },
    },
  },

  dark: {
    palette: {
      mode: 'dark',
      divider: 'rgba(241,245,249,.12)',
      text: darkPaletteText,
      common: {
        black: 'rgb(17, 24, 39)',
        white: 'rgb(255, 255, 255)',
      },
      primary: {
        light: '#64748b',
        main: '#334155',
        dark: '#0f172a',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#818cf8',
        main: '#2563eb',
        dark: '#3730a3',
        contrastText: darkPaletteText.primary,
      },
      info: {
        light: '#4dabf5',
        main: '#1e88e5',
        dark: '#1565c0',
        contrastText: '#FFF',
      },
      success: {
        light: '#66bb6a',
        main: '#43a047',
        dark: '#2e7d32',
        contrastText: '#FFF',
      },
      warning: {
        light: '#ffb74d',
        main: '#f57c00',
        dark: '#e65100',
        contrastText: '#000',
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
        contrastText: darkPaletteText.primary,
      },
      background: {
        paper: '#1e293b',
        default: '#111827',
      },
      action: {
        active: '#fff',
        hover: '#ffffff08',
        hoverOpacity: 0.08,
        selected: '#ffffff14',
        disabled: '#ffffff61',
        disabledBackground: '#ffffff1f',
        focus: '#ffffff1f',
        focusOpacity: 0.12,
        activatedOpacity: 0.24,
      },
    },
  },

  greyDark: {
    palette: {
      mode: 'dark',
      divider: 'rgba(241,245,249,.12)',
      text: darkPaletteText,
      primary: {
        light: '#dee2e9',
        main: '#4e525a',
        dark: '#93979f',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#e2f3ff',
        main: '#64b5f6',
        dark: '#0d47a1',
        contrastText: lightPaletteText.primary,
      },
      success: {
        light: '#d1fae5',
        main: '#10b981',
        dark: '#047857',
        contrastText: '#FFF',
      },
      warning: {
        light: '#fff4e5',
        main: '#ffb300',
        dark: '#b27500',
        contrastText: '#000',
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
      },
      background: {
        paper: '#455a64',
        default: '#263238',
      },
      action: {
        active: '#fff',
        hover: '#ffffff08',
        hoverOpacity: 0.08,
        selected: '#ffffff14',
        disabled: '#ffffff61',
        disabledBackground: '#ffffff1f',
        focus: '#ffffff1f',
        focusOpacity: 0.12,
        activatedOpacity: 0.24,
      },
    },
  },
};

export default themesConfig;
