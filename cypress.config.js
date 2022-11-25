module.exports = {
  env: {
    apiUrl: "https://petstore.swagger.io/v2/swagger.json",
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      //cypress-mochawesome-reporter
      baseUrl: "https://localhost:4200/";
      ignoreTestFiles: "**/examples/*";
      viewportHeight: 1080;
      viewportWidth: 1920;
      video: false;
      reporter: "cypress-multi-reporters";
      reporterOptions: {
        configFile: "reporter-config.json";
      }
    },
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      configFile: "reporter-config.json",
    },
  },
};
