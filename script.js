const PASSWORD = "7890";


/* ================= ELEMENTS ================= */

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

const notesInput =
  document.getElementById("notesInput");

const saveNotes =
  document.getElementById("saveNotes");

const notesStatus =
  document.getElementById("notesStatus");

const weeklyTotal =
  document.getElementById("weeklyTotal");

const weeklyCount =
  document.getElementById("weeklyCount");

const graphTotal =
  document.getElementById("graphTotal");

const barChart =
  document.getElementById("barChart");

const moneyTip =
  document.getElementById("moneyTip");


/* ================= DATA ================= */

let salary =
  Number(
    localStorage.getItem(
      "financeSalary"
    )
  ) || 0;


let expenses =
  JSON.parse(
    localStorage.getItem(
      "financeExpenses"
    )
  ) || [];


/* ================= PASSWORD ================= */

function unlockApp() {

  const entered =
    passwordInput.value.trim();

  if (entered === PASSWORD) {

    lockScreen.style.display =
      "none";

    app.style.display =
      "block";

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


/* ================= SALARY ================= */

salaryButton.addEventListener(
  "click",
  function() {

    const value =
      prompt(
        "Enter your monthly salary:"
      );

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


/* ================= MONEY ================= */

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


function formatMoney(amount) {

  return "₹" +
    Number(amount).toLocaleString(
      "en-IN"
    );

}


function updateBalance() {

  salaryAmount.textContent =
    formatMoney(salary);

  balanceAmount.textContent =
    formatMoney(getBalance());

}


/* ================= NAVIGATION ================= */

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

    updateStats();

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


/* ================= EXPENSE FORM ================= */

addExpenseButton.addEventListener(
  "click",
  openExpenseForm
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


/* ================= SAVE EXPENSE ================= */

saveExpense.addEventListener(
  "click",
  function() {

    const title =
      expenseTitle.value.trim();

    const amount =
      Number(
        expenseAmount.value
      );


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

      date: new Date().toISOString()

    };


    expenses.unshift(
      expense
    );


    localStorage.setItem(
      "financeExpenses",
      JSON.stringify(expenses)
    );


    closeExpenseForm();

    updateEverything();

  }
);


/* ================= EXPENSE DISPLAY ================= */

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
            ${formatDate(expense.date)}
          </p>

        </div>

        <div class="expenseMoney">
          -${formatMoney(expense.amount)}
        </div>

        <button
          class="deleteExpense"
          data-id="${expense.id}"
        >
          ×
        </button>

      `;


      card
        .querySelector(
          ".deleteExpense"
        )
        .addEventListener(
          "click",
          function() {

            deleteExpense(
              expense.id
            );

          }
        );


      expenseList.appendChild(
        card
      );

    }
  );

}


/* ================= DASHBOARD ================= */

function renderDashboardExpenses() {

  dashboardExpensePreview.innerHTML =
    "";


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


  expenses.slice(0,3).forEach(
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
            ${formatDate(expense.date)}
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


/* ================= DELETE ================= */

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


/* ================= DATE ================= */

function formatDate(dateString) {

  const date =
    new Date(dateString);

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );

}


/* ================= WEEK ================= */

function getLastSevenDays() {

  const days = [];

  const today =
    new Date();

  today.setHours(
    0,0,0,0
  );


  for (
    let i = 6;
    i >= 0;
    i--
  ) {

    const date =
      new Date(today);

    date.setDate(
      today.getDate() - i
    );

    days.push(date);

  }


  return days;

}


function sameDay(a,b) {

  return (
    a.getFullYear() ===
      b.getFullYear() &&

    a.getMonth() ===
      b.getMonth() &&

    a.getDate() ===
      b.getDate()
  );

}


function getWeeklyData() {

  const days =
    getLastSevenDays();


  return days.map(
    function(day) {

      const total =
        expenses.reduce(
          function(sum, expense) {

            const expenseDate =
              new Date(
                expense.date
              );

            if (
              sameDay(
                expenseDate,
                day
              )
            ) {

              return sum +
                expense.amount;

            }

            return sum;

          },
          0
        );


      return {
        date: day,
        total: total
      };

    }
  );

}


/* ================= STATS ================= */

function updateStats() {

  const data =
    getWeeklyData();


  const total =
    data.reduce(
      function(sum, day) {

        return sum + day.total;

      },
      0
    );


  const count =
    data.reduce(
      function(sum, day) {

        const dayCount =
          expenses.filter(
            function(expense) {

              return sameDay(
                new Date(expense.date),
                day.date
              );

            }
          ).length;

        return sum + dayCount;

      },
      0
    );


  weeklyTotal.textContent =
    formatMoney(total);

  weeklyCount.textContent =
    count;

  graphTotal.textContent =
    formatMoney(total);


  renderChart(data);

  generateTip(total);

}


/* ================= GRAPH ================= */

function renderChart(data) {

  barChart.innerHTML =
    "";


  const max =
    Math.max(
      ...data.map(
        function(day) {
          return day.total;
        }
      ),
      1
    );


  data.forEach(
    function(day) {

      const group =
        document.createElement("div");

      group.className =
        "barGroup";


      const value =
        document.createElement("div");

      value.className =
        "barValue";

      value.textContent =
        day.total > 0
          ? formatShortMoney(
              day.total
            )
          : "";


      const bar =
        document.createElement("div");

      bar.className =
        "bar";


      const height =
        day.total === 0
          ? 3
          : Math.max(
              8,
              (day.total / max) * 190
            );


      bar.style.height =
        height + "px";


      const label =
        document.createElement("div");

      label.className =
        "barLabel";

      label.textContent =
        day.date.toLocaleDateString(
          "en-IN",
          {
            weekday: "short"
          }
        ).slice(0,3);


      group.appendChild(value);

      group.appendChild(bar);

      group.appendChild(label);

      barChart.appendChild(group);

    }
  );

}


function formatShortMoney(amount) {

  if (amount >= 100000) {

    return "₹" +
      (amount / 100000)
        .toFixed(1) +
      "L";

  }


  if (amount >= 1000) {

    return "₹" +
      (amount / 1000)
        .toFixed(1) +
      "K";

  }


  return "₹" + amount;

}


/* ================= SMART TIP ================= */

function generateTip(total) {

  if (expenses.length === 0) {

    moneyTip.textContent =
      "Start adding expenses to receive smart spending tips.";

    return;

  }


  if (salary <= 0) {

    moneyTip.textContent =
      "Add your monthly salary to understand your spending better.";

    return;

  }


  const percentage =
    (total / salary) * 100;


  if (percentage >= 30) {

    moneyTip.textContent =
      "You have spent a significant part of your monthly salary this week. Try reducing unnecessary expenses.";

  } else if (percentage >= 15) {

    moneyTip.textContent =
      "Your spending is moderate. Keep tracking your expenses and watch unnecessary purchases.";

  } else {

    moneyTip.textContent =
      "Great control! Your spending this week is relatively low compared with your salary.";

  }

}


/* ================= NOTES ================= */

const savedNotes =
  localStorage.getItem(
    "financeNotes"
  );

if (savedNotes !== null) {

  notesInput.value =
    savedNotes;

}


saveNotes.addEventListener(
  "click",
  function() {

    localStorage.setItem(
      "financeNotes",
      notesInput.value
    );

    notesStatus.textContent =
      "✓ Notes saved";

    setTimeout(
      function() {

        notesStatus.textContent =
          "Saved automatically";

      },
      2000
    );

  }
);


/* ================= SECURITY ================= */

function escapeHTML(text) {

  return text
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

}


/* ================= UPDATE ================= */

function updateEverything() {

  updateBalance();

  renderExpenses();

  renderDashboardExpenses();

  updateStats();

}


/* ================= START ================= */

console.log(
  "Finance Manager - Final Version Loaded"
);
