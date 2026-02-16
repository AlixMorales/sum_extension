# SumBot – 8-Bit Text Summarizer Chrome Extension

> A retro 8-bit themed Chrome extension that lets you **highlight text** and generate a summary, or **summarize an entire webpage** with one click. No API keys required – summarization runs entirely in the browser.

![Chrome Extension](https://img.shields.io/badge/Platform-Chrome%20Extension-green?style=flat-square)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation (Local Development)](#installation-local-development)
- [Usage](#usage)
- [How the Summarizer Works](#how-the-summarizer-works)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

---

## Features

| Feature | Description |
|---------|-------------|
| **Summarize Selection** | Highlight any text on a webpage and click the button to get a concise summary. |
| **Summarize Full Page** | One-click summary of the entire visible page content. |
| **Adjustable Length** | Use the slider to choose how many sentences (1–10) the summary should contain. |
| **Copy to Clipboard** | Instantly copy the generated summary to your clipboard. |
| **8-Bit Retro UI** | Pixel-art styled interface with the "Press Start 2P" font. |
| **No API Keys** | Fully client-side extractive summarization – no data leaves your browser. |

---

## Screenshots

*After loading the extension you will see the retro popup when clicking the SumBot icon in your Chrome toolbar.*

---

## Project Structure

```
sum_extension/
├── manifest.json        # Chrome Extension Manifest V3
├── background.js        # Service worker (lifecycle events)
├── content.js           # Content script injected into pages
├── summarizer.js        # Client-side extractive summarization engine
├── popup.html           # Extension popup markup
├── popup.css            # 8-bit retro styles
├── popup.js             # Popup interaction logic
├── generate_icons.py    # Helper script to regenerate pixel-art icons
├── icons/
│   ├── icon16.png       # Toolbar icon (16×16)
│   ├── icon48.png       # Extensions page icon (48×48)
│   └── icon128.png      # Chrome Web Store icon (128×128)
└── README.md            # This file
```

---

## Prerequisites

- **Google Chrome** (or any Chromium-based browser – Edge, Brave, etc.)  
  Version **88+** is required for Manifest V3 support.
- **Git** (to clone the repository).
- *(Optional)* **Python 3 + Pillow** – only needed if you want to regenerate the icons.

---

## Installation (Local Development)

Follow these steps to load SumBot as an unpacked extension in Chrome:

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/sum_extension.git
cd sum_extension/sum_extension
```

> Replace `<your-username>` with your GitHub username.

### 2. Open Chrome Extensions Page

1. Open Google Chrome.
2. Navigate to `chrome://extensions/` in the address bar.
3. Enable **Developer mode** using the toggle in the top-right corner.

### 3. Load the Extension

1. Click the **"Load unpacked"** button.
2. In the file dialog, navigate to and select the `sum_extension/sum_extension` folder (the one containing `manifest.json`).
3. The extension will appear in your extensions list with the SumBot icon.

### 4. Pin the Extension (Recommended)

1. Click the **puzzle-piece** icon (Extensions) in the Chrome toolbar.
2. Find **SumBot – 8-Bit Text Summarizer** and click the **pin** icon.
3. The SumBot icon will now always be visible in your toolbar.

---

## Usage

### Summarize Selected Text

1. Navigate to any webpage.
2. **Highlight** the text you want to summarize.
3. Click the **SumBot** icon in the toolbar.
4. Adjust the **Sentences** slider to control summary length (1–10 sentences).
5. Click **"✎ Summarise Selection"**.
6. The summary appears in the output area.

### Summarize an Entire Page

1. Navigate to any webpage.
2. Click the **SumBot** icon in the toolbar.
3. Click **"☰ Summarise Page"**.
4. The full visible page text is extracted and summarized.

### Copy the Summary

1. After generating a summary, click the **"Copy"** button.
2. The summary is copied to your clipboard—paste it anywhere.

---

## How the Summarizer Works

SumBot uses **extractive summarization** (no AI model or API required):

1. **Sentence Splitting** – The input text is split into individual sentences.
2. **Word Frequency** – A frequency map is built for all non-stop-words.
3. **Sentence Scoring** – Each sentence is scored by the average frequency of its meaningful words.
4. **Top-N Selection** – The highest-scoring sentences are selected (N = your slider value).
5. **Order Preservation** – Selected sentences are re-sorted into their original order so the summary reads naturally.

This approach works well for articles, blog posts, and web content of any length.

---

## Customization

### Changing the Color Palette

Open `popup.css` and modify the CSS custom values at the top of the file:

| Role | Current Color | Variable |
|------|---------------|----------|
| Main 1 | Light Blue `#87CEEB` | Search for `#87CEEB` |
| Main 2 | Green `#5BCB5B` | Search for `#5BCB5B` |
| Secondary 1 | Light Brown `#C4A46C` | Search for `#C4A46C` |
| Secondary 2 | Dark Brown `#5C3D1E` | Search for `#5C3D1E` |

### Regenerating Icons

If you modify the icon design in `generate_icons.py`:

```bash
pip install Pillow   # if not already installed
python3 generate_icons.py
```

Three PNGs (16, 48, 128 px) will be written to the `icons/` folder.

### Adjusting Summarization Defaults

In `popup.html`, change the slider's `value`, `min`, and `max` attributes to alter defaults.  
In `summarizer.js`, you can edit the `STOP_WORDS` set or tweak the scoring algorithm.

---

## Contributing

Contributions are welcome! To contribute:

1. **Fork** this repository.
2. Create a new branch: `git checkout -b feature/my-feature`.
3. Make your changes and commit: `git commit -m "Add my feature"`.
4. Push to your fork: `git push origin feature/my-feature`.
5. Open a **Pull Request** against the `main` branch.

### Guidelines

- Keep the 8-bit aesthetic consistent.
- Test with `chrome://extensions/` → **Load unpacked** before submitting.
- Follow existing code style (vanilla JS, no build step).

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <b>⭐ Star this repo if you find SumBot useful! ⭐</b>
</p>
