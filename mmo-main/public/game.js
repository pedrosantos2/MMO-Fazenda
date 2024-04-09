export default function createGame(){
    const state = {
        players:{},
        rank:{},
        fruits:{},
        screen:{
            width: 10,
            height: 10
        }
    }

    const observers = []
    let totalFruits = 0

    function start(){
        const frequency = 2000
        setInterval(autoAddFruit, frequency)
        
    }

    function subscribe(observerFunction){
        observers.push(observerFunction)
    }
    function notifyAll(command){
        for (const observerFunction of observers){
            observerFunction(command)
        }
    }

    function addPlayer(command){
        
        const playerId = command.playerId
        const playerName = command.playerName

        const playerX = 'playerX' in command ? command.playerX: Math.floor(Math.random() * state.screen.width)
        const playery =  'playery' in command ? command.playery: Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: playerX,
            y: playery,
            playerName: playerName,
        }

        state.rank[playerName] = {
            points: 0
        }

        notifyAll({
            type : 'addplayer',
            playerId: playerId,
            playerX: playerX,
            playery: playery,
            playerName: playerName,
        })
    }

    function removePlayer(command){
        const playerId = command.playerId
        const playerName = state.players[playerId].playerName

        delete state.players[playerId]
        delete state.rank[playerName]
        notifyAll({
            type: 'removePlayer',
            playerId: playerId
        })
    }

    function autoAddFruit(){
        if(totalFruits < 20){
            addFruit()
        }
    }

    function addFruit(command){
        const fruitId = command ? command.fruitId: Math.floor(Math.random() * 10000000)
        const fruitX = command ? command.fruitX: Math.floor(Math.random() * state.screen.width)
        const fruitY = command ? command.fruitY: Math.floor(Math.random() * state.screen.height)
        
        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }

        totalFruits++
        notifyAll({
            type: 'addFruit',
            fruitId: fruitId,
            fruitX: fruitX,
            fruitY: fruitY
        })
    }

    function removeFruits(command){
        const fruitId = command.fruitId

        delete state.fruits[fruitId]
        totalFruits--
        notifyAll({
            type: 'removeFruit',
            fruitId: fruitId
        })
    }

    function setState(newState){
        Object.assign(state, newState)
    }

    function movePlayer(command){
        notifyAll(command)
        const acceptMoves = {
            ArrowUp(player){
                if(player.y -1 >= 0){
                    player.y = player.y - 1
                    return
                }
            },
            ArrowDown(player){
                if(player.y +1 < state.screen.width){
                    player.y = player.y + 1
                    return
                }
            },
            ArrowLeft(player){
                if(player.x -1 >= 0){
                    player.x = player.x - 1
                    return
                }
            },
            ArrowRight(player){
                if(player.x +1 < state.screen.height){
                    player.x = player.x + 1
                    return
                }
            }
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[playerId]
        const moveFunction = acceptMoves[keyPressed]

        if(player && moveFunction){
            moveFunction(player)
            checkFruitCollision(command)
        }
    }

    
    function checkFruitCollision(command){
        const playerId = command.playerId
        const player = state.players[playerId]
        const playerName = state.players[playerId].playerName
        
        for(const fruitId in state.fruits){
            const fruit = state.fruits[fruitId]
            if(player.x === fruit.x && player.y === fruit.y){
                removeFruits({fruitId: fruitId})
                state.rank[playerName].points += 1
                const rank = state.rank
                const command = {
                    type: 'updatePoints',
                    rank: rank
                }
                updatePoits(command)
            }
        }
    }

    function updatePoits(command){
        notifyAll(command)
    }

    function sendMessage(command){
        notifyAll(command)
    }
    
    
    return {start, 
        addPlayer,
        subscribe, 
        removePlayer, 
        addFruit, 
        autoAddFruit, 
        removeFruits, 
        setState,
        movePlayer, 
        checkFruitCollision,
        updatePoits,
        sendMessage,
        state
    }
}