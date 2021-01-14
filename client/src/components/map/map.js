
// The source code for the map 
// component and search was retrieved from 
// https://github.com/leighhalliday/google-maps-react-2020/ 
// and later modified

import React, { useState, useContext, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow} from "@react-google-maps/api"
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { Form } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";


const libraries = ["places"]
const options = {
    disableDefaultUI: true,
    zoomControl: true,
}

const containerStyle = {
    height: "50vh",
    width: "50vw"
  };
const center = {
    lat: 43.6532,
    lng: -79.3832,
}

function Map({setLocation}) {
    const [marker, setMarker] = useState('');
    
    const onMapClick = useCallback((event)=>{
        setMarker({lat: event.latLng.lat(), lng: event.latLng.lng()})
        setLocation({lat: event.latLng.lat(), lng: event.latLng.lng()})
    })

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, [])

    const panTo = useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
    }, [])

    return(
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
            <Search panTo={panTo} />
            <GoogleMap
            id="map"
            mapContainerStyle={containerStyle}
            zoom={8}
            center={center}
            options={options}
            onClick={onMapClick}
            onLoad={onMapLoad}
            >
                <Marker 
                key={`${marker.lat}-${marker.lat}`} 
                position={{ lat: marker.lat, lng: marker.lng }}
                />
            </GoogleMap>
        </LoadScript>
        
    )
}

function Search({ panTo }) {
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        location: { lat: () => 43.6532, lng: () => -79.3832 },
        radius: 100 * 1000,
      },
    });
  
    const handleInput = (e) => {
      setValue(e.target.value);
    };
  
    const handleSelect = async (address) => {
      setValue(address, false);
      clearSuggestions();
  
      try {
        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        panTo({ lat, lng });
      } catch (error) {
        console.log("😱 Error: ", error);
      }
    };
  
    return (
        <Combobox onSelect={handleSelect}>
        <ComboboxInput
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder="Search your location"
            className="form-control my-2"
        />
            <ComboboxPopover>
            <ComboboxList>
                {status === "OK" &&
                data.map(({ id, description }) => (
                    <ComboboxOption key={id} value={description} />
                ))}
            </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
}

export default Map