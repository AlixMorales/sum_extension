/*  summarizer.js – extractive text summarization
 *  Works entirely client-side with no API dependencies.
 *
 *  Algorithm
 *  ---------
 *  1. Split text into sentences.
 *  2. Tokenise & build a word-frequency map (ignoring stop-words).
 *  3. Score each sentence by the sum of its word frequencies.
 *  4. Pick the top-N highest-scoring sentences (preserving original order).
 */

const STOP_WORDS = new Set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any",
    "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below",
    "between", "both", "but", "by", "can", "can't", "cannot", "could", "couldn't", "did",
    "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few",
    "for", "from", "further", "get", "got", "had", "hadn't", "has", "hasn't", "have",
    "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers",
    "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've",
    "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "just", "let's", "me",
    "might", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off",
    "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over",
    "own", "same", "shall", "shan't", "she", "she'd", "she'll", "she's", "should",
    "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs",
    "them", "themselves", "then", "there", "there's", "these", "they", "they'd",
    "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under",
    "until", "up", "us", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've",
    "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which",
    "while", "who", "who's", "whom", "why", "why's", "will", "with", "won't", "would",
    "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
    "yourself", "yourselves", "also", "like", "one", "two", "new", "many", "well", "way",
    "use", "said", "say", "says", "even", "go", "going", "make", "made", "much", "still",
    "since", "back", "every", "may", "take", "come", "good", "look", "know", "want", "give",
    "tell", "think", "see", "go", "come", "really", "thing", "things", "need", "another"
]);

/**
 * Split a block of text into an array of sentence strings.
 */
function splitSentences(text) {
    // Split on period / question-mark / exclamation followed by whitespace or end
    const raw = text.match(/[^.!?]*[.!?]+[\s]*/g) || [text];
    return raw.map(s => s.trim()).filter(s => s.length > 10);
}

/**
 * Return a word-frequency map for all non-stop-words.
 */
function buildWordFrequency(sentences) {
    const freq = {};
    for (const sentence of sentences) {
        const words = sentence.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/);
        for (const w of words) {
            if (w && !STOP_WORDS.has(w)) {
                freq[w] = (freq[w] || 0) + 1;
            }
        }
    }
    return freq;
}

/**
 * Score a sentence based on the sum of its word frequencies.
 */
function scoreSentence(sentence, freq) {
    const words = sentence.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/);
    let score = 0;
    let wordCount = 0;
    for (const w of words) {
        if (w && !STOP_WORDS.has(w)) {
            score += freq[w] || 0;
            wordCount++;
        }
    }
    // Normalise by word count to avoid bias toward long sentences
    return wordCount > 0 ? score / wordCount : 0;
}

/**
 * Summarise text, returning the top `maxSentences` sentences in original order.
 *
 * @param {string} text          The input text to summarise.
 * @param {number} maxSentences  Number of sentences to keep (default: 5).
 * @returns {string}             The summary.
 */
function summarise(text, maxSentences = 5) {
    if (!text || text.trim().length === 0) {
        return "No text provided to summarise.";
    }

    const sentences = splitSentences(text);
    if (sentences.length === 0) {
        return text; // Too short to split – return as-is
    }
    if (sentences.length <= maxSentences) {
        return sentences.join(" ");
    }

    const freq = buildWordFrequency(sentences);

    // Pair each sentence with its index and score
    const scored = sentences.map((s, i) => ({ sentence: s, index: i, score: scoreSentence(s, freq) }));

    // Sort by score descending, pick top N
    const top = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, maxSentences);

    // Re-sort by original position so the summary reads naturally
    top.sort((a, b) => a.index - b.index);

    return top.map(t => t.sentence).join(" ");
}
