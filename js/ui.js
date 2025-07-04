/**
 * UI handler for the game
 */
class UI {
  /**
   * Create a new UI handler
   * @param {Game} game - The game instance
   */
  constructor(game) {
    this.game = game;

    // Get UI elements
    this.screens = {
      intro: document.getElementById("intro-screen"),
      levelSelect: document.getElementById("level-select-screen"),
      video: document.getElementById("video-screen"),
      game: document.getElementById("game-screen"),
      levelComplete: document.getElementById("level-complete-screen"),
      gameOver: document.getElementById("game-over-screen"),
      gameComplete: document.getElementById("game-complete-screen"),
    };

    this.elements = {
      score: document.getElementById("score"),
      lives: document.getElementById("lives"),
      levelVotes: document.getElementById("level-votes"),
      videoContainer: document.getElementById("video-container"),
      bossInstructions: document.getElementById("boss-instructions"),
    };

    this.buttons = {
      start: document.getElementById("start-button"),
      levelA: document.getElementById("level-a-button"),
      levelB: document.getElementById("level-b-button"),
      videoSkip: document.getElementById("video-skip-button"),
      nextLevel: document.getElementById("next-level-button"),
      restart: document.getElementById("restart-button"),
      playAgain: document.getElementById("play-again-button"),
    };

    // Game flow state
    this.firstLevelType = null;
    this.currentVideo = null;

    // Set up event listeners
    this.setupEventListeners();

    // Set up game callbacks
    this.setupGameCallbacks();
  }

  /**
   * Set up event listeners for UI elements
   */
  setupEventListeners() {
    // Start button
    this.buttons.start.addEventListener("click", () => {
      this.showScreen("levelSelect");
      this.playVideo(VIDEO_TYPE.INTRO);
    });

    // Level selection buttons
    this.buttons.levelA.addEventListener("click", () => {
      this.firstLevelType = LEVEL_TYPE.HOUSE;
      this.game.setLevelOrder([
        LEVEL_TYPE.HOUSE,
        LEVEL_TYPE.SENATE,
        LEVEL_TYPE.BOSS,
      ]);
      this.game.startLevel(LEVEL_TYPE.HOUSE);
    });

    this.buttons.levelB.addEventListener("click", () => {
      this.firstLevelType = LEVEL_TYPE.SENATE;
      this.game.setLevelOrder([
        LEVEL_TYPE.SENATE,
        LEVEL_TYPE.HOUSE,
        LEVEL_TYPE.BOSS,
      ]);
      this.game.startLevel(LEVEL_TYPE.SENATE);
    });

    // Video skip button
    this.buttons.videoSkip.addEventListener("click", () => {
      this.skipVideo();
    });

    // Next level button
    this.buttons.nextLevel.addEventListener("click", () => {
      const currentLevelType = this.game.currentLevel.type;

      if (
        currentLevelType === LEVEL_TYPE.HOUSE &&
        this.firstLevelType === LEVEL_TYPE.HOUSE
      ) {
        // Show video transition to Senate level
        this.playVideo(VIDEO_TYPE.HOUSE_TO_SENATE);
      } else if (
        currentLevelType === LEVEL_TYPE.SENATE &&
        this.firstLevelType === LEVEL_TYPE.SENATE
      ) {
        // Show video transition to House level
        this.playVideo(VIDEO_TYPE.SENATE_TO_HOUSE);
      } else if (
        (currentLevelType === LEVEL_TYPE.HOUSE &&
          this.firstLevelType === LEVEL_TYPE.SENATE) ||
        (currentLevelType === LEVEL_TYPE.SENATE &&
          this.firstLevelType === LEVEL_TYPE.HOUSE)
      ) {
        // Show video before boss level
        this.playVideo(VIDEO_TYPE.BEFORE_FINAL);
      } else {
        // No video, just go to next level
        this.game.nextLevel();
      }
    });

    // Restart button
    this.buttons.restart.addEventListener("click", () => {
      this.game.restart();
    });

    // Play again button
    this.buttons.playAgain.addEventListener("click", () => {
      // Reset UI state
      this.firstLevelType = null;
      this.currentVideo = null;

      // Reset game state
      this.game.restart();

      // Show intro screen
      this.showScreen("intro");
    });
  }

