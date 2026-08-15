const PASSWORD = "7890";


/* =========================
   ELEMENTS
========================= */

const lockScreen =
  document.getElementById("lockScreen");

const app =
  document.getElementById("app");

const passwordInput =
  document.getElementById("passwordInput");

const unlockButton =
  document.getElementById("unlockButton");

const passwordError =
  document.getElementById("passwordError");

const salaryButton =
  document.getElementById("salaryButton");

const salaryAmount =
  document.getElementById("salaryAmount");

const balanceAmount =
  document.getElementById("balanceAmount");

const navButtons =
  document.querySelectorAll(".navButton");

const dashboardPage =
  document.getElementById("dashboardPage");

const expensesPage =
  document.getElementById("expensesPage");

const statsPage =
  document.getElementById("statsPage");

const addExpenseButton =
  document.getElementById("addExpenseButton");

const dashboardAddExpense =
  document.getElementById("dashboardAddExpense");

const expenseForm =
  document.getElementById("expenseForm");

const expenseTitle =
  document.getElementById("expenseTitle");

const expenseAmount =
  document.getElementById("expenseAmount");

const saveExpense =
  document.getElementById("saveExpense");

const cancelExpense =
  document.getElementById("cancelExpense");

const expenseError =
  document.getElementById("expenseError");

const expenseList =
  document.getElementById("expenseList");

const dashboardExpensePreview =
  document.getElementById(
    "dashboardExpensePreview"
  );


/* =========================
   DATA
========================= */

let salary =
  Number(localStorage.getItem("financeSalary")) || 0;

let expenses =
  JSON.parse(
    localStorage.getItem("financeExpenses")
  ) || [];


/* =========================
   PASSWORD
========================= */

function unlockApp() {

  const entered =
    passwordInput.value.trim();

  if (entered === PASSWORD) {

    lockScreen.style.display = "none";

    app.style.display = "block";

    passwordError.textContent = "";

    updateEverything();

  } else {

    passwordError.textContent =
      "Incorrect password. Try again.";

    passwordInput.value = "";

    passwordInput.focus();

  }

}

unlockButton.addEventListener(
  "click",
  unlockApp
);

passwordInput.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {

      unlockApp();

    }

  }
);


/* =========================
   SALARY
========================= */

salaryButton.addEventListener(
  "click",
  function() {

    const value =
      prompt("Enter your monthly salary:");

    if (value === null) return;

    const amount =
      Number(value);

    if (
      Number.isNaN(amount) ||
      amount < 0
    ) {

      alert(
        "Please enter a valid salary."
      );

      return;

    }

    salary = amount;

    localStorage.setItem(
      "financeSalary",
      salary
    );

    updateEverything();

  }
);


/* =========================
   BALANCE
========================= */

function getTotalExpenses() {

  return expenses.reduce(
    function(total, expense) {

      return total + expense.amount;

    },
    0
  );

}


function getBalance() {

  return salary - getTotalExpenses();

}


function updateBalance() {

  salaryAmount.textContent =
    formatMoney(salary);

  balanceAmount.textContent =
    formatMoney(getBalance());

}


/* =========================
   NAVIGATION
========================= */

function openPage(page) {

  dashboardPage.classList.remove(
    "activePage"
  );

  expensesPage.classList.remove(
    "activePage"
  );

  statsPage.classList.remove(
    "activePage"
  );


  if (page === "dashboard") {

    dashboardPage.classList.add(
      "activePage"
    );

  }


  if (page === "expenses") {

    expensesPage.classList.add(
      "activePage"
    );

  }


  if (page === "stats") {

    statsPage.classList.add(
      "activePage"
    );

  }


  navButtons.forEach(
    function(button) {

      button.classList.remove(
        "active"
      );

      if (
        button.dataset.page === page
      ) {

        button.classList.add(
          "active"
        );

      }

    }
  );

}


navButtons.forEach(
  function(button) {

    button.addEventListener(
      "click",
      function() {

        openPage(
          button.dataset.page
        );

      }
    );

  }
);


/* =========================
   ADD EXPENSE BUTTONS
========================= */

addExpenseButton.addEventListener(
  "click",
  function() {

    openExpenseForm();

  }
);


dashboardAddExpense.addEventListener(
  "click",
  function() {

    openPage("expenses");

    openExpenseForm();

  }
);


