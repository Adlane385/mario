/**
 * Base Entity class for all game objects
 */
class Entity {
  /**
   * Create a new entity
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Width
   * @param {number} height - Height
   * @param {Sprite|null} sprite - Sprite for the entity (optional)
   */
  constructor(x, y, width, height, sprite = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sprite = sprite;

    this.velocityX = 0;
    this.velocityY = 0;
    this.isOnGround = false;
    this.isActive = true;
    this.facingRight = true;
  }

  /**
   * Update the entity
   * @param {number} deltaTime - Time since last update
   * @param {Array} platforms - Array of platforms for collision detection
   */
  update(deltaTime, platforms) {
    // Apply gravity
    this.velocityY += GRAVITY;

    // Apply friction
    this.velocityX *= FRICTION;

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Check platform collisions
    this.checkPlatformCollisions(platforms);

    // Update sprite if available
    if (this.sprite) {
      this.sprite.update(deltaTime);
    }
  }

  /**
   * Check for collisions with platforms
   * @param {Array} platforms - Array of platforms
   */
  checkPlatformCollisions(platforms) {
    this.isOnGround = false;

    for (const platform of platforms) {
      if (!platform.isActive) continue;

      // Store previous position
      const prevX = this.x - this.velocityX;
      const prevY = this.y - this.velocityY;

      if (checkCollision(this, platform)) {
        // Determine collision direction based on previous position
        const overlapLeft = this.x + this.width - platform.x;
        const overlapRight = platform.x + platform.width - this.x;
        const overlapTop = this.y + this.height - platform.y;
        const overlapBottom = platform.y + platform.height - this.y;

        // Find the smallest overlap to determine collision direction
        const minOverlap = Math.min(
          overlapLeft,
          overlapRight,
          overlapTop,
          overlapBottom
        );

        if (minOverlap === overlapTop && this.velocityY > 0) {
          // Landing on top of platform
          this.y = platform.y - this.height;
          this.velocityY = 0;
          this.isOnGround = true;

          // Handle special platform types
          if (platform.handlePlayerCollision) {
            platform.handlePlayerCollision(this);
          }
        } else if (minOverlap === overlapBottom && this.velocityY < 0) {
          // Hitting platform from below
          this.y = platform.y + platform.height;
          this.velocityY = 0;
        } else if (minOverlap === overlapLeft && this.velocityX > 0) {
          // Hitting platform from the left
          this.x = platform.x - this.width;
          this.velocityX = 0;
        } else if (minOverlap === overlapRight && this.velocityX < 0) {
          // Hitting platform from the right
          this.x = platform.x + platform.width;
          this.velocityX = 0;
        }
      }
    }
  }

  /**
   * Draw the entity
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} offsetX - Camera X offset
   * @param {number} offsetY - Camera Y offset
   */
  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.isActive) return;

    const drawX = this.x - offsetX;
    const drawY = this.y - offsetY;

    if (this.sprite) {
      this.sprite.draw(
        ctx,
        drawX,
        drawY,
        this.width,
        this.height,
        !this.facingRight
      );
    } else {
      // Draw a placeholder rectangle if no sprite is available
      ctx.fillStyle = "red";
      ctx.fillRect(drawX, drawY, this.width, this.height);
    }
  }
}
