document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("callButton").addEventListener("touchstart", notifyReception);
});

(function () {
  emailjs.init("r87F37EBTB8BIXB16"); // Replace with your actual EmailJS User ID
})();

function notifyReception() {
  const notification = document.getElementById("notification");
  const errorNotification = document.getElementById("errorNotification");

  emailjs
    .send("service_n5uf9wr", "template_kw277jr", {
      visitor_name: "A guest",
      message: "Someone clicked the reception bell!",
    })
    .then(
      function () {
        gsap.killTweensOf(notification);
        gsap.set(notification, {
          opacity: 0,
          y: "-20%",
          backgroundColor: "var(--success-color)",
          boxShadow: "0 6px 15px rgba(16, 185, 129, 0.3)",
        });
        gsap.to(notification, {
          duration: 0.4,
          opacity: 1,
          y: "-50%",
          display: "flex",
          ease: "power3.out",
        });
        setTimeout(() => {
          gsap.to(notification, {
            duration: 5,
            opacity: 0,
            y: "-60%",
            ease: "power2.in",
          });
        }, 300);
      },
      function () {
        gsap.killTweensOf(errorNotification);
        gsap.set(errorNotification, {
          opacity: 0,
          y: "-20%",
          backgroundColor: "var(--error-color)",
          boxShadow: "0 6px 15px #ff1d1d",
        });
        gsap.to(errorNotification, {
          duration: 0.4,
          opacity: 1,
          y: "-50%",
          display: "flex",
          ease: "power3.out",
        });
        setTimeout(() => {
          gsap.to(errorNotification, {
            duration: 0.3,
            opacity: 0,
            y: "-60%",
            ease: "power2.in",
          });
        }, 300);
      }
    );
}
