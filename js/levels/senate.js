/**
 * Senate level
 */
function createSenateLevel(game) {
  const level = new Level(
    LEVEL_TYPE.SENATE,
    "Senate",
    "Gather votes to pass your bill in the Senate",
    5000
  );

  // Ground platforms (with gaps for holes)
  const holePositions = [6, 14]; // Reduced number of holes - only keep 2 major ones

  // Create a more continuous ground with fewer gaps
  for (let i = 0; i < 20; i++) {
    const x = i * 300;
    const y = 500;
    const width = 290; // Slightly wider to reduce small gaps
    const height = 30;

    // Skip platforms where holes should be
    if (!holePositions.includes(i)) {
      level.addPlatform(
        new Platform(x, y, width, height, "solid", {
          color: "#191970", // Midnight Blue
        })
      );
    }
  }

  // Add holes - make them more obvious but fewer
  for (const holeIndex of holePositions) {
    const x = holeIndex * 300;
    const hazard = new Hazard(x, 500, 290, 100, "hole", {
      name: "Filibuster Trap",
      description: "A procedural obstacle that can block your legislation",
    });
    level.hazards = level.hazards || [];
    level.hazards.push(hazard);
  }

  // Additional platforms
  const platformPositions = [
    {
      x: 400,
      y: 400,
      width: 200,
      height: 20,
      type: "moving",
      options: { horizontal: true, moveDistance: 150 },
    },
    { x: 700, y: 350, width: 150, height: 20 },
    {
      x: 1000,
      y: 300,
      width: 200,
      height: 20,
      type: "moving",
      options: { horizontal: false, moveDistance: 100 },
    },
    { x: 1300, y: 350, width: 150, height: 20 },
    {
      x: 1600,
      y: 400,
      width: 200,
      height: 20,
      type: "moving",
      options: { horizontal: true, moveDistance: 150 },
    },
    { x: 1900, y: 300, width: 150, height: 20 },
    {
      x: 2200,
      y: 350,
      width: 200,
      height: 20,
      type: "moving",
      options: { horizontal: false, moveDistance: 100 },
    },
    { x: 2500, y: 400, width: 150, height: 20 },
    {
      x: 2800,
      y: 300,
      width: 200,
      height: 20,
      type: "moving",
      options: { horizontal: true, moveDistance: 150 },
    },
    { x: 3100, y: 350, width: 150, height: 20 },
    {
      x: 3400,
      y: 400,
      width: 200,
      height: 20,
      type: "moving",
      options: { horizontal: false, moveDistance: 100 },
    },
    { x: 3700, y: 350, width: 150, height: 20 },
    {
      x: 4000,
      y: 300,
      width: 200,
      height: 20,
      type: "moving",
      options: { horizontal: true, moveDistance: 150 },
    },
    { x: 4300, y: 350, width: 150, height: 20 },
    { x: 4600, y: 400, width: 200, height: 20 },
  ];

  for (const pos of platformPositions) {
    level.addPlatform(
      new Platform(
        pos.x,
        pos.y,
        pos.width,
        pos.height,
        pos.type || "solid",
        pos.options || { color: "#4169E1" } // Royal Blue
      )
    );
  }

  // Coins (votes)
  const coinPositions = [
    { x: 300, y: 450 },
    { x: 450, y: 350 },
    { x: 600, y: 450 },
    { x: 750, y: 300 },
    { x: 900, y: 450 },
    { x: 1050, y: 250 },
    { x: 1200, y: 450 },
    { x: 1350, y: 300 },
    { x: 1500, y: 450 },
    { x: 1650, y: 350 },
    { x: 1800, y: 450 },
    { x: 1950, y: 250 },
    { x: 2100, y: 450 },
    { x: 2250, y: 300 },
    { x: 2400, y: 450 },
    { x: 2550, y: 350 },
    { x: 2700, y: 450 },
    { x: 2850, y: 250 },
    { x: 3000, y: 450 },
    { x: 3150, y: 300 },
    { x: 3300, y: 450 },
    { x: 3450, y: 350 },
    { x: 3600, y: 450 },
    { x: 3750, y: 300 },
    { x: 3900, y: 450 },
    { x: 4050, y: 250 },
    { x: 4200, y: 450 },
    { x: 4350, y: 300 },
    { x: 4500, y: 450 },
    { x: 4650, y: 350 },
  ];

  for (const pos of coinPositions) {
    const coinSprite = new Sprite(game.images.coin, 24, 24, 1);
    level.addCoin(
      new Coin(pos.x, pos.y, coinSprite, 1, "regular", "A vote from a Senator")
    );
  }

  // Enemies (obstacles)
  const enemyPositions = [
    {
      x: 800,
      y: 300,
      type: "flyer",
      name: "Filibuster",
      description:
        "A filibuster can block legislation by extending debate indefinitely",
    },
    {
      x: 1500,
      y: 300,
      type: "flyer",
      name: "Senate Hold",
      description:
        "A single Senator can place a hold on legislation, delaying its consideration",
    },
    {
      x: 2200,
      y: 300,
      type: "flyer",
      name: "Cloture Vote",
      description: "Ending a filibuster requires 60 votes for cloture",
    },
    {
      x: 2900,
      y: 300,
      type: "flyer",
      name: "Committee Chair",
      description:
        "Committee chairs have significant power over which bills advance",
    },
    {
      x: 3600,
      y: 300,
      type: "flyer",
      name: "Majority Leader",
      description: "The Majority Leader controls the Senate schedule",
    },
    {
      x: 4300,
      y: 300,
      type: "flyer",
      name: "Procedural Objection",
      description: "Procedural objections can delay or block legislation",
    },
  ];

  for (const pos of enemyPositions) {
    const enemySprite = new Sprite(game.images.enemy, 32, 32, 1);
    level.addEnemy(
      new Enemy(pos.x, pos.y, enemySprite, pos.type, {
        name: pos.name,
        description: pos.description,
        flyHeight: 100,
        speed: 2,
        patrolDistance: 200,
      })
    );
  }

  // Educational points
  const educationalPoints = [
    {
      x: 500,
      y: 300,
      title: "Senate Committees",
      content:
        "Like the House, the Senate has committees that review and amend legislation.",
    },
    {
      x: 1500,
      y: 300,
      title: "Filibuster",
      content:
        "The filibuster allows Senators to block legislation by extending debate indefinitely.",
    },
    {
      x: 2500,
      y: 300,
      title: "Cloture",
      content:
        "Cloture is the procedure to end a filibuster, requiring 60 votes in the 100-member Senate.",
    },
    {
      x: 3500,
      y: 300,
      title: "Senate Rules",
      content:
        "The Senate has different rules than the House, with fewer restrictions on debate and amendments.",
    },
    {
      x: 4500,
      y: 300,
      title: "Senate Vote",
      content:
        "Most bills need a simple majority to pass the Senate, but procedural votes often require 60 votes.",
    },
  ];

  for (const point of educationalPoints) {
    level.addEducationalPoint(point.x, point.y, point.title, point.content);
  }

  // Checkpoints
  level.addCheckpoint(1000, 300);
  level.addCheckpoint(2000, 300);
  level.addCheckpoint(3000, 300);
  level.addCheckpoint(4000, 300);

  // Set level end
  level.endX = 4800;

  // Set required votes (increased difficulty)
  level.setRequiredVotes(25);

  return level;
}
