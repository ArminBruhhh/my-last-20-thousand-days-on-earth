const term = new Terminal({
  rows: 34, // Adjust based on your frame height
  cols: 64, // Adjust based on your frame width
});
term.open(document.getElementById('terminal'));

// Load the ASCII animation from a text file
let frames = [];
let frameIndex = 0;
let typingInterval = null; // To track the typing interval
let animationTimeout = null; // To track the animation timeout

fetch('animations/test.txt') // Replace with your file path
  .then(response => response.text())
  .then(data => {
    frames = data.split('_'); // Split frames by underscore
  })
  .catch(error => console.error('Error loading ASCII animation:', error));

// Function to simulate typing for the first frame
function typeFirstFrame(frame, delay = 50) {
  let i = 0;
  typingInterval = setInterval(() => {
    if (i < frame.length) {
      term.write(frame[i]); // Write one character at a time
      i++;
    } else {
      clearInterval(typingInterval); // Stop typing when the frame is complete

      // Wait for 5 seconds, then clear the terminal and move to the next frame
      animationTimeout = setTimeout(() => {
        term.reset(); // Clear the terminal
        frameIndex++;

        // Start displaying subsequent frames instantly
        if (frameIndex < frames.length) {
          displayFrame(frames[frameIndex]);
        }
      }, 5000); // Wait 5 seconds after the first frame
    }
  }, delay); // Delay between characters
}

// Function to display a frame instantly
function displayFrame(frame) {
  term.write('\x1b[H'); // Move cursor to the top-left corner
  term.write(frame); // Display the frame instantly

  // Move to the next frame after a delay
  animationTimeout = setTimeout(() => {
    frameIndex++;

    // Loop the animation, starting from the second frame
    if (frameIndex >= frames.length) {
      frameIndex = 1; // Restart from the second frame
    }

    // Continue with the next frame
    if (frameIndex < frames.length) {
      displayFrame(frames[frameIndex]);
    }
  }, 33); // Consistent delay between frames (adjust as needed)
}

// Intersection Observer to start animation when terminal is in view
const terminalElement = document.getElementById('terminal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Clear any existing intervals and timeouts
        if (typingInterval) clearInterval(typingInterval);
        if (animationTimeout) clearTimeout(animationTimeout);

        // Add a 1-second delay before starting the animation
        setTimeout(() => {
          // Clear the terminal and reset to the first frame
          term.reset(); // Completely clear the terminal
          frameIndex = 0; // Reset to the first frame

          // Start the animation from the first frame
          typeFirstFrame(frames[frameIndex], 50); // Start with normal speed for the first frame
        }, 1000); // 1-second delay to prevent overlapping
      } else {
        // Stop the animation and clear the terminal when out of view
        if (typingInterval) clearInterval(typingInterval);
        if (animationTimeout) clearTimeout(animationTimeout);
        term.reset(); // Completely clear the terminal
        frameIndex = 0; // Reset to the first frame
      }
    });
  },
  {
    threshold: 0.5, // Trigger when 50% of the terminal is visible
  }
);

// Observe the terminal element
observer.observe(terminalElement);