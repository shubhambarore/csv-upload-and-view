// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

Cypress.Commands.add("attachFile", { prevSubject: "element" }, (subject, file, options = {}) => {
  cy.log(`Uploading file: ${file}`);
  if (subject) {
    return cy
      .wrap(subject)
      .trigger("dragover", { force: true })
      .trigger(
        "drop",
        { dataTransfer: { files: [Cypress.Buffer.from(file).toString()] } },
        { force: true }
      );
  }
  return cy
    .get(subject)
    .trigger("dragover", { force: true })
    .trigger(
      "drop",
      { dataTransfer: { files: [Cypress.Buffer.from(file).toString()] } },
      { force: true }
    );
});
