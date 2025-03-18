const config = {
    reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
    use: {
      headless: true,
    },
  };
  
  export default config;
  