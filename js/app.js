// Reading Time Estimator Application

const CONFIG = {
    REGULAR_WPM: 200,
    CODE_WPM: 100,
    SECONDS_PER_IMAGE: 12
};

document.addEventListener('DOMContentLoaded', function() {
    const contentInput = document.getElementById('content-input');
    const imageCountInput = document.getElementById('image-count');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error');

    calculateBtn.addEventListener('click', calculateReadingTime);

    function calculateReadingTime() {
        const content = contentInput.value.trim();
        const imageCount = parseInt(imageCountInput.value) || 0;

        // Hide previous results/errors
        resultsDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');

        // Validate input
        if (!content) {
            showError("Please paste some content to estimate reading time.");
            return;
        }

        // Extract code blocks and regular text
        const { regularText, codeBlocks, codeBlockCount } = extractCodeBlocks(content);

        // Count words
        const regularWordCount = countWords(regularText);
        const codeWordCount = countWords(codeBlocks);
        const totalWordCount = regularWordCount + codeWordCount;

        // Calculate time in seconds
        const regularTimeSeconds = (regularWordCount / CONFIG.REGULAR_WPM) * 60;
        const codeTimeSeconds = (codeWordCount / CONFIG.CODE_WPM) * 60;
        const imageTimeSeconds = imageCount * CONFIG.SECONDS_PER_IMAGE;
        const totalTimeSeconds = regularTimeSeconds + codeTimeSeconds + imageTimeSeconds;

        // Round up to whole minutes
        const totalMinutes = Math.ceil(totalTimeSeconds / 60);

        // Display results
        displayResults({
            totalMinutes,
            totalWordCount,
            regularWordCount,
            codeBlockCount,
            codeWordCount,
            imageCount
        });
    }

    function extractCodeBlocks(content) {
        const codeBlockRegex = /```[\s\S]*?```/g;
        const codeBlocks = [];
        let match;

        while ((match = codeBlockRegex.exec(content)) !== null) {
            // Remove the backticks and any language identifier
            const codeContent = match[0]
                .replace(/^```\w*\n?/, '')  // Remove opening backticks and language
                .replace(/\n?```$/, '');     // Remove closing backticks
            codeBlocks.push(codeContent);
        }

        // Remove code blocks from content to get regular text
        const regularText = content.replace(codeBlockRegex, ' ');

        return {
            regularText,
            codeBlocks: codeBlocks.join(' '),
            codeBlockCount: codeBlocks.length
        };
    }

    function countWords(text) {
        if (!text || !text.trim()) return 0;
        // Split on whitespace and filter out empty strings
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    function displayResults(data) {
        document.getElementById('total-time').textContent =
            data.totalMinutes === 1 ? '1 minute' : `${data.totalMinutes} minutes`;
        document.getElementById('total-words').textContent = data.totalWordCount;
        document.getElementById('regular-words').textContent = data.regularWordCount;
        document.getElementById('code-blocks').textContent =
            data.codeBlockCount === 1 ? '1 block' : `${data.codeBlockCount} blocks`;
        document.getElementById('code-words').textContent = data.codeWordCount;
        document.getElementById('image-count-display').textContent = data.imageCount;

        resultsDiv.classList.remove('hidden');
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }
});
