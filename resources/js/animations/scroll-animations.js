import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Lenis smooth scroll instance
let lenis;

/**
 * Initialize Lenis smooth scroll with GSAP ScrollTrigger integration
 */
function initLenisScroll() {
    // Initialize Lenis with damping/lerp settings
    lenis = new Lenis({
        duration: 1.2, // Animation duration (higher = slower/smoother)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
        lerp: 0.1, // Linear interpolation intensity (0-1, lower = more damping/slippery)
        smoothWheel: true, // Enable smooth scrolling for mouse wheel
        smoothTouch: false, // Disable on touch devices (can cause issues on mobile)
        touchMultiplier: 2, // Touch scroll speed multiplier
    });

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Add Lenis to GSAP ticker for smooth integration
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000); // Convert GSAP time to milliseconds
    });

    // Disable GSAP's lag smoothing for better Lenis integration
    gsap.ticker.lagSmoothing(0);
}

/**
 * Initialize scroll animations
 * Sets up Lenis smooth scroll and GSAP ScrollTrigger configuration
 */
export function initScrollAnimations() {
    // Initialize Lenis smooth scroll first
    initLenisScroll();

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
        toggleActions: "play none none none", // onEnter, onLeave, onEnterBack, onLeaveBack
        start: "top 80%", // Default trigger point
        // markers: true, // Uncomment for debugging
    });
}

export function refreshScrollTriggers() {
    ScrollTrigger.refresh();
}

export function killScrollTriggers() {
    ScrollTrigger.killAll();
}
