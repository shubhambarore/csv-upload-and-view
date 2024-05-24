describe("Initial tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("Sidebar heading exists", () => {
    cy.get('[data-cy="sidebar-title"]').should("exist").should("have.text", "CSV Viewer");
  });

  it("Select file to view content message exists on baseurl", () => {
    cy.get('[data-cy="select-file-message"]')
      .should("exist")
      .should("have.text", "Select a file to view content");
  });

  it("Icon with select file to view exists", () => {
    cy.get('[data-cy="select-file-icon"]').should("exist");
  });

  it("Create table button exists", () => {
    cy.get('[data-cy="create-table-button"]')
      .should("exist")
      .should("have.text", "Create Table")
      .within(() => {
        cy.get("svg").should("have.class", "MuiSvgIcon-root");
      });
  });

  it('opens a modal or interface to create a table when clicking the "Create Table" button', () => {
    cy.get("[data-cy=create-table-button]").click();
    cy.get("#create-table-modal")
      .should("be.visible")
      .within(() => {
        cy.get('[data-cy="modal-heading"]').should("exist").should("have.text", "Upload CSV");
        cy.get('[data-cy="modal-description"]')
          .should("exist")
          .should("have.text", "Drag and Drop the csv file that you want to view");
      });
  });

  it("Drops a file into the dropzone", () => {
    cy.get("[data-cy=create-table-button]").click();
    cy.get("input[type=file]").selectFile("test.csv", { force: true });

    cy.intercept("POST", "http://5.161.210.217:3000/table").as("createTableAPI");

    // Wait for the API call to be made and respond
    let tableId;
    let uploadCount = 0;
    cy.wait("@createTableAPI").then((interception) => {
      expect(interception.response.body).to.have.property("tableId").that.is.a("string");
      tableId = interception.response.body.tableId;
      cy.intercept("POST", `http://5.161.210.217:3000/table/${tableId}`).as("uploadRecordsAPI");
      cy.wait("@uploadRecordsAPI").then((interception) => {
        expect(interception.response.body).to.have.property("inserted").that.is.a("number");
      });
    });
  });
});
