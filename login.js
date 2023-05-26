const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
// import jwtDecode from "jwt-decode";
loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const data = {
    email: email.value,
    password: password.value,
  };
  let deployedurl = "https://certisecure-backend.up.railway.app/auth/login";
  let localurl = "http://localhost:8080/auth/login";
  try {
    let response = await fetch(localurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    // console.log(response.status);

    if (response.status == 200) {
      let authToken = result.authToken;
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("role", result.role);
      alert("User signed successfully");
      setTimeout(() => {
        // baseUrl = "https://transcendent-snickerdoodle-40ccb7.netlify.app";
        window.location.href = "/index.html";
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
      });
    }
  } catch (error) {
    console.log(error);
  }
});
