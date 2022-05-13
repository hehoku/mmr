module.exports = {
  plugins: [
    require('prettier-plugin-tailwindcss'),
    require('prettier-standard'),
  ],
  overrides: [
    {
      files: '**/*.{js,jsx,ts,tsx}',
      options: {
        singleQuote: true,
        semi: false,
        arrowParens: 'avoid',
      },
    },
  ],
}
