// const socket = io()
// const btn = document.querySelector('#enter-room');


socket.on('message',message =>{
    console.log(message);
})

socket.on('helpMe',()=>{
join()
})

// btn.addEventListener("click",join )


function join(){
    console.log("joining.....");
    
    const {roomName} = Qs.parse(location.search,{
        ignoreQueryPrefix: true
    })

    socket.emit('joinRoom', {roomName})

}


    

