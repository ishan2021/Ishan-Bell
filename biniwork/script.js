document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const callButton = document.getElementById("callButton");
  const notification = document.getElementById("notification");
  const errorNotification = document.getElementById("errorNotification");
  const errorMessage = document.getElementById("errorMessage");
  const settingsButton = document.getElementById("settingsButton");
  const settingsModal = document.getElementById("settingsModal");
  const setupGuideButton = document.getElementById("setupGuideButton");
  const setupGuideModal = document.getElementById("setupGuideModal");
  const closeButton = document.querySelector(".close-button");
  const closeGuideButton = document.getElementById("closeGuideButton");
  const openSettingsButton = document.getElementById("openSettingsButton");
  const settingsForm = document.getElementById("settingsForm");
  const contactSubmit = document.getElementById("contactSubmit");

  // Default settings
  let notificationSettings = {
    recipientEmail: "receptionist@example.com",
    notificationType: "email",
    customMessage: "Customer needs assistance",
    emailServiceID: "",
    emailTemplateID: "",
    emailUserID: "",
  };

  // Initialize EmailJS
  function initEmailJS() {
    if (notificationSettings.emailUserID) {
      emailjs.init(notificationSettings.emailUserID);
    }
  }

  // Load settings from localStorage if available
  if (localStorage.getItem("notificationSettings")) {
    try {
      notificationSettings = JSON.parse(
        localStorage.getItem("notificationSettings")
      );
      document.getElementById("recipientEmail").value =
        notificationSettings.recipientEmail || "";
      document.getElementById("notificationType").value =
        notificationSettings.notificationType || "email";
      document.getElementById("customMessage").value =
        notificationSettings.customMessage || "";
      document.getElementById("emailServiceID").value =
        notificationSettings.emailServiceID || "";
      document.getElementById("emailTemplateID").value =
        notificationSettings.emailTemplateID || "";
      document.getElementById("emailUserID").value =
        notificationSettings.emailUserID || "";

      // Initialize EmailJS with the stored user ID
      initEmailJS();
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }

  // Check if settings are configured
  function areSettingsConfigured() {
    return (
      notificationSettings.emailServiceID &&
      notificationSettings.emailTemplateID &&
      notificationSettings.emailUserID
    );
  }

  // Show setup guide if settings are not configured
  if (!areSettingsConfigured()) {
    setupGuideModal.style.display = "block";
  }

  // Call Button Click Event
  callButton.addEventListener("click", function () {
    // Check if settings are configured
    if (
      !areSettingsConfigured() &&
      notificationSettings.notificationType !== "browser"
    ) {
      showError("Please configure your email settings first.");
      setupGuideModal.style.display = "block";
      return;
    }

    // Disable button and show loading state
    callButton.disabled = true;
    callButton.innerHTML = '<div class="spinner"></div>';

    // Send notification
    sendNotification()
      .then(() => {
        // Reset button
        callButton.disabled = false;
        callButton.innerHTML = '<i class="fas fa-bell"></i>';

        // Show success notification
        showSuccess();
      })
      .catch((error) => {
        // Reset button
        callButton.disabled = false;
        callButton.innerHTML = '<i class="fas fa-bell"></i>';

        // Show error notification
        showError(
          error.message || "Failed to send notification. Please try again."
        );
      });
  });

  // Send Notification Function
  async function sendNotification() {
    // Hide any existing notifications
    notification.classList.add("hidden");
    errorNotification.classList.add("hidden");

    const timestamp = new Date().toLocaleString();
    const location = window.location.href;

    // If browser notifications are enabled and permission is granted
    if (
      (notificationSettings.notificationType === "browser" ||
        notificationSettings.notificationType === "both") &&
      Notification.permission === "granted"
    ) {
      await showBrowserNotification();
    }

    // If email notification is selected
    if (
      (notificationSettings.notificationType === "email" ||
        notificationSettings.notificationType === "both") &&
      areSettingsConfigured()
    ) {
      await sendEmailNotification(timestamp, location);
    }

    return true;
  }

  // Browser Notification Function
  function showBrowserNotification() {
    return new Promise((resolve, reject) => {
      try {
        const notification = new Notification("Reception Call", {
          body:
            notificationSettings.customMessage || "Customer needs assistance",
          icon: "https://via.placeholder.com/128/0891b2/FFFFFF?text=RC",
        });

        notification.onclick = function () {
          window.focus();
          this.close();
        };

        resolve();
      } catch (error) {
        console.error("Error showing browser notification:", error);
        reject(new Error("Failed to show browser notification"));
      }
    });
  }

  // Email Notification Function
  function sendEmailNotification(timestamp, location) {
    return new Promise((resolve, reject) => {
      if (!areSettingsConfigured()) {
        reject(new Error("Email settings are not configured"));
        return;
      }

      const templateParams = {
        to_email: notificationSettings.recipientEmail,
        message:
          notificationSettings.customMessage || "Customer needs assistance",
        timestamp: timestamp,
        location: location,
      };

      emailjs
        .send(
          notificationSettings.emailServiceID,
          notificationSettings.emailTemplateID,
          templateParams
        )
        .then(function (response) {
          console.log("Email sent successfully:", response);
          resolve();
        })
        .catch(function (error) {
          console.error("Error sending email:", error);
          reject(new Error("Failed to send email notification"));
        });
    });
  }

  // Show Success Notification
  function showSuccess() {
    notification.classList.remove("hidden");
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 5000);
  }

  // Show Error Notification
  function showError(message) {
    errorMessage.textContent = message;
    errorNotification.classList.remove("hidden");
    setTimeout(() => {
      errorNotification.classList.add("hidden");
    }, 5000);
  }

  // Settings Modal Events
  settingsButton.addEventListener("click", function () {
    settingsModal.style.display = "block";
  });

  closeButton.addEventListener("click", function () {
    settingsModal.style.display = "none";
  });

  // Setup Guide Modal Events
  setupGuideButton.addEventListener("click", function () {
    setupGuideModal.style.display = "block";
  });

  closeGuideButton.addEventListener("click", function () {
    setupGuideModal.style.display = "none";
  });

  openSettingsButton.addEventListener("click", function () {
    setupGuideModal.style.display = "none";
    settingsModal.style.display = "block";
  });

  window.addEventListener("click", function (event) {
    if (event.target === settingsModal) {
      settingsModal.style.display = "none";
    }
    if (event.target === setupGuideModal) {
      setupGuideModal.style.display = "none";
    }
  });

  // Save Settings
  settingsForm.addEventListener("submit", function (e) {
    e.preventDefault();

    notificationSettings = {
      recipientEmail: document.getElementById("recipientEmail").value,
      notificationType: document.getElementById("notificationType").value,
      customMessage:
        document.getElementById("customMessage").value ||
        "Customer needs assistance",
      emailServiceID: document.getElementById("emailServiceID").value,
      emailTemplateID: document.getElementById("emailTemplateID").value,
      emailUserID: document.getElementById("emailUserID").value,
    };

    // Save to localStorage
    localStorage.setItem(
      "notificationSettings",
      JSON.stringify(notificationSettings)
    );

    // Initialize EmailJS with the new user ID
    initEmailJS();

    // If browser notifications are selected, request permission
    if (
      notificationSettings.notificationType === "browser" ||
      notificationSettings.notificationType === "both"
    ) {
      requestNotificationPermission();
    }

    // Close modal
    settingsModal.style.display = "none";

    // Show confirmation
    alert("Settings saved successfully!");
  });

  // Contact Form Submit
  contactSubmit.addEventListener("click", function () {
    const name = document.getElementById("contactName").value;
    const email = document.getElementById("contactEmail").value;
    const message = document.getElementById("contactMessage").value;

    if (!name || !email || !message) {
      alert("Please fill in all fields");
      return;
    }

    // Disable button and show loading state
    contactSubmit.disabled = true;
    contactSubmit.innerHTML = '<div class="spinner"></div> Sending...';

    // Use EmailJS to send the contact form
    if (areSettingsConfigured()) {
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_email: notificationSettings.recipientEmail,
      };

      emailjs
        .send(
          notificationSettings.emailServiceID,
          notificationSettings.emailTemplateID,
          templateParams
        )
        .then(function () {
          // Reset form
          document.getElementById("contactName").value = "";
          document.getElementById("contactEmail").value = "";
          document.getElementById("contactMessage").value = "";

          // Reset button
          contactSubmit.disabled = false;
          contactSubmit.innerHTML = "Send Message";

          // Show success
          alert("Message sent successfully!");
        })
        .catch(function (error) {
          console.error("Error sending contact form:", error);

          // Reset button
          contactSubmit.disabled = false;
          contactSubmit.innerHTML = "Send Message";

          // Show error
          alert("Failed to send message. Please try again.");
        });
    } else {
      // Reset button
      contactSubmit.disabled = false;
      contactSubmit.innerHTML = "Send Message";

      // Show error
      alert("Email settings are not configured. Please set up EmailJS first.");
      setupGuideModal.style.display = "block";
    }
  });

  // Request Browser Notification Permission
  function requestNotificationPermission() {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }

    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          console.log("Notification permission granted");
        }
      });
    }
  }

  // Check for notification permission on page load
  if (
    notificationSettings.notificationType === "browser" ||
    notificationSettings.notificationType === "both"
  ) {
    requestNotificationPermission();
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: "smooth",
          });
        }
      }
    });
  });
});