  /**
   * Set up callbacks for game events
   */
  setupGameCallbacks() {
    // Score change
    this.game.onScoreChange = (score) => {
      this.elements.score.textContent = score;
    };

    // Lives change
    this.game.onLivesChange = (lives) => {
      this.elements.lives.textContent = lives;
    };

    // Game state change
    this.game.onGameStateChange = (state) => {
      switch (state) {
        case GAME_STATE.INTRO:
          this.showScreen("intro");
          break;
        case GAME_STATE.LEVEL_SELECT:
          this.showScreen("levelSelect");
          break;
        case GAME_STATE.VIDEO:
          this.showScreen("video");
          break;
        case GAME_STATE.PLAYING:
          this.showScreen("game");
          break;
        case GAME_STATE.LEVEL_COMPLETE:
          this.showScreen("levelComplete");
          break;
        case GAME_STATE.GAME_OVER:
          this.showScreen("gameOver");
          break;
        case GAME_STATE.GAME_COMPLETE:
          this.showScreen("gameComplete");
          break;
      }
    };

    // Level complete
    this.game.onLevelComplete = (level, score) => {
      this.elements.levelVotes.textContent = score;
    };

    // Game over
    this.game.onGameOver = () => {
      // Additional game over logic if needed
    };

    // Game complete
    this.game.onGameComplete = () => {
      // Show ending video
      this.playVideo(VIDEO_TYPE.ENDING);
    };
  }

  /**
   * Show a specific screen and hide others
   * @param {string} screenName - Name of the screen to show
   */
  showScreen(screenName) {
    // Hide all screens
    for (const name in this.screens) {
      this.screens[name].classList.add("hidden");
    }

    // Show the requested screen
    if (this.screens[screenName]) {
      this.screens[screenName].classList.remove("hidden");
    }
  }

