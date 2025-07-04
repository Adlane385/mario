/**
 * Bullet class for player projectiles
 */
class Bullet extends Entity {
  /**
   * Create a new bullet
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} direction - Direction (1 for right, -1 for left)
   */
  constructor(x, y, direction) {
    super(x, y, BULLET_WIDTH, BULLET_HEIGHT);

    this.direction = direction;
    this.velocityX = BULLET_SPEED * direction;
    this.velocityY = 0;
    this.damage = 1;
    this.maxDistance = 600; // Maximum distance bullet can travel
    this.startX = x;
  }

  /**
   * Update the bullet
   * @param {number} deltaTime - Time since last update
   * @param {Array} platforms - Array of platforms for collision detection
   */
  update(deltaTime, platforms = []) {
    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Check if bullet has traveled too far
    if (Math.abs(this.x - this.startX) > this.maxDistance) {
      this.isActive = false;
    }

    // Check if bullet is off screen
    if (
      this.x < -50 ||
      this.x > 5000 ||
      this.y < -50 ||
      this.y > GAME_HEIGHT + 50
    ) {
      this.isActive = false;
    }

    // Check platform collisions
    for (const platform of platforms) {
      if (checkCollision(this, platform)) {
        this.isActive = false;
        break;
      }
    }
  }

  /**
   * Draw the bullet
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} offsetX - Camera X offset
   * @param {number} offsetY - Camera Y offset
   */
  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.isActive) return;

    const drawX = this.x - offsetX;
    const drawY = this.y - offsetY;

    // Draw bullet as a yellow oval
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.ellipse(
      drawX + this.width / 2,
      drawY + this.height / 2,
      this.width / 2,
      this.height / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Add a glow effect
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 5;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
