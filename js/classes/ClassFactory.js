/**
 * Factory for creating character class instances
 */
class ClassFactory {
    /**
     * Create a character instance based on the selected class
     * @param {string} className - The class name (warrior, rogue, mage, etc.)
     * @param {object} config - Configuration object
     * @returns {Character} - Instance of the appropriate character class
     */
    static createCharacter(className, testItem, testType, enchtype, config) {
        switch (className.toLowerCase()) {
            case 'warrior':
                return new WarriorPlayer(testItem, testType, enchtype, config);
            case 'rogue':
                return new RoguePlayer(testItem, testType, enchtype, config);
            case 'mage':
                return new MagePlayer(testItem, testType, enchtype, config);
            // Add more classes as they are implemented
            // case 'hunter':
            //     return new HunterPlayer(testItem, testType, enchtype, config);
            // case 'warlock':
            //     return new WarlockPlayer(testItem, testType, enchtype, config);
            default:
                throw new Error(`Unknown character class: ${className}`);
        }
    }
    
    /**
     * Get list of available character classes
     * @returns {Array<string>} - Array of class names
     */
    static getAvailableClasses() {
        return ['Warrior', 'Rogue', 'Mage'];
    }
    
    /**
     * Check if a class is implemented
     * @param {string} className - The class name to check
     * @returns {boolean} - True if class is implemented
     */
    static isClassImplemented(className) {
        return this.getAvailableClasses().includes(className);
    }
}
