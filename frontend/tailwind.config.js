export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        accent: '#3B82F6',
        teal: '#0EA5E9',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        night: '#0F172A',
        dark2: '#1E293B',
      },
      fontFamily: {
        syne: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: []
}
