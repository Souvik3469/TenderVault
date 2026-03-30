/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
        // Navigation / dark surfaces
        navy: {
          800: "#1e293b",
          900: "#0f172a",
        },
        // Status — tender lifecycle
        status: {
          draft:     "#f59e0b",
          open:      "#16a34a",
          closed:    "#0284c7",
          awarded:   "#7c3aed",
          cancelled: "#dc2626",
        },
        // Legacy aliases (used in existing classes)
        theme:      "#27ac1f",
        primary:    "#12181e",
        background: "#f1f5f9",
      },
      fontFamily: {
        mont:  ["Montserrat", "sans-serif"],
        merri: ["Merriweather", "serif"],
        comf:  ["Comfortaa", "cursive"],
        right: ["Righteous", "cursive"],
        sans:  ["Montserrat", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card:  "0 1px 3px 0 rgba(0,0,0,.07), 0 1px 2px -1px rgba(0,0,0,.07)",
        "card-hover": "0 4px 12px 0 rgba(0,0,0,.12), 0 2px 4px -1px rgba(0,0,0,.06)",
        modal: "0 20px 60px -12px rgba(0,0,0,.3)",
      },
      borderRadius: {
        xl2: "1rem",
        xl3: "1.25rem",
      },
      animation: {
        "fade-in":   "fadeIn .2s ease-out",
        "slide-up":  "slideUp .25s ease-out",
        "spin-slow": "spin 1.4s linear infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(8px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
