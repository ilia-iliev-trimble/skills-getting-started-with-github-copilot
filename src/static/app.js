document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";


      // Loop through activities and create cards with participants list
      for (const [activityName, activityDetails] of Object.entries(activities)) {
        const card = document.createElement("div");
        card.className = "activity-card";

        // Add activity details
        card.innerHTML = `
          <h4>${activityName}</h4>
          <p><strong>Description:</strong> ${activityDetails.description}</p>
          <p><strong>Schedule:</strong> ${activityDetails.schedule}</p>
          <p><strong>Max Participants:</strong> ${activityDetails.max_participants}</p>
          <p><strong>Participants:</strong></p>
          <ul class="participants-list">
            ${
              activityDetails.participants.length > 0
                ? activityDetails.participants
                    .map((participant) => `<li>${participant}</li>`)
                    .join("")
                : "<li>No participants yet</li>"
            }
          </ul>
        `;

        activitiesList.appendChild(card);
      }
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
