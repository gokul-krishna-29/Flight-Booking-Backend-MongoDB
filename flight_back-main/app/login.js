// Replace this with your backend API URL
const apiUrl = "http://localhost:5000";

function toggleForm(containerId) {
  const loginContainer = document.getElementById("login-container");
  const signupContainer = document.getElementById("signup-container");

  if (containerId === "login-container") {
    loginContainer.style.display = "block";
    signupContainer.style.display = "none";
  } else if (containerId === "signup-container") {
    loginContainer.style.display = "none";
    signupContainer.style.display = "block";
  }
}

async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch(`${apiUrl}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.status) {
      alert("Login successful");
      const redirectUrl = "tickets.html";
      // Redirect to the ticket booking page
      window.location.href = redirectUrl;
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred during login");
  }
}

async function signup() {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const response = await fetch(`${apiUrl}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status) {
      alert("Signup successful");
      const redirectUrl = "login.html";
      // Redirect to the ticket booking page
      window.location.href = redirectUrl;
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error during signup:", error);
    alert("An error occurred during signup");
  }
}
