$(document).ready(() => {
    // Sticky navbar on scroll
    $(window).scroll(function () {
      if (this.scrollY > 20) {
        $(".navbar").addClass("sticky")
      } else {
        $(".navbar").removeClass("sticky")
      }
  
      // Scroll-up button show/hide
      if (this.scrollY > 500) {
        $(".scroll-up-btn").addClass("show")
      } else {
        $(".scroll-up-btn").removeClass("show")
      }
    })
  
    // Slide-up script
    $(".scroll-up-btn").click(() => {
      $("html").animate({ scrollTop: 0 })
      // Removing smooth scroll on slide-up button click
      $("html").css("scrollBehavior", "auto")
    })
  
    $(".navbar .menu li a").click(() => {
      // Applying again smooth scroll on menu items click
      $("html").css("scrollBehavior", "smooth")
    })
  
    // Toggle menu/navbar script
    $(".menu-btn").click(() => {
      $(".navbar .menu").toggleClass("active")
      $(".menu-btn i").toggleClass("active")
    })
  
    // Typing text animation script
    var typed1 = new Typed(".typing-1", {
      strings: ["Cloud Enthusiast", "Computer Engineer", "Web Developer"],
      typeSpeed: 100,
      backSpeed: 60,
      loop: true,
    })
  
    var typed2 = new Typed(".typing-2", {
      strings: ["Cloud Enthusiast", "Computer Engineer", "Web Developer"],
      typeSpeed: 100,
      backSpeed: 60,
      loop: true,
    })
  
    // Owl carousel script
    $(".carousel").owlCarousel({
      margin: 20,
      loop: true,
      autoplay: true,
      autoplayTimeOut: 2000,
      autoplayHoverPause: true,
      responsive: {
        0: {
          items: 1,
          nav: false,
        },
        600: {
          items: 2,
          nav: false,
        },
        1000: {
          items: 3,
          nav: false,
        },
      },
    })
  
    // Form submission handling
    $("#contact-form").submit((e) => {
      e.preventDefault()
  
      // Get form values
      const name = $("#name").val()
      const email = $("#email").val()
      const subject = $("#subject").val()
      const message = $("#message").val()
  
      // Simple form validation
      if (!name || !email || !subject || !message) {
        $("#form-status").html('<p style="color: #ff4500;">Please fill in all fields</p>')
        return
      }
  
      // Here you would typically send the form data to a server
      // For now, we'll just show a success message
      $("#form-status").html('<p style="color: green;">Thank you for your message! I will get back to you soon.</p>')
  
      // Clear the form
      $("#contact-form")[0].reset()
  
      // Hide the success message after 5 seconds
      setTimeout(() => {
        $("#form-status").html("")
      }, 5000)
    })
  
    // Add smooth scrolling to all links
    $("a").on("click", function (event) {
      // Make sure this.hash has a value before overriding default behavior
      if (this.hash !== "") {
        // Prevent default anchor click behavior
        event.preventDefault()
  
        // Store hash
        var hash = this.hash
  
        // Using jQuery's animate() method to add smooth page scroll
        $("html, body").animate(
          {
            scrollTop: $(hash).offset().top,
          },
          800,
          () => {
            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash
          },
        )
      }
    })
  
    // Add active class to the current navigation item
    $(window)
      .scroll(() => {
        var scrollDistance = $(window).scrollTop()
  
        // Assign active class to nav items when section is in viewport
        $("section").each(function (i) {
          if ($(this).position().top <= scrollDistance + 200) {
            $(".navbar .menu li a.active").removeClass("active")
            $(".navbar .menu li a").eq(i).addClass("active")
          }
        })
      })
      .scroll()
  
    // Animate elements when they come into view
    function animateOnScroll() {
      $(".project-card, .cert-card, .skill-item, .card").each(function () {
        var elementPosition = $(this).offset().top
        var topOfWindow = $(window).scrollTop()
        var windowHeight = $(window).height()
  
        if (elementPosition < topOfWindow + windowHeight - 100) {
          $(this).addClass("animate")
        }
      })
    }
  
    // Run animation on scroll
    $(window).scroll(() => {
      animateOnScroll()
    })
  
    // Run animation on page load
    animateOnScroll()
  
    // Certificate modal functionality
    const modal = document.getElementById("certificate-modal")
    const modalTitle = document.getElementById("modal-title")
    const modalImage = document.getElementById("modal-image")
    const closeModal = document.querySelector(".close-modal")
  
    // Certificate data
    const certificateData = [
      {
        title: "PCAP Programming Essentials in Python",
        issuer: "Cisco Networking Academy",
        image: "images/certificates/python_essential.png",
      },
      {
        title: "Introduction to Cybersecurity",
        issuer: "Cisco Networking Academy",
        image: "images/certificates/intro_to_cybersecurity.png",
      },
      {
        title: "Cybersecurity Essentials",
        issuer: "Cisco Networking Academy",
        image: "images/certificates/cybersecurity_essentials.png",
      },
      {
        title: "Mastering Data Structures and Algorithms using C/C++",
        issuer: "Udemy",
        image: "images/certificates/dsa_udemy.png",
      },
      {
        title: "Postman API Fundamentals",
        issuer: "Postman",
        image: "images/certificates/postman_api.png",
      },
      {
        title: "AWS Cloud Foundations",
        issuer: "AWS Academy",
        image: "images/certificates/aws_cloud_foundation.png",
      },
      {
        title: "AWS Cloud Essentials",
        issuer: "AWS Academy",
        image: "images/certificates/aws_cloud_essentials.png",
      },
    ]
  
    // Add click event to each certification card
    document.querySelectorAll(".cert-card").forEach((card, index) => {
      card.addEventListener("click", () => {
        if (index < certificateData.length) {
          const cert = certificateData[index]
          modalTitle.textContent = cert.title
          modalImage.src = cert.image
          modalImage.alt = cert.title
  
          // Show modal with animation
          modal.style.display = "block"
          // Use setTimeout to ensure display: block takes effect before adding the show class
          setTimeout(() => {
            modal.classList.add("show")
          }, 10)
          document.body.style.overflow = "hidden" // Prevent scrolling
        }
      })
    })
  
    // Close modal when clicking the X
    closeModal.addEventListener("click", () => {
      closeModalFunction()
    })
  
    // Close modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModalFunction()
      }
    })
  
    // Close modal with Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("show")) {
        closeModalFunction()
      }
    })
  
    // Function to close the modal properly
    function closeModalFunction() {
      modal.classList.remove("show")
      // Wait for the animation to complete before hiding the modal
      setTimeout(() => {
        modal.style.display = "none"
        document.body.style.overflow = "" // Re-enable scrolling
      }, 300)
    }
  })
  
  