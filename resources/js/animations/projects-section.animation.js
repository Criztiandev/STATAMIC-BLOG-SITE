import gsap from "gsap";

export function initProjectsAnimation() {
    const projectsSection = document.querySelector("#projects-section");

    if (!projectsSection) return;

    gsap.fromTo(
        projectsSection,
        {
            scale: 0.8,
            opacity: 0,
        },
        {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: projectsSection,
                start: "top 85%",
                end: "top 65%",
                scrub: 1,
            },
        }
    );

    const projectItems = document.querySelectorAll(".project-item");
    if (projectItems.length > 0) {
        // Set initial state for all items
        gsap.set(projectItems, { y: 100, opacity: 0 });

        const bounceTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: projectsSection,
                start: "top 75%",
                toggleActions: "play none none none",
            },
        });

        projectItems.forEach((item, index) => {
            bounceTimeline.to(
                item,
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "elastic.out(1, 0.5)",
                },
                index * 0.3
            );
        });

        bounceTimeline.eventCallback("onComplete", () => {
            initProjectHoverAnimations(projectItems);
        });
    }
}

function initProjectHoverAnimations(projectItems) {
    const projectItemsArray = Array.from(projectItems);
    let lockedIndex = 0;

    projectItemsArray.forEach((item, currentIndex) => {
        const title = item.querySelector(".project-title");
        if (!title) return;

        const originalText = title.textContent.trim();
        gsap.set(title, { opacity: 0 });

        item.addEventListener("click", () => {
            lockedIndex = currentIndex;
            setDominantItem(currentIndex, projectItemsArray);
        });

        item.addEventListener("mouseenter", () => {
            projectItemsArray.forEach((otherItem) => {
                gsap.killTweensOf(otherItem);
                const otherTitle = otherItem.querySelector(".project-title");
                if (otherTitle) {
                    gsap.killTweensOf(otherTitle);
                    gsap.killTweensOf(otherTitle.querySelectorAll("span"));
                }
            });

            projectItemsArray.forEach((otherItem, otherIndex) => {
                if (otherIndex === currentIndex) {
                    gsap.to(otherItem, {
                        flex: 2,
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: true,
                    });
                } else {
                    gsap.to(otherItem, {
                        flex: 1,
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: true,
                    });

                    const otherTitle =
                        otherItem.querySelector(".project-title");
                    if (otherTitle) {
                        gsap.to(otherTitle, {
                            opacity: 0,
                            duration: 0.2,
                            ease: "power2.out",
                            overwrite: true,
                        });
                    }
                }
            });

            title.innerHTML = "";

            const letterSpans = originalText.split("").map((char) => {
                const span = document.createElement("span");
                span.textContent = char;
                span.style.opacity = "0";
                span.style.display = "inline-block";
                span.style.whiteSpace = "pre";
                title.appendChild(span);
                return span;
            });

            gsap.fromTo(
                title,
                { opacity: 0, y: 15 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: true,
                }
            );

            letterSpans.forEach((letter, index) => {
                const randomDelay = Math.random() * 0.02 + 0.005;
                const baseDelay = index * 0.015;
                const totalDelay = baseDelay + randomDelay;

                gsap.to(letter, {
                    opacity: 1,
                    duration: 0.1,
                    delay: totalDelay,
                    ease: "power1.out",
                    overwrite: true,
                });
            });
        });

        item.addEventListener("mouseleave", () => {
            gsap.killTweensOf(title);
            gsap.killTweensOf(title.children);

            setDominantItem(lockedIndex, projectItemsArray);

            if (currentIndex !== lockedIndex) {
                gsap.to(title, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out",
                    onComplete: () => {
                        title.innerHTML = originalText;
                    },
                });
            }
        });
    });

    function setDominantItem(dominantIndex, items) {
        items.forEach((otherItem, otherIndex) => {
            gsap.killTweensOf(otherItem);

            const targetFlex = otherIndex === dominantIndex ? 2 : 1;
            gsap.to(otherItem, {
                flex: targetFlex,
                duration: 0.5,
                ease: "power2.out",
            });

            const otherTitle = otherItem.querySelector(".project-title");
            if (otherTitle) {
                if (otherIndex === dominantIndex) {
                    showTitle(otherTitle);
                } else {
                    gsap.to(otherTitle, {
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.out",
                    });
                }
            }
        });
    }

    function showTitle(titleElement) {
        const text = titleElement.textContent.trim();
        titleElement.innerHTML = "";

        const letterSpans = text.split("").map((char) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.opacity = "0";
            span.style.display = "inline-block";
            span.style.whiteSpace = "pre";
            titleElement.appendChild(span);
            return span;
        });

        // Fade up title
        gsap.fromTo(
            titleElement,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
            }
        );

        // Animate letters
        letterSpans.forEach((letter, index) => {
            const randomDelay = Math.random() * 0.03 + 0.01;
            const baseDelay = index * 0.02;
            const totalDelay = baseDelay + randomDelay;

            gsap.to(letter, {
                opacity: 1,
                duration: 0.15,
                delay: totalDelay,
                ease: "power1.out",
            });
        });
    }

    // Initialize with center item locked and title showing
    setDominantItem(lockedIndex, projectItemsArray);
}
