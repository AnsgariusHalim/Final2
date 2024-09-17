document.addEventListener('DOMContentLoaded', async () => {
  const bookTitle = document.getElementById("book-title");
  const bookCover = document.getElementById("book-cover");
  const bookAuthor = document.getElementById("book-author");
  const bookSummary = document.getElementById("book-summary");  // Reference to the summary element
  const bookGenre = document.getElementById("book-genre");      // Reference to the genre element
  const publishBtn = document.getElementById("publish-btn");
  const viewBtn = document.getElementById("view-btn");

  const urlParams = new URLSearchParams(window.location.search);
  const storyId = urlParams.get('storyId');

  let story;

  async function fetchBookDetails() {
    try {
      const response = await fetch(`http://localhost:3001/collection/book/${storyId}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (data.success) {
          story = data.story;
          bookTitle.textContent = story.title;
          bookCover.src = `http://localhost:3001/api/image/${story.content[0].imageUrl}`;
          bookAuthor.textContent = `Author: ${story.author}`;
          bookSummary.textContent = story.summary || "No summary available.";  // Display summary
          bookGenre.textContent = `Genre: ${story.genres.join(', ')}`;          // Display genres

          publishBtn.textContent = story.isPublished ? "Remove from Publish" : "Publish";

          viewBtn.addEventListener('click', () => {
            window.location.href = `/viewBook.html?storyId=${story._id}`;
          });
        }
      } else {
        console.error("Unexpected response content type:", contentType);
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  }

  await fetchBookDetails();
});
