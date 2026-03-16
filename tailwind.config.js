/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        hongling: { DEFAULT: '#1E3A5F', accent: '#BA7517' },
        jay: { DEFAULT: '#BA7517', accent: '#EF9F27' },
        jayson: { DEFAULT: '#3B6D11', accent: '#639922' },
        jiao: { DEFAULT: '#185FA5', accent: '#993556' },
      },
    },
  },
  plugins: [],
}
