/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        background: "#F8FAFC",
        surface: "#FFFFFF",
        textPrimary: "#0F172A",
        textSecondary: "#64748B"
      },
      borderRadius: {
        card: "12px",
        input: "8px"
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};
