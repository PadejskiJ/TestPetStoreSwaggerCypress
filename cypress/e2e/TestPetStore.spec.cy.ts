let petID = "";

describe("pets - pet store swagger api", () => {
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
          id: 0,
          name: "dog",
        },
        name: "leksi",
        photoUrls: ["string"],
        tags: [
          {
            id: 0,
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
          id: 0,
          name: "dog",
        },
        name: "leksi",
        tags: [
          {
            id: 0,
            name: "dog",
          },
        ],
        status: "sold",
      },
    }).then((response) => {
      expect(response.status).equal(200);
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
  it("test - check inventory before and after pet is added", () => {
    cy.request({
      method: "GET",
      url: "https://petstore.swagger.io/v2/store/inventory",
      headers: {
        Authorisation: "special-key",
      },
    }).then((response) => {
      expect(response.status).equal(200);
      cy.log(JSON.stringify(response));
      const petsAvailable = response.body.available;
      cy.log(petsAvailable);
      cy.request({
        method: "POST",
        url: "https://petstore.swagger.io/v2/pet",
        headers: {
          Authorisation: "special-key",
        },
        body: {
          id: null,
          category: {
            id: 0,
            name: "dog",
          },
          name: "leksi",
          tags: [
            {
              id: 1,
              name: "dog",
            },
          ],
          status: "available",
        },
      }).then(() => {
        cy.request({
          method: "GET",
          url: "https://petstore.swagger.io/v2/store/inventory",
          headers: {
            Authorisation: "special-key",
          },
        }).then((response) => {
          expect(response.status).equal(200);
          const petsAvailable2 = response.body.available;
          cy.log(petsAvailable2);
          expect(petsAvailable2).to.equal(petsAvailable + 1);
        });
      });
    });
  });
  it("test - check pet status before and after pet is sold", () => {
    //adding a dog "Max" to the store
    cy.request({
      method: "POST",
      url: "https://petstore.swagger.io/v2/pet",
      headers: {
        Authorisation: "special-key",
      },
      body: {
        id: 1111,
        category: {
          id: 0,
          name: "dog",
        },
        name: "Max",
        photoUrls: ["string"],
        tags: [
          {
            id: 0,
            name: "dog",
          },
        ],
        status: "available",
      },
    }).then((response) => {
      // cheking dogs status
      expect(response.body.status).to.equal("available");
      cy.log(JSON.stringify(response));
      // selling the dog - changing dogs status
      cy.request({
        method: "POST",
        url: "https://petstore.swagger.io/v2/pet",
        headers: {
          Authorisation: "special-key",
        },
        body: {
          id: 1111,
          category: {
            id: 0,
            name: "dog",
          },
          name: "Max",
          tags: [
            {
              id: 0,
              name: "dog",
            },
          ],
          status: "sold",
        },
      }).then(() => {
        // cheking dogs status
        cy.request({
          method: "GET",
          url: "https://petstore.swagger.io/v2/pet/1111",
          headers: {
            Authorisation: "special-key",
          },
        }).then((response) => {
          expect(response.body.status).to.equal("sold");
        });
      });
    });
  });
});

describe("users - pet store swagger api", () => {
  it("test - create user in the store, and verify user is created by finding user by username", () => {
    cy.request({
      method: "POST",
      url: "https://petstore.swagger.io/v2/user",
      headers: {
        Authorisation: "special-key",
      },
      body: {
        id: 9,
        username: "jeca",
        firstName: "jelena",
        lastName: "tester",
        email: "jelenat@example.com",
        password: "pet",
        phone: "0123456",
        userStatus: 2,
      },
    }).then((response) => {
      expect(response.status).equal(200);
      cy.request({
        method: "GET",
        url: "https://petstore.swagger.io/v2/user/jeca",
        headers: {
          Authorisation: "special-key",
        },
      }).then((response) => {
        expect(response.body.username).equal("jeca");
      });
    });
  });
  it("test - check if user can login with valid credentials", () => {
    cy.request({
      method: "GET",
      url: "https://petstore.swagger.io/v2/user/login?username=jeca&password=pet'",
      headers: {
        Authorisation: "special-key",
      },
    }).then((response) => {
      cy.log(response.body.message);
      expect(response.status).equal(200);
    });
  });
  it("test - check if user can login with invalid credentials", () => {
    cy.request({
      method: "GET",
      url: "https://petstore.swagger.io/v2/user/login?username=jeca&password=hmmmmm'",
      headers: {
        Authorisation: "special-key",
      },
    }).then((response) => {
      cy.log(response.body.message);
      expect(response.status).equal(400);
      expect(response.statusText).equal("Invalid username/password supplied");
    });
  });
});
