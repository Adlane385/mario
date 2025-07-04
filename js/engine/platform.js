/**
 * Platform class for solid surfaces
 */
class Platform extends Entity {
  /**
   * Create a new platform
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Width
   * @param {number} height - Height
   * @param {string} type - Platform type (e.g., 'solid', 'moving', 'crumbling')
   * @param {Object} options - Additional options for the platform
   */
  constructor(x, y, width, height, type = "solid", options = {}) {
    super(x, y, width, height);

    this.type = type;
    this.color = options.color || "#8B4513"; // Brown by default

    // For moving platforms
    this.isMoving = type === "moving";
    this.moveSpeed = options.moveSpeed || 2;
    this.moveDistance = options.moveDistance || 100;
    this.startX = x;
    this.startY = y;
    this.endX = options.horizontal ? x + this.moveDistance : x;
    this.endY = options.horizontal ? y : y + this.moveDistance;
    this.movingForward = true;
    this.horizontal = options.horizontal || false;

    // For crumbling platforms
    this.isCrumbling = type === "crumbling";
    this.crumbleTimer = 0;
    this.crumbleDuration = options.crumbleDuration || 1000; // 1 second
    this.resetTimer = 0;
    this.resetDuration = options.resetDuration || 3000; // 3 seconds
    this.triggered = false;

    // For bouncy platforms
    this.isBouncy = type === "bouncy";
    this.bounceForce = options.bounceForce || PLAYER_JUMP_FORCE * 1.5;
  }

  /**
   * Update the platform
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    if (this.isMoving) {
      this.updateMovingPlatform();
    } else if (this.isCrumbling && this.triggered) {
      this.updateCrumblingPlatform(deltaTime);
    }
  }

  /**
   * Update a moving platform
   */
  updateMovingPlatform() {
    if (this.horizontal) {
      // Horizontal movement
      if (this.movingForward) {
        this.x += this.moveSpeed;
        if (this.x >= this.endX) {
          this.movingForward = false;
        }
      } else {
        this.x -= this.moveSpeed;
        if (this.x <= this.startX) {
          this.movingForward = true;
        }
      }
    } else {
      // Vertical movement
      if (this.movingForward) {
        this.y += this.moveSpeed;
        if (this.y >= this.endY) {
          this.movingForward = false;
        }
      } else {
        this.y -= this.moveSpeed;
        if (this.y <= this.startY) {
          this.movingForward = true;
        }
      }
    }
  }

  /**
   * Update a crumbling platform
   * @param {number} deltaTime - Time since last update
   */
  updateCrumblingPlatform(deltaTime) {
    if (this.isActive) {
      this.crumbleTimer += deltaTime * 1000;
      if (this.crumbleTimer >= this.crumbleDuration) {
        this.isActive = false;
        this.crumbleTimer = 0;
        this.resetTimer = 0;
      }
    } else {
      this.resetTimer += deltaTime * 1000;
      if (this.resetTimer >= this.resetDuration) {
        this.isActive = true;
        this.triggered = false;
      }
    }
  }

  /**
   * Trigger the crumbling platform
   */
  trigger() {
    if (this.isCrumbling && !this.triggered) {
      this.triggered = true;
    }
  }

  /**
   * Draw the platform
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} offsetX - Camera X offset
   * @param {number} offsetY - Camera Y offset
   */
  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.isActive) return;

    const drawX = this.x - offsetX;
    const drawY = this.y - offsetY;

    // Draw different platform types
    if (this.isCrumbling && this.triggered) {
      // Draw crumbling animation
      const progress = this.crumbleTimer / this.crumbleDuration;
      ctx.globalAlpha = 1 - progress * 0.7;
      ctx.fillStyle = this.color;
      ctx.fillRect(drawX, drawY, this.width, this.height);
      ctx.globalAlpha = 1;
    } else if (this.isBouncy) {
      // Draw bouncy platform
      ctx.fillStyle = "#00BFFF"; // Deep sky blue
      ctx.fillRect(drawX, drawY, this.width, this.height);

      // Draw spring effect
      ctx.fillStyle = "#87CEFA"; // Light sky blue
      ctx.fillRect(drawX + 5, drawY - 5, this.width - 10, 5);
    } else {
      // Draw regular platform
      ctx.fillStyle = this.color;
      ctx.fillRect(drawX, drawY, this.width, this.height);
    }
  }

  /**
   * Handle player collision with the platform
   * @param {Player} player - The player
   */
  handlePlayerCollision(player) {
    if (this.isCrumbling) {
      this.trigger();
    } else if (this.isBouncy && player.velocityY > 0) {
      player.velocityY = -this.bounceForce;
    }
  }
}
