import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --brand-bg-green: #edf2f0;
    --brand-dark-red: #d63c5e;
    --brand-light-green: #6da886;
    --brand-black: #212529;
    /* Colors from Figma  */
    --brand-cool-background: #d5d7e0;
    --brand-cool-border: rgb(189, 192, 207);
    --brand-cool-dark-text: #151c3b;
    --brand-cool-light-text: #79809c;
    --brand-cool-accent: #e9ebf3;
    --brand-warm-background: #d5d7e0;
    --brand-warm-border: rgb(207, 189, 186);
    --brand-warm-dark-text: #221b1a;
    --brand-warm-light-text: #8f7e7c;
    --brand-warm-accent: #f9f1f1;
    --brand-gray-dark-text: #14161b;
    --brand-gray-border: #e2e3eb;
    --brand-gray-background: #f4f4f8;
    --brand-gray-light-text: #8c8d92;
    --brand-gray-light-text-translucent: rgb(140, 141, 146, 0.1);
    --brand-gray-hover: #fafafb;
    --brand-color-red: #e40536;
    --brand-color-blue: #4965f0;
    --brand-color-green: #43b369;
    --brand-color-red-translucent: rgba(214, 60, 94, 0.1);
    --brand-color-blue-translucent: rgba(73, 101, 240, 0.1);
    --brand-color-green-translucent: rgba(67, 179, 105, 0.1);
    --game-title-lg: 4.25rem;
    --game-title: 3rem;
  }
  
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: rgb(213, 215, 225);
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  .__react_component_tooltip.show {
    opacity: 1 !important;
  }

  /* Load custom fonts */
  @font-face {
    font-family: 'Londrina Solid';
    src: url(/fonts/Londrina_Solid/LondrinaSolid-Black.ttf);
    src: url(/fonts/Londrina_Solid/LondrinaSolid-Regular.ttf);
  }
  @font-face {
    font-family: 'PT Root UI';
    src: url(/fonts/PT_Root_UI/PT-Root-UI_Regular.woff2) format('woff2'),
    url(/fonts/PT_Root_UI/PT-Root-UI_Regular.woff) format('woff');
  }
  @font-face {
    font-family: 'PT Root UI';
    font-weight: 500;
    src: url(/fonts/PT_Root_UI/PT-Root-UI_Medium.woff2) format('woff2'),
    url(/fonts/PT_Root_UI/PT-Root-UI_Medium.woff) format('woff');
  }

  @font-face {
    font-family: 'PT Root UI';
    font-weight: bold;
    src: url(/fonts/PT_Root_UI/PT-Root-UI_Bold.woff2) format('woff2'),
    url(/fonts/PT_Root_UI/PT-Root-UI_Bold.woff) format('woff');
  }
`;
