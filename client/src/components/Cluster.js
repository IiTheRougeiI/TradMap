import { MapLayer, withLeaflet } from "react-leaflet";
import L from "leaflet";

require("leaflet.markercluster");
require('leaflet.markercluster.freezable');

class MarkerClusterGroup extends MapLayer {

  createLeafletElement(props) {
    const el = new L.markerClusterGroup(props);
    this.contextValue = {
      ...props.leaflet,
      layerContainer: el
    };
    //el.maxClusterRadius(40);
    //el.freezeAtZoom(1);
    return el;
  }

}

export default withLeaflet(MarkerClusterGroup);
