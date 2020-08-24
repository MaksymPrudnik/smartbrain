import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({ boxes, imageUrl }) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img alt='' id='inputImage' src={imageUrl} width='500px' height='auto' />
                {
                    boxes.map((box, i) => (
                    <div className='bounding-box' key={i} style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
                ))
                }
            </div>
        </div>
    )
}

export default FaceRecognition;