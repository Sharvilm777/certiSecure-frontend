// Fetch data from the backend
async function fetchData() {
  let deployedurl =
    "https://certisecure-backend.up.railway.app/transac/getTransac";
  let localurl = "http://localhost:8080/transac/getTransac";
  try {
    const response = await fetch(deployedurl, {
      method: "GET",
      headers: {
        Authorization: "admin",
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
      },
    });
    const data = await response.json();
    return data;
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Render the data in the table
async function renderData() {
  const data = await fetchData();

  const tableBody = document.getElementById("data-body");

  data.forEach((entry) => {
    const row = document.createElement("tr");

    const roleCell = document.createElement("td");
    roleCell.textContent = entry.role;
    row.appendChild(roleCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = entry.name;
    row.appendChild(nameCell);

    const idNumberCell = document.createElement("td");
    idNumberCell.textContent = entry.id;
    row.appendChild(idNumberCell);

    const statusCell = document.createElement("td");
    statusCell.textContent = entry.status;
    row.appendChild(statusCell);

    const txHashCell = document.createElement("td");
    txHashCell.textContent = entry.txhash;
    row.appendChild(txHashCell);

    const verifiedAtCell = document.createElement("td");
    verifiedAtCell.textContent = new Date(entry.verifiedAt).toLocaleString();
    row.appendChild(verifiedAtCell);

    tableBody.appendChild(row);
  });
}

// Call the renderData function when the page loads
document.addEventListener("DOMContentLoaded", renderData);
