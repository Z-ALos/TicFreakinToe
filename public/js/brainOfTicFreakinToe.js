// ---------------Variables---------------

let isTheFreakinGameStillGoing = true;
let currentPlayer = "X";
let winner = "";
let currentPlayerReverse = ""
let botMode = false
let yourTURN = true
let currentUser = sessionStorage.getItem("USERNAME");
let somefirstState = false
let firstTurn = false
let reseted = false
let allowed = true
let twoPlayerMode = true
let available_space = [0,1,2,3,4,5,6,7,8]
let messageToBeSent = ""
const gameBoard = document.querySelectorAll(".grid-item-container");
const gameTitle = document.querySelector("#game-title")
const gameTitle_His = document.querySelector("#game-title-history")
const winningSound = document.querySelector("#winning-sound")
const marking1 = document.querySelector("#marking1-sound")
const marking2 = document.querySelector("#marking2-sound")
const popALert = document.querySelector("#message-pop-sound")
const gridItem = document.querySelectorAll(".grid-item");
const replayBtn = document.querySelector("[data-replay-btn]");
const notAllowedScreen = document.querySelector('.not-allowed');
const gameOverScreen = document.querySelector('#game-over-screen');
const sendChatMessage = document.querySelector('#send-chat-message');
const messageValue = document.querySelector('.chat-input');
const navMessage = document.querySelector('.nav-message');
const chatUl = document.querySelector('#chat-ul');
const chatBox = document.querySelector("#built-in-realtime-chat");

chatBox.style.display = "none"


const socket = io()

console.log("Real Brain:- Hi There")
replayBtn.textContent = "Request Replay"

// ----------- Game Board Data Logging -----------

socket.on('markPos', data=> {
    console.log(data);
    temp(data)
});

socket.on('firstTurn', (notSelected)=> {
    firstTurn = true
    somefirstState = true
    currentPlayer = "X"
    displayOnScreenText("Your Chance")
    socket.emit('next',notSelected)
    gameBoard.forEach(item=>{
      item.style.cursor = "pointer"
    })
});
  
socket.on('secondTurn', ()=> {
    firstTurn = false
    displayOnScreenText("Opponent's Chance:")
    currentPlayer = "O"
    gameBoard.forEach(item=>{
      item.style.cursor = "not-allowed"
    })
});

socket.on('resetOnDis', ()=> {
  location.reload()
});

socket.on('requestReplay', ()=> {
  if(reseted) return
  replayBtn.textContent = "Would You Like To Replay"
  
  
});

socket.on('whatToDo', ()=> {
  gameBoard.forEach(item=>{
    item.removeEventListener("click", PlayGame)
    item.style.cursor = "not-allowed"
    allowed = false
    notAllowedScreen.style.display = "grid"
  })
});

socket.on('requestedMessage', (message, user)=> {
  console.log("message is ",message);
  receivedMessage(message, user)
  if(chatBox.style.display == "none"){
    popALert.play()
  }
  
});

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
  item.addEventListener("click", PlayGame);
});

gameBoard.forEach((item) => {
  item.addEventListener("mouseenter",showTurn)
})

gameBoard.forEach((item) => {
  item.addEventListener("mouseleave",removeTurn)
})

sendChatMessage.addEventListener("click",(event)=>{
  event.preventDefault()
  sendMessage()
})


messageValue.addEventListener("change",()=>{messageToBeSent += messageValue.value})

replayBtn.addEventListener("click", replayBtnClickHandler)
navMessage.addEventListener("click", ()=>{
  if(chatBox.style.display == "none"){
    chatBox.style.display = "flex"
  }
  else{
    chatBox.style.display = "none"
  }
})



// ------------------ GAME LOOP --------------------

