/**
 * Boss class for boss enemies
 */
class Boss extends Entity {
  /**
   * Create a new boss
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} name - Boss name
   * @param {string} description - Boss description
   */
  constructor(x, y, name = "Boss", description = "A powerful enemy") {
    super(x, y, BOSS_WIDTH, BOSS_HEIGHT);

    this.name = name;
    this.description = description;
    this.maxHealth = BOSS_HEALTH;
    this.health = this.maxHealth;
    this.speed = BOSS_SPEED;
    this.direction = -1;
    this.patrolDistance = 300;
    this.startX = x;
    this.endX = x + this.patrolDistance;

    // Attack properties
    this.attackCooldown = 0;
    this.attackInterval = 2000; // 2 seconds between attacks
    this.isAttacking = false;
    this.attackDuration = 500; // 0.5 seconds attack animation

    // Visual effects
    this.hitFlash = 0;
    this.hitFlashDuration = 200;

    // Boss phases
    this.phase = 1;
    this.maxPhases = 3;
  }

  /**
   * Update the boss
   * @param {number} deltaTime - Time since last update
   * @param {Array} platforms - Array of platforms for collision detection
   * @param {Player} player - The player for AI behavior
   */
  update(deltaTime, platforms, player) {
    if (!this.isActive) return;

    // Update timers
    this.attackCooldown -= deltaTime * 1000;
    this.hitFlash -= deltaTime * 1000;

    // Boss AI behavior
    this.updateAI(player);

    // Movement
    this.velocityX = this.speed * this.direction;

    // Change direction at patrol boundaries
    if (this.x <= this.startX) {
      this.direction = 1;
      this.facingRight = true;
    } else if (this.x >= this.endX) {
      this.direction = -1;
      this.facingRight = false;
    }

    // Update physics
    super.update(deltaTime, platforms);

    // Update phase based on health
    const healthPercentage = this.health / this.maxHealth;
    if (healthPercentage > 0.66) {
      this.phase = 1;
    } else if (healthPercentage > 0.33) {
      this.phase = 2;
      this.speed = BOSS_SPEED * 1.5;
    } else {
      this.phase = 3;
      this.speed = BOSS_SPEED * 2;
    }
  }

  /**
   * Update boss AI
   * @param {Player} player - The player
   */
  updateAI(player) {
    // Attack if player is nearby and cooldown is ready
    if (this.attackCooldown <= 0 && !this.isAttacking) {
      const distanceToPlayer = Math.abs(this.x - player.x);
      if (distanceToPlayer < 200) {
        this.startAttack();
      }
    }

    // Update attack state
    if (this.isAttacking) {
      this.attackDuration -= 16; // Assuming 60 FPS
      if (this.attackDuration <= 0) {
        this.endAttack();
      }
    }
  }

  /**
   * Start an attack
   */
  startAttack() {
    this.isAttacking = true;
    this.attackDuration = 500;
    this.attackCooldown = this.attackInterval;

    // Different attack patterns based on phase
    switch (this.phase) {
      case 1:
        // Simple charge attack
        this.velocityX = this.speed * 3 * this.direction;
        break;
      case 2:
        // Jump attack
        this.velocityY = -PLAYER_JUMP_FORCE;
        break;
      case 3:
        // Rapid movement
        this.speed = BOSS_SPEED * 3;
        break;
    }
  }

  /**
   * End an attack
   */
  endAttack() {
    this.isAttacking = false;
    this.speed =
      BOSS_SPEED * (this.phase === 3 ? 2 : this.phase === 2 ? 1.5 : 1);
  }

  /**
   * Take damage from a bullet
   * @param {number} damage - Amount of damage to take
   */
  takeDamage(damage) {
    this.health -= damage;
    this.hitFlash = this.hitFlashDuration;

    if (this.health <= 0) {
      this.defeat();
    }
  }

  /**
   * Defeat the boss
   */
  defeat() {
    this.isActive = false;
  }

  /**
   * Draw the boss
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} offsetX - Camera X offset
   * @param {number} offsetY - Camera Y offset
   */
  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.isActive) return;

    const drawX = this.x - offsetX;
    const drawY = this.y - offsetY;

    // Flash red when hit
    if (this.hitFlash > 0) {
      ctx.fillStyle = "#FF0000";
    } else {
      // Different colors based on phase
      switch (this.phase) {
        case 1:
          ctx.fillStyle = "#8B0000"; // Dark red
          break;
        case 2:
          ctx.fillStyle = "#FF4500"; // Orange red
          break;
        case 3:
          ctx.fillStyle = "#DC143C"; // Crimson
          break;
      }
    }

    // Draw boss body
    ctx.fillRect(drawX, drawY, this.width, this.height);

    // Draw boss details
    ctx.fillStyle = "#000000";

    // Eyes
    const eyeSize = 8;
    const eyeY = drawY + 15;
    ctx.fillRect(drawX + 15, eyeY, eyeSize, eyeSize);
    ctx.fillRect(drawX + this.width - 23, eyeY, eyeSize, eyeSize);

    // Mouth
    ctx.fillRect(drawX + 20, drawY + 40, this.width - 40, 8);

    // Draw health bar
    this.drawHealthBar(ctx, drawX, drawY - 20);

    // Draw name
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.name, drawX + this.width / 2, drawY - 30);
  }

  /**
   * Draw the boss health bar
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  drawHealthBar(ctx, x, y) {
    const barWidth = this.width;
    const barHeight = 8;
    const healthPercentage = this.health / this.maxHealth;

    // Background
    ctx.fillStyle = "#333333";
    ctx.fillRect(x, y, barWidth, barHeight);

    // Health
    ctx.fillStyle =
      healthPercentage > 0.5
        ? "#00FF00"
        : healthPercentage > 0.25
        ? "#FFFF00"
        : "#FF0000";
    ctx.fillRect(x, y, barWidth * healthPercentage, barHeight);

    // Border
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barWidth, barHeight);
  }
}
