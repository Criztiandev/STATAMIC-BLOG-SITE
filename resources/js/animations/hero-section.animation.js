import gsap from "gsap";

export function initHeroAnimation() {
    const heroTitle = document.querySelector("#hero-title");
    const heroSubtitle = document.querySelector("#hero-subtitle");
    const heroBottom = document.querySelector("#hero-bottom");
    const header = document.querySelector("header");

    if (!heroTitle) return; // Exit if not on a page with hero section

    const heroTimeline = gsap.timeline();

    heroTimeline.from(
        header,
        {
            opacity: 0,
            y: -100,
            duration: 1,
            ease: "power3.out",
        },
        0
    );

    heroTimeline.from(
        heroBottom,
        {
            opacity: 0,
            y: 100,
            duration: 1,
            ease: "power3.out",
        },
        0
    );

    heroTimeline.from(
        heroTitle,
        {
            opacity: 0,
            y: 50,
            duration: 0.6,
            ease: "power2.out",
        },
        "-=0.3"
    );

    if (heroSubtitle) {
        const text = heroSubtitle.textContent.trim();
        heroSubtitle.innerHTML = "";

        const letters = text.split("").map((char) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.opacity = "0";
            span.style.display = "inline-block";
            span.style.whiteSpace = "pre";
            heroSubtitle.appendChild(span);
            return span;
        });

        heroTimeline.from(
            heroSubtitle,
            {
                y: 30,
                duration: 1.5,
                ease: "power2.out",
            },
            "-=0.2"
        );

        letters.forEach((letter, index) => {
            const randomDelay = Math.random() * 0.03 + 0.01;
            const baseDelay = index * 0.02;
            const totalDelay = baseDelay + randomDelay;

            heroTimeline.to(
                letter,
                {
                    opacity: 1,
                    duration: 0.15,
                    ease: "power1.out",
                },
                `-=${Math.max(0, 1.5 - totalDelay)}`
            );
        });
    }
}
