import React from 'react';

const Lap = (props) => {
    return(
        <li className='laptime'>
<span className="lap-detail"> Lap No:{props.id} Time: {props.children}</span>
        </li>
    )
     
}

export default Lap;