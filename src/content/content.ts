
console.log("WOO!!!");
console.log("???");


chrome.runtime.sendMessage({ "type": "getOpenAIKey" }).then(async (response) => {
    console.log(`response from apikey request: ${JSON.stringify(response)}`);
    const apiKey = response.openApiKey;
    console.log(`key: ${apiKey}`);
    console.log(JSON.stringify(document.body));
    // main loop for content
    let debounceTimer: number | null = null;

    const debounce = (callback: () => void, delay: number) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = window.setTimeout(callback, delay);
    };
    
    const observer = new MutationObserver(() => {
      debounce(() => {
        const messages = document.querySelectorAll('.message-container');
        console.log(JSON.stringify(messages));
        messages.forEach((message) => {
          const element = message as HTMLElement;
          const originalText = element.innerText;
          const rewrittenText = "Rewritten: " + originalText; // Replace with your actual logic
          element.innerText = rewrittenText;
        });
      }, 500); // Adjust delay as necessary
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

});



async function main(apiKey: string, records, observer) {
    console.log("Doing stuff...");
    console.log("apiKey: ", apiKey);
    console.log(`records: ${JSON.stringify(records)} observer: ${JSON.stringify(observer)}`)

    
    const messageContainers = document.querySelectorAll(".message-feed");
    console.log(`main: ${JSON.stringify(messageContainers)}`);
    const inputBox = document.querySelector("textarea.message-input");

    messageContainers.forEach((container) => {
        console.log(`container: ${JSON.stringify(container)}`)
        const originalText = container.textContent || "";
        const toggleButton = createToggleButton(container, originalText, apiKey);

        container.parentElement?.appendChild(toggleButton);
    });

    if (inputBox) {
        const rewriteButton = createRewriteButton(inputBox, apiKey);
        inputBox.parentElement?.appendChild(rewriteButton);
    }
};

function createToggleButton(container: Element, originalText: string, apiKey): HTMLButtonElement {
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "Rewrite with ChatGPT";
    toggleButton.style.marginLeft = "10px";

    toggleButton.addEventListener("click", async () => {
        const rewrittenText = await rewriteMessage(originalText, apiKey);
        container.textContent = rewrittenText || originalText;
    });

    return toggleButton;
}

function createRewriteButton(inputBox: Element, apiKey: string): HTMLButtonElement {
    const rewriteButton = document.createElement("button");
    rewriteButton.textContent = "Rewrite Input";
    rewriteButton.style.marginLeft = "10px";

    rewriteButton.addEventListener("click", async () => {
        const originalInput = (inputBox as HTMLTextAreaElement).value;
        const rewrittenInput = await rewriteMessage(originalInput, apiKey);
        (inputBox as HTMLTextAreaElement).value = rewrittenInput || originalInput;
    });

    return rewriteButton;
}

async function rewriteMessage(message: string, apiKey: string): Promise<string | null> {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
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

async function getCurrentOpenAiKey(): string {
    console.log("get api key...");
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log(tab);
    return await chrome.runtime.sendMessage(tab.id, { "type": "getOpenAIKey" }) as string
}