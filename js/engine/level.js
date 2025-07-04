/**
 * Level class for managing game levels
 */
class Level {
  /**
   * Create a new level
   * @param {string} type - Level type (e.g., 'house', 'senate', 'final')
   * @param {string} name - Level name
   * @param {string} description - Level description
   * @param {number} width - Level width
   * @param {number} height - Level height
   */
  constructor(type, name, description, width = 3000, height = GAME_HEIGHT) {
    this.type = type;
    this.name = name;
    this.description = description;
    this.width = width;
    this.height = height;

    this.platforms = [];
    this.coins = [];
    this.enemies = [];
    this.hazards = [];
    this.bosses = [];
    this.checkpoints = [];
    this.educationalPoints = [];

    this.startX = 100;
    this.startY = 300;
    this.endX = width - 100;

    this.background = null;
    this.completed = false;
    this.requiredVotes = 0; // Minimum votes needed to pass the level
  }

  /**
   * Add a platform to the level
   * @param {Platform} platform - Platform to add
   */
  addPlatform(platform) {
    this.platforms.push(platform);
  }

  /**
   * Add a coin to the level
   * @param {Coin} coin - Coin to add
   */
  addCoin(coin) {
    this.coins.push(coin);
  }

  /**
   * Add an enemy to the level
   * @param {Enemy} enemy - Enemy to add
   */
  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  /**
   * Add a checkpoint to the level
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  addCheckpoint(x, y) {
    this.checkpoints.push({ x, y });
  }

  /**
   * Add an educational point to the level
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} title - Title of the educational point
   * @param {string} content - Content of the educational point
   */
  addEducationalPoint(x, y, title, content) {
    this.educationalPoints.push({ x, y, title, content, triggered: false });
  }

  /**
   * Set the background image for the level
   * @param {HTMLImageElement} image - Background image
   */
  setBackground(image) {
    this.background = image;
  }

  /**
   * Set the required votes to complete the level
   * @param {number} votes - Required votes
   */
  setRequiredVotes(votes) {
    this.requiredVotes = votes;
  }

  /**
   * Update the level
   * @param {number} deltaTime - Time since last update
   * @param {Player} player - The player
   */
  update(deltaTime, player) {
    // Update platforms
    for (const platform of this.platforms) {
      platform.update(deltaTime);

      // Check if player is on this platform
      if (player.isOnGround && checkCollision(player, platform)) {
        platform.handlePlayerCollision(player);
      }
    }

    // Update coins
    for (const coin of this.coins) {
      coin.update(deltaTime);
    }

    // Update enemies
    for (const enemy of this.enemies) {
      enemy.update(deltaTime, this.platforms);
    }

    // Update hazards
    for (const hazard of this.hazards) {
      hazard.update(deltaTime);

      // Check hazard collisions with player
      if (hazard.checkPlayerCollision(player)) {
        hazard.handlePlayerCollision(player);
      }
    }

    // Update bosses
    for (const boss of this.bosses) {
      boss.update(deltaTime, this.platforms, player);

      // Check bullet collisions with boss
      for (let i = player.bullets.length - 1; i >= 0; i--) {
        const bullet = player.bullets[i];
        if (checkCollision(bullet, boss)) {
          boss.takeDamage(bullet.damage);
          bullet.isActive = false;
          player.bullets.splice(i, 1);
        }
      }
      
      // Check player collision with boss (only if player is not invulnerable)
      if (!player.isInvulnerable && boss.isActive && checkCollision(player, boss)) {
        player.takeDamage();
      }
    }

    // Check educational points
    for (const point of this.educationalPoints) {
      if (
        !point.triggered &&
        player.x >= point.x - 50 &&
        player.x <= point.x + 50 &&
        player.y >= point.y - 50 &&
        player.y <= point.y + 50
      ) {
        point.triggered = true;
        this.triggerEducationalPoint(point);
      }
    }

    // Check if player reached the end of the level
    if (player.x >= this.endX) {
      // For boss levels, check if all bosses are defeated
      if (this.isBossLevel) {
        const allBossesDefeated = this.bosses.every((boss) => !boss.isActive);
        if (allBossesDefeated) {
          this.completed = true;
        }
      } else {
        this.completed = true;
      }
    }
  }

  /**
   * Trigger an educational point
   * @param {Object} point - Educational point
   */
  triggerEducationalPoint(point) {
    // Display educational content (to be implemented in UI)
    console.log(`Educational Point: ${point.title}`);
    console.log(point.content);
  }

  /**
   * Draw the level
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} offsetX - Camera X offset
   * @param {number} offsetY - Camera Y offset
   */
  draw(ctx, offsetX = 0, offsetY = 0) {
    // Draw background
    if (this.background) {
      // Parallax scrolling effect
      const parallaxFactor = 0.5;
      const bgOffsetX = offsetX * parallaxFactor;

      // Repeat background horizontally
      const bgWidth = this.background.width;
      const repetitions = Math.ceil(this.width / bgWidth) + 1;

      for (let i = 0; i < repetitions; i++) {
        const drawX = i * bgWidth - (bgOffsetX % bgWidth);
        ctx.drawImage(this.background, drawX, 0, bgWidth, this.height);
      }
    } else {
      // Draw default background if no image is set
      ctx.fillStyle = "#87CEEB"; // Sky blue
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    // Draw platforms
    for (const platform of this.platforms) {
      platform.draw(ctx, offsetX, offsetY);
    }

    // Draw coins
    for (const coin of this.coins) {
      coin.draw(ctx, offsetX, offsetY);
    }

    // Draw enemies
    for (const enemy of this.enemies) {
      enemy.draw(ctx, offsetX, offsetY);
    }

    // Draw hazards
    for (const hazard of this.hazards) {
      hazard.draw(ctx, offsetX, offsetY);
    }

    // Draw bosses
    for (const boss of this.bosses) {
      boss.draw(ctx, offsetX, offsetY);
    }

    // Draw end flag
    ctx.fillStyle = "green";
    ctx.fillRect(this.endX - offsetX, 100 - offsetY, 20, 300);
    ctx.fillStyle = "white";
    ctx.fillRect(this.endX - offsetX + 20, 100 - offsetY, 30, 50);
  }

  /**
   * Reset the level
   */
  reset() {
    this.completed = false;

    // Reset all entities
    for (const coin of this.coins) {
      coin.reset();
    }

    for (const enemy of this.enemies) {
      enemy.reset();
    }

    for (const hazard of this.hazards) {
      hazard.isActive = true;
    }

    for (const boss of this.bosses) {
      boss.isActive = true;
      boss.health = boss.maxHealth;
    }

    for (const point of this.educationalPoints) {
      point.triggered = false;
    }
  }

  /**
   * Get the nearest checkpoint to the player
   * @param {number} playerX - Player X position
   * @param {number} playerY - Player Y position
   * @returns {Object} - Nearest checkpoint
   */
  getNearestCheckpoint(playerX, playerY) {
    if (this.checkpoints.length === 0) {
      return { x: this.startX, y: this.startY };
    }

    let nearestCheckpoint = this.checkpoints[0];
    let minDistance = Infinity;

    for (const checkpoint of this.checkpoints) {
      const distance = Math.sqrt(
        Math.pow(checkpoint.x - playerX, 2) +
          Math.pow(checkpoint.y - playerY, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestCheckpoint = checkpoint;
      }
    }

    return nearestCheckpoint;
  }
}
