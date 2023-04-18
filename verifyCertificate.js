const formContainer = document.getElementById("form-container");
const userTypeSelect = document.getElementById("user-type");
const submitBtn = document.getElementById("submitBtn");
const selectionContainer = document.querySelector(".selectionContainer");
const verifyForm = document.querySelector(".verifyForm");
console.log(selectionContainer, verifyForm);
userTypeSelect.addEventListener("change", () => {
  const userType = userTypeSelect.value;

  if (userType === "student") {
    formContainer.innerHTML = `
        <form class="formContent">
          <label for="student-name">Student Name:</label>
          <input type="text" id="student-name" name="studentName" required>

          <label for="student-id">Student ID:</label>
          <input type="text" id="student-id" name="studentId" required>

          <button id="submitBtn" type="submit">Submit</button>
        </form>
      `;
  } else if (userType === "employee") {
    formContainer.innerHTML = `
        <form class="formContent">
          <label for="employee-name">Employee Name:</label>
          <input type="text" id="employee-name" name="employeeName" required>

          <label for="company-name">Company Name:</label>
          <input type="text" id="company-name" name="companyName" required>

          <button id="submitBtn" type="submit">Submit</button>
        </form>
      `;
  }
});
formContainer.addEventListener("click", (event) => {
  if (event.target.matches("#submitBtn")) {
    event.preventDefault();

    // Hide selectionContainer
    selectionContainer.style.display = "none";

    // Remove displayNone class from verifyForm
    verifyForm.classList.remove("displayNone");
  }
});
