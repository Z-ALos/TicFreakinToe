// Branch :- rancho/styling

import lonelyMode from "./lonelyMode.js";

// ---------------Variables---------------

let isTheFreakinGameStillGoing = true;
let currentPlayer = "X";
let winner = "";
let currentPlayerReverse = ""
let botMode = false
let USER_NAME = ""
let available_space = [0,1,2,3,4,5,6,7,8]
let lonelyModeInputDisabled = false
const gameBoard = document.querySelectorAll(".grid-item-container");
const gameTitle = document.querySelector("#game-title")
const gameTitle_His = document.querySelector("#game-title-history")
const winningSound = document.querySelector("#winning-sound")
const marking1 = document.querySelector("#marking1-sound")
const marking2 = document.querySelector("#marking2-sound")
const gridItem = document.querySelectorAll(".grid-item");
const replayBtn = document.querySelector("[data-replay-btn]");
const lonelyModeInput = document.querySelector('.lonely-mode-checkbox');
const notAllowedScreen = document.querySelector('.not-allowed');
const gameOverScreen = document.querySelector('#game-over-screen');
const toggleCheckmark = document.querySelector('#forLonelyMode');

USER_NAME = prompt("Enter Your Name: ")
sessionStorage.setItem("USERNAME", USER_NAME);

let board = [
  gameBoard[0].innerText,
  gameBoard[1].innerText,
  gameBoard[2].innerText,
  gameBoard[3].innerText,
  gameBoard[4].innerText,
  gameBoard[5].innerText,
  gameBoard[6].innerText,
  gameBoard[7].innerText,
  gameBoard[8].innerText,
];

gameBoard.forEach((item) => {
  item.addEventListener("click", PlayGame,{once:true});
});

gameBoard.forEach((item) => {
  item.addEventListener("mouseenter",showTurn)
})

gameBoard.forEach((item) => {
  item.addEventListener("mouseleave",removeTurn)
})

gameBoard.forEach((item) => {
  item.addEventListener("change",()=>{console.log("I got Called")
  })
})



toggleCheckmark.addEventListener("click", ()=>{
  if(lonelyModeInput.checked === true){
    if(lonelyModeInputDisabled) return
    lonelyModeInput.checked = false
    botMode = false
    console.log(botMode);
  }
  else{
    if(lonelyModeInputDisabled) return
    lonelyModeInput.checked = true
    botMode = true
    console.log(botMode);
  }
  
})


replayBtn.addEventListener("click", replayBtnClickHandler)

// ------------------ GAME LOOP --------------------


function PlayGame() {
  
  if(lonelyModeInput.disabled === false){
    lonelyModeInputDisabled = true
    lonelyModeInput.disabled = true
  }

  
  const chidOfGridContainer = this.children[0]
  if(chidOfGridContainer.classList.contains("marked")) return
  let x = this.children[0].id;
  let x_prev = x

  
  let y = available_space.indexOf(parseInt(x));
  board[parseInt(x)] = currentPlayer;


  
  marking2.play()

  if(currentPlayer == "X"){
    currentPlayerReverse = "O"
  }else{
      currentPlayerReverse="X"
  }
  let previousPlayer_data = currentPlayerReverse + "'s Turn :  "
  if(!botMode){
      displayOnScreenText(previousPlayer_data);
    gameTitle_His.textContent = currentPlayer + " :  " + (parseInt(x)+1) + " --> " + (x = currentPlayer)
}else if(botMode){
    displayOnScreenText(currentPlayer + "'s Turn :  ")
    gameTitle_His.textContent = currentPlayerReverse + " :  " + x_prev + " --> " + (x = currentPlayer)
  }
  
  let grid_Index = this.querySelector(".grid-item");
  grid_Index.innerText = currentPlayer;
  chidOfGridContainer.classList.add("marked")
  available_space.splice(y,1)
  
  
  checkIfGameOver();
  flipPlayerMyGame()
  
  if(!botMode) return
  if(available_space == []) return
  if(!isTheFreakinGameStillGoing) return
  console.log(available_space);
  
  lonelyMode(board, available_space, gridItem, gameTitle_His, currentPlayer, flipPlayerMyGame, checkIfGameOver)
  
}




// ------------ ALL FUNCTION ----------

function checkIfGameOver() {
  rowWin();
  columnWin();
  diagonalWin();
  tie();
  if (winner != ""){
    winningSound.volume = 0.3
    winningSound.play()
    gameBoard.forEach((item) => {
      item.removeEventListener("click", PlayGame, { once: true });
      item.style.cursor = "not-allowed"
    });
    displayOnScreenText("<| Game Over |>")

    gameOverScreen.style.display = "grid"

    gameOverScreen.children[0].textContent = (winner == "XO") ? "It's A Draw Baby!" :`${winner} Is The Winner!!!`

    const gameOverRestartBtn = document.querySelector('.replay-btn-fix-it-later');
    
    gameOverRestartBtn.addEventListener("click", ()=>{
      replayBtnClickHandler()
    })

    replayBtn.parentElement.style.display = "none"


  }

}


