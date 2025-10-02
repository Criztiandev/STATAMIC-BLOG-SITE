import gsap from "gsap";

/**
 * Initialize awards section hover animations
 * Each award row transitions background to black and text to white on hover
 */
export function initAwardsAnimation() {
    const awardsSection = document.querySelector("#awards-section");

    if (!awardsSection) return; // Exit if not on a page with awards section

    const awardRows = awardsSection.querySelectorAll(".award-row");

    awardRows.forEach((row) => {
        // Mouse enter - animate to black background and white text
        row.addEventListener("mouseenter", () => {
            gsap.to(row, {
                backgroundColor: "#000000",
                color: "#ffffff",
                duration: 0.3,
                ease: "power2.out",
            });
        });

        // Mouse leave - animate back to original state
        row.addEventListener("mouseleave", () => {
            gsap.to(row, {
                backgroundColor: "transparent",
                color: "#000000",
                duration: 0.3,
                ease: "power2.out",
            });
        });
    });
}
