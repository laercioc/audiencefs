import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './global.css';

import RadiosList from './radios';

import Header from './components/Header';
import Ranking from './components/Ranking';

function App() {
    const [radios, setRadios] = useState([]);


    const RadiosUpdate = async () => {
        console.log('Atualizando...')
        let currentState = [...radios];

        await RadiosList.map(async(item) => {
            let thisRadioIndex = currentState.findIndex(radios => radios.radio === item.radio)
            console.log(thisRadioIndex)

            const response = await axios.get('http://localhost:3001', {
                params: {
                    url: item.stream,
                    type: item.type
                }
            })

            currentState[thisRadioIndex] = {
                radio: item.radio,
                imagem: item.imagem,
                ouvintes: response.data.ouvintes,
                locutor: response.data.locutor,
                programa: response.data.programa,    
            }
        })

        clearInterval(Interval)
        setRadios(currentState)
    }

    const Interval = setInterval(RadiosUpdate, 8000)

    useEffect(() => {
        console.log('Iniciando status...')

        RadiosList.map(async (item) => {

            const response = await axios.get('http://localhost:3001', {
                params: {
                    url: item.stream,
                    type: item.type
                }
            })
            
            setRadios((prev) => [{
                radio: item.radio,
                imagem: item.imagem,
                ouvintes: response.data.ouvintes,
                locutor: response.data.locutor,
                programa: response.data.programa,    
            }, ...prev])
        })
    }, [])

    return (
        <div className="container">
            <Header />

            <ol type="1" className="based-ranking">
                {
                    radios
                    .sort((a, b) => a.ouvintes < b.ouvintes ? 1 : -1)
                    .map((item, i) => (
                        <Ranking 
                            key={i} 
                            fs={item.radio} 
                            ouv={item.ouvintes} 
                            locutor={item.locutor} 
                            programa={item.programa} 
                            img={item.imagem}
                        />
                    ))
                }
            </ol>
        </div>
    );
}

export default App;