# Character Classes Implementation

This document describes the implementation status and details of each character class in the Turtle WoW DPS Simulator.

## Architecture Overview

The simulator uses a modular class-based architecture:

- **Base Classes**: `Character.js` provides the foundation that all classes can extend
- **Class Factory**: `ClassFactory.js` creates appropriate class instances based on player selection
- **Resource Management**: `ResourceManager.js` handles different resource types (Rage, Energy, Mana)
- **Class Data**: `classes.js` contains base stats and definitions for all classes

## Implemented Classes

### Warrior (Fully Implemented) ✅

**Resource Type**: Rage (0-100)  
**Armor Types**: Cloth, Leather, Mail, Plate  
**Weapon Types**: Axe, Sword, Mace, Dagger, Fist Weapon, Polearm, Staff

**Implementation Status**: 100% - Full feature parity with original simulator

**Features**:
- Rage generation from damage dealt and taken
- Stance system (Battle, Defensive, Berserker, Gladiator)
- All warrior abilities and talents
- Weapon skill calculations
- Critical strike and hit mechanics
- Set bonuses and rune effects
- Bleed effects and DoT tracking
- Enrage mechanics
- Full rotation optimization

**Files**:
- `js/classes/warrior/WarriorPlayer.js` - Main warrior implementation
- `js/data/spells_turtle.js` - Warrior spell data
- `js/data/talents_turtle.js` - Warrior talent trees

**Known Issues**: None - preserves all functionality from original simulator

---

### Rogue (Basic Implementation) 🔨

**Resource Type**: Energy (0-100, regenerates 20 per 2 seconds)  
**Secondary Resource**: Combo Points (0-5)  
**Armor Types**: Cloth, Leather  
**Weapon Types**: Dagger, Sword, Mace, Fist Weapon, Bow, Crossbow, Gun

**Implementation Status**: 30% - Core systems in place, needs spell and talent data

**Implemented Features**:
- Energy regeneration system (20 energy per 2 seconds)
- Combo point mechanics (0-5 points)
- Basic energy spending for abilities
- Agility to crit conversion (~29 agi per 1% crit)
- Base stat calculations

**TODO**:
- [ ] Rogue spell implementations (Sinister Strike, Backstab, Eviscerate, etc.)
- [ ] Rogue talent trees (Assassination, Combat, Subtlety)
- [ ] Stealth mechanics and openers (Ambush, Cheap Shot)
- [ ] Poison system (Instant, Deadly, Wound)
- [ ] Combo point builders and finishers
- [ ] Energy cost reductions from talents
- [ ] Relentless Strikes (CP refund mechanic)
- [ ] Seal Fate (double CP on crit)
- [ ] Blade Flurry (cleave mechanic)

**Files**:
- `js/classes/rogue/RoguePlayer.js` - Rogue implementation (basic structure)
- `js/data/spells_rogue_turtle.js` - TO BE CREATED
- `js/data/talents_rogue_turtle.js` - TO BE CREATED

---

### Mage (Placeholder) 📝

**Resource Type**: Mana  
**Armor Types**: Cloth  
**Weapon Types**: Staff, Wand, Dagger, Sword

**Implementation Status**: 5% - Stub only

**Planned Features**:
- Mana system with five-second rule
- Spell casting mechanics (cast times, GCD)
- Spell damage scaling
- Spell crit mechanics
- Ignite (Fire spec)
- Arcane Missiles
- Frostbolt spam rotation
- Fireball rotation
- Intellect to spell crit conversion
- Spirit to mana regen conversion
- MP5 calculations

**Files**:
- `js/classes/mage/MagePlayer.js` - Stub implementation
- TO BE CREATED: Mage spell and talent data

---

## Future Classes (Planned)

### Hunter
- Focus/Mana resource management
- Pet system with pet abilities
- Ranged weapon mechanics
- Ammo consumption
- Aimed Shot, Multi-Shot, Arcane Shot
- Hunter's Mark
- Aspect system

### Warlock
- Mana resource with Life Tap
- Pet summoning and management
- DoT tracking (Corruption, Immolate, Curse of Agony)
- Shadow Bolt spam
- Soul Shard management
- Demonic Sacrifice vs. active pet

### Priest
- Mana resource
- Shadow Word: Pain
- Mind Blast
- Mind Flay
- Shadow form
- Spirit tap
- Vampiric Embrace

### Paladin
- Mana resource with hybrid melee
- Seal system (Seal of Command, Seal of Righteousness)
- Judgement mechanics
- Blessing management
- Consecration
- Hybrid DPS calculations

