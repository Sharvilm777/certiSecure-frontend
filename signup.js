const signUpBtn = document.getElementById("signUpBtn");
const name = document.getElementById("name");
const dob = document.getElementById("dob");
const email = document.getElementById("email");
const password = document.getElementById("password");

signUpBtn.addEventListener("submit", async (e) => {
  e.preventDefault();

  let data = {
    name: name.value,
    email: email.value,
    password: password.value,
  };
  let deployedurl = "https://certisecure-backend.up.railway.app/auth/signup";
  let localurl = "http://localhost:8080/auth/signup";

  try {
    let response = await fetch(deployedurl, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
    // baseUrl = "https://transcendent-snickerdoodle-40ccb7.netlify.app";
    if (response.status == 201) {
      alert("User Signed up successfully");
      setTimeout(() => {
        // window.location.href = "/login.html";
      }, 3000);
    }
    if (response.status == 400) {
      alert(result.msg);
    }
    if (response.status == 406) {
      result.errors.map((e) => {
        if (e.path === "email") {
          alert("Email is Invalid,Check the Entered Email");
        }
        if (e.path === "password") {
          alert("Password must be greater than 6 characters");
        }
        if (e.path === "name") {
          alert("Name should be correct,and must greater than 2 characters");
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});
// signUpBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   let baseURl = "http://localhost:5500/client";
//   location.href = `${baseURl}/login.html`;
// });
