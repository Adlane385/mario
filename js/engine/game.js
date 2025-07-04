/**
 * Main Game class
 */
class Game {
  /**
   * Create a new game
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // Set canvas dimensions based on container size
    this.resizeCanvas();

    // Add event listener for window resize
    window.addEventListener("resize", () => this.resizeCanvas());

    // Game state
    this.state = GAME_STATE.INTRO;
    this.levels = {};
    this.currentLevel = null;
    this.levelOrder = [];
    this.currentLevelIndex = 0;

    // Game objects
    this.player = null;
    this.camera = new Camera();
    this.input = new InputHandler(canvas);

    // Game resources
    this.images = {};
    this.audio = {};
    this.videos = {};

    // Game loop variables
    this.lastTime = 0;
    this.animationFrameId = null;

    // UI callbacks
    this.onScoreChange = null;
    this.onLivesChange = null;
    this.onGameStateChange = null;
    this.onLevelComplete = null;
    this.onGameOver = null;
    this.onGameComplete = null;

    // Educational content
    this.educationalContent = {
      currentPoint: null,
      isDisplaying: false,
    };
  }

  /**
   * Initialize the game
   * @returns {Promise} - Promise that resolves when the game is initialized
   */
  async init() {
    try {
      // Load game resources
      await this.loadResources();

      // Create player
      this.createPlayer();

      // Create levels
      this.createLevels();

      console.log("Game initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing game:", error);
      return false;
    }
  }

