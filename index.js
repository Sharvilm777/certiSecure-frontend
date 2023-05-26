// const web3 = new Web3(
//   "https://sepolia.infura.io/v3/7f5244566ac44d86b2a4c45655f62b62"
// );
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
const hash = document.getElementById("hash");
const PRIVATE_KEY =
  "82abe18cb5f6d7b4ebfb176aa6b88fe8ae1078642aaba52482ae4d22ca5aa430";

var walletAddress;
async function connectMetamask() {
  const web3 = new Web3(window.ethereum);
  walletAddress = await web3.eth.requestAccounts();
  console.log(walletAddress);
  const walletBal = await web3.eth.getBalance(walletAddress[0]);
  const walletBalinEth = Math.round(web3.utils.fromWei(walletBal, "ether"));
  console.log(walletBalinEth);
}

connectMetamask();
console.log(web3.eth);

async function uploadCertificate() {
  console.log("Control is here");
  var image = document.getElementById("previewImage");
  var previewText = document.getElementById("previewText");
  const certificateFile = document.getElementById("certificate-add-file")
    .files[0];
  const certificateHash = await calculateHash(certificateFile);
  hash.innerHTML = certificateHash;
  const status = await storeCertificateHashOnBlockchain(certificateHash);
  if (status) {
    alert("Certificate uploaded successfully!");
    uploadFile.value = null;
    image.src = "";
    previewText.style.display = "block";
  } else {
    alert("certificate is not uploaded");
    uploadFile.value = null;
    image.src = "";
    previewText.style.display = "block";
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

async function storeCertificateHashOnBlockchain(certificateHash) {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const walletAddress = accounts[0];

  const isCertificateExists = await certificateValidationContract.methods
    .verifyCertificate(certificateHash)
    .call();

  if (isCertificateExists) {
    alert("Certificate already exists on the blockchain.");
    return false;
  }

  try {
    const nonce = await web3.eth.getTransactionCount(walletAddress, "pending");
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 300000;
    const txParams = {
      nonce: nonce,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      from: walletAddress,
      value: web3.utils.toWei("0.01", "ether"),
      to: certificateValidationContract.options.address,
      data: certificateValidationContract.methods
        .addCertificate(certificateHash)
        .encodeABI(),
    };
    try {
      await signData();
    } catch (error) {
      console.error(error);
      alert(error);
      return;
    }

    const signedTx = await web3.eth.accounts.signTransaction(
      txParams,
      PRIVATE_KEY
    );
    console.log("Raw transaction data: " + signedTx.rawTransaction);
    web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
      function (error, hash) {
        if (!error) {
          console.log(
            "🎉 The hash of your transaction is: ",
            hash,
            "\n Check Alchemy's Mempool to view the status of your transaction!"
          );
          sendHashToDB(certificateHash, hash);
        } else {
          console.log(
            "❗Something went wrong while submitting your transaction:",
            error
          );
        }
      }
    );

    return true;
  } catch (error) {
    console.error(error);
    alert("Failed to store certificate hash on the blockchain.");
    uploadFile.value = null;
    return false;
  }
}
const signData = async () => {
  if (typeof window.ethereum === "undefined") {
    console.log("Metamask not detected");
    return;
  }

  const web3 = new Web3(window.ethereum);
  try {
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    let msg = "Sign message";
    let signature = await web3.eth.personal.sign(msg, account);
    console.log(signature);
  } catch (error) {
    console.error(error);
    throw new Error("Signer declined the process");
  }
};
async function sendHashToDB(certificateHash, transactionHash) {
  let data = {
    C_hash: certificateHash,
    T_hash: transactionHash,
  };
  let response = await fetch(
    "https://certisecure-backend.up.railway.app/certificate/addCertificate",
    {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: "admin",
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  let result = await response.json();
  console.log(result);
}

const uploadBtn = document.getElementById("upload_certificate");
uploadBtn.addEventListener("click", uploadCertificate);
const LogoutBtn = document.getElementById("LogoutBtn");
LogoutBtn.addEventListener("click", () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("role");
});

const uploadFile = document.getElementById("certificate-add-file");
uploadFile.addEventListener("change", function previewImage(event) {
  console.log("Change happened");
  var file = event.target.files[0];
  var reader = new FileReader();

  reader.onload = function (event) {
    var image = new Image();
    image.src = event.target.result;

    image.onload = function () {
      var maxWidth = 200; // Maximum width for the preview image
      var maxHeight = 400; // Maximum height for the preview image

      // Calculate the aspect ratio of the image
      var aspectRatio = image.width / image.height;

      // Calculate the new dimensions to fit within the maximum width and height
      var newWidth = maxWidth;
      var newHeight = maxHeight;

      if (aspectRatio > 1) {
        newHeight = maxWidth / aspectRatio;
      } else {
        newWidth = maxHeight * aspectRatio;
      }

      // Create a canvas element to generate the preview image with the desired dimensions
      var canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw the image onto the canvas
      var context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, newWidth, newHeight);
      var existingPreview = document.getElementById("previewImage");
      if (existingPreview) {
        existingPreview.parentNode.removeChild(existingPreview);
      }

      var previewImage = new Image();
      previewImage.id = "previewImage";
      previewImage.src = canvas.toDataURL("image/jpeg");

      // Append the preview image to the container element
      var previewContainer = document.getElementById("previewContainer");
      previewContainer.appendChild(previewImage);

      // Show/hide the preview text based on the presence of an image
      var previewText = document.getElementById("previewText");
      previewText.style.display = previewImage.src ? "none" : "block";
    };
  };

  reader.readAsDataURL(file);
});
