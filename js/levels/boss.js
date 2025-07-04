/**
 * Boss level - Committee Chairman Boss Fight
 */
function createBossLevel(game) {
  const level = new Level(
    LEVEL_TYPE.BOSS,
    "Committee Chairman Boss Fight",
    "Defeat the powerful Committee Chairman to advance your bill",
    2000
  );

  // Create a more continuous ground with fewer, more strategic holes

  // First ground section
  level.addPlatform(
    new Platform(0, 500, 600, 100, "solid", {
      color: "#8B4513",
    })
  );

  // Middle ground section
  level.addPlatform(
    new Platform(800, 500, 600, 100, "solid", {
      color: "#8B4513",
    })
  );

  // Last ground section
  level.addPlatform(
    new Platform(1600, 500, 400, 100, "solid", {
      color: "#8B4513",
    })
  );

  // Add just two major holes in the ground at strategic locations
  const holePositions = [
    { x: 600, y: 500, width: 200, height: 100 }, // Larger hole between sections
    { x: 1400, y: 500, width: 200, height: 100 }, // Larger hole before final section
  ];

  for (const pos of holePositions) {
    const hazard = new Hazard(pos.x, pos.y, pos.width, pos.height, "hole", {
      name: "Committee Trap",
      description: "A dangerous procedural trap that can derail your bill",
    });
    level.hazards = level.hazards || [];
    level.hazards.push(hazard);
  }

  // Floating platforms for better movement
  const platformPositions = [
    { x: 200, y: 400, width: 150, height: 20 },
    { x: 450, y: 350, width: 120, height: 20 },
    { x: 750, y: 300, width: 150, height: 20 },
    { x: 1000, y: 350, width: 120, height: 20 },
    { x: 1350, y: 400, width: 150, height: 20 },
    { x: 1700, y: 350, width: 120, height: 20 },
  ];

  for (const pos of platformPositions) {
    level.addPlatform(
      new Platform(pos.x, pos.y, pos.width, pos.height, "solid", {
        color: "#A0522D",
      })
    );
  }

  // Add some moving platforms for extra challenge
  level.addPlatform(
    new Platform(500, 250, 100, 20, "moving", {
      horizontal: true,
      moveDistance: 200,
      color: "#CD853F",
    })
  );

  level.addPlatform(
    new Platform(1100, 200, 100, 20, "moving", {
      horizontal: false,
      moveDistance: 150,
      color: "#CD853F",
    })
  );

  // Boss enemy - Committee Chairman
  const boss = new Boss(
    1500,
    420,
    "Committee Chairman",
    "A powerful committee chairman who can block your bill"
  );
  level.bosses = level.bosses || [];
  level.bosses.push(boss);

  // Some regular enemies as minions
  const enemyPositions = [
    {
      x: 400,
      y: 450,
      name: "Staffer",
      description: "Committee staff member trying to slow down your bill",
    },
    {
      x: 800,
      y: 450,
      name: "Lobbyist",
      description: "A lobbyist working against your legislation",
    },
    {
      x: 1200,
      y: 450,
      name: "Bureaucrat",
      description: "A bureaucrat creating red tape",
    },
  ];

  for (const pos of enemyPositions) {
    const enemySprite = new Sprite(game.images.enemy, 32, 32, 1);
    level.addEnemy(
      new Enemy(pos.x, pos.y, enemySprite, "walker", {
        name: pos.name,
        description: pos.description,
        patrolDistance: 150,
        speed: 1.5,
      })
    );
  }

  // Power-up coins (special votes)
  const coinPositions = [
    { x: 250, y: 350, type: "special", value: 3 },
    { x: 500, y: 200, type: "special", value: 3 },
    { x: 800, y: 250, type: "special", value: 3 },
    { x: 1150, y: 150, type: "special", value: 3 },
    { x: 1400, y: 350, type: "special", value: 3 },
  ];

  for (const pos of coinPositions) {
    const coinSprite = new Sprite(game.images.coin, 24, 24, 1);
    level.addCoin(
      new Coin(
        pos.x,
        pos.y,
        coinSprite,
        pos.value,
        pos.type,
        "A powerful committee vote"
      )
    );
  }

  // Educational points
  const educationalPoints = [
    {
      x: 300,
      y: 300,
      title: "Committee Power",
      content:
        "Committee chairmen have significant power to advance or block legislation in their committees.",
    },
    {
      x: 800,
      y: 200,
      title: "Markup Process",
      content:
        "In committee markup, members debate and amend bills before voting to send them to the full chamber.",
    },
    {
      x: 1400,
      y: 300,
      title: "Committee Vote",
      content:
        "A bill must receive a majority vote in committee to advance to the full House or Senate floor.",
    },
  ];

  for (const point of educationalPoints) {
    level.addEducationalPoint(point.x, point.y, point.title, point.content);
  }

  // Checkpoints
  level.addCheckpoint(500, 300);
  level.addCheckpoint(1000, 300);

  // Set level end (after defeating boss)
  level.endX = 1900;

  // Set required votes (lower since this is a boss fight)
  level.setRequiredVotes(8);

  // Mark this as a boss level
  level.isBossLevel = true;

  return level;
}
