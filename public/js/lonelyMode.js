export default function lonelyMode(board, available_space, gridItem, gameTitle_His, currentPlayer, flipPlayerMyGame, checkIfGameOver){

    let botChooses = available_space[Math.floor(Math.random() * available_space.length)]
    let babu = available_space.indexOf(parseInt(botChooses));
    console.log("Bot: "+botChooses);
    available_space.splice(babu,1);
    console.log(available_space);
    gridItem.forEach((item) =>{
      if(item.id == botChooses){
        item.innerText = currentPlayer
        console.log(item);
        item.classList.add("marked")
        board[botChooses] = currentPlayer
        
      }
    })
    if(available_space.length != 0){
      gameTitle_His.textContent = currentPlayer + " :  " + botChooses + " --> " + (currentPlayer)
    }
    console.log(`current Player: ${currentPlayer}`);
    
    checkIfGameOver()
    flipPlayerMyGame()
    
  }

// export default function testModule(){
//     console.log("Test Successful!");
// }