const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://eth-sepolia.g.alchemy.com/v2/o1X8jkBBqpzsHd5J6hJJeFReHxVk5yMl"
  )
);
web3.eth.net.getId().then(console.log);
import MyContractABI from "./contracts/CertificateValidation.json" assert { type: "json" };
const abi = MyContractABI.abi;
const address = "0x1a2309A89f39962Ff8EeAd46E0F827eE80ffF747";
const certificateValidationContract = new web3.eth.Contract(abi, address);

const formContainer = document.getElementById("form-container");
const userTypeSelect = document.getElementById("user-type");
const submitBtn = document.getElementById("submitBtn");
const selectionContainer = document.querySelector(".selectionContainer");
const verifyForm = document.querySelector(".verifyForm");
let verifyBtn = document.getElementById("verify_btn");
let name, id, role;
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
  console.log(certificateIsValid);
  if (certificateIsValid) {
    sendDataToDB(role, name, id, "Success", certificateHash);
    resultElement.innerHTML = `<p>Certificate is valid</p>
  <img src="photos/verified.png" height="100px" width="100px"/>
    `;
  } else {
    sendDataToDB(role, name, id, "Failed", certificateHash);
    resultElement.innerHTML = `<p>Certificate is not valid</p>
    <img src="photos/failed.png" height="100px" width="100px"/>`;
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
let userType;
userTypeSelect.addEventListener("change", () => {
  userType = userTypeSelect.value;

  if (userType === "faculty") {
    formContainer.innerHTML = `
        <form class="formContent">
          <label for="student-name">Faculty Name:</label>
          <input type="text" id="faculty-name" name="studentName" required>

          <label for="student-id">Faculty ID:</label>
          <input type="text" id="faculty-id" name="studentId" required>

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
    if (userType === "faculty") {
      role = "faculty";
      name = document.getElementById("faculty-name").value;
      id = document.getElementById("faculty-id").value;
    } else if (userType === "employee") {
      role = "employee";
      name = document.getElementById("employee-name").value;
      id = document.getElementById("company-name").value;
    }
    console.log(role, name, id);
    // Hide selectionContainer
    selectionContainer.style.display = "none";

    // Remove displayNone class from verifyForm
    verifyForm.classList.remove("displayNone");
  }
});
document.addEventListener("DOMContentLoaded", () => {
  verifyBtn.addEventListener("click", verifyCertificate);
});
async function sendDataToDB(role, name, id, status, hash) {
  let data = {
    role,
    name,
    id,
    status,
    hash,
  };
  let response = await fetch(
    "https://certisecure-backend.up.railway.app/transac/addTransac",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  let result = await response.json();
  console.log(result);
}
