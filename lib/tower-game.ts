// Tower Stack game engine — pure functions, no React dependencies
// Tower builds UPWARD (y decreases), camera follows when tower exceeds half screen

export interface Block {
  x: number; // left position relative to container
  y: number; // top position (decreases upward — tower builds up)
  width: number;
  height: number;
}

export interface GameState {
  blocks: Block[];
  currentX: number;
  direction: 1 | -1;
  speed: number;
  score: number;
  running: boolean;
  gameOver: boolean;
  started: boolean;
  // Camera offset — shifts everything down so tower stays visible
  cameraY: number;
}

const BASE_SPEED = 3;
const SPEED_INCREMENT = 0.15;
const BLOCK_HEIGHT = 28;
const INITIAL_WIDTH = 260;

export function createInitialState(containerWidth: number): GameState {
  const baseBlockWidth = Math.min(INITIAL_WIDTH, containerWidth * 0.7);
  return {
    blocks: [
      {
        x: (containerWidth - baseBlockWidth) / 2,
        y: 0, // base block at bottom of visible area (camera will shift)
        width: baseBlockWidth,
        height: BLOCK_HEIGHT,
      },
    ],
    currentX: 0,
    direction: 1 as const,
    speed: BASE_SPEED,
    score: 0,
    running: false,
    gameOver: false,
    started: false,
    cameraY: 0,
  };
}

export function tick(state: GameState, containerWidth: number): GameState {
  if (!state.running || state.gameOver) return state;

  let { currentX, direction } = state;
  const speed = state.speed;
  const blockWidth = state.blocks[state.blocks.length - 1].width;

  // Move the sliding block
  currentX += direction * speed;

  // Bounce off walls
  if (currentX + blockWidth >= containerWidth) {
    currentX = containerWidth - blockWidth;
    direction = -1;
  } else if (currentX <= 0) {
    currentX = 0;
    direction = 1;
  }

  return { ...state, currentX, direction, speed };
}

export function dropBlock(state: GameState): GameState {
  if (!state.running || state.gameOver) return state;

  const lastBlock = state.blocks[state.blocks.length - 1];
  const droppedX = state.currentX;
  const droppedWidth = state.blocks[state.blocks.length - 1].width;

  // Calculate overlap
  const overlapStart = Math.max(droppedX, lastBlock.x);
  const overlapEnd = Math.min(droppedX + droppedWidth, lastBlock.x + lastBlock.width);
  const overlapWidth = overlapEnd - overlapStart;

  if (overlapWidth <= 0) {
    // Miss — game over
    return { ...state, running: false, gameOver: true };
  }

  // Create trimmed block — placed ABOVE the last one (y decreases = builds upward)
  const newBlock: Block = {
    x: overlapStart,
    y: lastBlock.y - BLOCK_HEIGHT, // negative = above previous block (upward!)
    width: overlapWidth,
    height: BLOCK_HEIGHT,
  };

  // Calculate camera offset so tower stays visible
  // When the top of the tower goes above half the screen, shift camera down
  const newCameraY = Math.max(
    state.cameraY,
    -newBlock.y - BLOCK_HEIGHT * 12 // keep ~12 blocks visible from top
  );

  // Update currentX to align with the trimmed block for next slide
  const newState: GameState = {
    ...state,
    blocks: [...state.blocks, newBlock],
    score: state.score + 1,
    speed: state.speed + SPEED_INCREMENT,
    currentX: overlapStart, // start next block at trimmed position
    cameraY: newCameraY,
  };

  return newState;
}

export function resetGame(containerWidth: number): GameState {
  return createInitialState(containerWidth);
}
