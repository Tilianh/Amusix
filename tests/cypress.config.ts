import { vitePreprocessor } from 'cypress-vite';
import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', vitePreprocessor());
      return config;
    },
    screenshotOnRunFailure: false,
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts'
  }
});
