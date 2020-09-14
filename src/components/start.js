import React from 'react'
import greenFlag from '../icons/green_flag.svg'

import "./header.scss"

export default function Start(props) {
    return (
        <div draggable>
            <img className = "flags" src={greenFlag} />
        </div>
    )
}