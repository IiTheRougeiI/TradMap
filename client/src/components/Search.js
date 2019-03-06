import { withLeaflet, MapControl } from "react-leaflet";
import L from "leaflet";
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.js";
import * as ELG from "esri-leaflet-geocoder";

class Search extends MapControl {
  createLeafletElement(props) {
    return new ELG.Geosearch();
  }

  componentDidMount() {
    const { map } = this.props.leaflet;
    const searchControl = this.leafletElement;

    const results = new L.LayerGroup().addTo(map);

    searchControl
      .on("results", function(data) {
        results.clearLayers();
        for (let i = data.results.length - 1; i >= 0; i--) {
          results.addLayer(L.marker(data.results[i].latlng));
        }
      })
      .addTo(map);
  }
}

export default withLeaflet(Search);
