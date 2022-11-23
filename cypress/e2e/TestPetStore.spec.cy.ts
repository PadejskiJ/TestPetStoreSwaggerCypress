let petID = "";

describe("pet store swagger api", () => {
  it("get inventory", () => {
    cy.request({
      method: "GET",
      url: "https://petstore.swagger.io/v2/store/inventory",
      headers: {
        Authorisation: "special-key",
      },
    }).then((response) => {
      expect(response.status).equal(200);
    });
  });
  //how to add photo?
  it("post - add pet photo", () => {
    cy.request({
      method: "POST",
      url: "https://petstore.swagger.io/v2/pet/111/uploadImage",
      headers: {
        Authorisation: "special-key",
      },
      body: {
        petID: "111",
        additionalMetadata: "dogie",
        file: "doggie.jpg",
        content: "pic",
        "image/png": "jpg",
        schema: "",
        type: "string",
        format: "binary",
      },
    }).then((response) => {
      expect(response.status).equal(200);
    });
  });

  it("post - add new pet to the store", () => {
    cy.request({
      method: "POST",
      url: "https://petstore.swagger.io/v2/pet",
      headers: {
        Authorisation: "special-key",
      },
      body: {
        id: 111,
        category: {
          id: 101,
          name: "dog",
        },
        name: "leksi",
        photoUrls: ["string"],
        tags: [
          {
            id: 1,
            name: "dog",
          },
        ],
        status: "available",
      },
    }).then((response) => {
      expect(response.status).equal(200);
    });
  });

  it("put - update an existing pet in the store", () => {
    cy.request({
      method: "PUT",
      url: "https://petstore.swagger.io/v2/pet",
      headers: {
        Authorisation: "special-key",
      },
      body: {
        id: 111,
        category: {
          id: 101,
          name: "doggie",
        },
        name: "Leksi",
        photoUrls: ["string"],
        tags: [
          {
            id: 1,
            name: "dog",
          },
        ],
        status: "available",
      },
    }).then((response) => {
      expect(response.status).equal(200);
    });
  });

  it("get - finds pets by status", () => {
    cy.request({
      method: "GET",
      url: "http://petstore.swagger.io/v2/pet/findByStatus?status=pending",
      headers: {
        Authorisation: "special-key",
      },
    }).then((response) => {
      expect(response.status).equal(200);
    });
  });

  it("get - finds pet by id", () => {
    cy.request({
      method: "GET",
      url: "http://petstore.swagger.io/v2/pet/111",
      headers: {
        Authorisation: "special-key",
      },
    }).then((response) => {
      expect(response.status).equal(200);
    });
  });
  //should be put, because test updates a pet, but when corrected, doesnt run good the next test?
  it("post - updates a pet in the store with form data", () => {
    cy.request({
      method: "POST",
      url: "https://petstore.swagger.io/v2/pet/111",
      headers: {
        Authorisation: "special-key",
      },
      body: {
        id: 111,
        category: {
          id: 101,
          name: "dog",
        },
        name: "leksi",

        tags: [
          {
            id: 1,
            name: "dog",
          },
        ],
        status: "sold",
      },
    }).then((response) => {
      expect(response.status).equal(405);
    });
  });
  it("delete - deletes a pet from the store", () => {
    cy.request({
      method: "DELETE",
      url: "https://petstore.swagger.io/v2/pet/111",
      headers: {
        Authorisation: "special-key",
      },
      body: {
        id: 111,
        category: {
          id: 101,
          name: "dog",
        },
        name: "leksi",
        photoUrls: ["string"],
        tags: [
          {
            id: 1,
            name: "dog",
          },
        ],
        status: "sold",
      },
    }).then((response) => {
      expect(response.status).equal(200);
    });
  });
});
