function notifyReception() {
  const notification = document.getElementById("notification");
  const errorNotification = document.getElementById("errorNotification");

  // Reset animations
  notification.classList.remove("hide");
  notification.classList.add("show");

  // Hide after 3.5s with fadeOut
  setTimeout(() => {
    notification.classList.remove("show");
    notification.classList.add("hide");
  }, 3500);

  // Send EmailJS notification
  emailjs
    .send("service_q8xh8ra", "template_6c2763g", {
      visitor_name: "A guest",
      message: "Someone clicked the reception bell!",
    })
    .then(
      function (response) {
        console.log("Success:", response);
      },
      function (error) {
        // Handle error with animation
        errorNotification.classList.remove("hide");
        errorNotification.classList.add("show");

        setTimeout(() => {
          errorNotification.classList.remove("show");
          errorNotification.classList.add("hide");
        }, 3500);

        console.log("Error:", error);
      }
    );
}
