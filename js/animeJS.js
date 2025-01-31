document.addEventListener('DOMContentLoaded', function () {
  const animation = lottie.loadAnimation({
      container: document.getElementById('animation-container'), // Container element
      renderer: 'svg', // Renderer type
      loop: true, // Loop the animation
      autoplay: true, // Autoplay the animation
      path: 'animations/laptopAN.json' // Path to the JSON file
  });

  // Resize the animation
  animation.setSize('500px', '500px'); // Set the desired width and height
});