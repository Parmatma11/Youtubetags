document.addEventListener('DOMContentLoaded', () => {
    const videoInfo = JSON.parse(sessionStorage.getItem('videoInfo'));
    const videoInfoDiv = document.getElementById('video-info');
    const copyAllButton = document.querySelector('.copy-all');

    // Clear sessionStorage after displaying tags
    sessionStorage.removeItem('videoInfo');

    if (videoInfo && videoInfo.tags && videoInfo.tags.length > 0) {
        const tagsHTML = videoInfo.tags.map(tag => 
            `<div class="tag">"${tag}"<button onclick="copyTag('${tag}')">Copy</button></div>`
        ).join('');
        videoInfoDiv.innerHTML = `<div class="tag-container">${tagsHTML}</div>`;

        copyAllButton.classList.remove('hidden');
        copyAllButton.addEventListener('click', () => {
            const allTags = videoInfo.tags.join(', ');
            navigator.clipboard.writeText(allTags).then(() => {
                alert('All tags copied to clipboard!');
            });
        });
    } else {
        videoInfoDiv.innerHTML = '<p>No Result Found</p>';
        copyAllButton.classList.add('hidden');
    }
});

function copyTag(tag) {
    navigator.clipboard.writeText(tag).then(() => {
        alert(`Copied "${tag}" to clipboard!`);
    });
}
