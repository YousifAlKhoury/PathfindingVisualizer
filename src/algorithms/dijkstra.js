// Dijkstra Algorithm implementation in JS

export function dijkstraAlgorithm (grid, start, finish) {
    const visited = []

    start.distance= 0
    const unvisited = singleArrayGrid(grid)

    while (!!unvisited.length) {
        sortNodesByDistance(unvisited)
        const closestNode = unvisited.shift()

        if(closestNode.isWall) continue;

        if(closestNode.distance === Infinity) return visited;

        closestNode.isVisited = true
        visited.push(closestNode)

        if(closestNode === finish) return visited;

        updateUnvisitedNeighbours(closestNode, grid)
    }
}

export function getPathDijkstra(finish){
    const path = []
    let currentNode = finish

    while(currentNode !== null) {
        path.unshift(currentNode)

        currentNode = currentNode.previousNode
    }
    return path
}

function singleArrayGrid(grid) {
    const nodes = []

    for(let col of grid) {
        for(let node of col) {
            nodes.push(node)
        }
    }

    return nodes
}

function sortNodesByDistance(array) {
    array.sort((a, b) => a.distance - b.distance)
}

function updateUnvisitedNeighbours(node, grid) {
    const unvisitedNeighbours = getUnvisitedNeighbours(node, grid)

    for(let neighbour of unvisitedNeighbours) {
        neighbour.distance = node.distance +1
        neighbour.previousNode = node
    }
}

function getUnvisitedNeighbours(node, grid) {
    const neighbours= []

    const {col, row} = node

    if(row>0) neighbours.push(grid[col][row-1])
    if(row<grid[0].length-1) neighbours.push(grid[col][row+1])
    if(col>0) neighbours.push(grid[col-1][row])
    if(col<grid.length -1) neighbours.push(grid[col+1][row])

    return neighbours.filter(node => !node.isVisited)
}