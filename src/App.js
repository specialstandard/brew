import React, { useEffect, useState } from 'react';
import './App.scss';
import axios from 'axios'

const API_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

function App() {

    const [result, setResult] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const handleSuccess = (response) => {
        console.log('response: ', response);
        setResult(response.data.result)
        setIsLoading(false)
        setError(false)
    }

    const handleError = (error) => {
        setError(error)
        setIsLoading(false)
    }

    useEffect(() => {
        const getResult = () => {
            axios.get(API_URL).then(response => {
                handleSuccess(response)

            })
            .catch(error => {
                handleError(error)

            })
        }
        getResult()
    }, [])

    return (
        <div className="App">
            {/* <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
        </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Earthquakes
        </a>
            </header> */}
        </div>
    );
}

export default App;
