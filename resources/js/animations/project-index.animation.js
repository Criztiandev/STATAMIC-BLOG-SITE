import gsap from "gsap";

/**
 * Initialize project index page hover animations
 * Minimalistic hover effect - subtle opacity fade
 */
export function initProjectIndexAnimation() {
    const projectItems = document.querySelectorAll(".project-item");

    if (projectItems.length === 0) return;

    projectItems.forEach((item) => {
        item.addEventListener("mouseenter", () => {
            gsap.to(item, {
                opacity: 0.7,
                duration: 0.3,
                ease: "power2.out",
            });
        });

        item.addEventListener("mouseleave", () => {
            gsap.to(item, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
            });
        });
    });
}
