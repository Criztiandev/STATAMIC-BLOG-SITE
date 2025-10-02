import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize content section animations
 * Word-by-word reveal for intro text and challenge section
 */
export function initContentAnimation() {
    const contentSection = document.querySelector("#content-section");
    const contentIntro = document.querySelector("#content-intro");
    const contentChallenge = document.querySelector("#content-challenge");

    if (!contentSection || !contentIntro || !contentChallenge) return;

    // Check if animation already initialized
    if (contentSection.dataset.animated === "true") return;
    contentSection.dataset.animated = "true";

    // Store original text before any manipulation
    const introText = contentIntro.textContent.trim();
    const challengeHeading = contentChallenge.querySelector(".challenge-heading");
    const challengeText = contentChallenge.querySelector(".challenge-text");

    if (!challengeHeading || !challengeText) return;

    const headingText = challengeHeading.textContent.trim();
    const textContent = challengeText.textContent.trim();

    // Create timeline triggered on scroll
    const contentTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: contentSection,
            start: "top 75%",
            toggleActions: "play none none none",
            // markers: true, // Uncomment for debugging
        },
    });

    // Step 1: Animate intro paragraph (medium-fast)
    animateTextWithLetters(contentIntro, contentTimeline, introText, {
        containerY: 30,
        containerDuration: 0.6,
        letterBaseDelay: 0.015,
        letterRandomDelay: 0.01,
        letterDuration: 0.12,
    });

    // Step 2: Animate challenge section after intro (sequential)
    // Animate heading letters
    animateTextWithLetters(challengeHeading, contentTimeline, headingText, {
        containerY: 30,
        containerDuration: 0.6,
        letterBaseDelay: 0.015,
        letterRandomDelay: 0.01,
        letterDuration: 0.12,
    });

    // Animate challenge text letters
    animateTextWithLetters(challengeText, contentTimeline, textContent, {
        containerY: 30,
        containerDuration: 0.6,
        letterBaseDelay: 0.015,
        letterRandomDelay: 0.01,
        letterDuration: 0.12,
    });
}

/**
 * Helper function to animate text with letter-by-letter reveal
 * Wraps words in containers to prevent mid-word wrapping
 */
function animateTextWithLetters(element, timeline, textToAnimate, options = {}) {
    const {
        containerY = 30,
        containerDuration = 0.6,
        letterBaseDelay = 0.02,
        letterRandomDelay = 0.01,
        letterDuration = 0.15,
        position = "+=0",
    } = options;

    // Clear element
    element.innerHTML = "";

    // Split text into words, then letters
    const words = textToAnimate.split(" ");
    const allLetters = [];

    words.forEach((word, wordIndex) => {
        // Create word container to prevent wrapping mid-word
        const wordContainer = document.createElement("span");
        wordContainer.style.display = "inline-block";
        wordContainer.style.whiteSpace = "nowrap";

        // Split word into letter spans
        word.split("").forEach((char) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.visibility = "hidden";
            span.style.opacity = "0";
            span.style.display = "inline-block";
            wordContainer.appendChild(span);
            allLetters.push(span); // Add to sequential letter array
        });

        element.appendChild(wordContainer);

        // Add space after word (except last word) and include in letter sequence
        if (wordIndex < words.length - 1) {
            const space = document.createElement("span");
            space.textContent = " ";
            space.style.display = "inline-block";
            space.style.visibility = "hidden";
            space.style.opacity = "0";
            element.appendChild(space);
            allLetters.push(space); // Add space to letter sequence for animation
        }
    });

    // Fade up container if needed
    if (containerDuration > 0) {
        timeline.from(
            element,
            {
                opacity: 0,
                y: containerY,
                duration: containerDuration,
                ease: "power2.out",
            },
            position
        );
    }

    // Animate letters with jittery timing
    allLetters.forEach((letter, index) => {
        const randomDelay = Math.random() * letterRandomDelay;
        const baseDelay = index * letterBaseDelay;
        const totalDelay = baseDelay + randomDelay;

        timeline.to(
            letter,
            {
                visibility: "visible",
                opacity: 1,
                duration: letterDuration,
                ease: "power1.out",
            },
            containerDuration + totalDelay // Start after container animation + letter delay
        );
    });
}
