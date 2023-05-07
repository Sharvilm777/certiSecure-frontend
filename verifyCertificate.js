const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://eth-sepolia.g.alchemy.com/v2/o1X8jkBBqpzsHd5J6hJJeFReHxVk5yMl"
  )
);
web3.eth.net.getId().then(console.log);
import MyContractABI from "../build/contracts/CertificateValidation.json" assert { type: "json" };
const abi = MyContractABI.abi;
const address = "0x1a2309A89f39962Ff8EeAd46E0F827eE80ffF747";
const certificateValidationContract = new web3.eth.Contract(abi, address);

const formContainer = document.getElementById("form-container");
const userTypeSelect = document.getElementById("user-type");
const submitBtn = document.getElementById("submitBtn");
const selectionContainer = document.querySelector(".selectionContainer");
const verifyForm = document.querySelector(".verifyForm");
let verifyBtn = document.getElementById("verify_btn");

async function verifyCertificate() {
  const certificateFile = document.getElementById("certificate-verify-file")
    .files[0];
  const certificateHash = await calculateHash(certificateFile);
  console.log(certificateHash);
  hash.innerHTML = certificateHash;
  const certificateIsValid = await certificateValidationContract.methods
    .verifyCertificate(certificateHash)
    .call();
  const resultElement = document.getElementById("result");
  if (certificateIsValid) {
    resultElement.innerText = "Certificate is valid";
  } else {
    resultElement.innerText = "Certificate is not valid";
  }
}

async function calculateHash(file) {
  const fileBuffer = await file.arrayBuffer();
  const certificateHashBuffer = await crypto.subtle.digest(
    "SHA-256",
    fileBuffer
  );
  const certificateHashArray = Array.from(
    new Uint8Array(certificateHashBuffer)
  );
  const certificateHashHex = certificateHashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return "0x" + certificateHashHex;
}

userTypeSelect.addEventListener("change", () => {
  const userType = userTypeSelect.value;

  if (userType === "student") {
    formContainer.innerHTML = `
        <form class="formContent">
          <label for="student-name">Faculty Name:</label>
          <input type="text" id="student-name" name="studentName" required>

          <label for="student-id">Faculty ID:</label>
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
document.addEventListener("DOMContentLoaded", () => {
  verifyBtn.addEventListener("click", verifyCertificate);
});
