import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './global.css';

import RadiosList from './radios';

import Header from './components/Header';
import Ranking from './components/Ranking';

function App() {
    const [radios, setRadios] = useState([]);

    useEffect(() => {
        console.log('Iniciando status...');

        RadiosList.map(async (item) => {

            const response = await axios.get('http://localhost:3001', {
                params: {
                    url: item.stream,
                    type: item.type
                }
            });
            
            console.log(response.data);
        });
    }, []);

    return (
        <div className="container">
            <Header />

            <ol type="1" className="based-ranking">
                {
                    RadiosList.map(item => (
                        <Ranking key={item.radio} fs={item.radio} ouv="0" img={item.imagem}/>
                    ))
                }
            </ol>
        </div>
    );
}

export default App;