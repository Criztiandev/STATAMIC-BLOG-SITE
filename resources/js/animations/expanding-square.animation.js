import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize expanding square animation on scroll
 * Starts small and expands as user scrolls
 */
export function initExpandingSquareAnimation() {
    const square = document.querySelector("#expanding-square");
    const container = document.querySelector("#expanding-square-container");

    if (!square || !container) return;

    // Set initial state - 300x300 square
    gsap.set(square, {
        width: 800,
        height: 500,
    });

    // Animate expansion on scroll
    gsap.to(square, {
        width: "90vw",
        height: 600,
        scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
            markers: false, // Set to true for debugging
        },
    });
}
