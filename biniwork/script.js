(function () {
  emailjs.init("rXVp9lym5eA4ajpBH"); // Replace with your User ID from EmailJS
})();

function notifyReception() {
  // Replace 'YOUR_SERVICE_ID' with the actual service ID (e.g., "gmail")
  // Replace 'YOUR_TEMPLATE_ID' with the actual Template ID you created
  emailjs
    .send("service_q8xh8ra", "template_6c2763g", {
      visitor_name: "A guest",
      message: "Someone clicked the reception bell!",
    })
    .then(
      function (response) {
        alert("Reception has been notified!");
      },
      function (error) {
        alert("Oops! Something went wrong.");
        console.log(error);
      }
    );
}