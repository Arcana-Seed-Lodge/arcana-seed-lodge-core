
import "./App.css";
import BitcoinWallet from "./BitcoinWallet";
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
// import * as mapStyle from './osm-bright.json';

export default function App() {

  return (
    <>
      <BitcoinWallet />
      <Map
        initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14
      }}
      style={{width: '100vw', height: '50vh'}}
      mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
    />
    </>
  );
}