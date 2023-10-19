// scripts.js

const form = document.querySelector("[data-form]");
const result = document.querySelector("[data-result]");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entries = new FormData(event.target);
  const dividend = parseFloat(entries.get("dividend"));
  const divider = parseFloat(entries.get("divider"));
  
  if (isNaN(dividend) || isNaN(divider)) {
    result.innerText = "Something critical went wrong. Please reload the page";
    console.error("Error: Invalid input provided.");
  } else if (divider === 0) {
    result.innerText = "Division not performed. Division by zero is not allowed. Try again.";
    console.error("Error: Division by zero.");
  } else {
    const divisionResult = dividend / divider;
    if (Number.isInteger(divisionResult)) {
      result.innerText = divisionResult;
    } else {
      result.innerText = Math.floor(divisionResult);
    }
  }
});
