const OPENAI_API_KEY = "your_openai_api_key";

console.log("WOO!!!");

document.addEventListener("DOMContentLoaded", () => {
    console.log("Doing stuff...")
    const messageContainers = document.querySelectorAll(".message-feed");
    const inputBox = document.querySelector("textarea.message-input");

    messageContainers.forEach((container) => {
        const originalText = container.textContent || "";
        const toggleButton = createToggleButton(container, originalText);

        container.parentElement?.appendChild(toggleButton);
    });

    if (inputBox) {
        const rewriteButton = createRewriteButton(inputBox);
        inputBox.parentElement?.appendChild(rewriteButton);
    }
});

function createToggleButton(container: Element, originalText: string): HTMLButtonElement {
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "Rewrite with ChatGPT";
    toggleButton.style.marginLeft = "10px";

    toggleButton.addEventListener("click", async () => {
        const rewrittenText = await rewriteMessage(originalText);
        container.textContent = rewrittenText || originalText;
    });

    return toggleButton;
}

function createRewriteButton(inputBox: Element): HTMLButtonElement {
    const rewriteButton = document.createElement("button");
    rewriteButton.textContent = "Rewrite Input";
    rewriteButton.style.marginLeft = "10px";

    rewriteButton.addEventListener("click", async () => {
        const originalInput = (inputBox as HTMLTextAreaElement).value;
        const rewrittenInput = await rewriteMessage(originalInput);
        (inputBox as HTMLTextAreaElement).value = rewrittenInput || originalInput;
    });

    return rewriteButton;
}

async function rewriteMessage(message: string): Promise<string | null> {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await response.json();
        return data.choices[0]?.message?.content || null;
    } catch (error) {
        console.error("Error rewriting message:", error);
        return null;
    }
}