import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize recognition section scroll animation
 * Text lines appear one by one as you scroll, stacking vertically
 */
export function initRecognitionAnimation() {
    const section = document.querySelector("#recognition-section");
    if (!section) return;

    // Check if animation already initialized
    if (section.dataset.animated === "true") return;
    section.dataset.animated = "true";

    const textLines = gsap.utils.toArray("#recognition-section .recognition-line");
    if (!textLines.length) return;

    // Create timeline for text animations
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top", // Pin when section reaches top
            end: `+=${window.innerHeight * 2}`, // Pin for 2 viewport heights of scrolling
            pin: true, // Pin the section during scroll
            scrub: 1, // Link animation progress to scroll (1 = slight delay for smoothness)
            anticipatePin: 1,
            // markers: true, // Uncomment for debugging
        },
    });

    // Set initial state - all lines start below viewport
    gsap.set(textLines, {
        y: 100,
        opacity: 0,
    });

    // Animate each text line sequentially - slide up into view
    textLines.forEach((line, index) => {
        timeline.to(
            line,
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
            },
            index * 0.5 // Stagger: each line starts 0.5 timeline units after previous
        );
    });
}
