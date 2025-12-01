/**
 * Profanity Filter Utility
 * Detects offensive language and cuss words in messages
 */

// Comprehensive list of offensive words and phrases
// This list includes common profanities, slurs, and offensive terms
const PROFANITY_LIST = [
  // Common profanities
  'fuck', 'fucking', 'fucked', 'fucker', 'fucks',
  'shit', 'shitting', 'shitted', 'shits',
  'damn', 'damned', 'damnit',
  'hell', 'hells',
  'ass', 'asses', 'asshole', 'assholes',
  'bitch', 'bitches', 'bitching', 'bitched',
  'bastard', 'bastards',
  'crap', 'craps',
  'piss', 'pissing', 'pissed', 'pisses',
  
  // Stronger profanities
  'cunt', 'cunts',
  'dick', 'dicks', 'dickhead', 'dickheads',
  'pussy', 'pussies',
  'cock', 'cocks',
  'whore', 'whores',
  'slut', 'sluts',
  
  // Offensive slurs (partial list - add more as needed)
  'nigger', 'niggers', 'nigga', 'niggas',
  'retard', 'retards', 'retarded',
  'gay', 'gays', // Context-dependent, but included for filtering
  
  // Other offensive terms
  'idiot', 'idiots', 'idiotic',
  'stupid', 'stupids',
  'moron', 'morons',
  'dumb', 'dumbs', 'dumbass', 'dumbasses',
  'loser', 'losers',
  
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
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/!/g, 'i')
    .trim();
}

/**
 * Checks if a message contains profanity
 * @param {string} message - The message to check
 * @returns {boolean} - True if profanity is detected, false otherwise
 */
export function containsProfanity(message) {
  if (!message || typeof message !== 'string') {
    return false;
  }

  const normalizedMessage = normalizeText(message);
  const words = normalizedMessage.split(/\s+/);

  // Check each word against the profanity list
  for (const word of words) {
    // Direct match
    if (PROFANITY_LIST.includes(word)) {
      return true;
    }

    // Check if word contains any profanity (handles cases like "fuckinghell")
    for (const profanity of PROFANITY_LIST) {
      if (word.includes(profanity) || profanity.includes(word)) {
        return true;
      }
    }
  }

  // Check for profanity in the entire normalized message (handles cases without spaces)
  const messageWithoutSpaces = normalizedMessage.replace(/\s/g, '');
  for (const profanity of PROFANITY_LIST) {
    if (messageWithoutSpaces.includes(profanity)) {
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