function openExpenseForm() {

  expenseForm.style.display =
    "block";

  expenseError.textContent = "";

  expenseTitle.focus();

}


function closeExpenseForm() {

  expenseForm.style.display =
    "none";

  expenseTitle.value = "";

  expenseAmount.value = "";

  expenseError.textContent = "";

}


cancelExpense.addEventListener(
  "click",
  closeExpenseForm
);


/* =========================
   SAVE EXPENSE
========================= */

saveExpense.addEventListener(
  "click",
  function() {

    const title =
      expenseTitle.value.trim();

    const amount =
      Number(expenseAmount.value);


    if (title === "") {

      expenseError.textContent =
        "Please enter an expense title.";

      return;

    }


    if (
      Number.isNaN(amount) ||
      amount <= 0
    ) {

      expenseError.textContent =
        "Please enter a valid amount.";

      return;

    }


    const expense = {

      id: Date.now(),

      title: title,

      amount: amount,

      date: new Date()
        .toLocaleDateString("en-IN")

    };


    expenses.unshift(expense);


    localStorage.setItem(
      "financeExpenses",
      JSON.stringify(expenses)
    );


    closeExpenseForm();

    updateEverything();

  }
);


/* =========================
   DISPLAY EXPENSES
========================= */

function renderExpenses() {

  expenseList.innerHTML = "";


  if (expenses.length === 0) {

    expenseList.innerHTML = `

      <div class="emptyExpense">

        <div class="emptyIcon">
          💸
        </div>

        <h3>
          No expenses yet
        </h3>

        <p>
          Add your first expense to start
          tracking your money.
        </p>

      </div>

    `;

    return;

  }


  expenses.forEach(
    function(expense) {

      const card =
        document.createElement("div");

      card.className =
        "expenseCard";


      card.innerHTML = `

        <div class="expenseIcon">
          💸
        </div>

        <div class="expenseInfo">

          <h3>
            ${escapeHTML(expense.title)}
          </h3>

          <p>
            ${expense.date}
          </p>

        </div>

        <div class="expenseMoney">
          -${formatMoney(expense.amount)}
        </div>

        <button
          class="deleteExpense"
          data-id="${expense.id}"
          aria-label="Delete expense"
        >
          ×
        </button>

      `;


      const deleteButton =
        card.querySelector(
          ".deleteExpense"
        );


      deleteButton.addEventListener(
        "click",
        function() {

          deleteExpense(
            expense.id
          );

        }
      );


      expenseList.appendChild(card);

    }
  );

}


/* =========================
   DASHBOARD EXPENSE
========================= */

function renderDashboardExpenses() {

  dashboardExpensePreview.innerHTML = "";


  if (expenses.length === 0) {

    dashboardExpensePreview.innerHTML = `

      <div class="emptyExpense">

        <div class="emptyIcon">
          💸
        </div>

        <h3>
          No expenses yet
        </h3>

        <p>
          Your saved expenses will appear here.
        </p>

      </div>

    `;

    return;

  }


  const latest =
    expenses.slice(0, 3);


  latest.forEach(
    function(expense) {

      const card =
        document.createElement("div");

      card.className =
        "dashboardExpenseCard";


      card.innerHTML = `

        <div class="expenseIcon">
          💸
        </div>

        <div class="expenseInfo">

          <h3>
            ${escapeHTML(expense.title)}
          </h3>

          <p>
            ${expense.date}
          </p>

        </div>

        <div class="expenseMoney">
          -${formatMoney(expense.amount)}
        </div>

      `;


      dashboardExpensePreview
        .appendChild(card);

    }
  );

}


/* =========================
   DELETE
========================= */

function deleteExpense(id) {

  expenses =
    expenses.filter(
      function(expense) {

        return expense.id !== id;

      }
    );


  localStorage.setItem(
    "financeExpenses",
    JSON.stringify(expenses)
  );


  updateEverything();

}


/* =========================
   FORMAT MONEY
========================= */

function formatMoney(amount) {

  return "₹" +
    Number(amount).toLocaleString(
      "en-IN"
    );

}


/* =========================
   SAFETY
========================= */

function escapeHTML(text) {

  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================
   UPDATE EVERYTHING
========================= */

function updateEverything() {

  updateBalance();

  renderExpenses();

  renderDashboardExpenses();

}


/* =========================
   START
========================= */

console.log(
  "Finance Manager Part 2 loaded successfully."
);
