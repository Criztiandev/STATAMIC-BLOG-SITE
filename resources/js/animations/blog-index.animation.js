import gsap from "gsap";

/**
 * Initialize blog index page hover animations
 * Minimalistic hover effect - subtle opacity fade
 */
export function initBlogIndexAnimation() {
    const blogItems = document.querySelectorAll(".blog-item");

    if (blogItems.length === 0) return;

    blogItems.forEach((item) => {
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
