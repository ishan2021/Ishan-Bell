(function () {
  emailjs.init("rXVp9lym5eA4ajpBH"); // Replace with your User ID from EmailJS
})();

function notifyReception() {
  // Displaying notification that message is being sent
  const notification = document.getElementById("notification");
  notification.classList.remove("hidden");

  // Hide the notification after 3 seconds
  setTimeout(function () {
    notification.classList.add("hidden");
  }, 3000);

  // Sending email using EmailJS
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
        const errorNotification = document.getElementById("errorNotification");
        errorNotification.classList.remove("hidden");
        setTimeout(function () {
          errorNotification.classList.add("hidden");
        }, 3000);
        console.log("Error:", error);
      }
    );
}
