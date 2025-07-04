/**
 * Camera class for following the player
 */
class Camera {
  /**
   * Create a new camera
   * @param {number} width - Camera width
   * @param {number} height - Camera height
   * @param {number} levelWidth - Level width
   * @param {number} levelHeight - Level height
   */
  constructor(
    width = GAME_WIDTH,
    height = GAME_HEIGHT,
    levelWidth = 3000,
    levelHeight = GAME_HEIGHT
  ) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.levelWidth = levelWidth;
    this.levelHeight = levelHeight;

    // Camera smoothing
    this.smoothing = 0.1;
    this.targetX = 0;
    this.targetY = 0;
  }

  /**
   * Update the camera to follow a target
   * @param {Object} target - Target to follow (usually the player)
   */
  follow(target) {
    // Center the camera on the target
    this.targetX = target.x - this.width / 2 + target.width / 2;

    // Apply smoothing
    this.x += (this.targetX - this.x) * this.smoothing;

    // Clamp camera position to level boundaries
    this.x = Math.max(0, Math.min(this.x, this.levelWidth - this.width));
  }

  /**
   * Set the level dimensions
   * @param {number} width - Level width
   * @param {number} height - Level height
   */
  setLevelDimensions(width, height) {
    this.levelWidth = width;
    this.levelHeight = height;
  }
}
