/**
 * 3x3 Rubik's Cube scramble generator
 */

const MOVES = ['R', 'L', 'U', 'D', 'F', 'B'];
const MODIFIERS = ['', "'", '2'];

interface Move {
  face: string;
  modifier: string;
}

/**
 * Check if two moves are on the same face
 */
const isSameFace = (move1: Move, move2: Move): boolean => {
  return move1.face === move2.face;
};

/**
 * Check if two moves are on opposite faces
 */
const isOppositeFace = (move1: Move, move2: Move): boolean => {
  const opposites: Record<string, string> = {
    'R': 'L', 'L': 'R',
    'U': 'D', 'D': 'U',
    'F': 'B', 'B': 'F'
  };
  return opposites[move1.face] === move2.face;
};

/**
 * Generate a random move
 */
const generateRandomMove = (): Move => {
  const face = MOVES[Math.floor(Math.random() * MOVES.length)];
  const modifier = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
  return { face, modifier };
};

/**
 * Generate a 3x3 scramble
 */
export const generate3x3Scramble = (length: number = 20): string => {
  const moves: Move[] = [];
  
  for (let i = 0; i < length; i++) {
    let newMove: Move;
    let attempts = 0;
    
    do {
      newMove = generateRandomMove();
      attempts++;
      
      // Prevent infinite loops
      if (attempts > 50) break;
      
      // Check if this move is valid
      const isValid = moves.length === 0 || (
        !isSameFace(newMove, moves[moves.length - 1]) &&
        !(moves.length >= 2 && 
          isOppositeFace(newMove, moves[moves.length - 2]) &&
          isSameFace(moves[moves.length - 1], moves[moves.length - 2]))
      );
      
      if (isValid) break;
    } while (true);
    
    moves.push(newMove);
  }
  
  return moves.map(move => `${move.face}${move.modifier}`).join(' ');
};

/**
 * Generate scrambles for different cube types
 */
export const generateScramble = (cubeType: string): string => {
  switch (cubeType) {
    case '3x3':
      return generate3x3Scramble(20);
    case '2x2':
      return generate3x3Scramble(9); // 2x2 uses subset of 3x3 moves
    case '4x4':
      return generate3x3Scramble(40); // Longer scramble for 4x4
    case '5x5':
      return generate3x3Scramble(60); // Even longer for 5x5
    default:
      return generate3x3Scramble(20);
  }
};

/**
 * Available cube types
 */
export const CUBE_TYPES = [
  { id: '3x3', name: '3×3×3', scrambleLength: 20 },
  { id: '2x2', name: '2×2×2', scrambleLength: 9 },
  { id: '4x4', name: '4×4×4', scrambleLength: 40 },
  { id: '5x5', name: '5×5×5', scrambleLength: 60 },
] as const;