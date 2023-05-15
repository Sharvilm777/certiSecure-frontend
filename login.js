const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
import jwtDecode from "jwt-decode";
loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const data = {
    email: email.value,
    password: password.value,
  };
  try {
    let response = await fetch(
      "https://certisecure-backend.up.railway.app/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    console.log(result);
    let authToken = result.authToken;
    const { role } = jwtDecode(authToken);
    console.log(role);
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("role", role);
    alert("User Logged IN Succesfully");
    setTimeout(() => {
      baseUrl = "https://transcendent-snickerdoodle-40ccb7.netlify.app";
      location.href = `${baseUrl}/index.html`;
    }, 3000);
  } catch (error) {
    console.log(error);
  }
});
