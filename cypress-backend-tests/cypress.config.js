// const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   e2e: {
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// });

module.exports = {
  e2e: {
    baseUrl: 'http://localhost:8000', // Replace with your backend API base URL
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000
  }
}
