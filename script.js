/* =========================================
   FINANCE MANAGER - PART 1
========================================= */

const PASSWORD = "7890";

const lockScreen = document.getElementById("lockScreen");
const app = document.getElementById("app");

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


/* =========================================
   PASSWORD
========================================= */

function unlockApp() {

  const enteredPassword =
    passwordInput.value.trim();

  if (enteredPassword === PASSWORD) {

    lockScreen.style.display = "none";

    app.style.display = "block";

    passwordError.textContent = "";

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


/* =========================================
   SALARY
========================================= */

salaryButton.addEventListener(
  "click",
  function() {

    const value = prompt(
      "Enter your monthly salary:"
    );

    if (value === null) {

      return;

    }

    const amount = Number(value);

    if (
      Number.isNaN(amount) ||
      amount < 0
    ) {

      alert(
        "Please enter a valid amount."
      );

      return;

    }

    salaryAmount.textContent =
      formatMoney(amount);

    balanceAmount.textContent =
      formatMoney(amount);

  }
);


/* =========================================
   MONEY FORMAT
========================================= */

function formatMoney(amount) {

  return "₹" +
    Number(amount).toLocaleString(
      "en-IN"
    );

}


/* =========================================
   START
========================================= */

console.log(
  "Finance Manager Part 1 loaded."
);
