// Utility functions for the game

/**
 * Check if two objects are colliding using AABB collision detection
 * @param {Object} obj1 - First object with x, y, width, height properties
 * @param {Object} obj2 - Second object with x, y, width, height properties
 * @returns {boolean} - True if objects are colliding, false otherwise
 */
function checkCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Load an image and return a promise
 * @param {string} src - Image source URL
 * @returns {Promise<HTMLImageElement>} - Promise that resolves with the loaded image
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Load multiple images and return a promise that resolves when all images are loaded
 * @param {Object} sources - Object with key-value pairs of image name and source URL
 * @returns {Promise<Object>} - Promise that resolves with an object of loaded images
 */
function loadImages(sources) {
  const promises = Object.entries(sources).map(([name, src]) => {
    return loadImage(src).then((img) => [name, img]);
  });

  return Promise.all(promises).then((entries) => {
    return Object.fromEntries(entries);
  });
}

/**
 * Load an audio file and return a promise
 * @param {string} src - Audio source URL
 * @returns {Promise<HTMLAudioElement>} - Promise that resolves with the loaded audio
 */
function loadAudio(src) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = () => reject(new Error(`Failed to load audio: ${src}`));
    audio.src = src;
  });
}

/**
 * Load multiple audio files and return a promise that resolves when all audio files are loaded
 * @param {Object} sources - Object with key-value pairs of audio name and source URL
 * @returns {Promise<Object>} - Promise that resolves with an object of loaded audio files
 */
function loadAudios(sources) {
  const promises = Object.entries(sources).map(([name, src]) => {
    return loadAudio(src).then((audio) => [name, audio]);
  });

  return Promise.all(promises).then((entries) => {
    return Object.fromEntries(entries);
  });
}
