import { visitgame } from "./utils";

describe("Boozang games", () => {
  it("Speed Game", () => {
    visitgame("Speed Game");

    //Iniciar juego
    cy.get('[data-testid="startBtn"]').click();
    //Esperar
    cy.get(".delete", { timeout: 12000 }).click();
    // Validar
    cy.get('[data-testid="message"]')
      .should("exist")
      .and("have.class", "success_message")
      .and("contain.text", "Success");
  });

  it("Wait Game", () => {
    visitgame("Wait Game");

    //Iniciar juego
    cy.get('[data-testid="startBtn"]').click();

    //Esperar
    cy.wait(5000);

    //Presionar boton
    cy.get(".delete").click();

    // // Validar
    cy.get('[data-testid="message"]')
      .should("exist")
      .and("have.class", "success_message")
      .and("contain.text", "Success");
  });

  it("Yellow or Blue", async () => {
    visitgame("Yellow or Blue");

    //Obtenemos color
    cy.get(".form_btn").click();

    //De la tarjeta del color, obtenemos el texto y presionamos la clase con ese color
    await cy
      .get(".color")
      .invoke("text")
      .then(text => {
        const color = text.trim();
        cy.get(`.${color}`).click();
      });
    // Validar
    cy.get('[data-testid="message"]')
      .should("exist")
      .and("have.class", "success_message")
      .and("contain.text", "Success");
  });

  it("Sorted list (Agregar 2 objetos nuevos a la lista)", async () => {
    visitgame("Sorted list");

    //Esperar a que renderice el elemento
    cy.wait(500);

    // Asegurar espacios en la lista
    cy.get("body").then(async $body => {
      // Checamos si el elemento existe
      if ($body.find('[data-testid="todo"]').length > 0) {
        //Eliminamos si hay mas que 3 elementos
        await cy.get('[data-testid="todo"]').then($todos => {
          const total = $todos.length;
          if (total > 3) {
            const toRemove = total - 3;
            // Repetimos la eliminación las veces necesarias
            for (let i = 0; i < toRemove; i++) {
              cy.get(":nth-child(1) > .icon_btn") // asumiendo que este botón elimina un item
                .click();
              cy.wait(300); // Esperar que refresque el componente
            }
          }
        });
      }
    });

    //Agregar items
    await cy.fixture("listElements.json").then(elements => {
      elements.forEach(element => {
        cy.get("input")
          .clear()
          .type(element);
        cy.get(".form_btn").click();
        cy.wait(300); //esperar a que refresque
      });
    });

    //Validar que se agregaron los items
    await cy.fixture("listElements.json").then(elements => {
      elements.forEach(element => {
        cy.get('[data-testid="todo"]')
          .find("*")
          .contains(element)
          .should("exist");
      });
    });
  });

  
  it("Form Fill (Agregar 2 elementos a la forma utilizando fixtures y validar que se hayan agregado correctamente)", async () => {
    visitgame("Form Fill");

    //Agregamos la informacion
    await cy.fixture("users.json").then(async users => {
      users.forEach(async user => {
        //Agregamos los datos
        cy.get(":nth-child(1) > input")
          .clear()
          .type(user.firstName);
        cy.get(":nth-child(2) > input")
          .clear()
          .type(user.lastName);
        cy.get(":nth-child(3) > input")
          .clear()
          .type(user.email);
        cy.get(":nth-child(4) > input")
          .clear()
          .type(user.password);

        //Mandamos la info
        cy.get(".btn_section > .form_btn").click();
        cy.wait(300);

        cy.get(".save_message", { timeout: 3000 }).should("exist");
      });
    });

    //Validamos que se encuentre en la tabla
    cy.get(".orange").click();
    cy.fixture("users.json").then(async users => {
      users.forEach(async user => {
        cy.get(".print_form")
          .find("*")
          .contains(user.firstName)
          .should("exist");
      });
    });
  });

  it("Cat Shelter (Agregar 2 gatos a la lista y asignarles un hogar. Utilizar fixtures para los nombres)", async () => {
      visitgame("Cat Shelter");
      cy.wait(500);
      // Agregar a los gatos
      cy.fixture("cats.json").then(cats => {
        cats.forEach(cat => {
          cy.get(".cat_shelter_header > .link_btn").click(); // entrar
          
          //Forms
          cy.get(".list_form > :nth-child(1) > input")
            .clear()
            .type(cat.name);
  
          cy.get("textarea")
            .clear()
            .type(cat.description);
  
          cy.get(".go_out_or_not > :nth-child(2) > label > input").click();
  
          cy.get(".text-center > .form_btn").click();
          cy.wait(200); 
        });
      });
     
  
      //Asignar casa y validar que tenga casa
      cy.fixture("cats.json").then(async cats => {
        cats.forEach(cat => {
          cy.get(".collection")
            .contains(cat.name)
            .parent()
            .within(() => {
              cy.get(".new_home").then($btn => {
                if (!$btn.hasClass("found")) {
                  cy.wrap($btn).click();
                }
  
                cy.wrap($btn).should("have.class", "found");
              });
            });
        });
      });
    });

       it("Concatenate Strings", () => {
         visitgame("Concat strings");
         cy.wait(500);
    
         // Generar strings
         cy.get(".strings_section > :nth-child(2)").click();
         cy.wait(300);
    
         // Obtener y concatenar strings
         let text1 = "";
         let text2 = "";
    
         cy.get(".string1")
           .invoke("text")
           .then(t => {
             text1 = t.trim();
           });
    
         cy.get(".string2")
           .invoke("text")
           .then(t => {
             text2 = t.trim();
           });
    
         cy.then(() => {
           const fullText = text1 + text2;
           cy.get("input").type(fullText);
           cy.get(".text-center > .form_btn").click();
         });
    
         // Validar mensaje de éxito
         cy.get('[data-testid="message"]')
           .should("exist")
           .and("have.class", "success_message")
           .and("contain.text", "Success");
       });
});
