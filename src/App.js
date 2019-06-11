import React, { useEffect, useState } from 'react';
import { Chart } from "react-charts";
import './App.scss';
import axios from 'axios'
import moment from 'moment'

import { loadOptions } from '@babel/core';

const API_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

function App() {

    const [allFeatures, setAllFeatures] = useState([])
    const [filteredFeatures, setFilteredFeatures] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [hours, setHours] = useState(24)

    useEffect(() => {
        const calculateTopQuakes = () => {
            const now = moment()

            const filteredFeaturesSorted = allFeatures.filter((feature) => (
                now.diff(moment(feature.properties.time), 'h') < hours
            )).slice(0, 10)

            console.log('filteredFeaturesSorted: ', filteredFeaturesSorted)
            // console.log('filteredFeaturesSorted: ', filteredFeaturesSorted.);
            setFilteredFeatures(filteredFeaturesSorted)
            // console.log('result: ', result);
            setIsLoading(false)
        }
        calculateTopQuakes()
    }, [hours, allFeatures])

    useEffect(() => {
        const getResult = () => {
            return axios.get(API_URL).then(response => {
                const sortedFeatures = response.data.features.sort((a, b) => b.properties.mag - a.properties.mag)
                console.log('sortedFeatures: ', sortedFeatures);
                setAllFeatures(sortedFeatures)
                // setIsLoading(false)
                setError(false)

            })
            .catch(error => {
                setError(error)
                setIsLoading(false)

            })
        }
        getResult()
    }, [])

    const handleChange = (event) => {
        console.log('value: ', event.target.value);
        setHours(event.target.value)
    };

    if(isLoading) {
        return <div>Loading...</div>
    } else {
        return (
            <div className="App">

                <select value={hours} onChange={handleChange}>
                    {/* <option>Select Hours</option> */}
                    <option value="12">12 Hours</option>
                    <option value="24">24 Hours</option>
                </select>
                <div>{filteredFeatures && filteredFeatures.map((feature) =>(
                    <>
                        <div className="magnitude">{feature.properties.mag}</div>
                        <div className="place">{feature.properties.place}</div>
                    </>

                ))}</div>

                    <div
                        style={{
                        width: "400px",
                        height: "300px"
                        }}
                    >
                        <Chart
                        data={[
                            {
                            label: "Series 1",
                            data: filteredFeatures.map((item, i) => [i, item.properties.mag])
                            },

                        ]}
                        axes={[
                            { primary: true, type: "linear", position: "bottom" },
                            { type: "linear", position: "left" }
                        ]}
                        />
                    </div>

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

}

export default App;
