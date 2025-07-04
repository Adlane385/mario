/**
 * House of Representatives level
 */
function createHouseLevel(game) {
  const level = new Level(
    LEVEL_TYPE.HOUSE,
    "House of Representatives",
    "Gather votes to pass your bill in the House",
    5000
  );

  // Ground platforms (with gaps for holes)
  const holePositions = [3, 7, 12, 16]; // Platform indices where holes will be

  for (let i = 0; i < 20; i++) {
    const x = i * 300;
    const y = 500;
    const width = 280;
    const height = 30;

    // Skip platforms where holes should be
    if (!holePositions.includes(i)) {
      level.addPlatform(
        new Platform(x, y, width, height, "solid", {
          color: "#8B4513", // Brown
        })
      );
    }
  }

  // Add holes
  for (const holeIndex of holePositions) {
    const x = holeIndex * 300;
    const hazard = new Hazard(x, 500, 280, 100, "hole", {
      name: "Procedural Trap",
      description: "A legislative pitfall that can derail your bill",
    });
    level.hazards = level.hazards || [];
    level.hazards.push(hazard);
  }

  // Additional platforms
  const platformPositions = [
    { x: 400, y: 400, width: 200, height: 20 },
    { x: 700, y: 350, width: 150, height: 20 },
    { x: 1000, y: 300, width: 200, height: 20 },
    { x: 1300, y: 350, width: 150, height: 20 },
    { x: 1600, y: 400, width: 200, height: 20 },
    { x: 1900, y: 300, width: 150, height: 20 },
    { x: 2200, y: 350, width: 200, height: 20 },
    { x: 2500, y: 400, width: 150, height: 20 },
    { x: 2800, y: 300, width: 200, height: 20 },
    { x: 3100, y: 350, width: 150, height: 20 },
    { x: 3400, y: 400, width: 200, height: 20 },
    { x: 3700, y: 350, width: 150, height: 20 },
    { x: 4000, y: 300, width: 200, height: 20 },
    { x: 4300, y: 350, width: 150, height: 20 },
    { x: 4600, y: 400, width: 200, height: 20 },
  ];

  for (const pos of platformPositions) {
    level.addPlatform(
      new Platform(pos.x, pos.y, pos.width, pos.height, "solid", {
        color: "#A0522D", // Sienna
      })
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
      new Coin(
        pos.x,
        pos.y,
        coinSprite,
        1,
        "regular",
        "A vote from a House Representative"
      )
    );
  }

  // Enemies (obstacles)
  const enemyPositions = [
    {
      x: 800,
      y: 450,
      type: "walker",
      name: "Committee Chair",
      description: "Committee chairs can block bills from reaching the floor",
    },
    {
      x: 1500,
      y: 450,
      type: "walker",
      name: "Lobbyist",
      description: "Lobbyists try to influence legislation",
    },
    {
      x: 2200,
      y: 450,
      type: "walker",
      name: "Opposing Party",
      description: "Members of the opposing party may try to block your bill",
    },
    {
      x: 2900,
      y: 450,
      type: "walker",
      name: "Rules Committee",
      description: "The Rules Committee determines how a bill is debated",
    },
    {
      x: 3600,
      y: 450,
      type: "walker",
      name: "Special Interests",
      description: "Special interest groups may oppose your bill",
    },
    {
      x: 4300,
      y: 450,
      type: "walker",
      name: "Procedural Hurdle",
      description: "Procedural hurdles can delay legislation",
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
      title: "Introduction of a Bill",
      content:
        "Bills are introduced by Representatives and assigned to committees for review.",
    },
    {
      x: 1500,
      y: 300,
      title: "Committee Process",
      content:
        "Committees debate, amend, and vote on bills before they can reach the House floor.",
    },
    {
      x: 2500,
      y: 300,
      title: "Rules Committee",
      content:
        "The Rules Committee sets the terms for debate and amendments on the House floor.",
    },
    {
      x: 3500,
      y: 300,
      title: "Floor Debate",
      content:
        "The full House debates the bill according to the rules set by the Rules Committee.",
    },
    {
      x: 4500,
      y: 300,
      title: "House Vote",
      content:
        "The House votes on the bill. A simple majority (218 votes) is needed to pass.",
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

  // Set required votes
  level.setRequiredVotes(15);

  return level;
}
