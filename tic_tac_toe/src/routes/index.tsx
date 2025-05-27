import { component$ } from "@builder.io/qwik";
import TicTacToe from "../components/tictactoe/TicTacToe";

// PUBLIC_INTERFACE
export default component$(() => {
  return (
    <div>
      <div role="presentation" class="ellipsis"></div>
      <div role="presentation" class="ellipsis ellipsis-purple"></div>
      <TicTacToe />
    </div>
  );
});