function temp(data){
  yourTURN = true
  firstTurn = true
  displayOnScreenText("Your Turn: ")
  gameBoard.forEach(item=>{
    item.style.cursor = "pointer"
  })
  
    gridItem.forEach(item =>{
        if(item.id == data.position){
            item.innerText = data.currentPlayer
            item.classList.add("marked")
            // marking2.play()
          }
        })
        
        
        
    let y = available_space.indexOf(data.position);
    board[parseInt(data.position)] = data.currentPlayer;
    console.log(board);
  if(data.currentPlayer == "X"){
      currentPlayer = "O"
  }else{
      currentPlayer="X"
  }

    gameTitle_His.textContent = data.currentPlayer + " :  " + (data.position +1)+ " --> " + (data.currentPlayer)



available_space.splice(y,1)


checkIfGameOver();
if(data.currentPlayer === "X"){
  currentPlayer = "O"
}
else{
    currentPlayer = "X"
  }

}

function PlayGame() {
  
  if(!firstTurn) return
  if(!yourTURN) return
  console.log("play Game");
  const chidOfGridContainer = this.children[0]
  if(chidOfGridContainer.classList.contains("marked")) return
  let x = this.children[0].id;
  let x_prev = x

  
  let y = available_space.indexOf(parseInt(x));
  board[parseInt(x)] = currentPlayer;

  socket.emit('playMove', {currentPlayer:currentPlayer, position : parseInt(x)})
  
  yourTURN = false
  if(!yourTURN){
    gameBoard.forEach(item=>{
      item.style.cursor = "not-allowed"
    })
  }
  
  marking2.play()
  if(currentPlayer == "X"){
    currentPlayerReverse = "O"
  }else{
      currentPlayerReverse="X"
  }
  previousPlayer_data = currentPlayerReverse + "'s Turn :  "
  if(!botMode){
      displayOnScreenText(previousPlayer_data);
    gameTitle_His.textContent = currentPlayer + " :  " + (parseInt(x)+1) + " --> " + (x = currentPlayer)
}else if(botMode){
    displayOnScreenText(currentPlayer + "'s Turn :  ")
    gameTitle_His.textContent = currentPlayerReverse + " :  " + (parseInt(x)+1) + " --> " + (x = currentPlayer)
}
  
let grid_Index = this.querySelector(".grid-item");
grid_Index.innerText = currentPlayer;
chidOfGridContainer.classList.add("marked")


available_space.splice(y,1)


checkIfGameOver();
flipPlayerMyGame()
 

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
      console.log("replayed");
    })

    document.querySelector('.dope').addEventListener("click", (e)=>{
      replayBtnClickHandler()
      console.log("replayed dope");
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
  if(!allowed) return
  if(!yourTURN) return
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
  console.log(this.innerText);
  
  if(this.innerText == "Would You Like To Replay" || this.innerText == undefined){
    socket.emit('resetOnlineGame')
    console.log("emited");
    
}
else{
  socket.emit('replay')
}
}

function sendMessage(){
  if(messageToBeSent == "") return
  console.log(messageToBeSent);
  
  socket.emit('send-chat-message', messageToBeSent, currentUser)

  // Creating & Appending Elements For Sent Message
  const li = document.createElement("li")
  const divSent = document.createElement("div")
  const spanSentMessage = document.createElement("span")

  li.classList.add("ex-girlfriend")
  divSent.classList.add("sent")
  spanSentMessage.classList.add("message")

  spanSentMessage.textContent = messageToBeSent

  divSent.appendChild(spanSentMessage)
  li.appendChild(divSent)
  chatUl.appendChild(li)

  //Resetting The Input Box And Variable
  messageValue.value = ""
  messageToBeSent = ""
  messageValue.focus = true

  chatBox.scrollTop = chatBox.scrollHeight;
}


function receivedMessage(message, userName){
  
  // Creating Elements 
  const li = document.createElement("li")
  const divReceived = document.createElement("div")
  const divUserName = document.createElement("div")
  const spanMessage = document.createElement("span")
  
  // Adding ClassList
  divReceived.classList.add("received")
  divUserName.classList.add("user-name")
  spanMessage.classList.add("message")
  
  // Adding Text
  divUserName.textContent = userName + ":"
  spanMessage.textContent = message

  //Appending Childs
  divReceived.appendChild(divUserName)
  divReceived.appendChild(spanMessage)
  li.appendChild(divReceived)
  chatUl.appendChild(li)
  chatBox.scrollTop = chatBox.scrollHeight;

}
