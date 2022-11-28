let petID = "";

describe("testing pet store api / pets", () => {
  it("get inventory and check how many pets with status available are there", () => {
    cy.request({
      method: "GET",
      url: "https://petstore.swagger.io/v2/store/inventory",
      headers: {
        Authorisation: "special-key",
      },
    }).then((response) => {
      expect(response.status).equal(200);
      cy.log(response.body.available);
    });
  });
  it("post - add new pet to the store, and check if pet is created", () => {
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
      cy.request({
        method: "GET",
        url: "https://petstore.swagger.io/v2/pet/111",
        headers: {
          Authorisation: "special-key",
        },
      }).then((response) => {
        expect(response.status).equal(200);
        cy.log(response.body.name);
      });
    });
  });
  it("put - update an existing pet in the store, and check if pet status is updated", () => {
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
        status: "sold",
      },
    }).then((response) => {
      expect(response.status).equal(200);
      expect(response.body.status).to.equal("sold");
    });
  });
  it("get - find pets by status, and check their number", () => {
    cy.request({
      method: "GET",
      url: "http://petstore.swagger.io/v2/pet/findByStatus?status=pending",
      headers: {
        Authorisation: "special-key",
      },
    }).then((response) => {
      expect(response.status).equal(200);
      cy.log(response.body[0].id);
    });
  });
  it("get - finds pet by id, and check if its the right pet by name ", () => {
    cy.request({
      method: "GET",
      url: "http://petstore.swagger.io/v2/pet/111",
      headers: {
        Authorisation: "special-key",
      },
    }).then((response) => {
      expect(response.body.name).equal("Leksi");
    });
  });
  it("delete - deletes a pet from the store, and check if the pet is deleted", () => {
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
      cy.request({
        method: "GET",
        url: "http://petstore.swagger.io/v2/pet/111",
        failOnStatusCode: false,
        headers: {
          Authorisation: "special-key",
        },
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
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

describe("testing pet store api / users", () => {
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
  it("test - check if user can login with empty credentials", () => {
    cy.request({
      method: "GET",
      url: "https://petstore.swagger.io/v2/user/login?username=null&password=null'",
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

describe("testing pet store api / store", () => {
  it("test - check if user can place new order", () => {
    cy.request({
      method: "POST",
      url: "https://petstore.swagger.io/v2/store/order",
      headers: {
        Authorisation: "special-key",
      },
      body: {
        id: 7,
        petId: 1111,
        quantity: 1,
        shipDate: "2022-11-28T10:38:59.562Z",
        status: "placed",
        complete: true,
      },
    }).then((response) => {
      expect(response.status).equal(200);
      expect(response.body.status).equal("placed");
    });
  });
  it("test - check open order", () => {
    cy.request({
      method: "GET",
      url: "https://petstore.swagger.io/v2/store/order/7",
      headers: {
        Authorisation: "special-key",
      },
    }).then((response) => {
      expect(response.body.status).equal("placed");
    });
  });
  it("test - check delete order", () => {
    cy.request({
      method: "DELETE",
      url: "https://petstore.swagger.io/v2/store/order/7",
      headers: {
        Authorisation: "special-key",
      },
    }).then((response) => {
      expect(response.status).equal(200);
      cy.request({
        method: "GET",
        url: "https://petstore.swagger.io/v2/store/order/7",
        failOnStatusCode: false,
        headers: {
          Authorisation: "special-key",
        },
      }).then((response) => {
        expect(response.status).equal(404);
        cy.log(response.body.message);
      });
    });
  });
});
