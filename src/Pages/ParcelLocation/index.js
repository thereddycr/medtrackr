import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import "./ParcelLocation.css";
const ParcelLocation = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyB_8l1rGZiSzib2JEkttDZajdLXvN8OsUk"
  });
  const center = useMemo(() => ({ lat: 51.4761548, lng: -0.391909 }), []);

  return (

    <div className="main-wrapper">
      <div className="container-fluid">
        <div className="card custom-card d-flex align-items-center justify-content-center">
          <div className="App1 d-flex align-items-center justify-content-center" >
            {!isLoaded ? (
              <h1>Loading...</h1>
            ) : (
              <GoogleMap
                mapContainerClassName="map-container"
                center={center}
                zoom={16}
              >
                <Marker position={{ lat: 51.4761548, lng: -0.391909 }} />
              </GoogleMap>
            )}
          </div>
        </div>
      </div>
    </div>
   
  );
};

export default ParcelLocation;
