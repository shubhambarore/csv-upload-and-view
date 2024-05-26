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

    let tableId;
    cy.wait("@createTableAPI").then((interception) => {
      expect(interception.response.body).to.have.property("tableId").that.is.a("string");
      tableId = interception.response.body.tableId;
      cy.intercept("POST", `http://5.161.210.217:3000/table/${tableId}`).as("uploadRecordsAPI");
      cy.wait("@uploadRecordsAPI").then((interception) => {
        expect(interception.response.body).to.have.property("inserted").that.is.a("number");
      });
    });
  });

  it("Cancel file upload on cance button click", () => {
    cy.get("[data-cy=create-table-button]").click();
    cy.get("input[type=file]").selectFile("test.csv", { force: true });

    cy.intercept("POST", `http://5.161.210.217:3000/table`).as("createTableAPI");

    cy.wait("@createTableAPI").then((interception) => {
      const tableId = interception.response.body.tableId;

      cy.intercept("POST", `http://5.161.210.217:3000/table/${tableId}`).as("uploadRecordsAPI");

      cy.get("#cancel-upload-button").click();
      cy.get("@uploadRecordsAPI.all").should("have.length", 0);
    });
  });

  it("Click on back button to again view file uploader", () => {
    cy.get("[data-cy=create-table-button]").click();
    cy.get("input[type=file]").selectFile("test.csv", { force: true });

    cy.intercept("POST", `http://5.161.210.217:3000/table`).as("createTableAPI");

    cy.wait("@createTableAPI").then((interception) => {
      const tableId = interception.response.body.tableId;

      cy.intercept("POST", `http://5.161.210.217:3000/table/${tableId}`).as("uploadRecordsAPI");

      cy.get("#cancel-upload-button").click();
      cy.get("@uploadRecordsAPI.all").should("have.length", 0);
      cy.get("#modal-back-button").should("exist").should("be.visible").click();
      cy.get("#dropzone-file").should("exist").should("be.visible");
    });
  });

  it("Navigates to the created table view", () => {
    cy.get("[data-cy=create-table-button]").click();
    cy.get("input[type=file]").selectFile("test.csv", { force: true });

    cy.intercept("POST", `http://5.161.210.217:3000/table`).as("createTableAPI");

    cy.wait("@createTableAPI").then((interception) => {
      expect(interception.response.body).to.have.property("tableId").that.is.a("string");
      const tableId = interception.response.body.tableId;

      cy.intercept("POST", `http://5.161.210.217:3000/table/${tableId}`).as("uploadRecordsAPI");

      for (let i = 0; i < 9; i++) {
        cy.wait("@uploadRecordsAPI").then((interception) => {
          console.log(`Upload Response ${i + 1}:`, interception.response.body);

          if (i === 8) {
            cy.get("#view-file-button").click();
            cy.url().should("include", `/view-table/${tableId}`);
          }
        });
      }
    });
  });

  it("Check table data is fetched when user is on view-table/tableId page", () => {
    // cy.get("[data-cy=create-table-button]").click();
    // cy.get("input[type=file]").selectFile("test.csv", { force: true });

    // cy.intercept("POST", `http://5.161.210.217:3000/table`).as("createTableAPI");
    // cy.wait("@createTableAPI").then((interception) => {
    //   expect(interception.response.body).to.have.property("tableId").that.is.a("string");
    //   const tableId = interception.response.body.tableId;

    //   cy.intercept("POST", `http://5.161.210.217:3000/table/${tableId}`).as("uploadRecordsAPI");
    //   cy.intercept("GET", `http://5.161.210.217:3000/table/${tableId}?page=1`).as(
    //     "fetchTableDataAPI"
    //   );

    cy.get("[data-cy=create-table-button]").click();
    cy.get("input[type=file]").selectFile("test.csv", { force: true });

    cy.intercept("POST", `http://5.161.210.217:3000/table`).as("createTableAPI");

    cy.wait("@createTableAPI").then((interception) => {
      expect(interception.response.body).to.have.property("tableId").that.is.a("string");
      const tableId = interception.response.body.tableId;

      cy.intercept("POST", `http://5.161.210.217:3000/table/${tableId}`).as("uploadRecordsAPI");
      cy.intercept("GET", `http://5.161.210.217:3000/table/${tableId}?page=1`).as(
        "fetchTableDataAPI"
      );

      for (let i = 0; i < 9; i++) {
        cy.wait("@uploadRecordsAPI").then((interception) => {
          if (i === 8) {
            cy.get("#view-file-button").click();
            cy.url().should("include", `/view-table/${tableId}`);

            cy.wait("@fetchTableDataAPI").then((interception) => {
              expect(interception.response.body).to.have.property("page").that.is.a("number");
              expect(interception.response.body).to.have.property("records").that.is.an("array");
              expect(interception.response.body).to.have.property("totalPages").that.is.a("number");
            });
          }
        });
      }
    });
  });
});
