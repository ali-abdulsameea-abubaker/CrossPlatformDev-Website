// Set up event handlers
const reconnectModal = document.getElementById("components-reconnect-modal");
reconnectModal.addEventListener("components-reconnect-state-changed", handleReconnectStateChanged);

const retryButton = document.getElementById("components-reconnect-button");
retryButton.addEventListener("click", retry);

const resumeButton = document.getElementById("components-resume-button");
resumeButton.addEventListener("click", resume);

function handleReconnectStateChanged(event) {
    if (event.detail.state === "show") {
        reconnectModal.showModal();
    } else if (event.detail.state === "hide") {
        reconnectModal.close();
    } else if (event.detail.state === "failed") {
        // Only add visibility listener if needed
        document.addEventListener("visibilitychange", retryWhenDocumentBecomesVisible);
    } else if (event.detail.state === "rejected") {
        // Don't auto-reload - let the user decide
        // location.reload(); // REMOVED - this was the problem
    }
}

async function retry() {
    document.removeEventListener("visibilitychange", retryWhenDocumentBecomesVisible);

    try {
        const successful = await Blazor.reconnect();
        if (!successful) {
            const resumeSuccessful = await Blazor.resumeCircuit();
            if (!resumeSuccessful) {
                // Don't auto-reload - show error and let user decide
                reconnectModal.classList.add("components-reconnect-failed");
                // location.reload(); // REMOVED
            } else {
                reconnectModal.close();
            }
        } else {
            reconnectModal.close();
        }
    } catch (err) {
        document.addEventListener("visibilitychange", retryWhenDocumentBecomesVisible);
    }
}

async function resume() {
    try {
        const successful = await Blazor.resumeCircuit();
        if (!successful) {
            // Don't auto-reload
            // location.reload(); // REMOVED
            reconnectModal.classList.add("components-reconnect-failed");
        } else {
            reconnectModal.close();
        }
    } catch {
        reconnectModal.classList.replace("components-reconnect-paused", "components-reconnect-resume-failed");
    }
}

async function retryWhenDocumentBecomesVisible() {
    if (document.visibilityState === "visible") {
        await retry();
    }
}

// Remove the automatic retry on page visibility change that might be causing reloads
document.removeEventListener("visibilitychange", retryWhenDocumentBecomesVisible);