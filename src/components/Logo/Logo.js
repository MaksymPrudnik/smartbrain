import React from 'react';
import Tilt from 'react-tilt'
import brain from './brain.png';
import './Logo.css'

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} >
               <div className="Tilt-inner f7">
                   <img alt='Brain' src={brain} width='100%'></img>
                   <a target="_blank" rel="noopener noreferrer" href="https://icons8.com/icons/set/brain">Brain icon</a> icon by <a target="_blank" rel="noopener noreferrer" href="https://icons8.com">Icons8</a>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo;