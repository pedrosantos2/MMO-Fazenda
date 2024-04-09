export default function renderScreen(screen, game, requestAnimationFrame, currenPlayerId){
    const context = screen.getContext('2d')
    const localPlayer = game.state.players[currenPlayerId]

    context.fillStyle = 'white'
    context.clearRect(0, 0, 600, 600)

    for(const fruitId in game.state.fruits){
        const fruit = game.state.fruits[fruitId]
        //context.fillStyle = 'green'
        //context.fillRect(fruit.x, fruit.y, 1, 1)

        var image = document.getElementById("fruit");
        context.drawImage(image ,fruit.x * 60, fruit.y * 60, 60, 60)
    }
    for (const playerId in game.state.players){
        const player = game.state.players[playerId]
        if(player === localPlayer){
            //context.fillStyle = '#F0DB4F'
            //context.fillRect(localPlayer.x, localPlayer.y, 60, 60)

            var image = document.getElementById("plyer_1");
            context.drawImage(image ,localPlayer.x * 60, localPlayer.y * 60, 60, 60)
        }else{
            /* context.fillStyle = 'blue'
            context.fillRect(player.x, player.y, 1, 1) */
            
            var image = document.getElementById("player_2");
            context.drawImage(image ,player.x * 60, player.y * 60, 60, 60)
        }
    }    
    requestAnimationFrame(() =>{
        renderScreen(screen, game, requestAnimationFrame, currenPlayerId)
    })
}