import React from 'react';
import ReactDOM from 'react-dom';

import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";


import "leaflet/dist/leaflet.js";
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.js";



import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
