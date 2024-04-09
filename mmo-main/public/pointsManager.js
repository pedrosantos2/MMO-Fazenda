export default function pointsController(document) {
    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId
    }
    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function sortRank(rank) {
        // Extrair os pares chave-valor do objeto para um array de objetos
        const rankArray = Object.entries(rank).map(([key, value]) => ({ key, value }));

        // Implementar o Bubble Sort para ordenar o array de objetos com base nos pontos
        const len = rankArray.length;
        let swapped;

        do {
            swapped = false;
            for (let i = 0; i < len - 1; i++) {
                if (rankArray[i].value.points < rankArray[i + 1].value.points) {
                    // Troca os elementos
                    let temp = rankArray[i];
                    rankArray[i] = rankArray[i + 1];
                    rankArray[i + 1] = temp;
                    swapped = true;
                }
            }
        } while (swapped);

        // Reconstruir o objeto ordenado
        const sortedRank = {};
        for (const { key, value } of rankArray) {
            sortedRank[key] = value;
        }

        return sortedRank;
    }

    function updatePoints(command, playerName) {
        console.log(command)

        let rank_list = document.getElementById('rank_list')
        let localPlayer = document.getElementById('localPlayer')

        let lista = command.rank
        lista = sortRank(lista)

        rank_list.innerHTML = ""
        localPlayer.innerHTML = ""
        localPlayer.classList.remove("f_place")
        localPlayer.classList.remove("s_place")
        localPlayer.classList.remove("t_place")
        localPlayer.classList.remove("n_place")
        //localPlayer.classList.add("element")
        let rank = 1
        for (var prop in lista) {
            let li = document.createElement('li')
            li.textContent = prop + ": " + lista[prop].points
            if(rank === 1){
                li.classList.add("f_place")
                if(prop === playerName){
                    localPlayer.classList.add("f_place")
                }
            }else if(rank === 2){
                li.classList.add("s_place")
                if(prop === playerName){
                    localPlayer.classList.add("s_place")
                }
            }else if(rank === 3){
                li.classList.add("t_place")
                if(prop === playerName){
                    localPlayer.classList.add("t_place")
                }
            }else{
                li.classList.add("n_place")
                if(prop === playerName){
                    localPlayer.classList.add("n_place")
                }
            }


            if(prop === playerName){
                let p = document.createElement('p')
                p.textContent = playerName + ": " + lista[prop].points
                localPlayer.appendChild(p)
                console.log("Name: ", prop)
            }
            rank_list.appendChild(li)
            rank++
        }
    }

    return { subscribe, registerPlayerId, updatePoints }
}