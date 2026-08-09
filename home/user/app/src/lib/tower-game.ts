// Tower Stack game engine — pure functions, no React dependencies

export interface Block {
  x: number; // left position relative to container
  y: number; // top position (increases downward)
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
}

const BASE_SPEED = 3;
const SPEED_INCREMENT = 0.15;
const BLOCK_HEIGHT = 28;
const INITIAL_WIDTH = 260; // will be set to container width fraction

export function createInitialState(containerWidth: number): GameState {
  const baseBlockWidth = Math.min(INITIAL_WIDTH, containerWidth * 0.7);
  return {
    blocks: [
      {
        x: (containerWidth - baseBlockWidth) / 2,
        y: 0,
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
  };
}

export function tick(state: GameState, containerWidth: number): GameState {
  if (!state.running || state.gameOver) return state;

  let { currentX, direction, speed } = state;
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

  // Create trimmed block
  const newBlock: Block = {
    x: overlapStart,
    y: lastBlock.y + lastBlock.height,
    width: overlapWidth,
    height: BLOCK_HEIGHT,
  };

  // Update currentX to align with the trimmed block for next slide
  const newState: GameState = {
    ...state,
    blocks: [...state.blocks, newBlock],
    score: state.score + 1,
    speed: state.speed + SPEED_INCREMENT,
    currentX: overlapStart, // start next block at trimmed position
  };

  return newState;
}

export function resetGame(containerWidth: number): GameState {
  return createInitialState(containerWidth);
}
