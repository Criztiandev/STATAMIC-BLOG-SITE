import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize services section scroll animation
 * Text lines slide in alternating from left and right as you scroll
 */
export function initServicesAnimation() {
    const section = document.querySelector("#services-section");
    if (!section) return;

    // Check if animation already initialized
    if (section.dataset.animated === "true") return;
    section.dataset.animated = "true";

    const textLines = gsap.utils.toArray("#services-section .service-line");
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

    // Animate each text line sequentially - alternating left/right
    textLines.forEach((line, index) => {
        const isEven = index % 2 === 0;
        const xStart = isEven ? -200 : 200; // Even = from left, Odd = from right

        // Set initial state
        gsap.set(line, {
            x: xStart,
            opacity: 0,
        });

        // Animate to center
        timeline.to(
            line,
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
            },
            index * 0.4 // Stagger: each line starts 0.4 timeline units after previous
        );
    });
}
