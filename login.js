const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

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
  } catch (error) {
    console.log(error);
  }
});
