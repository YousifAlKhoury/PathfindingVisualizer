import React, { Component, useState } from 'react';
import Start from '../../components/start'
import Finish from '../../components/finish'
import { state } from '../../components/state'
import './Node.scss';

import { changeStart, changeFinish } from '../PathfindingVisualizer'

export default function Node(props) {

    const {row, col, onMouseDown, onMouseEnter, onMouseUp } = props

    let { isStart, isFinish, isWall } = props

    const [start, setStart] = useState(isStart);
    const [finish, setFinish] = useState(isFinish);

   

    if(isStart || isFinish && isWall) {
        isWall = false;
    }
    
    const extraClass =
    isStart? '':
    isFinish? '':
    isWall? 'node-wall':
    '';

    const onDragOver = (e) => {
        e.preventDefault();
    }

    const onDrop= (row, col) => {
        if(state()) {
            changeStart(row, col);
            setStart(true)
            isStart = true
        }
        else{
            changeFinish (row,col);
            setFinish(true)
            isFinish = true
        }
    }

    const onDragStart = () => {
        if (start) {
            state(true);
        }
        else {
            state(false);
        }
    }   
    
    const onDragEnd = (e) => {
        
        if(!!row) {
            if (start) {
                setStart(false)
            }
            else {
                setFinish(false)
            }
        }
    }

    
    return (
    <div className = {`node ${extraClass}`}
        id = {`node-${row}-${col}`}
        onMouseDown = {() => onMouseDown(row, col)}
        onMouseUp = {() => onMouseUp()}
        onMouseEnter = {() => onMouseEnter(row, col)}
        onDragStart = {() => onDragStart()}
        onDragEnd = {(e) => onDragEnd(e)}
        onDragOver={(e)=>onDragOver(e)}
        onDrop = {() => {onDrop(row, col)}}
    >
        {start && <Start />}
        
        {finish && <Finish />}
    </div>
    )
    
}

