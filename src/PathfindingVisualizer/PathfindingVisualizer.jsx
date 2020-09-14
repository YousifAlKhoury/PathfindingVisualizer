import React, { Component } from 'react'
import Node from './Node/Node'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './PathfindingVisualizer.scss'
import { render } from '@testing-library/react'
import { dijkstraAlgorithm, getPathDijkstra } from '../algorithms/dijkstra'
import { aStarAlgorithm, getPathAStar } from '../algorithms/aStar'

import Header from '../components/header'

var startRow = 10
var startCol = 10

var finishRow = 10
var finishCol = 40

var animate = [];
var temp;
var stopBool = false;


export default class PathfindingVisualizer extends Component {
    constructor(props){
        super(props)
        this.state = {
            grid: [],
            mouseIsPressed: false,
            isDisabled: false
        }
        this.visitedNodesInOrder = []
    }

    handleMouseDown(row, col) {
        if((row == startRow && col == startCol)||(row == finishRow && col == finishCol)) return;      
        this.setState({grid: updateGrid(row, col, this.state.grid), mouseIsPressed: true})
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false})
        
    }

    handleMouseEnter(row, col) {
        if((row == startRow && col == startCol)||(row == finishRow && col == finishCol)) return;
        if(this.state.mouseIsPressed == false) return;
        
        this.setState({grid: updateGrid(row, col, this.state.grid)})
    }

    componentDidMount () {
        const grid = createGrid();

        this.setState({grid: grid})
    }

    animation(visitedNodesInOrder, pathNodes){
        for(let i = 0; i<=visitedNodesInOrder.length; i++) {
            if(visitedNodesInOrder.length === i) {
                setTimeout(() => {
                    this.pathAnimation(pathNodes)
                }, 10*i)
                return;
            }

            else{
            temp = setTimeout(() => {
                    const node = visitedNodesInOrder[i]

                    if(!((node.row==finishRow && node.col == finishCol) || (node.row==startRow && node.col == startCol))) {
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited'
                    }
                }, 10*i)
                animate.push(temp)
            }
        }
   
    }

    pathAnimation(pathNodes) {
        if(stopBool) {
            stopBool = false;
            return;
        }
        else{
            for(let i = 0; i<pathNodes.length; i++) {
                temp = setTimeout(() => {
                    const node = pathNodes[i]

                    if (!((node.row==finishRow && node.col == finishCol) || (node.row==startRow && node.col == startCol))){
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-path'
                    }
                }, 50*i)
                animate.push(temp)
            }
        }
    }

    visualizeDijkstraAlgorithm(){
        this.setState({isDisabled: true})
        console.log(this.state.isDisabled)
        const {grid} = this.state;
        const start = grid[startCol][startRow]
        const finish = grid[finishCol][finishRow]
        
        this.visitedNodesInOrder = dijkstraAlgorithm(grid, start, finish)

        const pathNodes = getPathDijkstra(finish)
        
        stopBool = false
        this.animation(this.visitedNodesInOrder, pathNodes)
        this.clearSettings()
    }

    visualizeAStarAlgorithm(){
        this.setState({isDisabled: true})
        const {grid} = this.state;
        const start = grid[startCol][startRow]
        const finish = grid[finishCol][finishRow]
        
        this.visitedNodesInOrder = aStarAlgorithm(grid, start, finish)
        console.log(this.visitedNodesInOrder)

        const pathNodes = getPathAStar(finish)
        
        stopBool = false
        this.animation(this.visitedNodesInOrder, pathNodes)
        this.clearSettings()
    }
  
    clearAnimation() {
        this.setState({isDisabled: false})
        if(this.visitedNodesInOrder.length == 0) return;
        else {
            this.stop();
            for(let i = 0; i< this.visitedNodesInOrder.length; i++) {
                setTimeout(() => {
                    const node = this.visitedNodesInOrder[i]
                    
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node'
                }, 0.1)
            }
        }
    }
    
    clearWall() {
        for(let col = 0; col<50; col++) {
            for(let row = 0; row< 25; row++) {
                if(this.state.grid[col][row].isWall) {
                    updateGrid(row, col, this.state.grid);
                    document.getElementById(`node-${row}-${col}`).className = 'node'
                }
            }
        }
    }

    stop() {
        stopBool = true
        for(let i = 0; i < animate.length; i++) {
            clearTimeout(animate[i]);
        }
    }

    clearSettings() {
        this.setState({isDisabled: false})
        for (let node of this.visitedNodesInOrder) {
            node.isVisited = false
            node.previousNode = null
            node.distance = Infinity
            node.g = 0
        }
    }
  
    render() {
        
        const {grid, mouseIsPressed} = this.state
        const algorithms = [() => this.visualizeDijkstraAlgorithm(), () => this.visualizeAStarAlgorithm(),]

        return (
            <DndProvider backend={HTML5Backend}>
                <Header isDisabled = {this.state.isDisabled} clearAnimation = {() => this.clearAnimation()} clearWall = {() => this.clearWall()} algorithms = {algorithms}></Header>
                <div className= "container">
                    <div className= "grid">
                        {grid.map((col, colIDX) => 
                        <div  key={colIDX}>
                            {col.map((node, nodeIDX) => {
                                const {isStart, isFinish, isWall} = node
                                return (
                                    <Node className="cell"
                                        key={nodeIDX}
                                        row={nodeIDX}
                                        col={colIDX} 
                                        isStart ={isStart}
                                        isFinish= {isFinish}
                                        isWall = {isWall}
                                        mouseIsPressed = {mouseIsPressed}
                                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                        onMouseUp={() => this.handleMouseUp()}
                                    >   
                                    </Node> 
                                )
                                }
                            )}
                        </div>)}
                    </div>
                </div>
            </DndProvider>
        )
    }
}

const createGrid = () => {
    const grid = []
    for(let col = 0; col<50; col++) {
        const currentCol = []
        for(let row = 0; row< 25; row++) {
            currentCol.push(createNode(row, col, false))
        }
        grid.push(currentCol)
    }
    return grid;
}

const createNode = (row, col) => {
    return (
        {
            row: row,
            col: col,
            isStart: row==startRow && col == startCol,
            isFinish: row==finishRow && col == finishCol,
            isWall: false,
            isVisited: false,
            previousNode: null,
            distance: Infinity,
            g: 0,
        }
    )
}

const updateGrid = (row, col, grid) => {
    const newGrid = grid.slice();
    const node = newGrid[col][row];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[col][row] = newNode;
    return newGrid;
};

export function changeStart (row, col) {
    
    startRow = row;
    startCol = col;
}

export function changeFinish (row, col) {

    finishRow = row;
    finishCol = col;
}