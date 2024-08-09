document.addEventListener('DOMContentLoaded', () => {
  fetch('navigation.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navigation-placeholder').innerHTML = data;

      // Initialize the navigation scripts only after the navigation bar is loaded
      const script = document.createElement('script');
      script.src = 'navigation.js';
      script.defer = true;
      document.body.appendChild(script);
    })
    .catch(error => console.error('Error loading navigation:', error));
});
