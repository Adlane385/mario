/**
 * Enemy class for obstacles and opponents
 */
class Enemy extends Entity {
  /**
   * Create a new enemy
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Sprite} sprite - Enemy sprite
   * @param {string} type - Enemy type (e.g., 'walker', 'flyer')
   * @param {Object} options - Additional options for the enemy
   */
  constructor(x, y, sprite, type = "walker", options = {}) {
    super(x, y, ENEMY_WIDTH, ENEMY_HEIGHT, sprite);

    this.type = type;
    this.speed = options.speed || ENEMY_SPEED;
    this.direction = options.direction || -1; // -1 for left, 1 for right
    this.patrolDistance = options.patrolDistance || 200;
    this.startX = x;
    this.endX = x + this.patrolDistance;

    // For flying enemies
    this.flyHeight = options.flyHeight || 0;
    this.startY = y;
    this.flyingUp = true;

    // For stationary enemies
    this.isStationary = options.isStationary || false;

    // Enemy name/description for educational content
    this.name = options.name || "Obstacle";
    this.description = options.description || "An obstacle to avoid";
  }

  /**
   * Update the enemy
   * @param {number} deltaTime - Time since last update
   * @param {Array} platforms - Array of platforms for collision detection
   */
  update(deltaTime, platforms) {
    if (!this.isActive) return;

    if (this.isStationary) {
      // Stationary enemies don't move but may have animations
      if (this.sprite) {
        this.sprite.update(deltaTime);
      }
      return;
    }

    if (this.type === "walker") {
      // Walking enemy behavior
      this.velocityX = this.speed * this.direction;

      // Change direction at patrol boundaries
      if (this.x <= this.startX) {
        this.direction = 1;
        this.facingRight = true;
      } else if (this.x >= this.endX) {
        this.direction = -1;
        this.facingRight = false;
      }

      super.update(deltaTime, platforms);

      // Change direction if hitting a wall
      if (this.velocityX === 0) {
        this.direction *= -1;
        this.facingRight = !this.facingRight;
      }
    } else if (this.type === "flyer") {
      // Flying enemy behavior
      this.velocityX = this.speed * this.direction;

      // Vertical movement
      if (this.flyingUp) {
        this.velocityY = -this.speed * 0.5;
        if (this.y <= this.startY - this.flyHeight) {
          this.flyingUp = false;
        }
      } else {
        this.velocityY = this.speed * 0.5;
        if (this.y >= this.startY) {
          this.flyingUp = true;
        }
      }

      // Change horizontal direction at patrol boundaries
      if (this.x <= this.startX) {
        this.direction = 1;
        this.facingRight = true;
      } else if (this.x >= this.endX) {
        this.direction = -1;
        this.facingRight = false;
      }

      // Update position without platform collision for flying enemies
      this.x += this.velocityX;
      this.y += this.velocityY;

      // Update sprite
      if (this.sprite) {
        this.sprite.update(deltaTime);
      }
    }
  }

  /**
   * Defeat the enemy
   */
  defeat() {
    this.isActive = false;
  }

  /**
   * Reset the enemy to its initial state
   */
  reset() {
    this.isActive = true;
    this.x = this.startX;
    this.y = this.startY;
    this.direction = -1;
    this.facingRight = false;
    this.flyingUp = true;
  }
}
