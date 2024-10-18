document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  const closeButtons = document.querySelectorAll(".close");
  const goToSignup = document.getElementById("goToSignup");
  const goToLogin = document.getElementById("goToLogin");
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  // Show signup modal
  document.getElementById("signupButton").onclick = () => {
    signupModal.style.display = "block";
  };

  // Show login modal
  goToLogin.onclick = () => {
    signupModal.style.display = "none";
    loginModal.style.display = "block";
  };

  // Close modals
  closeButtons.forEach((button) => {
    button.onclick = () => {
      loginModal.style.display = "none";
      signupModal.style.display = "none";
    };
  });

  // Handle signup form submission
  signupForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const avatar = `https://api.dicebear.com/6.x/initials/svg?seed=${username.substring(
      0,
      2
    )}&backgroundColor=random`;

    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, avatar }),
    });

    if (response.ok) {
      alert("Sign-up successful! You can now log in.");
      signupModal.style.display = "none";
    } else {
      alert("Email already in use. Please try a different one.");
    }
  };

  // Handle login form submission
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const response = await fetch("http://localhost:3000/users");
    const users = await response.json();
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      alert(`Welcome back, ${user.username}!`);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("user", JSON.stringify(user));

      // Store user data in local storage
      loginModal.style.display = "none";
      window.location.href = "dash.html"; // Redirect to dashboard
    } else {
      alert("Invalid email or password. Please try again.");
    }
  };
});

