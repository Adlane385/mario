/**
 * Final level - Presidential Approval
 */
function createFinalLevel(game) {
  const level = new Level(
    LEVEL_TYPE.FINAL,
    "Presidential Approval",
    "Navigate the final steps to turn your bill into law",
    4000
  );

  // Ground platforms
  for (let i = 0; i < 16; i++) {
    const x = i * 300;
    const y = 500;
    const width = 280;
    const height = 30;

    level.addPlatform(
      new Platform(x, y, width, height, "solid", {
        color: "#006400", // Dark Green
      })
    );
  }

  // Additional platforms with various types
  const platformPositions = [
    { x: 400, y: 400, width: 200, height: 20, type: "bouncy" },
    { x: 700, y: 350, width: 150, height: 20, type: "crumbling" },
    {
      x: 1000,
      y: 300,
      width: 200,
      height: 20,
      type: "moving",
      options: { horizontal: true, moveDistance: 150 },
    },
    { x: 1300, y: 350, width: 150, height: 20, type: "crumbling" },
    { x: 1600, y: 400, width: 200, height: 20, type: "bouncy" },
    { x: 1900, y: 300, width: 150, height: 20, type: "crumbling" },
    {
      x: 2200,
      y: 350,
      width: 200,
      height: 20,
      type: "moving",
      options: { horizontal: false, moveDistance: 100 },
    },
    { x: 2500, y: 400, width: 150, height: 20, type: "crumbling" },
    { x: 2800, y: 300, width: 200, height: 20, type: "bouncy" },
    { x: 3100, y: 350, width: 150, height: 20, type: "crumbling" },
    {
      x: 3400,
      y: 400,
      width: 200,
      height: 20,
      type: "moving",
      options: { horizontal: true, moveDistance: 150 },
    },
    { x: 3700, y: 350, width: 150, height: 20 },
  ];

  for (const pos of platformPositions) {
    const options = pos.options || {};
    if (!options.color) {
      options.color = "#228B22"; // Forest Green
    }

    level.addPlatform(
      new Platform(
        pos.x,
        pos.y,
        pos.width,
        pos.height,
        pos.type || "solid",
        options
      )
    );
  }

  // All coins (votes) worth 1 point
  const coinPositions = [
    { x: 300, y: 450, type: "special", value: 1 },
    { x: 450, y: 350, type: "special", value: 1 },
    { x: 600, y: 450, type: "regular", value: 1 },
    { x: 750, y: 300, type: "regular", value: 1 },
    { x: 900, y: 450, type: "special", value: 1 },
    { x: 1050, y: 250, type: "special", value: 1 },
    { x: 1200, y: 450, type: "regular", value: 1 },
    { x: 1350, y: 300, type: "regular", value: 1 },
    { x: 1500, y: 450, type: "special", value: 1 },
    { x: 1650, y: 350, type: "special", value: 1 },
    { x: 1800, y: 450, type: "regular", value: 1 },
    { x: 1950, y: 250, type: "regular", value: 1 },
    { x: 2100, y: 450, type: "special", value: 1 },
    { x: 2250, y: 300, type: "special", value: 1 },
    { x: 2400, y: 450, type: "regular", value: 1 },
    { x: 2550, y: 350, type: "regular", value: 1 },
    { x: 2700, y: 450, type: "special", value: 1 },
    { x: 2850, y: 250, type: "special", value: 1 },
    { x: 3000, y: 450, type: "regular", value: 1 },
    { x: 3150, y: 300, type: "regular", value: 1 },
    { x: 3300, y: 450, type: "special", value: 1 },
    { x: 3450, y: 350, type: "special", value: 1 },
    { x: 3600, y: 450, type: "regular", value: 1 },
    { x: 3750, y: 300, type: "regular", value: 1 },
    // Add more coins to make it possible to reach the required votes
    { x: 350, y: 450, type: "regular", value: 1 },
    { x: 500, y: 350, type: "regular", value: 1 },
    { x: 650, y: 450, type: "regular", value: 1 },
    { x: 800, y: 300, type: "regular", value: 1 },
    { x: 950, y: 450, type: "regular", value: 1 },
    { x: 1100, y: 250, type: "regular", value: 1 },
    { x: 1250, y: 450, type: "regular", value: 1 },
    { x: 1400, y: 300, type: "regular", value: 1 },
    { x: 1550, y: 450, type: "regular", value: 1 },
    { x: 1700, y: 350, type: "regular", value: 1 },
    { x: 1850, y: 450, type: "regular", value: 1 },
    { x: 2000, y: 250, type: "regular", value: 1 },
  ];

  for (const pos of coinPositions) {
    const coinSprite = new Sprite(game.images.coin, 24, 24, 1);
    let description = "A vote from a member of Congress";

    if (pos.type === "special") {
      description = "A key vote from a committee chair or party leader";
    }

    level.addCoin(
      new Coin(pos.x, pos.y, coinSprite, pos.value, pos.type, description)
    );
  }

  // Boss enemy - Presidential Veto
  const bossSprite = new Sprite(game.images.enemy, 64, 64, 1);
  const boss = new Enemy(3500, 400, bossSprite, "walker", {
    name: "Presidential Veto",
    description: "The President can veto a bill, sending it back to Congress",
    width: 64,
    height: 64,
    speed: 3,
    patrolDistance: 300,
  });
  level.addEnemy(boss);

  // Regular enemies
  const enemyPositions = [
    {
      x: 800,
      y: 450,
      type: "walker",
      name: "Conference Committee",
      description:
        "The conference committee resolves differences between House and Senate versions",
    },
    {
      x: 1500,
      y: 450,
      type: "walker",
      name: "Enrollment Process",
      description:
        "The bill must be properly formatted and enrolled before going to the President",
    },
    {
      x: 2200,
      y: 450,
      type: "walker",
      name: "Legal Review",
      description:
        "The bill undergoes legal review before the President can sign it",
    },
    {
      x: 2900,
      y: 450,
      type: "walker",
      name: "Executive Branch Review",
      description:
        "Executive branch agencies review the bill and advise the President",
    },
  ];

  for (const pos of enemyPositions) {
    const enemySprite = new Sprite(game.images.enemy, 32, 32, 1);
    level.addEnemy(
      new Enemy(pos.x, pos.y, enemySprite, pos.type, {
        name: pos.name,
        description: pos.description,
        patrolDistance: 200,
      })
    );
  }

  // Educational points
  const educationalPoints = [
    {
      x: 500,
      y: 300,
      title: "Conference Committee",
      content:
        "If the House and Senate pass different versions of a bill, a conference committee resolves the differences.",
    },
    {
      x: 1500,
      y: 300,
      title: "Enrollment",
      content:
        "After passing both chambers in identical form, the bill is enrolled (printed on parchment) and certified by House and Senate officials.",
    },
    {
      x: 2500,
      y: 300,
      title: "Presidential Action",
      content:
        "The President has four options: sign the bill, veto it, allow it to become law without signature, or pocket veto it.",
    },
    {
      x: 3500,
      y: 300,
      title: "Veto Override",
      content:
        "If the President vetoes a bill, Congress can override the veto with a two-thirds majority in both chambers.",
    },
  ];

  for (const point of educationalPoints) {
    level.addEducationalPoint(point.x, point.y, point.title, point.content);
  }

  // Checkpoints
  level.addCheckpoint(1000, 300);
  level.addCheckpoint(2000, 300);
  level.addCheckpoint(3000, 300);

  // Set level end
  level.endX = 3800;

  // Set required votes (increased difficulty)
  level.setRequiredVotes(30);

  return level;
}
