import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
  getCellElementAtIdx,
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let isGameEnded = false;
let cellValues = new Array(9).fill("");
function toggleTurn() {
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
  }
}
function updateGameStatus(newGameStatus) {
  gameStatus = newGameStatus;

  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) gameStatusElement.textContent = newGameStatus;
}

function showReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) replayButton.classList.add("show");
}

function hideReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) replayButton.classList.remove("show");
}

function highlightWinCell(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error("Invalid win position");
  }

  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    if (cell) cell.classList.add("win");
  }
}

function handleCellClick(cell, index) {
  const isClicked =
    cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
  // only allow in click if game is playing and that cell is not click
  if (isClicked || isEndGame) return;
  // set selected cell
  cell.classList.add(currentTurn);

  // update cellValues
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

  // toggle turn
  toggleTurn();

  // check game status
  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED:
      updateGameStatus(game.status);
      showReplayButton();
      break;
    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN:
      updateGameStatus(game.status);
      showReplayButton();
      highlightWinCell(game.winPositions);
      break;

    default:
      break;
  }

  console.log(cell);
}
function initCellElementList() {
  const cellElementList = getCellElementList();
  cellElementList.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
  });
}

function resetGame() {
  // reset temp global vars
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => "");

  // reset dom elements
  // reset game status
  updateGameStatus(GAME_STATUS.PLAYING);

  // reset current turn
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(TURN.CROSS);
  }

  // reset game board
  const cellElementList = getCellElementList();
  for (const cellElement of cellElementList) {
    cellElement.className = "";
  }

  // hide replay button
  hideReplayButton();
}

function initReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) replayButton.addEventListener("click", resetGame);
}

/**
 * Global variables
 */
console.log(
  getCellElementList,
  getCellElementAtIdx,
  getCurrentTurnElement,
  getGameStatusElement
);

(() => {
  initCellElementList();
  initReplayButton();
  checkGameStatus();
})();
