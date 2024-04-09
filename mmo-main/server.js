import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import { Server, Socket } from 'socket.io'
import setName from './nameGenerator.js'

/* const  {getName} = setName() */



const app_port = 3000 || 8080
const app = express()
const server = http.createServer(app) // recebe uma instancia do express
const sockets = new Server(server) // recebe uma instancia do node

app.use(express.static('public'))

const {getNames} = setName()
const playersName = getNames()


const game = createGame()
game.start()

game.subscribe((command) =>{
    sockets.emit(command.type, command)
})

function setPlayerName(id){
    for(const name in playersName){
        if(playersName[name] === ""){
            playersName[name] = id
            return name
        }
    }
}

function getPlayerName(id){
    for(const name in playersName){
        if(playersName[name] === id){            
            return name
        }
    }
}

function removePlayerName(id){
    for(const name in playersName){
        if(playersName[name] === id){
            playersName[name] = ""
            return
        }
    }
}

sockets.on('connection', (socket) =>{
    const playerId = socket.id
    const setName = setPlayerName(playerId)
    const getName = getPlayerName(playerId)

    game.addPlayer({playerId: playerId, playerName: setName})
    
    socket.emit('setup', game.state)

    socket.on('disconnect', () =>{
        game.removePlayer({playerId: playerId})
        removePlayerName(socket.id)
    })
    socket.on('movePlayer', (command) =>{
        command.playerId = playerId
        command.type = 'movePlayer'
        command.playerName = getName
        
        game.movePlayer(command)
    })
    socket.on('message', (command) =>{
        command.playerId = playerId
        command.type = 'message'
        command.playerName = getName
        
        if(command.message.trim().length){
            game.sendMessage(command)
        }
    })
})

server.listen(app_port, 'localhost', () =>{
    console.log(`Server up and listening in port: ${app_port}`)
})