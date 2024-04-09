export default function sendMessage(document){
    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId){
        state.playerId = playerId
    }
    function subscribe(observerFunction){
        state.observers.push(observerFunction)
    }
    function notifyAll(command){
        for (const observerFunction of state.observers){
            observerFunction(command)
        }
        
    }

    document.addEventListener('submit', (event) => {
        event.preventDefault()
        const msg = document.getElementById('input')
        const command = {
            type: 'message',
            playerId: state.playerId,
            message: msg.value
        }
        msg.value = ''
        if(command.message.trim().length){
            notifyAll(command)
        }
    })

    
    
    
    function receiveMessege(command){
        const chatList = document.getElementById('messages')
        const li = document.createElement('li')
        const msg = command.message
        const gameTag = command.playerName
        const mask  = document.getElementById('chat_mask')

        li.textContent = gameTag + ": " + msg

        chatList.appendChild(li)
        mask.scroll(0, (mask.scrollHeight + mask.offsetHeight))

        
    }


    
    
    return{ subscribe, registerPlayerId, receiveMessege}
}