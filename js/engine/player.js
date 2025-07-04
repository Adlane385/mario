/**
 * Player class for the main character
 */
class Player extends Entity {
  /**
   * Create a new player
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Sprite} sprite - Player sprite
   */
  constructor(x, y, sprite) {
    super(x, y, PLAYER_WIDTH, PLAYER_HEIGHT, sprite);

    this.lives = 3;
    this.score = 0;
    this.isInvulnerable = false;
    this.invulnerabilityTimer = 0;
    this.invulnerabilityDuration = 2000; // 2 seconds
    this.jumpCount = 0;
    this.maxJumps = 1; // Single jump by default

    // Shooting mechanics
    this.bullets = [];
    this.shootCooldown = 0;
    this.shootInterval = 300; // 0.3 seconds between shots
    this.canShoot = false; // Enabled in boss levels
  }

  /**
   * Handle player input
   * @param {InputHandler} input - Input handler
   */
  handleInput(input) {
    // Movement
    if (input.isPressed("ArrowLeft") || input.isPressed("KeyA")) {
      this.velocityX = -PLAYER_SPEED;
      this.facingRight = false;
      if (this.isOnGround) {
        this.sprite.setAnimation("run");
      }
    } else if (input.isPressed("ArrowRight") || input.isPressed("KeyD")) {
      this.velocityX = PLAYER_SPEED;
      this.facingRight = true;
      if (this.isOnGround) {
        this.sprite.setAnimation("run");
      }
    } else if (this.isOnGround) {
      this.sprite.setAnimation("idle");
    }

    // Jumping (only if not in boss level or if not shooting)
    if (
      (input.isPressed("ArrowUp") || input.isPressed("KeyW")) &&
      this.jumpCount < this.maxJumps
    ) {
      this.velocityY = -PLAYER_JUMP_FORCE;
      this.jumpCount++;
      this.isOnGround = false;
      this.sprite.setAnimation("jump");
    }

    // Shooting (Space key in boss levels)
    if (this.canShoot && input.isPressed("Space") && this.shootCooldown <= 0) {
      this.shoot();
    }

    // Limit speed
    this.velocityX = clamp(this.velocityX, -PLAYER_MAX_SPEED, PLAYER_MAX_SPEED);
  }

  /**
   * Update the player
   * @param {number} deltaTime - Time since last update
   * @param {Array} platforms - Array of platforms for collision detection
   * @param {Array} coins - Array of coins for collection
   * @param {Array} enemies - Array of enemies for collision detection
   */
  update(deltaTime, platforms, coins = [], enemies = []) {
    super.update(deltaTime, platforms);

    // Reset jump count when on ground
    if (this.isOnGround) {
      this.jumpCount = 0;
    }

    // Update invulnerability timer
    if (this.isInvulnerable) {
      this.invulnerabilityTimer -= deltaTime * 1000;
      if (this.invulnerabilityTimer <= 0) {
        this.isInvulnerable = false;
      }
    }

    // Update shoot cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime * 1000;
    }

    // Update bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update(deltaTime, platforms);

      if (!bullet.isActive) {
        this.bullets.splice(i, 1);
      }
    }

    // Check coin collisions
    this.checkCoinCollisions(coins);

    // Check enemy collisions
    if (!this.isInvulnerable) {
      this.checkEnemyCollisions(enemies);
    }

    // Check if player fell off the level
    if (this.y > GAME_HEIGHT + 200) {
      this.takeDamage();
      this.resetPosition();
    }
  }

  /**
   * Check for collisions with coins
   * @param {Array} coins - Array of coins
   */
  checkCoinCollisions(coins) {
    for (let i = coins.length - 1; i >= 0; i--) {
      const coin = coins[i];
      if (coin.isActive && checkCollision(this, coin)) {
        this.score += coin.value;
        coin.collect();
      }
    }
  }

  /**
   * Check for collisions with enemies
   * @param {Array} enemies - Array of enemies
   */
  checkEnemyCollisions(enemies) {
    for (const enemy of enemies) {
      if (enemy.isActive && checkCollision(this, enemy)) {
        // Check if player is jumping on the enemy
        if (
          this.velocityY > 0 &&
          this.y + this.height - this.velocityY <= enemy.y
        ) {
          enemy.defeat();
          this.velocityY = -PLAYER_JUMP_FORCE * 0.7; // Bounce off enemy
        } else {
          this.takeDamage();
        }
      }
    }
  }

  /**
   * Take damage and become temporarily invulnerable
   */
  takeDamage() {
    if (!this.isInvulnerable) {
      this.lives--;
      this.isInvulnerable = true;
      this.invulnerabilityTimer = this.invulnerabilityDuration;
    }
  }

  /**
   * Shoot a bullet
   */
  shoot() {
    const bulletX = this.facingRight
      ? this.x + this.width
      : this.x - BULLET_WIDTH;
    const bulletY = this.y + this.height / 2 - BULLET_HEIGHT / 2;
    const direction = this.facingRight ? 1 : -1;

    const bullet = new Bullet(bulletX, bulletY, direction);
    this.bullets.push(bullet);

    this.shootCooldown = this.shootInterval;
  }

  /**
   * Enable or disable shooting
   * @param {boolean} canShoot - Whether the player can shoot
   */
  setCanShoot(canShoot) {
    this.canShoot = canShoot;
  }

  /**
   * Reset player position (after falling or taking damage)
   */
  resetPosition() {
    // Reset to a safe position (should be set by the level)
    this.x = 100;
    this.y = 300;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  /**
   * Draw the player
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} offsetX - Camera X offset
   * @param {number} offsetY - Camera Y offset
   */
  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.isActive) return;

    // Flicker when invulnerable
    if (
      this.isInvulnerable &&
      Math.floor(this.invulnerabilityTimer / 100) % 2 === 0
    ) {
      return;
    }

    super.draw(ctx, offsetX, offsetY);

    // Draw bullets
    for (const bullet of this.bullets) {
      bullet.draw(ctx, offsetX, offsetY);
    }
  }
}
