/// <reference types= "cypress" />

const getHeaders = {
  Authorisation: "special-key",
};

describe(
  "testing pet store api / pets",
  { baseUrl: "https://petstore.swagger.io/v2" },
  () => {
    it("get inventory and check how many pets with status available are there", () => {
      cy.request({
        method: "GET",
        url: "/store/inventory",
        headers: getHeaders,
      }).then((response) => {
        expect(response.status).equal(200);
        cy.log(response.body.available);
      });
    });
    it("post - add new pet to the store, and check if pet is created", () => {
      cy.request({
        method: "POST",
        url: "/pet",
        headers: getHeaders,
        body: {
          id: 111,
          name: "leksi",
          status: "available",
        },
      }).then((response) => {
        expect(response.status).equal(200);
        cy.request({
          method: "GET",
          url: "/pet/111",
          headers: getHeaders,
        }).then((response) => {
          expect(response.status).equal(200);
          cy.log(response.body.name);
        });
      });
    });
    it("put - update an existing pet in the store, and check if pet status is updated", () => {
      cy.request({
        method: "PUT",
        url: "/pet",
        headers: getHeaders,
        body: {
          id: 111,
          name: "Leksi",
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
        url: "/pet/findByStatus?status=pending",
        headers: getHeaders,
      }).then((response) => {
        expect(response.status).equal(200);
        cy.log(response.body[0].id);
      });
    });
    it("get - finds pet by id, and check if its the right pet by name ", () => {
      cy.request({
        method: "GET",
        url: "/pet/111",
        headers: getHeaders,
      }).then((response) => {
        expect(response.body.name).equal("Leksi");
      });
    });
    it("delete - deletes a pet from the store, and check if the pet is deleted", () => {
      cy.request({
        method: "DELETE",
        url: "/pet/111",
        headers: getHeaders,
        body: {
          id: 111,
          name: "leksi",
          status: "sold",
        },
      }).then((response) => {
        expect(response.status).equal(200);
        cy.request({
          method: "GET",
          url: "/pet/111",
          failOnStatusCode: false,
          headers: getHeaders,
        }).then((response) => {
          expect(response.status).to.equal(404);
        });
      });
    });
    it("test - check inventory before and after pet is added", () => {
      cy.request({
        method: "GET",
        url: "/store/inventory",
        headers: getHeaders,
      }).then((response) => {
        expect(response.status).equal(200);
        cy.log(JSON.stringify(response));
        const petsAvailable = response.body.available;
        cy.log(petsAvailable);
        cy.request({
          method: "POST",
          url: "/pet",
          headers: getHeaders,
          body: {
            id: null,
            name: "leksi",
            status: "available",
          },
        }).then(() => {
          cy.request({
            method: "GET",
            url: "/store/inventory",
            headers: getHeaders,
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
        url: "/pet",
        headers: getHeaders,
        body: {
          id: 1111,
          name: "Max",
          status: "available",
        },
      }).then((response) => {
        // cheking dogs status
        expect(response.body.status).to.equal("available");
        cy.log(JSON.stringify(response));
        // selling the dog - changing dogs status
        cy.request({
          method: "POST",
          url: "/pet",
          headers: getHeaders,
          body: {
            id: 1111,
            name: "Max",
            status: "sold",
          },
        }).then(() => {
          // cheking dogs status
          cy.request({
            method: "GET",
            url: "/pet/1111",
            headers: getHeaders,
          }).then((response) => {
            expect(response.body.status).to.equal("sold");
          });
        });
      });
    });
  }
);

describe(
  "testing pet store api / users",
  { baseUrl: "https://petstore.swagger.io/v2/user" },
  () => {
    it("test - create user in the store, and verify user is created by finding user by username", () => {
      cy.request({
        method: "POST",
        url: "",
        headers: getHeaders,
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
          url: "/jeca",
          headers: getHeaders,
        }).then((response) => {
          expect(response.body.username).equal("jeca");
        });
      });
    });
    it("test - check if user can login with valid credentials", () => {
      cy.request({
        method: "GET",
        url: "/login?username=jeca&password=pet'",
        headers: getHeaders,
      }).then((response) => {
        cy.log(response.body.message);
        expect(response.status).equal(200);
      });
    });
    it("test - check if user can login with invalid credentials", () => {
      cy.request({
        method: "GET",
        url: "/login?username=jeca&password=hmmmmm'",
        headers: getHeaders,
      }).then((response) => {
        cy.log(response.body.message);
        expect(response.status).equal(400);
        expect(response.statusText).equal("Invalid username/password supplied");
      });
    });
    it("test - check if user can login with empty credentials", () => {
      cy.request({
        method: "GET",
        url: "/login?username=null&password=null'",
        headers: getHeaders,
      }).then((response) => {
        cy.log(response.body.message);
        expect(response.status).equal(400);
        expect(response.statusText).equal("Invalid username/password supplied");
      });
    });
  }
);

describe(
  "testing pet store api / store",
  { baseUrl: "https://petstore.swagger.io/v2/store" },
  () => {
    it("test - check if user can place new order", () => {
      cy.request({
        method: "POST",
        url: "/order",
        headers: getHeaders,
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
        url: "/order/7",
        headers: getHeaders,
      }).then((response) => {
        expect(response.body.status).equal("placed");
      });
    });
    it("test - check delete order", () => {
      cy.request({
        method: "DELETE",
        url: "/order/7",
        headers: getHeaders,
      }).then((response) => {
        expect(response.status).equal(200);
        cy.request({
          method: "GET",
          url: "/order/7",
          failOnStatusCode: false,
          headers: getHeaders,
        }).then((response) => {
          expect(response.status).equal(404);
          cy.log(response.body.message);
        });
      });
    });
  }
);

//check if you can create user that already exists
//check if you can delete nonexisting user
//updating user with invalid data
//missing Autorisation data
