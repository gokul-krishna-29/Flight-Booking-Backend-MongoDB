// Replace this with your backend API URL
const apiUrl = "http://localhost:5000";

// Function to toggle between different forms
function toggleForm(containerId) {
  const addFlightContainer = document.getElementById("add-flight-container");
  const deleteFlightContainer = document.getElementById(
    "delete-flight-container"
  );

  if (containerId === "add-flight-container") {
    addFlightContainer.style.display = "block";
    deleteFlightContainer.style.display = "none";
  } else if (containerId === "delete-flight-container") {
    addFlightContainer.style.display = "none";
    deleteFlightContainer.style.display = "block";
  }
}

// Function to fetch and display flights
async function displayFlights() {
  try {
    const response = await fetch(`${apiUrl}/admin/getallflights`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const flights = await response.json();

      // Display flights in the flights-container
      const flightsContainer = document.getElementById("flights-container");
      flightsContainer.innerHTML = "<h2>Flights</h2>";

      flights.flights.forEach((flight) => {
        const flightDetails = document.createElement("div");
        flightDetails.innerHTML = `
                    <p>Name: ${flight.name}</p>
                    <p>From: ${flight.from}</p>
                    <p>To: ${flight.to}</p>
                    <p>Departure Date: ${flight.departureDateTime}</p>
                    <p>Arrival Date: ${flight.arrivalDateTime}</p>
                    <p>Price: ${flight.price}</p>
                    <p>Max Capacity: ${flight.maxcapacity}</p>
                    <hr>
                `;
        flightsContainer.appendChild(flightDetails);
      });
    } else {
      console.error("Error fetching flights:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching flights:", error);
  }
}

async function addFlight() {
  try {
    // Fetch data from your form
    const name = document.getElementById("add-flight-name").value;
    const from = document.getElementById("add-flight-from").value;
    const departureDateTime = document.getElementById(
      "add-flight-departure-date"
    ).value;
    const to = document.getElementById("add-flight-to").value;
    const arrivalDateTime = document.getElementById(
      "add-flight-arrival-date"
    ).value;
    const price = document.getElementById("add-flight-price").value;
    const currcapacity = document.getElementById(
      "add-flight-curr-capacity"
    ).value;
    console.log(currcapacity);
    const maxcapacity = document.getElementById(
      "add-flight-max-capacity"
    ).value;

    // Make a POST request to add the new flight
    const response = await fetch(`${apiUrl}/admin/addflight`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        from,
        departureDateTime,
        to,
        arrivalDateTime,
        price,
        currcapacity,
        maxcapacity,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      alert(result.message);
      // Refresh the flights list after adding a new flight
      const redirectUrl = "adminFlight.html";
      // Redirect to the ticket booking page
      window.location.href = redirectUrl;
    } else {
      console.error("Error adding flight:", response.statusText);
    }
  } catch (error) {
    console.error("Error adding flight:", error);
  }
}

// Function to delete a flight
async function deleteFlight() {
  try {
    // Fetch data from your form
    const name = document.getElementById("delete-flight-name").value;

    // Make a POST request to delete the flight
    const response = await fetch(`${apiUrl}/admin/deleteflight`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      alert(result.message);
      // Refresh the flights list after deleting a flight
      const redirectUrl = "adminFlight.html";
      // Redirect to the ticket booking page
      window.location.href = redirectUrl;
    } else {
      console.error("Error deleting flight:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting flight:", error);
  }
}

// Fetch and display flights when the page loads
displayFlights();
