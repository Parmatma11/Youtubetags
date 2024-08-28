const searchButton = document.querySelector('.fa-search');
const input = document.getElementById('youtube_url');
const loadingOverlay = document.getElementById('loading-overlay');

// Function to validate and fetch tags
const inputValue = () => {
    const value = input.value.trim();
    if (value === '') {
        alert('Please enter something to search');
    } 
    else {
        fetchTags(value);
        input.value='';
    }
};

// Event listener for the search button click
searchButton.addEventListener('click', function () {
    inputValue();

});

// Event listener for pressing "Enter" in the input field
input.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        inputValue();
        event.preventDefault();  // Prevent form submission or other default actions
    }
});

// Function to fetch tags from the server
async function fetchTags(url) {
    try {
        loadingOverlay.style.display = 'flex'; // Show loading indicator

        const response = await fetch(`/video-info?Url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        sessionStorage.setItem('videoInfo', JSON.stringify(data));

        if (data.error) {
            window.location.href = '/error.html';
        } else {
            window.location.href = '/extractedtags';
        }
    } catch (error) {
        console.error('Error fetching tags:', error);
        window.location.href = '/error.html';
    } finally {
        loadingOverlay.style.display = 'none'; // Hide loading indicator
    }
}