// This is all you.
import { createIcons, Mail, Phone, MapPin } from "lucide";
import gsap from "gsap";
import { initHeroAnimation } from "./animations/hero-section.animation";
import { initScrollAnimations } from "./animations/scroll-animations";
import { initProjectsAnimation } from "./animations/projects-section.animation";
import { initContentAnimation } from "./animations/content-section.animation";
import { initRecognitionAnimation } from "./animations/recognition-section.animation";
import { initServicesAnimation } from "./animations/services-section.animation";
import { initDecryptedText } from "./animations/decrypted-text";

// Initialize Lucide icons
document.addEventListener("DOMContentLoaded", () => {
    createIcons({
        icons: {
            Mail,
            Phone,
            MapPin,
        },
    });

    initHeroAnimation();
    initScrollAnimations();
    initProjectsAnimation();
    initContentAnimation();
    initRecognitionAnimation();
    initServicesAnimation();
    initGsapAnimations();

    initDecryptedText("[data-decrypt]", {
        speed: 48,
        maxIterations: 15,
        sequential: true,
        revealDirection: "start",
        useOriginalCharsOnly: true,
        encryptedClass: "text-gray-400",
        animateOn: "both",
    });

    initDecryptedText("[data-decrypt-view]", {
        speed: 48,
        sequential: true,
        revealDirection: "start",
        useOriginalCharsOnly: true,
        animateOn: "view",
    });

    initDecryptedText("[data-decrypt-hover]", {
        speed: 48,
        sequential: true,
        revealDirection: "start",
        useOriginalCharsOnly: true,
        animateOn: "hover",
    });
});

function initGsapAnimations() {
    // Generic animations for other sections (not hero)
    // Fade in and slide up animation for elements with .gsap-fade-in class
    gsap.from(".gsap-fade-in", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
    });

    gsap.from(".gsap-scale", {
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
    });

    // Note: .gsap-fade-down and .gsap-fade-up removed from generic animations
    // Hero section handles these specifically in initHeroAnimation()
}
