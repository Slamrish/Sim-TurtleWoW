# Turtle WoW DPS Simulator
A multi-class DPS simulation tool for [Turtle WoW](https://turtle-wow.org) that supports Warriors, Rogues, and more classes coming soon!

Forked from https://github.com/GuybrushGit/WarriorSim

Latest version is live at:
https://zebouski.github.io/WarriorSim-TurtleWoW/

## Features

### Multi-Class Support
- **Warrior** - Full implementation with rage system, stances, and all abilities
- **Rogue** - Basic implementation with energy system and combo points (in development)
- **Mage** - Placeholder (coming in future updates)
- More classes planned: Hunter, Warlock, Priest, Paladin, Druid, Shaman

### Desktop Application
Run as a native desktop application using Electron:
- Native window controls
- File menu for saving/loading character configurations
- Keyboard shortcuts (Ctrl+S to save, Ctrl+O to load)
- Cross-platform support (Windows, Mac, Linux)

### Web Application
Also available as a traditional web application - just open `turtle.html` in your browser.

## Installation

### Desktop App (Electron)

1. Clone the repository:
```bash
git clone https://github.com/Slamrish/Sim-TurtleWoW.git
cd Sim-TurtleWoW
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run dist
```

4. Run the desktop app:
```bash
npm start
```

5. (Optional) Build installers for distribution:
```bash
npm run build
```
This creates installers for Windows (NSIS), Mac (DMG), and Linux (AppImage).

### Web App (Browser)

1. Clone and build as above (steps 1-3)
2. Open `turtle.html` or `turtleclassic.html` in your web browser
3. Or use `npm run web` to start a local development server

## Architecture

The simulator is built with a modular architecture supporting multiple character classes:

```
js/
├── classes/
│   ├── Character.js          # Base class for all characters
│   ├── ClassFactory.js       # Factory for creating class instances
│   ├── warrior/
│   │   └── WarriorPlayer.js  # Warrior implementation
│   ├── rogue/
│   │   └── RoguePlayer.js    # Rogue implementation (in development)
│   └── mage/
│       └── MagePlayer.js     # Mage placeholder
├── combat/
│   └── ResourceManager.js    # Handles Rage/Energy/Mana systems
└── data/
    ├── classes.js            # Class definitions and base stats
    ├── spells_turtle.js      # Spell data
    ├── talents_turtle.js     # Talent data
    └── gear_turtle.js        # Gear data
```

## Class Selection

Use the "Class" dropdown in the settings panel to switch between available classes:
- **Warrior** - Fully functional
- **Rogue (Basic)** - Basic energy system and combo points implemented
- **Mage (Not Impl.)** - Coming soon

## Development

### Adding a New Class

1. Create a new directory in `js/classes/` for your class
2. Create a `[ClassName]Player.js` file extending the base character mechanics
3. Implement required methods: `getClassName()`, `getResourceType()`
4. Add spell and talent data in `js/data/`
5. Update `ClassFactory.js` to include your new class
6. Add the class option to the UI dropdowns in HTML files

### Building

- `npm run dist` - Build minified files for production
- `npm run dev` - Start development server with live reload
- `npm start` - Run Electron desktop app
- `npm run pack` - Package app without creating installer
- `npm run build` - Create distributable installers

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## Credits

- Original WarriorSim by GuybrushGit
- Turtle WoW fork maintained by Zaas
- Contributors: Thrunk, Hobbit, Melba
- Multi-class expansion and Electron wrapper by contributors

## License

ISC License
