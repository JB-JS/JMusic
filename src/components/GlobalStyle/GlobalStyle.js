import { createGlobalStyle } from 'styled-components'
import './fonts.css'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  :root {
    color-scheme: light dark;
    --red: #ff453a;
    --theme-color: #000;
    --system-primary: rgba(0, 0, 0, .85);
    --system-secondary: rgba(0, 0, 0, .5);
    --sidebar-bg: rgba(60, 60, 67, 0.03);
    --sidebar-border-color: rgba(0, 0, 0, 0.1);
    --sidebar-width: 260px;
    --sidebar-selected-bg: rgba(60, 60, 67, 0.1);
    --divider: rgba(0, 0, 0, 0.15);
    --player-bar-height: 72px;
    --theme-background-color: transparent;
    --searchbox-border-color: #ccc;
    --searchbox-background: #fff;
    --searchbox-icon-fill: rgba(0, 0, 0, .65);
    --searchbox-text-color: #111;
    --profilebox-background: rgba(60, 60, 67, 0.03);
    --player-bg: rgba(255, 255, 255, 1);
    --playlist-shadow-color: rgba(0, 0, 0, .1);
    --sound-progress-bg: #f00;
    --musicItem-even-bg: rgba(0, 0, 0, 0.02);
    --playlist-item-bg: rgba(255, 255, 255, 0.05);
    --tracklist-hover-bg: rgba(0, 0, 0, 0.06);
    --googleBtn-color: #fff; 
    --scrollbar-width: 15px;
    --contextmenu-bg: rgba(246, 246, 246, 0.72)
    
    @media (max-width: 760px) {
      --sidebar-width: 33vw;
    }

  }
  
  @media (prefers-color-scheme: dark) {
    :root {
      --theme-color: #fff;
      --system-primary: rgb(255, 255, 255, 0.85);
      --system-secondary: rgb(255, 255, 255, 0.55);
      --sidebar-bg: rgb(33, 33, 33);
      --sidebar-border-color: rgba(255, 255, 255, 0.1);
      --sidebar-selected-bg: rgba(235, 235, 245, 0.1);
      --primary-color-rgb: 250, 45, 72;
      --theme-background-color: rgb(31, 31, 31);
      --searchbox-border-color: rgb(255, 255, 255, 0.3);
      --searchbox-background: rgb(31, 31, 31);
      --searchbox-text-color: rgb(255, 255, 255, .8);
      --searchbox-icon-fill: #fff;
      --divider: rgba(255, 255, 255, 0.1);
      --profilebox-background: rgba(235, 235, 245, 0.03);
      --player-bg: rgba(45, 45, 45, 0.88);
      --player-title-color: rgb(229, 229, 229);
      --musicItem-even-bg: rgba(255, 255, 255, 0.02);
      --player-content-color: 
      --sound-progress-bg: #fff;
      --tracklist-hover-bg: rgba(255, 255, 255, 0.06);
      --googleBtn-color: #000;
      --contextmenu-bg: rgba(40, 40, 40, 0.7);
      
    }
    .MuiSkeleton-root {
      background-color : rgba(255, 255, 255, 0.13) !important;
    }
  }

  body {
    font-family: -apple-system,BlinkMacSystemFont,"Apple Color Emoji","SF Pro","SF Pro Icons","Helvetica Neue",Helvetica,Arial,sans-serif;
    background: var(--theme-background-color);
    color: var(--system-primary);
  }
  input {
    border: none;
    outline: none;
  }

  ul {
    list-style: none;
  }

  button {
    outline: none;
    border: none;
  }

  textarea {
    font-size: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }


`

export default GlobalStyle
