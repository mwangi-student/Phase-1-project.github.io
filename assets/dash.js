document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Set user greeting
  const greeting = document.querySelector("h1");
  const currentHour = new Date().getHours();
  let timeGreeting = "Good evening";
  if (currentHour < 12) timeGreeting = "Good morning";
  else if (currentHour < 18) timeGreeting = "Good afternoon";
  greeting.textContent = `${timeGreeting}, ${user.username}`;

  // Fetch all events
  fetchEvents();

  // Add new event
  const addForm = document.getElementById("createEventForm");
  addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createEvent();
  });

  // Edit event form submission
  const editForm = document.getElementById("editEventForm");
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateEvent();
  });
});

function fetchEvents() {
  fetch("https://ohasie-1-projects.onrender.com/events")
    .then((res) => res.json())
    .then((data) => {
      const eventsContainer = document.getElementById("eventsContainer");
      eventsContainer.innerHTML = ""; // Clear any previous content

      data.forEach((event) => {
        eventsContainer.innerHTML += `
          <tr id="event-${event.id}">
            <td>${event.title}</td>
            <td>${event.date}</td>
            <td>${event.location}</td>
            <td>${event.time || "N/A"}</td>
            <td>${event.description}</td>
            <td><button class="btn btn-info btn-sm" onclick="populateEditForm(${
              event.id
            })">Edit</button></td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteEvent(${
              event.id
            })">Delete</button></td>
          </tr>
        `;
      });
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
    });
}

function createEvent() {
  const title = document.getElementById("eventName").value;
  const description = document.getElementById("eventDescription").value;
  const location = document.getElementById("eventLocation").value;
  const date = document.getElementById("eventDate").value;
  const time = document.getElementById("eventTime").value;

  fetch("https://ohasie-1-projects.onrender.com/events", {
    method: "POST",
    body: JSON.stringify({
      title,
      description,
      location,
      date,
      time,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(() => {
      alert("Event created successfully!");
      bootstrap.Modal.getInstance(
        document.getElementById("createEventModal")
      ).hide();
      fetchEvents(); // Refresh the event list
    })
    .catch((error) => {
      console.error("Error creating event:", error);
    });
}

function deleteEvent(id) {
  fetch(`https://ohasie-1-projects.onrender.com/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => {
      document.getElementById(`event-${id}`).remove(); // Remove the row from the table
      alert("Event deleted successfully!");
    })
    .catch((error) => {
      console.error("Error deleting event:", error);
    });
}

function populateEditForm(id) {
  fetch(`https://ohasie-1-projects.onrender.com/${id}`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("editEventName").value = data.title;
      document.getElementById("editEventDate").value = data.date;
      document.getElementById("editEventTime").value = data.time || "";
      document.getElementById("editEventLocation").value = data.location;
      document.getElementById("editEventDescription").value = data.description;
      document.getElementById("editEventId").value = data.id;

      const editModal = new bootstrap.Modal(
        document.getElementById("editEventModal")
      );
      editModal.show();
    })
    .catch((error) => {
      console.error("Error fetching event:", error);
    });
}

function updateEvent() {
  const id = document.getElementById("editEventId").value;
  const title = document.getElementById("editEventName").value;
  const date = document.getElementById("editEventDate").value;
  const time = document.getElementById("editEventTime").value;
  const location = document.getElementById("editEventLocation").value;
  const description = document.getElementById("editEventDescription").value;

  fetch(`https://ohasie-1-projects.onrender.com/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      date,
      time,
      location,
      description,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(() => {
      alert("Event updated successfully!");
      bootstrap.Modal.getInstance(
        document.getElementById("editEventModal")
      ).hide();
      fetchEvents(); // Refresh the event list
    })
    .catch((error) => {
      console.error("Error updating event:", error);
    });
}
