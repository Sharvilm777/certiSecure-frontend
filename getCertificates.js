async function fetchCertificates() {
  try {
    const response = await fetch(
      "https://certisecure-backend.up.railway.app/certificate/getCertificates",
      {
        method: "GET",
        headers: {
          Authorization: "admin",
          "content-type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data.certificates;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function displayCertificates() {
  const certificates = await fetchCertificates();

  const tableBody = document.getElementById("certificate-table-body");
  tableBody.innerHTML = "";

  certificates.forEach((certificate) => {
    const row = document.createElement("tr");
    const addedAtCell = document.createElement("td");
    const cHashCell = document.createElement("td");
    const tHashCell = document.createElement("td");
    const addedAt = new Date(certificate.addedAt).toLocaleString();
    addedAtCell.textContent = addedAt;
    row.appendChild(addedAtCell);

    // addedAtCell.textContent = certificate.addedAt || "-";
    cHashCell.textContent = certificate.c_hash || "-";
    tHashCell.textContent = certificate.t_hash || "-";

    row.appendChild(cHashCell);
    row.appendChild(tHashCell);

    tableBody.appendChild(row);
  });
}

displayCertificates();
