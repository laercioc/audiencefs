import React from 'react';

import './styles.css';

function Ranking(props) {
    return ( 
        <li className="ranking">
            <div className="based-t">
                <div className="name">{props.fs}</div>
                <div className="number">{props.ouv} {props.ouv === '1' ? 'ouvinte' : 'ouvintes'}</div>
            </div>
                
            <div className="img" style={{backgroundImage: `url(${props.img})`}}></div>

            <div className="additional-info">
                <div className="loc">{props.locutor}</div>
                <div className="prog">{props.programa}</div>
            </div>
        </li>
    );
}

export default Ranking;