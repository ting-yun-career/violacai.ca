import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

(function ($) {
  "use strict";
  $(function () {
    $(document).on("click", 'a[data-scroll][href^="#"]', function (e) {
      var id = $(this).attr("href");
      var $id = $(id);
      if ($id.length === 0) {
        return;
      }
      e.preventDefault();
      $("body, html").animate(
        {
          scrollTop: $id.offset().top,
        },
        600
      );
    });

    gsap.registerPlugin(ScrollTrigger, SplitText);

    gsap.to("body", { opacity: 1, duration: 3, ease: "power2.inOut" });

    gsap.utils.toArray(".sidebar .nav-link").forEach((link) => {
      let target = document.querySelector(link.getAttribute("href"));

      ScrollTrigger.create({
        trigger: target,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            document
              .querySelectorAll(".sidebar .nav-link")
              .forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
          }
        },
      });
    });

    (function () {
      var animationDelay = 2500,
        revealDuration = 660,
        revealAnimationDelay = 1500;

      initHeadline();

      function initHeadline() {
        animateHeadline($(".cd-headline"));
      }

      function animateHeadline($headlines) {
        var duration = animationDelay;
        $headlines.each(function () {
          var headline = $(this);
          if (headline.hasClass("clip")) {
            var spanWrapper = headline.find(".cd-words-wrapper"),
              newWidth = spanWrapper.width() + 10;
            spanWrapper.css("width", newWidth);
          }

          setTimeout(function () {
            hideWord(headline.find(".is-visible").eq(0));
          }, duration);
        });
      }

      function hideWord($word) {
        var nextWord = takeNext($word);

        if ($word.parents(".cd-headline").hasClass("clip")) {
          $word.parents(".cd-words-wrapper").animate(
            {
              width: "2px",
            },
            revealDuration,
            function () {
              switchWord($word, nextWord);
              showWord(nextWord);
            }
          );
        }
      }

      function showWord($word, $duration) {
        if ($word.parents(".cd-headline").hasClass("clip")) {
          $word.parents(".cd-words-wrapper").animate(
            {
              width: $word.width() + 10,
            },
            revealDuration,
            function () {
              setTimeout(function () {
                hideWord($word);
              }, revealAnimationDelay);
            }
          );
        }
      }

      function takeNext($word) {
        return !$word.is(":last-child")
          ? $word.next()
          : $word.parent().children().eq(0);
      }

      function takePrev($word) {
        return !$word.is(":first-child")
          ? $word.prev()
          : $word.parent().children().last();
      }

      function switchWord($oldWord, $newWord) {
        $oldWord.removeClass("is-visible").addClass("is-hidden");
        $newWord.removeClass("is-hidden").addClass("is-visible");
      }
    })();

    particlesJS("particles-js", {
      particles: {
        number: {
          value: 4,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000",
          },
          polygon: {
            nb_sides: 6,
          },
          image: {
            src: "img/github.svg",
            width: 100,
            height: 100,
          },
        },
        opacity: {
          value: 0.2,
          random: true,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 90,
          random: false,
          anim: {
            enable: true,
            speed: 10,
            size_min: 40,
            sync: false,
          },
        },
        line_linked: {
          enable: false,
          distance: 200,
          color: "#ffffff",
          opacity: 1,
          width: 2,
        },
        move: {
          enable: true,
          speed: 8,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: false,
            mode: "grab",
          },
          onclick: {
            enable: false,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    });
  });
  $(window).on("load", function () {
    $(".preloader-icon").fadeOut(400);
    $(".preloader").delay(500).fadeOut("slow");

    let hireTitleSplit = new SplitText(".hire-title", { type: "words" });
    gsap.from(hireTitleSplit.words, {
      scrollTrigger: {
        trigger: ".hire-area",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse",
      },
      y: (index) => (index % 2 === 0 ? -10 : 10),
      opacity: 0,
      stagger: 0.05,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
  });
})(jQuery);
