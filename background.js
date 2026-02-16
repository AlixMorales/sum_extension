/*  background.js – service worker
 *  Handles extension installation event and any future
 *  background processing needs.
 */

chrome.runtime.onInstalled.addListener(() => {
    console.log("SumBot 8-Bit Summarizer installed!");
});
