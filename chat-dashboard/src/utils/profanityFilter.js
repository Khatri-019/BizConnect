/**
 * Profanity Filter Utility
 * Detects offensive language and cuss words in messages
 */

// Comprehensive list of offensive words and phrases
// This list includes common profanities, slurs, and offensive terms
const PROFANITY_LIST = [
  // Common profanities (explicit offensive words only)
  'fuck', 'fucking', 'fucked', 'fucker', 'fucks',
  'shit', 'shitting', 'shitted', 'shits',
  'damn', 'damned', 'damnit',
  'hell', 'hells',
  'asshole', 'assholes', // Only the offensive compound, not "ass" alone
  'bitch', 'bitches', 'bitching', 'bitched',
  'bastard', 'bastards',
  'crap', 'craps',
  'piss', 'pissing', 'pissed', 'pisses',
  
  // Stronger profanities
  'cunt', 'cunts',
  'dickhead', 'dickheads', // Only offensive compound, not "dick" alone
  'pussy', 'pussies',
  'cock', 'cocks',
  'whore', 'whores',
  'slut', 'sluts',
  
  // Offensive slurs (partial list - add more as needed)
  'nigger', 'niggers', 'nigga', 'niggas',
  'retard', 'retards', 'retarded',
  
  // Offensive compounds only (not individual words that can be used in context)
  'dumbass', 'dumbasses',
  
  // Variations with numbers/leetspeak
  'f*ck', 'f**k', 'f***', 'sh*t', 's**t', 'a$$', 'a**', 'b*tch', 'b**ch',
  'f0ck', 'sh1t', 'a55', 'b1tch',
  
  // Common misspellings/alternatives
  'fuk', 'fuking', 'fuker',
  'shyt', 'shite',
  'azz', 'ashole',
  'biatch', 'bich',
];

/**
 * Normalizes text for profanity checking
 * Removes special characters, converts to lowercase, handles leetspeak
 * Preserves word boundaries for accurate matching
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // Replace special characters with spaces to preserve word boundaries
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/!/g, 'i')
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .trim();
}

/**
 * Checks if a message contains profanity
 * Uses word boundary detection to avoid false positives
 * @param {string} message - The message to check
 * @returns {boolean} - True if profanity is detected, false otherwise
 */
export function containsProfanity(message) {
  if (!message || typeof message !== 'string') {
    return false;
  }

  const normalizedMessage = normalizeText(message);
  
  // Split into words for more accurate matching
  const words = normalizedMessage.split(/\s+/);
  
  // Check each word against profanity list with word boundaries
  for (const word of words) {
    for (const profanity of PROFANITY_LIST) {
      // Escape special regex characters
      const escaped = profanity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Use word boundaries to ensure we match whole words only
      // This prevents false positives like "class" matching "ass"
      const wordBoundaryPattern = new RegExp(`\\b${escaped}\\b`, 'i');
      
      if (wordBoundaryPattern.test(word)) {
        return true;
      }
    }
  }
  
  // Also check the entire normalized message for compound profanities
  // (e.g., "fuckinghell" without spaces) but only for longer profanities
  const longProfanities = PROFANITY_LIST.filter(p => p.length >= 4);
  for (const profanity of longProfanities) {
    const escaped = profanity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Check if profanity appears at word boundaries in the full message
    const boundaryPattern = new RegExp(`(^|\\s)${escaped}(\\s|$)`, 'i');
    if (boundaryPattern.test(normalizedMessage)) {
      return true;
    }
  }

  return false;
}

/**
 * Gets a list of detected profanities in a message (for debugging/logging)
 * @param {string} message - The message to check
 * @returns {string[]} - Array of detected profanities
 */
export function getDetectedProfanities(message) {
  if (!message || typeof message !== 'string') {
    return [];
  }

  const detected = [];
  const normalizedMessage = normalizeText(message);
  const words = normalizedMessage.split(/\s+/);

  for (const word of words) {
    for (const profanity of PROFANITY_LIST) {
      if (word.includes(profanity) || profanity.includes(word)) {
        if (!detected.includes(profanity)) {
          detected.push(profanity);
        }
      }
    }
  }

  return detected;
}

