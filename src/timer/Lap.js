import React from 'react';

const Lap = (props) => {
    return(
        
        <li className='laptime'>Time: {props.children}</li>
        
    )
     
}

export default Lap;