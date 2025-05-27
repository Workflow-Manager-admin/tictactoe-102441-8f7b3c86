import { component$, useSignal, $ } from "@builder.io/qwik";
import styles from "./TicTacToe.module.css";

// PUBLIC_INTERFACE
/**
 * Main TicTacToe container component.
 * Features:
 * - Two player local mode ("X" and "O")
 * - Win and draw detection
 * - Reset functionality
 * - Minimal, centered, accessible UI with specified color theme
 */
export default component$(() => {
  // 0 = empty, 1 = X, 2 = O
  const board = useSignal<(0 | 1 | 2)[]>([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  // true = X's turn, false = O's turn
  const xTurn = useSignal(true);
  const winner = useSignal<null | 1 | 2>(null);
  const draw = useSignal(false);

  // Winning patterns: indices of cells
  const WIN_PATTERNS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  // PUBLIC_INTERFACE
  /**
   * Handles a cell click. Sets value and checks for win/draw.
   */
  const handleCellClick = $((idx: number) => {
    if (winner.value !== null || draw.value || board.value[idx] !== 0) return;
    board.value = board.value.slice();
    board.value[idx] = xTurn.value ? 1 : 2;
    checkGameStatus();
    if (winner.value === null && !draw.value) {
      xTurn.value = !xTurn.value;
    }
  });

  // PUBLIC_INTERFACE
  /**
   * Checks for win or draw after every move.
   */
  const checkGameStatus = $(() => {
    for (const pattern of WIN_PATTERNS) {
      const [a, b, c] = pattern;
      if (
        board.value[a] !== 0 &&
        board.value[a] === board.value[b] &&
        board.value[a] === board.value[c]
      ) {
        winner.value = board.value[a];
        return;
      }
    }
    if (board.value.every((cell) => cell !== 0)) {
      draw.value = true;
    }
  });

  // PUBLIC_INTERFACE
  /**
   * Resets the game to initial state.
   */
  const handleReset = $(() => {
    board.value = [0,0,0,0,0,0,0,0,0];
    xTurn.value = true;
    winner.value = null;
    draw.value = false;
  });

  // Helper for indication text
  function getStatusText() {
    if (winner.value)
      return `Player ${winner.value === 1 ? "X" : "O"} Wins!`;
    if (draw.value)
      return "Draw!";
    return `Player ${xTurn.value ? "X" : "O"}'s Turn`;
  }

  return (
    <div class={styles.container}>
      <div class={styles.status} aria-live="polite">
        {getStatusText()}
      </div>
      <div class={styles.grid}>
        {board.value.map((cell, idx) => (
          <button
            key={idx}
            class={[
              styles.cell,
              (winner.value === 1 && cell === 1) ? styles.winX : "",
              (winner.value === 2 && cell === 2) ? styles.winO : "",
            ]}
            aria-label={
              cell === 1 ? "X"
              : cell === 2 ? "O"
              : `Cell ${idx+1}, empty`
            }
            tabIndex={cell === 0 && !winner.value && !draw.value ? 0 : -1}
            disabled={cell !== 0 || !!winner.value || draw.value}
            onClick$={() => handleCellClick(idx)}
            type="button"
          >
            {cell === 1 ? "X" : cell === 2 ? "O" : ""}
          </button>
        ))}
      </div>
      <button
        class={styles.resetBtn}
        type="button"
        onClick$={handleReset}
        aria-label="Reset game"
      >
        Reset Game
      </button>
    </div>
  );
});
