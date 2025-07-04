# Congressional Sidescroller Game

An educational game that teaches young audiences about how a bill is passed in the US Congress, presented in a Super Mario Brothers style sidescroller format.

## Game Overview

The game follows the journey of a bill becoming a law through the US Congress:

1. **Intro Video**: Introduction to the legislative process
2. **Level Selection**: Choose to start in either the House of Representatives or the Senate
3. **First Level**: Play through the first chamber you selected
4. **Transition Video**: Learn about the next steps in the process
5. **Second Level**: Play through the other chamber of Congress
6. **Final Video**: Learn about the final steps in the legislative process
7. **Final Level**: Navigate the final challenges to turn your bill into law

## Educational Content

The game teaches players about:

- The role of the House of Representatives and Senate
- How bills move through committees
- The voting process in Congress
- Obstacles in the legislative process (filibusters, procedural hurdles, etc.)
- The role of the President in signing bills into law

## Game Controls

- **Arrow Keys** or **WASD**: Move the character
- **Space**: Jump
- **Touch Controls**: Swipe left/right to move, swipe up to jump (on mobile devices)

## Running the Game

### Prerequisites

- Node.js (for running the server)

### Starting the Server

1. Navigate to the game directory
2. Run `node server.js`
3. Open a web browser and go to `http://localhost:12000`

## Development

### Project Structure

- `/css`: Stylesheets
- `/js`: JavaScript files
  - `/js/engine`: Game engine components
  - `/js/levels`: Level definitions
- `/assets`: Game assets
  - `/assets/images`: Sprites and backgrounds
  - `/assets/audio`: Sound effects and music
  - `/assets/videos`: Educational videos

### Adding New Content

- **New Levels**: Create a new level file in `/js/levels` and add it to the game in `main.js`
- **New Enemies**: Extend the Enemy class with new behaviors
- **New Educational Content**: Add new educational points to levels

## Future Enhancements

- Additional levels covering more aspects of the legislative process
- More detailed graphics and animations
- Interactive educational elements
- Multiplayer mode for classroom use

## License

This project is created for educational purposes.

## Credits

Created as an educational tool to teach young audiences about the US legislative process.
