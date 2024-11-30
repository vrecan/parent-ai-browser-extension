document.addEventListener("DOMContentLoaded", () => {
    console.log("Popup is loaded");

    const enableButton = document.getElementById("enableButton") as HTMLButtonElement;
    const disableButton = document.getElementById("disableButton") as HTMLButtonElement;
    const apiKeyInput = document.getElementById("apiKeyInput") as HTMLInputElement;
    const statusMessage = document.getElementById("statusMessage") as HTMLElement;

    // Load saved settings from localStorage
    const storedApiKey = localStorage.getItem("openAIKey");
    const isEnabled = localStorage.getItem("enabled") === "true";

    if (storedApiKey) {
        apiKeyInput.value = storedApiKey;
    }
    updateStatus(isEnabled);

    enableButton.addEventListener("click", () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem("openAIKey", apiKey);  // Store the API key in localStorage
            localStorage.setItem("enabled", "true");  // Enable the app
            updateStatus(true);
            alert("App enabled with your OpenAI API key.");
        } else {
            alert("Please enter a valid OpenAI API key.");
        }
    });

    disableButton.addEventListener("click", () => {
        localStorage.setItem("enabled", "false");  // Disable the app
        updateStatus(false);
        alert("App disabled.");
    });

    // Update the UI to reflect whether the app is enabled or disabled
    function updateStatus(isEnabled: boolean) {
        if (isEnabled) {
            statusMessage.textContent = "App is enabled.";
            enableButton.disabled = true;
            disableButton.disabled = false;
        } else {
            statusMessage.textContent = "App is disabled.";
            enableButton.disabled = false;
            disableButton.disabled = true;
        }
    }
});