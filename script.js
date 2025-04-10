function notifyReception() {
  const notification = document.getElementById("notification");
  const errorNotification = document.getElementById("errorNotification");



  // Show success notification with GSAP
  gsap.killTweensOf(notification);
  gsap.set(notification, { opacity: 0, y: "-20%" });
  gsap.to(notification, {
    duration: 0.6,
    opacity: 1,
    y: "-50%",
    display: "flex",
    ease: "power3.out",
  });

  // Hide after 3.5s
  setTimeout(() => {
    gsap.to(notification, {
      duration: 0.5,
      opacity: 0,
      y: "-60%",
      ease: "power2.in",
    });
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
        console.log("Error:", error);

        // Show error notification with GSAP
        gsap.killTweensOf(errorNotification);
        gsap.set(errorNotification, { opacity: 0, y: "-20%" });
        gsap.to(errorNotification, {
          duration: 0.6,
          opacity: 1,
          y: "-50%",
          display: "flex",
          ease: "power3.out",
        });

        setTimeout(() => {
          gsap.to(errorNotification, {
            duration: 0.5,
            opacity: 0,
            y: "-60%",
            ease: "power2.in",
          });
        }, 3500);
      }
    );
}
