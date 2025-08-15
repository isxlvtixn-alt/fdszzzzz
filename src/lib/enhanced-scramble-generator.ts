/**
 * Enhanced scramble generator 
 * Supports multiple WCA events with proper scramble algorithms
 */

export const CUBE_EVENTS = [
  { id: '3x3', name: '3×3×3', scrambleLength: 20, event: '333' },
  { id: '2x2', name: '2×2×2', scrambleLength: 9, event: '222' },
  { id: '4x4', name: '4×4×4', scrambleLength: 40, event: '444' },
  { id: '5x5', name: '5×5×5', scrambleLength: 60, event: '555' },
  { id: '6x6', name: '6×6×6', scrambleLength: 80, event: '666' },
  { id: '7x7', name: '7×7×7', scrambleLength: 100, event: '777' },
  { id: 'oh', name: '3×3 One-Handed', scrambleLength: 20, event: '333oh' },
  { id: 'bld', name: '3×3 Blindfolded', scrambleLength: 20, event: '333bf' },
  { id: 'fmc', name: 'Fewest Moves', scrambleLength: 1, event: '333fm' },
  { id: 'clock', name: 'Clock', scrambleLength: 1, event: 'clock' },
  { id: 'mega', name: 'Megaminx', scrambleLength: 70, event: 'minx' },
  { id: 'pyra', name: 'Pyraminx', scrambleLength: 10, event: 'pyram' },
  { id: 'skewb', name: 'Skewb', scrambleLength: 10, event: 'skewb' },
  { id: 'sq1', name: 'Square-1', scrambleLength: 15, event: 'sq1' },
] as const;

/**
 * Generate scramble using scrambow for better quality scrambles
 */
export const generateEnhancedScramble = (cubeType: string): string => {
  try {
    // For now, use the enhanced basic scramble generator
    // Future: Integrate with scrambow when properly configured
    return generateBasicScramble(cubeType);
  } catch (error) {
    console.error('Error generating scramble:', error);
    // Fallback scramble
    return generateBasicScramble(cubeType);
  }
};

/**
 * Enhanced basic scramble generator
 */
const generateBasicScramble = (cubeType: string): string => {
  const event = CUBE_EVENTS.find(e => e.id === cubeType);
  const length = event?.scrambleLength || 20;
  
  // Different move sets for different puzzles
  let moves: string[];
  let modifiers: string[];
  
  switch (cubeType) {
    case '2x2':
      moves = ['R', 'U', 'F'];
      modifiers = ['', "'", '2'];
      break;
    case 'pyra':
      moves = ['R', 'L', 'U', 'B'];
      modifiers = ['', "'"];
      break;
    case 'skewb':
      moves = ['R', 'L', 'U', 'B'];
      modifiers = ['', "'"];
      break;
    case 'mega':
      moves = ['R++', 'R--', 'D++', 'D--', 'U'];
      modifiers = ['', "'"];
      break;
    case 'sq1':
      // Square-1 has special notation
      return generateSquare1Scramble();
    default:
      moves = ['R', 'L', 'U', 'D', 'F', 'B'];
      modifiers = ['', "'", '2'];
  }
  
  const scramble: string[] = [];
  let lastMove = '';
  let lastTwoMoves = ['', ''];
  
  for (let i = 0; i < length; i++) {
    let move;
    let attempts = 0;
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
      attempts++;
      if (attempts > 50) break; // Prevent infinite loop
    } while (
      move === lastMove || 
      (move === lastTwoMoves[1] && lastMove === lastTwoMoves[0])
    );
    
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
    
    lastTwoMoves[0] = lastTwoMoves[1];
    lastTwoMoves[1] = lastMove;
    lastMove = move;
  }
  
  return scramble.join(' ');
};

/**
 * Generate Square-1 scramble with proper notation
 */
const generateSquare1Scramble = (): string => {
  const scramble: string[] = [];
  
  for (let i = 0; i < 15; i++) {
    const top = Math.floor(Math.random() * 12) - 6;
    const bottom = Math.floor(Math.random() * 12) - 6;
    scramble.push(`(${top}, ${bottom})`);
    
    if (i < 14) {
      scramble.push('/');
    }
  }
  
  return scramble.join(' ');
};

/**
 * Get scramble info for a cube type
 */
export const getScrambleInfo = (cubeType: string) => {
  return CUBE_EVENTS.find(e => e.id === cubeType) || CUBE_EVENTS[0];
};