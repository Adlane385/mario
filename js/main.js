/**
 * Main entry point for the game
 */
document.addEventListener("DOMContentLoaded", async () => {
  // Get the canvas element
  const canvas = document.getElementById("game-canvas");

  // Create game instance
  const game = new Game(canvas);

  // Initialize the game
  const initialized = await game.init();

  if (initialized) {
    // Create UI handler
    const ui = new UI(game);

    // Set UI reference in game for updates
    game.ui = ui;

    // Override level creation functions
    game.levels[LEVEL_TYPE.HOUSE] = createHouseLevel(game);
    game.levels[LEVEL_TYPE.SENATE] = createSenateLevel(game);
    game.levels[LEVEL_TYPE.BOSS] = createBossLevel(game);
    game.levels[LEVEL_TYPE.FINAL] = createFinalLevel(game);

    // Start the game
    game.start();

    console.log("Game started successfully");
  } else {
    console.error("Failed to initialize game");
  }
});
