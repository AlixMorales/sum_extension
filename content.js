/*  content.js – injected into every page
 *  Listens for messages from the popup and returns either
 *  the currently-selected text or the full page body text.
 */

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "getSelectedText") {
        const selected = window.getSelection().toString().trim();
        sendResponse({ text: selected });
    } else if (request.action === "getPageText") {
        // Grab visible body text, stripping excessive whitespace
        const body = document.body.innerText || "";
        const cleaned = body.replace(/\s+/g, " ").trim();
        sendResponse({ text: cleaned });
    }
    // Return true to keep the message channel open for async response
    return true;
});
