document.addEventListener("DOMContentLoaded", () => {
  const revealItems = document.querySelectorAll(".reveal");

  revealItems.forEach((item) => {
    const delay = item.dataset.delay;
    if (delay) {
      item.style.setProperty("--delay", `${delay}ms`);
    }
  });

  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));

  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector(".contact-submit") || contactForm.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      const payload = {
        name: contactForm.querySelector("#contact-name")?.value?.trim() || "",
        email: contactForm.querySelector("#contact-email")?.value?.trim() || "",
        phone: contactForm.querySelector("#contact-phone")?.value?.trim() || "",
        address: contactForm.querySelector("#contact-address")?.value?.trim() || "",
        pincode: contactForm.querySelector("#contact-pincode")?.value?.trim() || "",
        service: contactForm.querySelector("#contact-service")?.value?.trim() || ""
      };

      try {
        const res = await fetch("http://localhost:5000/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        alert(res.ok ? "Appointment request submitted successfully." : (data?.error || "Submission failed."));
        if (res.ok) contactForm.reset();
      } catch (err) {
        alert("Network error. Please try again.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Get Appointment";
        }
      }
    });
  }
});

