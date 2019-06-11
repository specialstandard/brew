import React, { useEffect, useState } from 'react';
import { Chart } from "react-charts";
import './App.scss';
import axios from 'axios'
import moment from 'moment'

const API_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

function App() {

    const [allFeatures, setAllFeatures] = useState([])
    const [filteredFeatures, setFilteredFeatures] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [hours, setHours] = useState(24)

    // Initial API Query
    useEffect(() => {
        const getResult = () => {
            return axios.get(API_URL).then(response => {
                const sortedFeatures = response.data.features.sort((a, b) => b.properties.mag - a.properties.mag)
                setAllFeatures(sortedFeatures)
                setError(false)

            })
            .catch(error => {
                setError(error)
                setIsLoading(false)

            })
        }
        getResult()
    }, [])

    // Calculate top 10 quakes when hours or featurs change
    useEffect(() => {
        const calculateTopQuakes = () => {
            const now = moment()
            const filteredFeaturesSorted = allFeatures.filter((feature) => (
                now.diff(moment(feature.properties.time), 'h') < hours
            )).slice(0, 10)
            setFilteredFeatures(filteredFeaturesSorted)
            setIsLoading(false)
        }
        calculateTopQuakes()
    }, [hours, allFeatures])

    // Hours select change handler
    const handleChange = (event) => {
        setHours(event.target.value)
    };

    if(isLoading) {
        // if Loading show loading message
        return <div>Loading...</div>
    } else if (error) {
        // if error show error message
        return <div>Error {error}</div>
    } else {
        return (
            <div className="App">
                <h1>Top 10 Earthquake Magnitudes</h1>
                <select data-testid="hoursValue" className="select" value={hours} onChange={handleChange}>
                    <option value="12">The Last 12 Hours</option>
                    <option value="24">The Last 24 Hours</option>
                </select>

                {/* Magnitudes and Places */}
                <div className="earthquake-list">{filteredFeatures && filteredFeatures.map((feature) =>(
                    <div className="features-container">
                        <div className="magnitude">{feature.properties.mag}</div>
                        <div className="place">{feature.properties.place}</div>
                    </div>
                ))}
                </div>

                {/* Chart of Earthquake Magnitudes */}
                <div className="chart-container">
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
            </div>
        );
    }
}

export default App;
