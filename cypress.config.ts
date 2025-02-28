import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: "7gste3",  // O ID do projeto fornecido pelo Cypress Dashboard
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports', // Diretório onde os relatórios serão salvos
    overwrite: false, // Não sobrescreve relatórios anteriores
    html: true, // Gera relatório em HTML
    json: true, // Gera relatório em JSON
    charts: true, // Habilita gráficos no relatório
  },
  env: {
    baseUrl: 'https://iot-system.rodolfo-silva.com/',
  },
  e2e: {
    setupNodeEvents(on, config) {
      // Plugin do mochawesome
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    baseUrl: 'https://iot-system.rodolfo-silva.com/',
  },
});
