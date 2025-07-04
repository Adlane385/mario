/**
 * Hazard class for dangerous areas like holes
 */
class Hazard extends Entity {
  /**
   * Create a new hazard
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Width
   * @param {number} height - Height
   * @param {string} type - Hazard type (e.g., 'hole', 'spike', 'lava')
   * @param {Object} options - Additional options
   */
  constructor(x, y, width, height, type = "hole", options = {}) {
    super(x, y, width, height);

    this.type = type;
    this.damage = options.damage || 1;
    this.name = options.name || "Hazard";
    this.description = options.description || "A dangerous obstacle";

    // Visual properties
    this.color = options.color || "#000000";
    this.animationTimer = 0;
  }

  /**
   * Update the hazard
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    // Simple animation for some hazard types
    this.animationTimer += deltaTime * 1000;
  }

  /**
   * Check if player is touching this hazard
   * @param {Player} player - The player
   * @returns {boolean} - True if player is touching hazard
   */
  checkPlayerCollision(player) {
    return checkCollision(this, player);
  }

  /**
   * Handle player collision
   * @param {Player} player - The player
   */
  handlePlayerCollision(player) {
    if (this.type === "hole") {
      // Player falls into hole
      player.takeDamage();
      player.resetPosition();
    } else {
      // Other hazards just damage the player
      player.takeDamage();
    }
  }

  /**
   * Draw the hazard
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} offsetX - Camera X offset
   * @param {number} offsetY - Camera Y offset
   */
  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.isActive) return;

    const drawX = this.x - offsetX;
    const drawY = this.y - offsetY;

    switch (this.type) {
      case "hole":
        this.drawHole(ctx, drawX, drawY);
        break;
      case "spike":
        this.drawSpike(ctx, drawX, drawY);
        break;
      case "lava":
        this.drawLava(ctx, drawX, drawY);
        break;
      default:
        // Default hazard appearance
        ctx.fillStyle = this.color;
        ctx.fillRect(drawX, drawY, this.width, this.height);
        break;
    }
  }

  /**
   * Draw a hole hazard
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  drawHole(ctx, x, y) {
    // Draw hole as a dark pit
    ctx.fillStyle = "#000000";
    ctx.fillRect(x, y, this.width, this.height);

    // Add some depth effect
    const gradient = ctx.createRadialGradient(
      x + this.width / 2,
      y + this.height / 2,
      0,
      x + this.width / 2,
      y + this.height / 2,
      this.width / 2
    );
    gradient.addColorStop(0, "#333333");
    gradient.addColorStop(1, "#000000");

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, this.width, this.height);

    // Add warning stripes around the edge
    ctx.strokeStyle = "#FFFF00";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.strokeRect(x, y, this.width, this.height);
    ctx.setLineDash([]);
  }

  /**
   * Draw a spike hazard
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  drawSpike(ctx, x, y) {
    ctx.fillStyle = "#666666";

    // Draw multiple spikes
    const spikeCount = Math.floor(this.width / 10);
    const spikeWidth = this.width / spikeCount;

    for (let i = 0; i < spikeCount; i++) {
      const spikeX = x + i * spikeWidth;

      ctx.beginPath();
      ctx.moveTo(spikeX, y + this.height);
      ctx.lineTo(spikeX + spikeWidth / 2, y);
      ctx.lineTo(spikeX + spikeWidth, y + this.height);
      ctx.closePath();
      ctx.fill();
    }
  }

  /**
   * Draw a lava hazard
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  drawLava(ctx, x, y) {
    // Animated lava effect
    const waveOffset = Math.sin(this.animationTimer * 0.005) * 5;

    // Base lava
    ctx.fillStyle = "#FF4500";
    ctx.fillRect(x, y + waveOffset, this.width, this.height - waveOffset);

    // Lava bubbles
    ctx.fillStyle = "#FF6347";
    for (let i = 0; i < 5; i++) {
      const bubbleX =
        x +
        (i * this.width) / 5 +
        Math.sin(this.animationTimer * 0.003 + i) * 10;
      const bubbleY =
        y + this.height / 2 + Math.cos(this.animationTimer * 0.004 + i) * 5;
      const bubbleSize = 3 + Math.sin(this.animationTimer * 0.006 + i) * 2;

      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
