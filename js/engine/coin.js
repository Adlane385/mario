/**
 * Coin class for collectible items
 */
class Coin extends Entity {
  /**
   * Create a new coin
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Sprite} sprite - Coin sprite
   * @param {number} value - Value of the coin
   * @param {string} type - Type of coin (e.g., 'regular', 'special')
   * @param {string} description - Educational description of what this coin represents
   */
  constructor(
    x,
    y,
    sprite,
    value = COIN_VALUE,
    type = "regular",
    description = "A vote from a member of Congress"
  ) {
    super(x, y, COIN_WIDTH, COIN_HEIGHT, sprite);

    // Ensure value is at least 1
    this.value = value < 1 ? 1 : value;
    this.type = type;
    this.description = description;
    this.collected = false;
    this.collectAnimation = 0;
    this.collectAnimationDuration = 20;
  }

  /**
   * Update the coin
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    if (!this.isActive) return;

    if (this.collected) {
      this.collectAnimation++;
      if (this.collectAnimation >= this.collectAnimationDuration) {
        this.isActive = false;
      }
    } else if (this.sprite) {
      this.sprite.update(deltaTime);
    }
  }

  /**
   * Collect the coin
   */
  collect() {
    if (!this.collected) {
      this.collected = true;
    }
  }

  /**
   * Draw the coin
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} offsetX - Camera X offset
   * @param {number} offsetY - Camera Y offset
   */
  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.isActive) return;

    const drawX = this.x - offsetX;
    const drawY = this.y - offsetY;

    if (this.collected) {
      // Draw collection animation
      const progress = this.collectAnimation / this.collectAnimationDuration;
      ctx.globalAlpha = 1 - progress;
      ctx.translate(drawX + this.width / 2, drawY + this.height / 2);
      ctx.scale(1 + progress, 1 + progress);

      if (this.sprite) {
        this.sprite.draw(
          ctx,
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height
        );
      } else {
        ctx.fillStyle = this.type === "special" ? "gold" : "yellow";
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.resetTransform();
      ctx.globalAlpha = 1;
    } else {
      if (this.sprite) {
        this.sprite.draw(ctx, drawX, drawY, this.width, this.height);
      } else {
        // Draw a placeholder circle if no sprite is available
        ctx.fillStyle = this.type === "special" ? "gold" : "yellow";
        ctx.beginPath();
        ctx.arc(
          drawX + this.width / 2,
          drawY + this.height / 2,
          this.width / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }

  /**
   * Reset the coin to its initial state
   */
  reset() {
    this.isActive = true;
    this.collected = false;
    this.collectAnimation = 0;
  }
}
