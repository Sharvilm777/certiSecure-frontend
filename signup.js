const signUpBtn = document.getElementById("signUpBtn");
const name = document.getElementById("name");
const dob = document.getElementById("dob");
const email = document.getElementById("email");
const password = document.getElementById("password");

signUpBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log(name.value, dob.value, email.value, password.value);
  console.log(typeof password.value);
  let data = {
    name: name.value,
    dob: dob.value,
    email: email.value,
    password: password.value,
  };
  console.log(data.password);
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
  } catch (error) {
    console.log(error);
  }
});
