import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import FlyToLocation from './FlyToLocation'
import 'leaflet/dist/leaflet.css';
import './App.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default function App() {
  const [ip, setIp] = useState("");
  const [position, setPosition] = useState([51.505, -0.09])
  const [alpha2code, setAlpha2code] = useState("")
  const [countries, setCountries] = useState([])
  const [currentCountry, setCurrentCountry] = useState("")

  const getGeoData = () => {
    try {
      fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_GEO_IPIFY_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          setIp(data.ip);
          setPosition([data.location.lat, data.location.lng]);
          setAlpha2code(data.location.country);
          console.log("GEO DATA: ", data);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const getCountryData = () => {
    try {
      fetch(`https://restcountries.com/v3.1/alpha/${alpha2code}`)
      .then((res) => res.json()
      .then((data) => setCurrentCountry(data[0]) || console.log("COUNTRIES", data[0]))
    );
    } catch (err) {
      console.error(err);
      }
  };

  useEffect(() => {
    getGeoData();
  }, []);

  useEffect(() => {
    alpha2code && getCountryData();
  }, [alpha2code]);

  
  return (
    <div className="App">
      <h2>Your IP Address is {ip}</h2>
      <h2>Your Country is {currentCountry.name?.common}</h2>
      <h2>Your Country Flag is {currentCountry.flag} </h2>
      <h2>Your Country Capital is {currentCountry.capital}</h2>
      <h2>Your Country Region is {currentCountry.region}</h2>
      <h2>Your Country Subregion is {currentCountry.subregion}</h2>
      <div id="map">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height:"400px",margin:'auto', width:'60%'
            }}
        >
        <FlyToLocation position={position}/>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}