  /**
   * Play a video
   * @param {string} videoType - Type of video to play
   */
  playVideo(videoType) {
    this.game.setState(GAME_STATE.VIDEO);
    this.currentVideo = videoType;

    // Clear previous video
    this.elements.videoContainer.innerHTML = "";

    // Create video element
    const video = document.createElement("video");
    video.width = 800;
    video.height = 500;
    video.controls = true; // Enable controls for better user experience
    video.autoplay = true;
    video.onended = () => this.videoEnded(); // Add event listener for video end

    // Set video source based on type
    let videoSrc = "";
    let videoTitle = "";

    switch (videoType) {
      case VIDEO_TYPE.INTRO:
        videoSrc = "assets/videos/intro.mp4";
        videoTitle = "How a Bill Becomes a Law";
        break;
      case VIDEO_TYPE.HOUSE_TO_SENATE:
        videoSrc = "assets/videos/house_to_senate.mp4";
        videoTitle = "From the House to the Senate";
        break;
      case VIDEO_TYPE.SENATE_TO_HOUSE:
        videoSrc = "assets/videos/senate_to_house.mp4";
        videoTitle = "From the Senate to the House";
        break;
      case VIDEO_TYPE.BEFORE_FINAL:
        videoSrc = "assets/videos/before_final.mp4";
        videoTitle = "The Final Steps";
        break;
      case VIDEO_TYPE.ENDING:
        videoSrc = "assets/videos/ending.mp4";
        videoTitle = "Your Bill is Now a Law!";
        break;
    }

    // Try to load the video if it exists
    try {
      const videoExists = new XMLHttpRequest();
      videoExists.open("HEAD", videoSrc, false);
      videoExists.send();

      if (videoExists.status === 200) {
        // Video exists, use it
        video.src = videoSrc;
        this.elements.videoContainer.appendChild(video);
        return; // Exit early, we're using the actual video
      }
    } catch (e) {
      console.log("Video not found, using placeholder");
    }

    // For development, use a placeholder instead of actual videos
    const placeholderDiv = document.createElement("div");
    placeholderDiv.style.width = "100%";
    placeholderDiv.style.height = "100%";
    placeholderDiv.style.backgroundColor = "#000";
    placeholderDiv.style.color = "#fff";
    placeholderDiv.style.display = "flex";
    placeholderDiv.style.flexDirection = "column";
    placeholderDiv.style.justifyContent = "center";
    placeholderDiv.style.alignItems = "center";
    placeholderDiv.style.textAlign = "center";
    placeholderDiv.style.padding = "20px";

    const titleElement = document.createElement("h2");
    titleElement.textContent = videoTitle;
    titleElement.style.marginBottom = "20px";

    const descriptionElement = document.createElement("p");
    descriptionElement.style.fontSize = "18px";
    descriptionElement.style.lineHeight = "1.5";

    // Set description based on video type
    switch (videoType) {
      case VIDEO_TYPE.INTRO:
        descriptionElement.innerHTML = `
                  Welcome to the Congressional Adventure!<br><br>
                  In this game, you'll learn how a bill becomes a law by navigating through the legislative process.<br><br>
                  Collect votes (coins) to pass your bill and avoid obstacles that can block legislation.<br><br>
                  Choose which chamber of Congress to start in: the House of Representatives or the Senate.
              `;
        break;
      case VIDEO_TYPE.HOUSE_TO_SENATE:
        descriptionElement.innerHTML = `
                  Congratulations! Your bill has passed the House of Representatives.<br><br>
                  Now it moves to the Senate, where different rules apply.<br><br>
                  In the Senate, you'll face new challenges like the filibuster, which can block legislation unless 60 senators vote for cloture.<br><br>
                  Collect enough votes to pass your bill through the Senate!
              `;
        break;
      case VIDEO_TYPE.SENATE_TO_HOUSE:
        descriptionElement.innerHTML = `
                  Congratulations! Your bill has passed the Senate.<br><br>
                  Now it moves to the House of Representatives, where different rules apply.<br><br>
                  In the House, bills go through committees and the Rules Committee determines how they will be debated.<br><br>
                  Collect enough votes to pass your bill through the House!
              `;
        break;
      case VIDEO_TYPE.BEFORE_FINAL:
        descriptionElement.innerHTML = `
                  Great job! Your bill has passed both chambers of Congress.<br><br>
                  Now it faces the final steps in becoming a law.<br><br>
                  If the House and Senate passed different versions, a conference committee must resolve the differences.<br><br>
                  Finally, the bill goes to the President, who can sign it into law or veto it.<br><br>
                  Navigate the final challenges to turn your bill into law!
              `;
        break;
      case VIDEO_TYPE.ENDING:
        descriptionElement.innerHTML = `
                  Congratulations! Your bill has successfully become a law!<br><br>
                  You've navigated the complex legislative process, from introduction to presidential approval.<br><br>
                  You've learned how bills move through committees, floor debates, and votes in both chambers of Congress.<br><br>
                  You've overcome obstacles like filibusters, procedural hurdles, and even a potential presidential veto.<br><br>
                  Your understanding of how government works will help you be an informed and engaged citizen!
              `;
        break;
    }

    placeholderDiv.appendChild(titleElement);
    placeholderDiv.appendChild(descriptionElement);

    // Add placeholder to container
    this.elements.videoContainer.appendChild(placeholderDiv);

    // Set timeout to auto-advance after video would end
    setTimeout(() => {
      this.videoEnded();
    }, 10000); // 10 seconds for placeholder
  }

  /**
   * Skip the current video
   */
  skipVideo() {
    this.videoEnded();
  }

  /**
   * Handle video end event
   */
  videoEnded() {
    switch (this.currentVideo) {
      case VIDEO_TYPE.INTRO:
        // After intro video, stay on level select screen
        this.showScreen("levelSelect");
        break;
      case VIDEO_TYPE.HOUSE_TO_SENATE:
      case VIDEO_TYPE.SENATE_TO_HOUSE:
      case VIDEO_TYPE.BEFORE_FINAL:
        // After transition videos, go to next level
        this.game.nextLevel();
        break;
      case VIDEO_TYPE.ENDING:
        // After ending video, show game complete screen
        this.showScreen("gameComplete");
        break;
    }

    this.currentVideo = null;
  }

  /**
   * Update the UI display
   */
  update() {
    if (this.game.state === GAME_STATE.PLAYING) {
      this.elements.score.textContent = this.game.player.score;
      this.elements.lives.textContent = this.game.player.lives;

      // Show/hide boss instructions
      if (this.game.currentLevel && this.game.currentLevel.isBossLevel) {
        this.elements.bossInstructions.style.display = "block";
      } else {
        this.elements.bossInstructions.style.display = "none";
      }
    }
  }
}
