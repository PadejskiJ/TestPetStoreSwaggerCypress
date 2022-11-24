module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      //cypress-mochawesome-reporter
    },
  },
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "reporter-config.json",
  },
};
