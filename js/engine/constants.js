// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GRAVITY = 0.5;
const FRICTION = 0.8;

// Player constants
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 48;
const PLAYER_SPEED = 5;
const PLAYER_JUMP_FORCE = 12;
const PLAYER_MAX_SPEED = 8;

// Bullet constants
const BULLET_WIDTH = 8;
const BULLET_HEIGHT = 4;
const BULLET_SPEED = 10;

// Boss constants
const BOSS_WIDTH = 80;
const BOSS_HEIGHT = 80;
const BOSS_SPEED = 2;
const BOSS_HEALTH = 10;

// Enemy constants
const ENEMY_WIDTH = 32;
const ENEMY_HEIGHT = 32;
const ENEMY_SPEED = 2;

// Coin constants
const COIN_WIDTH = 24;
const COIN_HEIGHT = 24;
const COIN_VALUE = 1;

// Platform constants
const PLATFORM_FRICTION = 0.9;

// Game states
const GAME_STATE = {
  INTRO: "intro",
  LEVEL_SELECT: "level_select",
  VIDEO: "video",
  PLAYING: "playing",
  LEVEL_COMPLETE: "level_complete",
  GAME_OVER: "game_over",
  GAME_COMPLETE: "game_complete",
};

// Level types
const LEVEL_TYPE = {
  HOUSE: "house",
  SENATE: "senate",
  BOSS: "boss",
  FINAL: "final",
};

// Video types
const VIDEO_TYPE = {
  INTRO: "intro",
  HOUSE_TO_SENATE: "house_to_senate",
  SENATE_TO_HOUSE: "senate_to_house",
  BEFORE_FINAL: "before_final",
  ENDING: "ending",
};
