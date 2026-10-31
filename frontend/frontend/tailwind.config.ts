import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          soft: "var(--primary-soft)",
        },
        onPrimary: "var(--on-primary)",
        warning: {
          DEFAULT: "var(--warning)",
          bg: "var(--warning-bg)",
        },
        success: {
          DEFAULT: "var(--success)",
          bg: "var(--success-bg)",
        },
        error: {
          DEFAULT: "var(--error)",
          bg: "var(--error-bg)",
        },
      },
      keyframes: {
        'neon-star': {
          '0%': {
            transform: 'translateY(0) scale(0.8)',
            opacity: '0',
          },
          '10%': {
            opacity: '1',
            transform: 'translateY(10vh) scale(1)',
          },
          '90%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(110vh) scale(0.6)',
            opacity: '0',
          },
        },
        'twinkle-core': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.8',
          },
          '50%': {
            transform: 'scale(1.3)',
            opacity: '1',
          },
        },
        'pulse-slow': {
          '0%, 100%': {
            opacity: '0.6',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.1)',
          },
        },
      },
      animation: {
        'neon-star': 'neon-star linear infinite',
        'twinkle-core': 'twinkle-core 1.5s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;