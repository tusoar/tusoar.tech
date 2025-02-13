// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
// Site title and description
export const SITE_LANG = "en";
export const SITE_TAB = "tusoar";
export const SITE_TITLE = "tusoar's blog";
export const SITE_DESCRIPTION = "tusoar's blog";
export const DATE_FORMAT = "Wed Sep 11 2024";

// User profile information
export const USER_SITE = "https://frosti.saroprock.com"; // At the same time, this is also the site retrieved by the i18n configuration.
export const USER_NAME = "tusoar";
export const USER_AVATAR = "/avater.png";

// Server and transition settings
export const SERVER_URL = "https://tusoar.tech";

// Theme settings
export const DAISYUI_THEME = {
  light: "winter",
  dark: "dracula",
};
export const CODE_THEME = {
  light: "github-light",
  dark: "github-dark",
};

// Menu items for navigation
export const menuItems = [
  { id: "home", text: "Home", href: "/", svg: "material-symbols:home-outline-rounded", target: "_self" }, // Home page
  { id: "about", text: "About", href: "/about", svg: "material-symbols:info-outline-rounded", target: "_self" }, // About page
  {
    id: "blog",
    text: "Blogs",
    href: "/blog",
    svg: "material-symbols:book-2-outline-rounded",
    target: "_self",
    subItems: [
      {
        id: "all",
        text: "All blogs",
        href: "/blog",
        svg: "material-symbols:ink-pen-outline-rounded",
        target: "_self",
      }, // All blog
      {
        id: "tech",
        text: "Tech blogs",
        href: "/blog/categories/tech",
        svg: "material-symbols:deployed-code-outline",
        target: "_self",
      }, // Technology category
      {
        id: "life",
        text: "Life blogs",
        href: "/blog/categories/life",
        svg: "material-symbols:earthquake-rounded",
        target: "_self",
      }, // Life category
    ],
  },
  {
    id: "friend",
    text: "Friend",
    href: "/friend",
    svg: "material-symbols:supervisor-account-outline-rounded",
    target: "_self",
  }, // Friend page
  {
    id: "contact",
    text: "Contact",
    href: "mailto:imsoartu@gmail.com", // Contact email
    target: "_blank", // Open in a new tab
    svg: "material-symbols:attach-email-outline-rounded",
  },

];

// Social media and contact icons
export const socialIcons = [

  {
    href: "https://x.com/soar_tu",
    ariaLabel: "Twitter",
    title: "Twitter",
    svg: "ri:twitter-line",
  },
  {
    href: "https://github.com/tusoar",
    ariaLabel: "Github",
    title: "Github",
    svg: "ri:github-line",
  },
  {
    href: "https://zeroday.hitcon.org/user/tusoar",
    ariaLabel: "Hitcon",
    title: "Hitcon",
    svg: "ri:terminal-box-line",
  }


];