### Druid
- Shapeshifting mechanics
- Cat Form (Energy + Combo Points)
- Bear Form (Rage)
- Caster Form (Mana)
- Form-specific abilities
- Feral Attack Power scaling
- Moonfire spam vs. Starfire

### Shaman
- Mana resource with hybrid melee
- Totem management
- Windfury Totem calculations
- Stormstrike
- Lightning Bolt
- Earth Shock
- Enhancement vs. Elemental specs

---

## Resource Systems

### Rage (Warrior, Druid Bear Form)
- Generates from dealing and taking damage
- Maximum: 100
- Decays over time when out of combat (1 per 3 seconds)
- Conversion formula: `((0.0091107836 * level²) + 3.225598133 * level) + 4.2652911`
- Rage from damage dealt: `(damage / conversion) * 7.5`
- Rage from damage taken: `(damage / conversion) * 2.5`

### Energy (Rogue, Druid Cat Form)
- Regenerates at fixed rate: 20 per 2 seconds
- Maximum: 100
- Does not decay
- No generation from damage
- Abilities cost energy to use

### Mana (Casters, Hybrids)
- Regenerates based on Spirit stat
- Five-second rule: Stops regenerating for 5 seconds after casting
- Maximum varies by class and Intellect
- Spirit regen formula: `((Spirit / 5) + 15) * 0.001 * Intellect * 5`
- MP5 (Mana per 5 seconds) from gear adds to regeneration

### Combo Points (Rogue)
- Built by certain attacks (Sinister Strike, Backstab, etc.)
- Maximum: 5 points
- Spent on finisher abilities (Eviscerate, Slice and Dice, etc.)
- Damage/effect scales with points spent

---

## Stat Conversions by Class

### Warrior
- 1 Strength = 2 Attack Power
- 1 Agility = 1 Attack Power + Crit
- ~20 Agility = 1% Crit
- 1% Hit = 32.79 Hit Rating

### Rogue
- 1 Strength = 1 Attack Power
- 1 Agility = 1 Attack Power + Crit
- ~29 Agility = 1% Crit
- 1% Hit = 32.79 Hit Rating

### Mage
- 1 Intellect = 15 Mana + Spell Crit
- ~59.5 Intellect = 1% Spell Crit
- 1 Spirit = ~0.125 MP5 (base regen)
- 1% Spell Hit = 12.6 Spell Hit Rating

---

## Adding a New Class

To add a new character class to the simulator:

1. **Create Class Directory**
   ```bash
   mkdir js/classes/[classname]/
   ```

2. **Implement Player Class**
   Create `js/classes/[classname]/[ClassName]Player.js`:
   ```javascript
   class [ClassName]Player {
       static getConfig(base) { /* ... */ }
       constructor(testItem, testType, enchtype, config) { /* ... */ }
       getClassName() { return '[ClassName]'; }
       getResourceType() { return 'Energy|Mana|Rage'; }
       // Implement class-specific methods
   }
   ```

3. **Add to ClassFactory**
   Edit `js/classes/ClassFactory.js`:
   ```javascript
   case '[classname]':
       return new [ClassName]Player(testItem, testType, enchtype, config);
   ```

4. **Create Spell Data**
   Create `js/data/spells_[classname]_turtle.js` with spell definitions

5. **Create Talent Data**
   Create `js/data/talents_[classname]_turtle.js` with talent tree definitions

6. **Update UI**
   Add class option to dropdowns in `turtle.html` and `turtleclassic.html`:
   ```html
   <option value="[ClassName]">[ClassName]</option>
   ```

7. **Test**
   ```bash
   npm run dist
   npm start  # Test in Electron
   ```

---

## Testing

### Manual Testing
1. Build the project: `npm run dist`
2. Launch Electron app: `npm start`
3. Select class from dropdown
4. Configure gear, buffs, and talents
5. Run simulation and verify results

### Automated Testing
TODO: Unit tests for combat mechanics in `test/` directory

---

## Known Limitations

1. **Rogue**: Spell and talent data not yet implemented
2. **Mage**: Stub implementation only
3. **Other Classes**: Not yet implemented
4. **Multi-target**: Limited support for cleave mechanics
5. **PvP**: Simulator focused on PvE scenarios
6. **Procs**: Some weapon proc rates may need adjustment

---

## Contributing

When implementing a new class or feature:

1. Follow existing code patterns
2. Preserve backward compatibility
3. Add appropriate comments and documentation
4. Test thoroughly before submitting PR
5. Update this CLASSES.md file with implementation details

See [CONTRIBUTING.md](CONTRIBUTING.md) for general contribution guidelines.