  /**
   * Load game resources (images, audio, etc.)
   * @returns {Promise} - Promise that resolves when resources are loaded
   */
  async loadResources() {
    // Placeholder for actual resource loading
    // In a real game, you would load sprites, sounds, etc.
    console.log("Loading resources...");

    // Create realistic placeholder images
    const createPlayerImage = () => {
      const img = document.createElement("canvas");
      img.width = 32;
      img.height = 48;
      const ctx = img.getContext("2d");

      // Body (suit)
      ctx.fillStyle = "#2C3E50";
      ctx.fillRect(8, 16, 16, 24);

      // Head
      ctx.fillStyle = "#F4C2A1";
      ctx.fillRect(10, 4, 12, 12);

      // Hair
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(10, 4, 12, 6);

      // Eyes
      ctx.fillStyle = "#000";
      ctx.fillRect(12, 8, 2, 2);
      ctx.fillRect(18, 8, 2, 2);

      // Tie
      ctx.fillStyle = "#E74C3C";
      ctx.fillRect(14, 16, 4, 12);

      // Arms
      ctx.fillStyle = "#2C3E50";
      ctx.fillRect(4, 18, 6, 16);
      ctx.fillRect(22, 18, 6, 16);

      // Legs
      ctx.fillStyle = "#34495E";
      ctx.fillRect(10, 40, 5, 8);
      ctx.fillRect(17, 40, 5, 8);

      return img;
    };

    const createEnemyImage = () => {
      const img = document.createElement("canvas");
      img.width = 32;
      img.height = 32;
      const ctx = img.getContext("2d");

      // Boulder shape
      ctx.fillStyle = "#8B4513";
      ctx.beginPath();
      ctx.ellipse(16, 16, 15, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rock texture
      ctx.fillStyle = "#A0522D";
      ctx.fillRect(8, 8, 4, 4);
      ctx.fillRect(20, 12, 3, 3);
      ctx.fillRect(12, 20, 5, 3);
      ctx.fillRect(18, 6, 3, 4);

      // Darker spots
      ctx.fillStyle = "#654321";
      ctx.fillRect(6, 14, 3, 3);
      ctx.fillRect(22, 18, 4, 4);
      ctx.fillRect(14, 6, 2, 2);

      return img;
    };

    const createCoinImage = () => {
      const img = document.createElement("canvas");
      img.width = 24;
      img.height = 24;
      const ctx = img.getContext("2d");

      // Coin background
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.ellipse(12, 12, 11, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      // Coin border
      ctx.strokeStyle = "#FFA500";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Vote symbol (V)
      ctx.fillStyle = "#B8860B";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("V", 12, 17);

      return img;
    };

    const createBackgroundImage = () => {
      const img = document.createElement("canvas");
      img.width = 800;
      img.height = 600;
      const ctx = img.getContext("2d");

      // Sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 600);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(1, "#E0F6FF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);

      // Capitol building silhouette
      ctx.fillStyle = "#2C3E50";
      ctx.fillRect(300, 400, 200, 200);

      // Dome
      ctx.beginPath();
      ctx.ellipse(400, 400, 100, 50, 0, 0, Math.PI, true);
      ctx.fill();

      // Flag
      ctx.fillStyle = "#E74C3C";
      ctx.fillRect(395, 350, 10, 50);
      ctx.fillStyle = "#3498DB";
      ctx.fillRect(405, 350, 30, 20);

      return img;
    };

    // Create realistic images
    this.images.player = createPlayerImage();
    this.images.enemy = createEnemyImage();
    this.images.coin = createCoinImage();
    this.images.background = createBackgroundImage();

    return Promise.resolve();
  }

  /**
   * Create the player
   */
  createPlayer() {
    // Create a simple sprite for the player
    const playerSprite = new Sprite(this.images.player, 32, 48, 1);

    // Create the player
    this.player = new Player(100, 300, playerSprite);
  }

  /**
   * Create game levels
   */
  createLevels() {
    // House level
    const houseLevel = new Level(
      LEVEL_TYPE.HOUSE,
      "House of Representatives",
      "Gather votes to pass your bill in the House",
      3000
    );

    // Add platforms to house level
    for (let i = 0; i < 10; i++) {
      const x = i * 300;
      const y = 400 + Math.sin(i * 0.5) * 50;
      const width = 250;
      const height = 20;

      houseLevel.addPlatform(new Platform(x, y, width, height));
    }

    // Add coins to house level
    for (let i = 0; i < 20; i++) {
      const x = 100 + i * 150;
      const y = 350 + Math.sin(i * 0.8) * 30;

      const coinSprite = new Sprite(this.images.coin, 24, 24, 1);
      houseLevel.addCoin(new Coin(x, y, coinSprite));
    }

    // Add enemies to house level
    for (let i = 0; i < 5; i++) {
      const x = 400 + i * 500;
      const y = 350;

      const enemySprite = new Sprite(this.images.enemy, 32, 32, 1);
      houseLevel.addEnemy(
        new Enemy(x, y, enemySprite, "walker", {
          name: "Lobbyist",
          description: "A lobbyist trying to block your bill",
        })
      );
    }

    // Add educational points
    houseLevel.addEducationalPoint(
      300,
      300,
      "House of Representatives",
      "The House of Representatives is one of two chambers of Congress. Bills need a simple majority to pass."
    );

    houseLevel.addEducationalPoint(
      1000,
      300,
      "Committee Process",
      "Before a vote, bills go through committees where they are debated and amended."
    );

    houseLevel.addEducationalPoint(
      2000,
      300,
      "House Rules",
      "The Rules Committee determines how a bill will be debated and amended on the House floor."
    );

    // Set required votes
    houseLevel.setRequiredVotes(10);

    // Senate level
    const senateLevel = new Level(
      LEVEL_TYPE.SENATE,
      "Senate",
      "Gather votes to pass your bill in the Senate",
      3000
    );

    // Add platforms to senate level
    for (let i = 0; i < 10; i++) {
      const x = i * 300;
      const y = 400 + Math.cos(i * 0.5) * 50;
      const width = 250;
      const height = 20;

      if (i % 3 === 0) {
        // Add moving platform
        senateLevel.addPlatform(
          new Platform(x, y, width, height, "moving", {
            horizontal: true,
            moveDistance: 100,
          })
        );
      } else {
        senateLevel.addPlatform(new Platform(x, y, width, height));
      }
    }

    // Add coins to senate level
    for (let i = 0; i < 15; i++) {
      const x = 100 + i * 200;
      const y = 350 + Math.cos(i * 0.8) * 30;

      const coinSprite = new Sprite(this.images.coin, 24, 24, 1);
      senateLevel.addCoin(new Coin(x, y, coinSprite));
    }

    // Add enemies to senate level
    for (let i = 0; i < 3; i++) {
      const x = 600 + i * 800;
      const y = 350;

      const enemySprite = new Sprite(this.images.enemy, 32, 32, 1);
      senateLevel.addEnemy(
        new Enemy(x, y, enemySprite, "flyer", {
          name: "Filibuster",
          description: "A filibuster can block legislation in the Senate",
          flyHeight: 100,
          speed: 3,
        })
      );
    }

    // Add educational points
    senateLevel.addEducationalPoint(
      300,
      300,
      "The Senate",
      "The Senate is the upper chamber of Congress. Each state has two senators regardless of population."
    );

    senateLevel.addEducationalPoint(
      1000,
      300,
      "Filibuster",
      "The filibuster is a tactic used to block legislation by extending debate indefinitely."
    );

    senateLevel.addEducationalPoint(
      2000,
      300,
      "Cloture",
      "Cloture is the procedure to end a filibuster, requiring 60 votes in the Senate."
    );

    // Set required votes
    senateLevel.setRequiredVotes(8);

    // Final level
    const finalLevel = new Level(
      LEVEL_TYPE.FINAL,
      "Presidential Approval",
      "Navigate the final steps to turn your bill into law",
      2000
    );

    // Add platforms to final level
    for (let i = 0; i < 8; i++) {
      const x = i * 250;
      const y = 400 + Math.sin(i * 0.7) * 70;
      const width = 200;
      const height = 20;

      if (i % 4 === 0) {
        // Add bouncy platform
        finalLevel.addPlatform(
          new Platform(x, y, width, height, "bouncy", {
            bounceForce: 15,
          })
        );
      } else if (i % 4 === 2) {
        // Add crumbling platform
        finalLevel.addPlatform(new Platform(x, y, width, height, "crumbling"));
      } else {
        finalLevel.addPlatform(new Platform(x, y, width, height));
      }
    }

    // Add coins to final level
    for (let i = 0; i < 10; i++) {
      const x = 100 + i * 180;
      const y = 300 + Math.sin(i * 1.2) * 50;

      const coinSprite = new Sprite(this.images.coin, 24, 24, 1);
      finalLevel.addCoin(
        new Coin(
          x,
          y,
          coinSprite,
          2,
          "special",
          "A special vote from a key committee member"
        )
      );
    }

    // Add a boss enemy
    const bossSprite = new Sprite(this.images.enemy, 64, 64, 1);
    finalLevel.addEnemy(
      new Enemy(1500, 300, bossSprite, "walker", {
        name: "Presidential Veto",
        description:
          "The President can veto a bill, sending it back to Congress",
        width: 64,
        height: 64,
        speed: 4,
        patrolDistance: 300,
      })
    );

    // Add educational points
    finalLevel.addEducationalPoint(
      300,
      300,
      "Conference Committee",
      "If the House and Senate pass different versions of a bill, a conference committee resolves the differences."
    );

    finalLevel.addEducationalPoint(
      1000,
      300,
      "Presidential Action",
      "After passing both chambers, a bill goes to the President who can sign it into law or veto it."
    );

    finalLevel.addEducationalPoint(
      1700,
      300,
      "Veto Override",
      "Congress can override a presidential veto with a two-thirds majority in both chambers."
    );

    // Set required votes
    finalLevel.setRequiredVotes(5);

    // Create boss level
    const bossLevel = createBossLevel(this);

    // Store levels
    this.levels = {
      [LEVEL_TYPE.HOUSE]: houseLevel,
      [LEVEL_TYPE.SENATE]: senateLevel,
      [LEVEL_TYPE.BOSS]: bossLevel,
      [LEVEL_TYPE.FINAL]: finalLevel,
    };
  }

  /**
   * Start the game
   */
  start() {
    // Set initial game state
    this.setState(GAME_STATE.INTRO);

    // Start game loop
    this.lastTime = 0;
    this.gameLoop(0);
  }

  /**
   * Game loop
   * @param {number} timestamp - Current timestamp
   */
  gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Debug: Log game state occasionally
    if (Math.floor(timestamp / 1000) % 5 === 0 && timestamp % 1000 < 50) {
      console.log(
        "Game state:",
        this.state,
        "Current level:",
        this.currentLevel ? this.currentLevel.constructor.name : "none"
      );
    }

    // Update and draw based on game state
    if (this.state === GAME_STATE.PLAYING) {
      this.update(deltaTime);
      this.draw();
    }

    // Update UI
    if (this.ui) {
      this.ui.update();
    }

    // Continue game loop
    this.animationFrameId = requestAnimationFrame((timestamp) =>
      this.gameLoop(timestamp)
    );
  }

  /**
   * Update game state
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    if (!this.currentLevel) return;

    // Update player
    this.player.handleInput(this.input);
    this.player.update(
      deltaTime,
      this.currentLevel.platforms,
      this.currentLevel.coins,
      this.currentLevel.enemies
    );

    // Update camera to follow player
    this.camera.setLevelDimensions(
      this.currentLevel.width,
      this.currentLevel.height
    );
    this.camera.follow(this.player);

    // Update level
    this.currentLevel.update(deltaTime, this.player);

    // Check if player has completed the level
    if (this.currentLevel.completed) {
      this.completeLevel();
    }

    // Check if player has lost all lives
    if (this.player.lives <= 0) {
      this.gameOver();
    }

    // Update UI
    if (this.onScoreChange) {
      this.onScoreChange(this.player.score);
    }

    if (this.onLivesChange) {
      this.onLivesChange(this.player.lives);
    }
  }

  /**
   * Draw the game
   */
  draw() {
    if (!this.currentLevel) return;

    // Draw level
    this.currentLevel.draw(this.ctx, this.camera.x, this.camera.y);

    // Draw player
    this.player.draw(this.ctx, this.camera.x, this.camera.y);
  }

  /**
   * Set the game state
   * @param {string} state - New game state
   */
  setState(state) {
    this.state = state;

    if (this.onGameStateChange) {
      this.onGameStateChange(state);
    }
  }

  /**
   * Start a level
   * @param {string} levelType - Level type to start
   */
  startLevel(levelType) {
    // Set current level
    this.currentLevel = this.levels[levelType];

    if (!this.currentLevel) {
      console.error(`Level type ${levelType} not found`);
      return;
    }

    // Reset player
    this.player.x = this.currentLevel.startX;
    this.player.y = this.currentLevel.startY;
    this.player.velocityX = 0;
    this.player.velocityY = 0;

    // Reset camera
    this.camera.x = 0;
    this.camera.y = 0;

    // Enable shooting for boss levels
    this.player.setCanShoot(this.currentLevel.isBossLevel || false);

    // Set game state to playing
    this.setState(GAME_STATE.PLAYING);
  }

  /**
   * Complete the current level
   */
  completeLevel() {
    // Check if player has enough votes
    if (this.player.score < this.currentLevel.requiredVotes) {
      // Not enough votes, restart level
      this.currentLevel.reset();
      this.player.resetPosition();
      return;
    }

    // Set game state to level complete
    this.setState(GAME_STATE.LEVEL_COMPLETE);

    // Call level complete callback
    if (this.onLevelComplete) {
      this.onLevelComplete(this.currentLevel, this.player.score);
    }
  }

  /**
   * Advance to the next level
   */
  nextLevel() {
    // Determine next level based on level order
    this.currentLevelIndex++;

    if (this.currentLevelIndex >= this.levelOrder.length) {
      // All levels completed
      this.gameComplete();
    } else {
      // Start next level
      const nextLevelType = this.levelOrder[this.currentLevelIndex];
      this.startLevel(nextLevelType);
    }
  }

  /**
   * Set the level order
   * @param {Array} order - Array of level types in order
   */
  setLevelOrder(order) {
    this.levelOrder = order;
    this.currentLevelIndex = 0;
  }

  /**
   * Game over
   */
  gameOver() {
    this.setState(GAME_STATE.GAME_OVER);

    if (this.onGameOver) {
      this.onGameOver();
    }
  }

  /**
   * Resize canvas to fit container while maintaining aspect ratio
   */
  resizeCanvas() {
    const container = this.canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Maintain 4:3 aspect ratio
    let canvasWidth, canvasHeight;

    if (containerWidth / containerHeight > 4 / 3) {
      // Container is wider than 4:3
      canvasHeight = containerHeight;
      canvasWidth = containerHeight * (4 / 3);
    } else {
      // Container is taller than 4:3
      canvasWidth = containerWidth;
      canvasHeight = containerWidth * (3 / 4);
    }

    // Set canvas dimensions
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;

    // Set canvas style dimensions for display
    this.canvas.style.width = `${canvasWidth}px`;
    this.canvas.style.height = `${canvasHeight}px`;
  }

  /**
   * Game complete
   */
  gameComplete() {
    this.setState(GAME_STATE.GAME_COMPLETE);

    if (this.onGameComplete) {
      this.onGameComplete();
    }
  }

  /**
   * Restart the game
   */
  restart() {
    // Reset all levels
    for (const levelType in this.levels) {
      this.levels[levelType].reset();
    }

    // Reset player
    this.player.lives = 3;
    this.player.score = 0;

    // Reset level index and order
    this.currentLevelIndex = 0;
    this.levelOrder = [];

    // Reset game state to intro
    this.setState(GAME_STATE.INTRO);
  }

  /**
   * Stop the game
   */
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