function rowWin() {
  let row1_color = [0,1,2]
  let row2_color = [3,4,5]
  let row3_color = [6,7,8]
  let row1 = ((board[0] == board[1]) && board[1] == board[2]) && (board[2] == "X" || board[2] == "O")
  let row2 = ((board[3] == board[4]) && board[4] == board[5]) && (board[5] == "X" || board[5] == "O")
  let row3 = ((board[6] == board[7]) && board[7] == board[8]) && (board[8] == "X" || board[8] == "O")

  if (row1) {
    winner = board[0];
    isTheFreakinGameStillGoing = false;
    winnerRedDisplay(row1_color)
  } 
  else if (row2) {
    winner = board[3];
    isTheFreakinGameStillGoing = false;
    winnerRedDisplay(row2_color)
  } 
  else if (row3) {
    winner = board[6];
    isTheFreakinGameStillGoing = false;
    winnerRedDisplay(row3_color)
  }

  if(row1 || row2 || row3){
    displayOnScreenText(winner + " Is The Winner!!!")
  }
}

function columnWin() {
  let column1_color = [0,3,6]
  let column2_color = [1,4,7]
  let column3_color = [2,5,8]
  let column1 = ((board[0] == board[3]) && board[3] == board[6]) && (board[3] === "X" || board[3] === "O")
  let column2 = ((board[1] == board[4]) && board[7] == board[4]) && (board[4] == "X" || board[4] == "O");
  let column3 = ((board[2] == board[5]) && board[5] == board[8]) && (board[8] == "X" || board[8] == "O");

  if (column1 == true) {
    winner = board[0];
    isTheFreakinGameStillGoing = false;
    winnerRedDisplay(column1_color)
  } 
  else if (column2 == true) {
    winner = board[1];
    isTheFreakinGameStillGoing = false;
    winnerRedDisplay(column2_color)
  } 
  else if (column3 == true) {
    winner = board[2];
    isTheFreakinGameStillGoing = false;
    winnerRedDisplay(column3_color)
  }
  
  if(column1 || column2 || column3){
    displayOnScreenText(winner + " Is The Winner!!!")
  }
}


function diagonalWin() {
  
  let diagonal1_color = [0,4,8]
  let diagonal2_color = [2,4,6]
  let diagonal1 = ((board[0] == board[4]) && board[4] == board[8]) && (board[8] == "X" || board[8] == "O")
  let diagonal2 = ((board[2] == board[4]) && board[4] == board[6]) && (board[6] == "X" || board[6] == "O")
  
  if (diagonal1) {
    winner = board[0];
    isTheFreakinGameStillGoing = false;
    winnerRedDisplay(diagonal1_color)
  } 
  
  else if (diagonal2) {
    winner = board[2];
    isTheFreakinGameStillGoing = false;
    winnerRedDisplay(diagonal2_color)
  }

  if(diagonal1 || diagonal2){
    displayOnScreenText(winner + " Is The Winner!!!")
  }

}


function tie() {
  if(available_space.length === 0 && winner ===""){
    displayOnScreenText("Looks Like It's A Tie!")
    winnerRedDisplay([0,1,2,3,4,5,6,7,8])
    winner = "XO"
  }

}


function flipPlayerMyGame(){

  if(currentPlayer === "X"){
    currentPlayer = "O"
  }
  else{
    currentPlayer = "X"
  }

}


function displayOnScreenText(string){
  gameTitle.textContent = string
}


function winnerRedDisplay(arr){
  for (let i = 0; i < arr.length; i++) {
    gameBoard.forEach((item) => {
      if(item.children[0].id == arr[i]){
        item.classList.add("hell")
      }
    })
  }
}


function showTurn(){
  if (!isTheFreakinGameStillGoing) return
  if(currentPlayer === "X"){
    this.childNodes[1].classList.add("grid-item-mark-indicator-x")
  }else{
    this.childNodes[1].classList.add("grid-item-mark-indicator-o")
  }
  
}


function removeTurn(){
  if(currentPlayer === "X"){
    
    if(this.childNodes[1].classList.value.includes("grid-item-mark-indicator-x")){
      this.childNodes[1].classList.remove("grid-item-mark-indicator-x")
    }
  }else{
    if(this.childNodes[1].classList.value.includes("grid-item-mark-indicator-o")){
      this.childNodes[1].classList.remove("grid-item-mark-indicator-o")
    }
  }
  

}


function replayBtnClickHandler(){
 currentPlayer = "X"
 winner = ""
 currentPlayerReverse = ""
 available_space = [0,1,2,3,4,5,6,7,8]
 board = [
];
for (let i = 0; i < 9; i++) {
  board[i] = ""
}
 isTheFreakinGameStillGoing = true

 gridItem.forEach(element => {
  element.innerText = ""
  if(element.classList.contains("marked")){
    element.classList.remove("marked")
  }
  if(element.classList.contains("grid-item-mark-indicator-x")){
    element.classList.remove("grid-item-mark-indicator-x")
  }
  else{
    element.classList.remove("grid-item-mark-indicator-o")
  }
 });
 gameBoard.forEach(element =>{
   if(element.classList.contains("hell")){
     element.classList.remove("hell")
   }
 })


 displayOnScreenText(currentPlayer + "'s" + " Turn:")
 gameTitle_His.innerText = ""

 gameBoard.forEach((item) => {
  item.addEventListener("click", PlayGame, { once: true });
  item.style.cursor = "pointer"
});

lonelyModeInput.disabled = false
lonelyModeInputDisabled = false
replayBtn.parentElement.style.display = "block"


gameOverScreen.style.display = "none"

}

function gsapAnimation(){

tl.to('.game-over-text',{
    duration: 1,
    y: '0',
    ease: Power3.easeOut
})
.to('.op',{
    duration: 1.2,
    y: '100px',
    ease: Power3.easeOut
},"-=1")
.onOverwrite = () =>{
  console.log("overwrite");
  
}
}