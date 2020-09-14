import React, { useState } from 'react'

import {ReactComponent as Caret} from '../icons/caret.svg'

import './header.scss'



export default function Header(props) {
    const {isDisabled, algorithms, clearAnimation, clearWall} = props

    const [mode, setMode] = useState(null)
    const [open, setOpen] = useState(false)

    window.onclick = function(event) {
        if(!(event.target.matches('.icon-button') || event.target.closest('.icon-button'))) {
            setOpen(false)
        }
    }
    
    return(
        <Navbar>
            <button className = "button" onClick = {algorithms[mode]}><ButtonText mode = {mode}/></button>
            <div onClick = {() => setOpen(!open)}>
                <NavItem icon = {<Caret />}>
                    {open && <DropdownMenu></DropdownMenu>}
                </NavItem>
            </div>
            <button className = "button reset" onClick = {() => clearAnimation()}>Reset</button>
            <button className = "button clearWall" onClick = {() => clearWall()}>Clear Wall</button>
        </Navbar>
    )
    function DropdownMenu(props){
        function DropdownItem(props) {
            return(
                <a href = "#" className="menu-item" onClick = {() => {setMode(props.mode); setOpen(false)}}>
                    {props.children}
                </a>
            )
        }

        return(
            <>
                <div className="dropdown">
                    <DropdownItem mode = {0}>Dijkstra's Algorithm</DropdownItem>
                    <DropdownItem mode = {1}>A* Algorithm</DropdownItem>
                </div>
            </>
            
        )
    }
}

function Navbar(props) {
    
    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                {props.children}
            </ul>
        </nav>
    );
}

function NavItem(props) {
    return (
        <li className= "nav-item">
            <a href = "#" className = "icon-button">
                {props.icon}
            </a>
            {props.children}
        </li>
    )
}

function ButtonText(props){
   
    if( props.mode == 0) {
        return (
            <p>
                Visualize Dijkstra's Algorithm
            </p>
        )
    }
    else if (props.mode == 1) {
        return (
            <p>
                Visualiza A* Algorithm
            </p>
        )
    }
    else {
        return (
            <p>Please choose an algorithm</p>
        )
    }
}