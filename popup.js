/*  popup.js  –  wires up the popup UI to the content script + summariser  */

document.addEventListener("DOMContentLoaded", () => {
    const btnSelection = document.getElementById("btn-selection");
    const btnPage = document.getElementById("btn-page");
    const btnCopy = document.getElementById("btn-copy");
    const sentenceSlider = document.getElementById("sentence-count");
    const sentenceValue = document.getElementById("sentence-value");
    const outputWrapper = document.getElementById("output-wrapper");
    const summaryOutput = document.getElementById("summary-output");
    const statusBar = document.getElementById("status-bar");

    /* ---- Slider live update ---- */
    sentenceSlider.addEventListener("input", () => {
        sentenceValue.textContent = sentenceSlider.value;
    });

    /* ---- Helper: update status bar ---- */
    function setStatus(msg, type = "") {
        statusBar.textContent = msg;
        statusBar.className = "status-bar" + (type ? ` ${type}` : "");
    }

    /* ---- Helper: show summary ---- */
    function showSummary(text) {
        summaryOutput.textContent = text;
        outputWrapper.classList.remove("hidden");
    }

    /* ---- Helper: send message to content script ---- */
    function sendToContent(action) {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (!tabs || tabs.length === 0) {
                    return reject(new Error("No active tab found."));
                }

                const tabId = tabs[0].id;

                // Ensure content script is injected, then send message
                chrome.scripting.executeScript(
                    {
                        target: { tabId },
                        files: ["content.js"]
                    },
                    () => {
                        // Ignore injection errors (script may already be running)
                        if (chrome.runtime.lastError) {
                            // Try sending anyway
                        }
                        chrome.tabs.sendMessage(tabId, { action }, (response) => {
                            if (chrome.runtime.lastError) {
                                return reject(new Error(chrome.runtime.lastError.message));
                            }
                            resolve(response);
                        });
                    }
                );
            });
        });
    }

    /* ---- Summarise Selection ---- */
    btnSelection.addEventListener("click", async () => {
        try {
            setStatus("Grabbing selection...");
            const res = await sendToContent("getSelectedText");
            const text = res?.text;

            if (!text) {
                setStatus("No text selected! Highlight some text first.", "error");
                return;
            }

            setStatus("Summarising...");
            const maxSentences = parseInt(sentenceSlider.value, 10);
            const summary = summarise(text, maxSentences);
            showSummary(summary);
            setStatus("Done! Selection summarised.", "success");
        } catch (err) {
            setStatus("Error: " + err.message, "error");
        }
    });

    /* ---- Summarise Full Page ---- */
    btnPage.addEventListener("click", async () => {
        try {
            setStatus("Reading page content...");
            const res = await sendToContent("getPageText");
            const text = res?.text;

            if (!text) {
                setStatus("Could not read page content.", "error");
                return;
            }

            setStatus("Summarising page...");
            const maxSentences = parseInt(sentenceSlider.value, 10);
            const summary = summarise(text, maxSentences);
            showSummary(summary);
            setStatus("Done! Page summarised.", "success");
        } catch (err) {
            setStatus("Error: " + err.message, "error");
        }
    });

    /* ---- Copy to Clipboard ---- */
    btnCopy.addEventListener("click", () => {
        const text = summaryOutput.textContent;
        if (!text) {
            setStatus("Nothing to copy.", "error");
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            setStatus("Copied to clipboard!", "success");
        }).catch(() => {
            setStatus("Copy failed.", "error");
        });
    });
});
