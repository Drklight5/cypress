export function visitgame(name) {
  cy.visit("https://thelab.boozang.com/");
  cy.get(".veggie_burger > :nth-child(2)").click();
  cy.contains(name).click()
}

export async function deleteItemsUntil(parent, item , x) {
  return cy.get(parent).then(($todos) => {
    const total = $todos.length;
    if (total > x) {
      const toRemove = total - x;
      // Repetimos la eliminación las veces necesarias
      for (let i = 0; i < toRemove; i++) {
        cy.get(item) // asumiendo que este botón elimina un item
          .click();
        cy.wait(300) // Esperar que refresque el componente
      }
    }
  });
}

export async function addItems(){
  return cy.fixture("listElements.json").then((elements) => {
    elements.forEach(element => {
      cy.get("input").clear().type(element);
      cy.get(".form_btn").click()
      cy.wait(300) //esperar a que refresque
    });
  })
}