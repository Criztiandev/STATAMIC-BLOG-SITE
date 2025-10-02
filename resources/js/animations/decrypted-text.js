const DEFAULT_OPTIONS = {
    speed: 1000,
    maxIterations: 10,
    sequential: true,
    revealDirection: "start",
    useOriginalCharsOnly: true,
    characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    encryptedClass: "encrypted-char",
    animateOn: "hover", // 'hover' | 'view' | 'both'
};

export class DecryptedText {
    constructor(element, options = {}) {
        this.element = element;
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.originalText = element.textContent;
        this.displayText = this.originalText;
        this.revealedIndices = new Set();
        this.isScrambling = false;
        this.hasAnimated = false;
        this.interval = null;
        this.currentIteration = 0;
        this.isHovering = false;

        this.init();
    }

    init() {
        // Store original text for accessibility
        this.element.setAttribute("data-original-text", this.originalText);

        // Set up hover listeners if needed
        if (
            this.options.animateOn === "hover" ||
            this.options.animateOn === "both"
        ) {
            this.element.addEventListener("mouseenter", () => {
                if (!this.isHovering) {
                    this.isHovering = true;
                    this.startAnimation();
                }
            });
            this.element.addEventListener("mouseleave", () => {
                this.isHovering = false;
            });
        }

        // Set up intersection observer if needed
        if (
            this.options.animateOn === "view" ||
            this.options.animateOn === "both"
        ) {
            this.setupIntersectionObserver();
        }

        // Initial render
        this.renderText();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.startAnimation();
                        // Only set hasAnimated for 'view' trigger, not 'both'
                        if (this.options.animateOn === "view") {
                            this.hasAnimated = true;
                        }
                    }
                });
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0.1,
            }
        );

        observer.observe(this.element);
    }

    getNextIndex() {
        const textLength = this.originalText.length;
        const revealed = this.revealedIndices;

        switch (this.options.revealDirection) {
            case "start":
                return revealed.size;
            case "end":
                return textLength - 1 - revealed.size;
            case "center": {
                const middle = Math.floor(textLength / 2);
                const offset = Math.floor(revealed.size / 2);
                const nextIndex =
                    revealed.size % 2 === 0
                        ? middle + offset
                        : middle - offset - 1;

                if (
                    nextIndex >= 0 &&
                    nextIndex < textLength &&
                    !revealed.has(nextIndex)
                ) {
                    return nextIndex;
                }
                // Fallback: find first unrevealed
                for (let i = 0; i < textLength; i++) {
                    if (!revealed.has(i)) return i;
                }
                return 0;
            }
            default:
                return revealed.size;
        }
    }

    getAvailableChars() {
        if (this.options.useOriginalCharsOnly) {
            return Array.from(new Set(this.originalText.split(""))).filter(
                (char) => char !== " "
            );
        }
        return this.options.characters.split("");
    }

    shuffleText() {
        const revealed = this.revealedIndices;
        const availableChars = this.getAvailableChars();

        if (this.options.useOriginalCharsOnly) {
            // Shuffle only original characters
            const positions = this.originalText.split("").map((char, i) => ({
                char,
                isSpace: char === " ",
                index: i,
                isRevealed: revealed.has(i),
            }));

            const nonSpaceChars = positions
                .filter((p) => !p.isSpace && !p.isRevealed)
                .map((p) => p.char);

            // Fisher-Yates shuffle
            for (let i = nonSpaceChars.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [nonSpaceChars[i], nonSpaceChars[j]] = [
                    nonSpaceChars[j],
                    nonSpaceChars[i],
                ];
            }

            let charIndex = 0;
            return positions
                .map((p) => {
                    if (p.isSpace) return " ";
                    if (p.isRevealed) return this.originalText[p.index];
                    return nonSpaceChars[charIndex++];
                })
                .join("");
        } else {
            // Random character substitution
            return this.originalText
                .split("")
                .map((char, i) => {
                    if (char === " ") return " ";
                    if (revealed.has(i)) return this.originalText[i];
                    return availableChars[
                        Math.floor(Math.random() * availableChars.length)
                    ];
                })
                .join("");
        }
    }

    renderText() {
        // Clear element
        this.element.innerHTML = "";

        // Create accessible version (screen reader only)
        const srSpan = document.createElement("span");
        srSpan.className = "sr-only";
        srSpan.textContent = this.originalText;
        this.element.appendChild(srSpan);

        // Create visible version with character spans
        const visibleSpan = document.createElement("span");
        visibleSpan.setAttribute("aria-hidden", "true");

        this.displayText.split("").forEach((char, index) => {
            const charSpan = document.createElement("span");
            const isRevealed =
                this.revealedIndices.has(index) || !this.isScrambling;

            if (!isRevealed && this.options.encryptedClass) {
                charSpan.className = this.options.encryptedClass;
            }

            charSpan.textContent = char;
            visibleSpan.appendChild(charSpan);
        });

        this.element.appendChild(visibleSpan);
    }

    startAnimation() {
        // Prevent starting if already animating
        if (this.interval) return;

        this.isScrambling = true;
        this.currentIteration = 0;
        this.revealedIndices.clear();

        this.interval = setInterval(() => {
            if (this.options.sequential) {
                // Sequential reveal: one letter at a time
                if (this.revealedIndices.size < this.originalText.length) {
                    const nextIndex = this.getNextIndex();
                    this.revealedIndices.add(nextIndex);
                    this.displayText = this.shuffleText();
                    this.renderText();
                } else {
                    this.stopAnimation();
                }
            } else {
                // Non-sequential: scramble all, then reveal
                this.currentIteration++;

                if (this.currentIteration >= this.options.maxIterations) {
                    // Final iteration - show original text
                    this.stopAnimation();
                } else {
                    // Keep scrambling
                    this.displayText = this.shuffleText();
                    this.renderText();
                }
            }
        }, this.options.speed);
    }

    stopAnimation() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        this.isScrambling = false;
        this.displayText = this.originalText;
        this.revealedIndices.clear();
        this.currentIteration = 0;
        this.renderText();
    }

    destroy() {
        this.stopAnimation();
        this.element.textContent = this.originalText;
    }
}

/**
 * Initialize decrypted text animation on elements
 * @param {string} selector - CSS selector for elements to animate
 * @param {object} options - Animation options
 * @returns {DecryptedText[]} Array of DecryptedText instances
 */
export function initDecryptedText(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).map((el) => new DecryptedText(el, options));
}
