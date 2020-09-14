//A* algorithm implementation in JS

export function aStarAlgorithm(grid, start, finish) {
    const visited = []

    start.distance = 0                                  //note that A star algorithm resources commonly use "f" instead of "distance", distance = g+h
    const unvisited = singleArrayGrid(grid)

    while(!!unvisited.length) {
        sortNodesByf(unvisited)
        const closestNode = unvisited.shift()

        if(closestNode.isWall) continue;

        if(closestNode.distance === Infinity) return visited;

        closestNode.isVisited = true;
        visited.push(closestNode)

        if(closestNode == finish) return visited
        
        updateUnvisitedNeighbours(closestNode, grid, finish);
    }
}

export function getPathAStar(finish) {
    const path = []
    let currentNode = finish

    while (currentNode != null) {
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

function sortNodesByf(array) {
    array.sort((a, b) => a.distance - b.distance)
}

function updateUnvisitedNeighbours(node, grid, finish) {
    const unvisitedNeighbours = getUnvisitedNeighbours(node, grid)
    console.log(unvisitedNeighbours)

    for(let neighbour of unvisitedNeighbours) {
        neighbour.g = node.g +1
        var h = Math.abs(Math.sqrt(Math.pow(finish.row - node.row, 2) + Math.pow(finish.col - node.col, 2)))
        neighbour.distance = neighbour.g + h
        neighbour.previousNode = node
    }
}

function getUnvisitedNeighbours(node, grid) {
    const neighbours = []

    const {col, row} = node

    if(row>0) neighbours.push(grid[col][row-1])
    if(row<grid[0].length-1) neighbours.push(grid[col][row+1])
    if(col>0) neighbours.push(grid[col-1][row])
    if(col<grid.length -1) neighbours.push(grid[col+1][row])

    return neighbours.filter(node => !node.isVisited)
}