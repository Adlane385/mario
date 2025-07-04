/**
 * Input handler class for keyboard and touch controls
 */
class InputHandler {
  constructor(canvas = null) {
    this.keys = {};
    this.touchY = 0;
    this.touchThreshold = 30;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.canvas = canvas;

    // Set up event listeners
    const target = canvas || window;
    target.addEventListener("keydown", (e) => this.handleKeyDown(e));
    target.addEventListener("keyup", (e) => this.handleKeyUp(e));

    // Also listen on window as fallback
    if (canvas) {
      window.addEventListener("keydown", (e) => this.handleKeyDown(e));
      window.addEventListener("keyup", (e) => this.handleKeyUp(e));
    }

    // Touch controls for mobile
    window.addEventListener("touchstart", (e) => this.handleTouchStart(e));
    window.addEventListener("touchmove", (e) => this.handleTouchMove(e));
    window.addEventListener("touchend", (e) => this.handleTouchEnd(e));

    // Focus canvas if provided
    if (canvas) {
      canvas.focus();
    }
  }

  /**
   * Handle keydown events
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyDown(e) {
    console.log("Key down:", e.code);
    this.keys[e.code] = true;
  }

  /**
   * Handle keyup events
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyUp(e) {
    this.keys[e.code] = false;
  }

  /**
   * Handle touch start events
   * @param {TouchEvent} e - Touch event
   */
  handleTouchStart(e) {
    if (e.touches.length > 0) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }
  }

  /**
   * Handle touch move events
   * @param {TouchEvent} e - Touch event
   */
  handleTouchMove(e) {
    // Prevent default to avoid scrolling the page
    e.preventDefault();

    if (e.touches.length > 0) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;

      // Determine horizontal swipe
      if (touchX < this.touchStartX - this.touchThreshold) {
        this.keys["ArrowLeft"] = true;
        this.keys["ArrowRight"] = false;
      } else if (touchX > this.touchStartX + this.touchThreshold) {
        this.keys["ArrowRight"] = true;
        this.keys["ArrowLeft"] = false;
      }

      // Determine vertical swipe for jump
      if (touchY < this.touchStartY - this.touchThreshold) {
        this.keys["Space"] = true;
      }
    }
  }

  /**
   * Handle touch end events
   * @param {TouchEvent} e - Touch event
   */
  handleTouchEnd(e) {
    // Reset all keys on touch end
    this.keys["ArrowLeft"] = false;
    this.keys["ArrowRight"] = false;
    this.keys["Space"] = false;
  }

  /**
   * Check if a key is pressed
   * @param {string} key - Key code to check
   * @returns {boolean} - True if key is pressed, false otherwise
   */
  isPressed(key) {
    return this.keys[key] === true;
  }

  /**
   * Reset all keys
   */
  reset() {
    this.keys = {};
  }
}
