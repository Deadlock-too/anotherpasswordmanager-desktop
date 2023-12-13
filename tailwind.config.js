const defaultThemes = require('daisyui/src/theming/themes')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ['./src/**/**/**/*.{js,jsx,ts,tsx}'],
  theme: {},
  variants: {},
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...defaultThemes['light'],
          "primary": "#4a00ff",
          "secondary": "#ff00d3",
          "secondary-content": "#fff8fd",
          "accent": "#00d7c0",
          "base-100": "#ffffff",
        }
      },
      {
        aqua: {
          ...defaultThemes['aqua'],
          "error": "#ff7265",
        }
      },
      'black',
      {
        bumblebee: {
          ...defaultThemes['bumblebee'],
          "primary": "#ffd900",
          "primary-content": "#4c4528",
          "secondary": "#ffa400",
          "secondary-content": "#5d3f18",
          "accent": "#ffa551",
          "neutral": "#060023",
          "base-100": "#ffffff",
        }
      }, {
        cmyk: {
          ...defaultThemes['cmyk'],
          "base-100": "#ffffff",
        }
      }, {
        corporate: {
          ...defaultThemes['corporate'],
          "primary": "#4d6eff",
          "base-100": "#ffffff",
        }
      },
      'cupcake',
      {
        cyberpunk: {
          ...defaultThemes['cyberpunk'],
          "primary": "#ff6596",
          "secondary": "#00e8ff",
          "accent": "#ce74ff",
          "neutral": "#111a3b",
          "neutral-content": "#fff248",
          "base-100": "#fff248",
        }
      }, {
        dark: {
          ...defaultThemes['dark'],
          "primary": "#7480ff",
          "secondary": "#ff52d9",
          "accent": "#00cdb7",
        }
      }, 'dracula', {
        emerald: {
          ...defaultThemes['emerald'],
          "base-100": "#ffffff",
        }
      }, {
        fantasy: {
          ...defaultThemes['fantasy'],
          "primary": "#6d0076",
          "secondary": "#0075c2",
          "accent": "#ff8600",
          "base-100": "#ffffff",
        }
      }, 'forest', {
        garden: {
          ...defaultThemes['garden'],
          "primary": "#fe0075",
        }
      }, {
        halloween: {
          ...defaultThemes['halloween'],
          "primary": "#ff8f00",
          "secondary": "#7a00c2",
          "accent": "#42aa00",
          "error": "#f35248",
        }
      }, {
        lofi: {
          ...defaultThemes['lofi'],
          "primary-content": "#ffffff",
          "secondary-content": "#ffffff",
          "accent-content": "#ffffff",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "info": "#5fcfdd",
          "success": "#69fec3",
          "warning": "#ffce69",
          "error": "#ff9181",
        }
      }, {
        luxury: {
          ...defaultThemes['luxury'],
          "primary": "#ffffff",
        }
      }, {
        pastel: {
          ...defaultThemes['pastel'],
          "base-100": "#ffffff",
        }
      }, {
        retro: {
          ...defaultThemes['retro'],
          "error": "#f35248",
        }
      }, {
        synthwave: {
          ...defaultThemes['synthwave'],
          "accent": "#ffd200",
        }
      }, {
        valentine: {
          ...defaultThemes['valentine'],
          "error": "#ff675b",
        }
      }, {
        wireframe: {
          ...defaultThemes['wireframe'],
          "base-100": "#ffffff",
        }
      }, {
        autumn: {
          ...defaultThemes['autumn'],
          "error": "#d40014",
        }
      }, 'business', {
        acid: {
          ...defaultThemes['acid'],
          "primary": "#ff00ff",
          "secondary": "#ff6e00",
          "accent": "#c8ff00",
          "neutral": "#140151",
          "info": "#007fff",
          "success": "#00ff8a",
          "warning": "#ffe200",
          "error": "#ff0000",
        }
      }, {
        lemonade: {
          ...defaultThemes['lemonade'],
          "primary": "#419400",
          "secondary": "#bdc000",
          "accent": "#edd000",
          "neutral": "#343300",
          "base-100": "#f8fdef",
          "info": "#b1d9e9",
          "success": "#b9dbc6",
          "warning": "#d7d3b0",
          "error": "#efc6c2",
        }
      }, 'night', 'coffee', {
        winter: {
          ...defaultThemes['winter'],
          "primary": "#0069ff",
          "base-100": "#ffffff",
        }
      }, 'dim', 'nord', {
        sunset: {
          ...defaultThemes['sunset'],
          "neutral": "#1b262c",
          "neutral-content": "#94a0a9",
          "base-200": "#0e171e",
          "base-300": "#091319",
        },
      }
    ]
  }
}