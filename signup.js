const signUpBtn = document.getElementById("signUpBtn");
const name = document.getElementById("name");
const dob = document.getElementById("dob");
const email = document.getElementById("email");
const password = document.getElementById("password");

signUpBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  let data = {
    name: name.value,
    dob: dob.value,
    email: email.value,
    password: password.value,
  };

  try {
    let response = await fetch(
      "https://certisecure-backend.up.railway.app/auth/signup",
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    console.log(result);
    // baseUrl = "https://transcendent-snickerdoodle-40ccb7.netlify.app";
    window.location.href = "/login.html";
  } catch (error) {
    console.log(error);
  }
});
// signUpBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   let baseURl = "http://localhost:5500/client";
//   location.href = `${baseURl}/login.html`;
// });
