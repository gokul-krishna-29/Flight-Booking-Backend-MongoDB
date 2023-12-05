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

async function adminLogin() {
  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;

  try {
    // Make a Fetch API request to the admin login endpoint
    const response = await fetch(`${apiUrl}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.status) {
      // Admin login successful, you can redirect or perform other actions
      console.log("Admin login successful");
      const redirectUrl = "adminFlight.html";
      // Redirect to the ticket booking page
      window.location.href = redirectUrl;
      alert("Admin login successful");
    } else {
      // Admin login failed, display an error message
      console.log("Admin login failed");
      alert("Admin login failed");
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    alert("An error occurred during admin login");
  }
}

async function adminSignup() {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const adminkey = document.getElementById("admin-key").value; // assuming you have an input field for adminkey

  try {
    // Make a Fetch API request to the admin signup endpoint
    const response = await fetch(`${apiUrl}/admin/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email, adminkey }),
    });

    if (response.ok) {
      // Registration successful
      const result = await response.json();
      console.log(result); // log or handle the response
      alert("Admin signup successful");
      const redirectUrl = "Admin.html";
      // Redirect to the ticket booking page
      window.location.href = redirectUrl;
    } else {
      // Registration failed
      const errorResult = await response.json();
      console.error(errorResult); // log or handle the error
      alert("Admin signup failed");
    }
  } catch (error) {
    console.error("Error during admin signup:", error);
    alert("An error occurred during admin signup");
  }
}
