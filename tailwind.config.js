module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],


  theme: {
    extend: {
      animation: {
        pingSlow: 'ping 4s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
}
