document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/users")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
});

// Attach event listeners to edit and delete buttons
function attachEventListeners() {
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", deleteEvent);
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", openEditModal);
  });
}

// Function to delete an event
function deleteEvent(e) {
  const eventId = e.target.getAttribute("data-id");
  fetch(`${apiUrl}/events/${eventId}`, { method: "DELETE" })
    .then((response) => {
      if (!response.ok) throw new Error("Error deleting event");
      fetchUserEvents(); // Refresh events after deletion
    })
    .catch((error) => console.error("Error deleting event:", error));
}

// Function to open the edit modal with pre-filled data
function openEditModal(e) {
  editingEventId = e.target.getAttribute("data-id");
  const eventElement = e.target.closest("tr");

  // Prefill modal with existing event data
  document.getElementById("editEventName").value =
    eventElement.children[0].textContent;
  document.getElementById("editEventDate").value =
    eventElement.children[1].textContent;
  document.getElementById("editEventTime").value =
    eventElement.children[2].textContent;
  document.getElementById("editEventLocation").value =
    eventElement.children[3].textContent;
  document.getElementById("editEventDescription").value =
    eventElement.children[4].textContent;

  // Show the modal
  editEventModal.show();
}

// Submit the edited event
document.getElementById("editEventForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const updatedEvent = {
    name: document.getElementById("editEventName").value,
    date: document.getElementById("editEventDate").value,
    time: document.getElementById("editEventTime").value,
    location: document.getElementById("editEventLocation").value,
    description: document.getElementById("editEventDescription").value,
  };

  fetch(`${apiUrl}/events/${editingEventId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedEvent),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error updating event");
      fetchUserEvents(); // Refresh events
      editEventModal.hide(); // Hide modal after update
    })
    .catch((error) => console.error("Error updating event:", error));
});

// Add new event
createEventForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newEvent = {
    id: Date.now(), // Create a unique ID for the event
    name: document.getElementById("eventName").value,
    date: document.getElementById("eventDate").value,
    time: document.getElementById("eventTime").value,
    location: document.getElementById("eventLocation").value,
    description: document.getElementById("eventDescription").value,
    reminder: true,
  };

  fetch(apiUrl, {
    method: "PATCH", // Use PATCH to update the user object
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      events: [...user.events, newEvent], // Append new event
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error adding event");
      fetchUserEvents(); // Refresh events
      createEventModal.hide(); // Hide modal after creating
    })
    .catch((error) => console.error("Error adding event:", error));
});

// Initial call to load events
fetchUserEvents();
// });
