function splitSentences(text) {
    // Ensure text is a string before processing
    if (typeof text !== 'string') {
        console.error('Expected a string but received:', text);
        return []; // Return an empty array or handle it as needed
    }

    const sentenceRegex = /([.!?。！？](?!\d))/;

    const parts = text.split(sentenceRegex);
    let sentences = [];
    let currentSentence = '';

    parts.forEach(part => {
        const trimmedPart = part.trim();
        if (trimmedPart.length > 0) {
            if (!trimmedPart.match(sentenceRegex)) {
                currentSentence += trimmedPart;
            } else {
                currentSentence += trimmedPart;
                sentences.push(currentSentence.trim());
                currentSentence = '';
            }
        }
    });

    return sentences;
}

async function loadStory(storyId) {
    const response = await fetch(`http://localhost:3001/api/story/${storyId}`, {
        method: 'GET',
        credentials: 'include' // Include credentials to handle authentication
    });

    if (response.ok) {
        const data = await response.json();
        const story = data.story;

        // Ensure the content is an array of objects with sentence and imageUrl
        const sentences = Array.isArray(story.content) ? story.content : splitSentences(story.content);

        if (!sentences || !Array.isArray(sentences)) {
            console.error('Invalid story data:', story);
            alert('Failed to load the story. Please try again later.');
            return;
        }

        const container = document.getElementById('textboxes-container');
        container.innerHTML = ''; // Clear previous content

        sentences.forEach((sentenceObj, index) => {
            const pageNumber = index + 1;

            const label = document.createElement('p');
            label.textContent = `Page ${pageNumber} text:`;

            const textbox = document.createElement('textarea');
            textbox.setAttribute('rows', '1');
            textbox.setAttribute('id', `page${pageNumber}-text`);
            textbox.value = sentenceObj.sentence;

            const image = document.createElement('img');
            image.setAttribute('src', `http://localhost:3001/api/image/${sentenceObj.imageUrl}`);
            image.setAttribute('alt', `Image for Page ${pageNumber}`);
            image.classList.add('placeholder-image');

            const regenerateButton = document.createElement('button');
            regenerateButton.textContent = 'Regenerate';
            regenerateButton.classList.add('regenerate-button');
            regenerateButton.setAttribute('onclick', `regeneratePage(${pageNumber}, '${story._id}')`);

            container.appendChild(label);
            container.appendChild(textbox);
            container.appendChild(image);
            container.appendChild(regenerateButton);
        });

        // Add the "Produce" button at the end
        const produceButton = document.createElement('button');
        produceButton.textContent = 'Produce';
        produceButton.classList.add('produce-button');
        produceButton.setAttribute('onclick', `produceStory('${story._id}')`);
        container.appendChild(produceButton);

        // Hide the loading animation once everything is loaded
        const loadingAnimation = document.getElementById('loading-animation');
        if (loadingAnimation) {
            loadingAnimation.style.display = 'none';
        }
    } else if (response.status === 401) {
        alert('Unauthorized: Please log in to access this resource.');
        window.location.href = '/login';
    } else {
        console.error('Failed to load story:', response.statusText);
    }
}

async function regeneratePage(pageNumber, storyId) {
    const sentence = document.getElementById(`page${pageNumber}-text`).value;

    try {
        const response = await fetch('http://localhost:3001/api/regenerate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ storyId, sentence, pageNumber }),
        });

        if (!response.ok) {
            throw new Error('Failed to regenerate image.');
        }

        const result = await response.json();

        if (result.success) {
            const image = document.querySelector(`#textboxes-container img:nth-child(${pageNumber * 4 - 2})`);
            image.src = `http://localhost:3001/api/image/${result.newImageUrl}`;
        } else {
            alert('Error regenerating the image.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to regenerate the image. Please try again.');
    }
}

function produceStory(storyId) {
    alert(`Producing story with ID: ${storyId}`);
    window.location.href = `storyBook.html?storyId=${storyId}`;
}

window.onload = function () {
    const storyId = new URLSearchParams(window.location.search).get('storyId');
    loadStory(storyId);
};