const users =[]

let overpowered = ""
let notSelected
function userJoin(id, roomName){
    
    if(users.length > 1) {
        return 0
    }
    const user = {id, roomName}

    users.push(user)
    
    if(users.length == 2){
        // const op = Math.floor(Math.random() * 2);
        const op = 0
        // const dope = (op == 0) ? 1 : 0
        const dope = 1
        notSelected = users[dope].id
        const choosedUser = users[op]
        overpowered = choosedUser.id
    }

    return {user,overpowered,notSelected}
    
}

function removeUser(id){

    for (let index = 0; index < users.length; index++) {
        let element = users[index];
        if(element.id == id){
            users.splice(index,1)
        }
    }

}

function getCurrentUser(id){
    return users.find(user => user.id === id)
}

module.exports={
    userJoin,
    removeUser
}