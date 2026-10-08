import { defineConfig } from "cypress"

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://127.0.0.1:5173",
    supportFile: false,
    video: false,
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
    indexHtmlFile: "cypress/support/component-index.html",
    video: false,
  },
})
