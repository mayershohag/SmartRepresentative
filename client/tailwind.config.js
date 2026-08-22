/** @type {import('tailwindcss').Config} */
module.exports = {
      content: [
            "./app/**/*.{js,jsx}",
            "./components/**/*.{js,jsx}",
      ],
      theme: {
            extend: {
                  fontFamily: {
                        display: ["Space Grotesk", "sans-serif"],
                        body: ["Inter", "sans-serif"],
                        mono: ["JetBrains Mono", "monospace"],
                  },
                  colors: {
                        void: "#0F0B1E",
                        panel: "#1A1330",
                        thread: {
                              pink: "#EC4899",
                              violet: "#8B5CF6",
                              blue: "#3B82F6",
                        },
                  },
                  backdropBlur: {
                        xs: "2px",
                  },
            },
      },
      plugins: [],
};