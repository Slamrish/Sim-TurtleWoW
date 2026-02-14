/**
 * ResourceManager - Handles different resource types (Rage, Energy, Mana)
 */
class ResourceManager {
    constructor(character, resourceType, maxResource) {
        this.character = character;
        this.resourceType = resourceType;
        this.maxResource = maxResource;
        this.currentResource = 0;
        this.resourceRegen = 0;
        this.timer = 0;
        
        // For mana classes - five second rule
        this.lastCastTime = 0;
        this.inFiveSecondRule = false;
    }
    
    /**
     * Add resource (Rage from damage, Energy regen, etc.)
     */
    addResource(amount, source = 'unknown') {
        const before = this.currentResource;
        this.currentResource = Math.min(this.currentResource + amount, this.maxResource);
        
        if (this.character.logging) {
            this.character.log(`Resource ${this.resourceType}: ${before.toFixed(1)} + ${amount.toFixed(1)} = ${this.currentResource.toFixed(1)} (${source})`);
        }
        
        return this.currentResource;
    }
    
    /**
     * Spend resource for ability
     */
    spendResource(amount, abilityName = 'unknown') {
        if (this.currentResource < amount) {
            return false;
        }
        
        const before = this.currentResource;
        this.currentResource -= amount;
        
        if (this.character.logging) {
            this.character.log(`Spent ${amount} ${this.resourceType} on ${abilityName}: ${before.toFixed(1)} -> ${this.currentResource.toFixed(1)}`);
        }
        
        // For mana, trigger five second rule
        if (this.resourceType === 'Mana') {
            this.lastCastTime = step;
            this.inFiveSecondRule = true;
        }
        
        return true;
    }
    
    /**
     * Step through resource regeneration
     */
    stepRegen(deltaTime) {
        switch (this.resourceType) {
            case 'Energy':
                this.stepEnergyRegen(deltaTime);
                break;
            case 'Mana':
                this.stepManaRegen(deltaTime);
                break;
            case 'Rage':
                this.stepRageDecay(deltaTime);
                break;
        }
    }
    
    /**
     * Energy regenerates at 20 per 2 seconds (10 per second)
     */
    stepEnergyRegen(deltaTime) {
        this.timer += deltaTime;
        
        // Regen every 2 seconds
        if (this.timer >= 2000) {
            this.addResource(20, 'energy regen');
            this.timer -= 2000;
        }
    }
    
    /**
     * Mana regeneration with five second rule
     */
    stepManaRegen(deltaTime) {
        // Check if we're still in the five second rule
        if (this.inFiveSecondRule && (step - this.lastCastTime) >= 5000) {
            this.inFiveSecondRule = false;
        }
        
        // Only regenerate mana if not in five second rule
        if (!this.inFiveSecondRule) {
            this.timer += deltaTime;
            
            // Regen every 2 seconds (tick rate)
            if (this.timer >= 2000) {
                const mp5 = this.character.stats.mp5 || 0;
                const spiritRegen = this.calculateSpiritRegen();
                const totalRegen = (mp5 / 5) * 2 + spiritRegen;
                
                this.addResource(totalRegen, 'mana regen');
                this.timer -= 2000;
            }
        }
    }
    
    /**
     * Calculate spirit-based mana regeneration
     */
    calculateSpiritRegen() {
        const spirit = this.character.stats.spi || 0;
        const intellect = this.character.stats.int || 0;
        
        // Base formula: (Spirit / 5 + 15) * 0.001 * Intellect * 5
        const baseRegen = ((spirit / 5) + 15) * 0.001 * intellect * 5;
        
        return baseRegen;
    }
    
    /**
     * Rage decays over time when not in combat
     */
    stepRageDecay(deltaTime) {
        this.timer += deltaTime;
        
        // Rage decays at 1 per second when out of combat
        if (this.timer >= 3000) {
            if (this.currentResource > 0) {
                this.currentResource = Math.max(0, this.currentResource - 1);
            }
            this.timer -= 3000;
        }
    }
    
    /**
     * Add rage from damage dealt or taken
     */
    addRageFromDamage(damage, isTaken = false) {
        if (this.resourceType !== 'Rage') return;
        
        const conversion = this.character.rageconversion || 230.6;
        let rageGained;
        
        if (isTaken) {
            // Rage from damage taken
            rageGained = (damage / conversion) * 2.5;
        } else {
            // Rage from damage dealt
            rageGained = (damage / conversion) * 7.5;
        }
        
        // Apply rage modifiers
        rageGained *= (this.character.ragemod || 1);
        
        this.addResource(rageGained, isTaken ? 'damage taken' : 'damage dealt');
    }
    
    /**
     * Check if there's enough resource for an ability
     */
    hasResource(amount) {
        return this.currentResource >= amount;
    }
    
    /**
     * Get current resource amount
     */
    getResource() {
        return this.currentResource;
    }
    
    /**
     * Set resource to a specific amount (for initialization, etc.)
     */
    setResource(amount) {
        this.currentResource = Math.max(0, Math.min(amount, this.maxResource));
    }
    
    /**
     * Get resource percentage
     */
    getResourcePercent() {
        return (this.currentResource / this.maxResource) * 100;
    }
}
