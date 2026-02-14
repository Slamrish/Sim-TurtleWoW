/**
 * Base Character class that all class-specific implementations extend
 * Handles common functionality shared across all character classes
 */
class Character {
    constructor(config) {
        if (!config) throw new Error('Character config is required');
        
        // Common properties
        this.level = config.level;
        this.mode = config.mode;
        this.race = config.race;
        this.logging = config.logging;
        this.target = config.target;
        
        // Timers
        this.timer = 0;
        this.itemtimer = 0;
        this.crittimer = 0;
        
        // Combat stats
        this.critdmgbonus = 0;
        this.extraattacks = 0;
        this.batchedextras = 0;
        
        // Spell damage
        this.spelldamage = 0;
        this.mainspelldmg = 1;
        
        // Base stats structure
        this.base = {
            ap: 0,
            agi: 0,
            str: 0,
            int: 0,
            spi: 0,
            sta: 0,
            arp: 0,
            hit: 0,
            crit: 0,
            spellcrit: 0,
            spellhit: 0,
            spelldamage: 0,
            mp5: 0,
            skill_0: this.level * 5,
            skill_1: this.level * 5,
            skill_2: this.level * 5,
            skill_3: this.level * 5,
            skill_4: this.level * 5,
            skill_5: this.level * 5,
            skill_6: this.level * 5,
            skill_7: (this.level < 35 ? 225 : 300),
            skill_10: 0,
            skill_11: 0,
            skill_13: 0,
            skill_20: 0,
            skill_21: 0,
            skill_23: 0,
            haste: 1,
            expertise: 0,
            strmod: 1,
            agimod: 1,
            intmod: 1,
            spimod: 1,
            dmgmod: 1,
            spelldmgmod: 1,
            moddmgdone: 0,
            moddmgtaken: 0,
            apmod: 1,
            baseapmod: 1,
            resist: {
                shadow: 0,
                arcane: 0,
                nature: 0,
                fire: 0,
                frost: 0,
            },
            block: 0,
            defense: 0,
        };
        
        // Stats object (will be calculated from base + gear + buffs)
        this.stats = {};
        
        // Initialize class-specific properties
        this.initializeClass(config);
    }
    
    /**
     * Initialize class-specific properties
     * To be overridden by subclasses
     */
    initializeClass(config) {
        throw new Error('initializeClass must be implemented by subclass');
    }
    
    /**
     * Get the class name
     */
    getClassName() {
        throw new Error('getClassName must be implemented by subclass');
    }
    
    /**
     * Get the primary resource type (Rage, Energy, Mana, etc.)
     */
    getResourceType() {
        throw new Error('getResourceType must be implemented by subclass');
    }
    
    /**
     * Step through combat timers
     */
    steptimer(amount) {
        if (this.timer) {
            this.timer = Math.max(0, this.timer - amount);
        }
    }
    
    stepitemtimer(amount) {
        if (this.itemtimer) {
            this.itemtimer = Math.max(0, this.itemtimer - amount);
        }
    }
    
    /**
     * Common logging function
     */
    log(message) {
        if (this.logging && this.combatlog) {
            this.combatlog.push(step + ' ' + message);
        }
    }
    
    /**
     * Get armor reduction against target
     */
    getArmorReduction() {
        let armor = this.target.basearmor;
        let level = this.target.level;
        
        // Apply armor reduction from debuffs
        armor = Math.max(0, armor - (this.stats.arp || 0));
        
        // Calculate damage reduction
        let reduction = armor / (armor + 400 + 85 * level);
        reduction = Math.max(0, Math.min(0.75, reduction));
        
        return reduction;
    }
    
    /**
     * Process physical attack result (hit/miss/dodge/crit/glance)
     */
    physproc(dmg) {
        let tmp = 0;
        let roll = rng10k();
        
        // Check for miss
        tmp += Math.max(this.mh.miss, 0) * 100;
        if (roll < tmp) return 0;
        
        // Check for dodge
        tmp += this.mh.dodge * 100;
        if (roll < tmp) return 0;
        
        // Check for crit
        roll = rng10k();
        let crit = this.crit + this.mh.crit;
        if (roll < (crit * 100)) {
            dmg *= 1 + 1 * (1 + this.critdmgbonus * 2);
        }
        
        return dmg * this.stats.dmgmod * this.mh.modifier * (1 - this.armorReduction);
    }
    
    /**
     * Serialize character stats for saving/exporting
     */
    serializeStats() {
        return {
            class: this.getClassName(),
            level: this.level,
            race: this.race,
            stats: this.stats,
            base: this.base
        };
    }
}
