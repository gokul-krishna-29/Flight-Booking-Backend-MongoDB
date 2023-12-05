const apiUrl = "http://localhost:5000";

async function displayAvailableFlights() {
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
      flights.flights.forEach((flight) => {
        const flightCard = document.createElement("div");
        flightCard.className = "flight-card";
        flightCard.innerHTML = `
          <p>Name: ${flight.name}</p>
          <p>From: ${flight.from}</p>
          <p>To: ${flight.to}</p>
          <p>Departure Date: ${flight.departureDateTime}</p>
          <p>Arrival Date: ${flight.arrivalDateTime}</p>
          <p>Price: ${flight.price}</p>
          <button onclick="openBookingModel('${flight.name}', ${flight.price})">Book Now</button>
          <br>
        `;
        flightsContainer.appendChild(flightCard);
      });
    } else {
      console.error("Error fetching flights:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching flights:", error);
  }
}

function openBookingModel(flightName, price) {
  document.getElementById("flight-name").innerText = flightName;
  document.getElementById("flight-price").innerText = price;
  document.getElementById("booking-model").style.display = "block";
}

function closeBookingModal() {
  document.getElementById("booking-model").style.display = "none";
}

async function submitBooking() {
  const email = document.getElementById("email").value;
  const flightName = document.getElementById("flight-name").innerText;
  const count = parseInt(document.getElementById("count").value, 10);

  try {
    const response = await fetch(`${apiUrl}/user/bookflight`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        flightName,
        count,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      alert(result.message);
    } else {
      console.error("Error booking flight:", response.statusText);
    }
  } catch (error) {
    console.error("Error booking flight:", error);
  }
}
displayAvailableFlights();
