import { useContext, useState, useEffect } from "react";
import { Card, CardBody, WindmillContext } from "@windmill/react-ui";
import GoogleMapReact from "google-map-react";
import Geosuggest from "react-geosuggest";
import { Marker } from "./Marker";

import {
  ACTIVATED_DISTRICTS,
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  GMAP_KEY,
} from "../../lib/common";
import { selectedButtonClasses } from "../../utils/map";
import { MapTheme } from "./theme";
import { ProcessFacilityDataReturnType } from "../../lib/common/processor";

interface GMapProps {
  district: typeof ACTIVATED_DISTRICTS[number];
  className?: string;
  facilities: ProcessFacilityDataReturnType;
}

const GMap: React.FC<GMapProps> = ({ district, facilities, className }) => {
  const [selectedBedType, setSelectedBedType] = useState("All");
  const { mode } = useContext(WindmillContext);

  let [state, setState] = useState({
    assets: [],
    showAddressSuggestion: false,
    center: {
      lat: district.lat,
      lng: district.lng,
    },
    zoom: district.zoom,
  });

  useEffect(() => {
    setState({
      ...state,
      center: {
        lat: district.lat,
        lng: district.lng,
      },
      zoom: district.zoom,
    });
  }, [district]);

  return (
    <div className={`${className} overflow-visible relative rounded-xl`}>
      <div className="rounded-lg overflow-hidden">
        <div className="main-content-container rounded-lg">
          <div className="rounded-xl" style={{ height: "75vh", width: "100%" }}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: GMAP_KEY,
              }}
              defaultCenter={{
                lat: 10.148_547_6,
                lng: 76.500_752_4,
              }}
              defaultZoom={8}
              center={state.center}
              zoom={state.zoom}
              options={{
                styles: MapTheme(mode),
              }}
            >
              {facilities
                .filter((f) => f.location)
                .map((f) => (
                  <Marker
                    key={f.id}
                    data={f}
                    lat={f.location?.latitude}
                    lng={f.location?.longitude}
                    // coordinates={Object.values(f.location).reverse()}
                    // group={0}
                    zoom={state.zoom}
                    selectedBedType={selectedBedType}
                    setFocus={(center, zoom) =>
                      setState((prev) => ({ ...prev, center, zoom }))
                    }
                  />
                ))}
            </GoogleMapReact>
          </div>
        </div>

        <div className="flex flex-col items-end dark:text-gray-400 text-gray-600 break-all text-xxxs sm:text-xs w-full">
          <span className="inline-flex space-x-1">
            <span>Legends: </span>
            {[
              { label: "Available", color: "#00FF00" },
              { label: "Full", color: "#FF0000" },
            ].map((x) => (
              <span key={x.label} style={{ color: x.color }}>
                {x.label}
              </span>
            ))}
          </span>
          <div className="grid gap-2 grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full">
            <button
              onClick={(_) => setSelectedBedType("All")}
              className={selectedButtonClasses(selectedBedType === "All")}
            >
              Show All
            </button>
            {AVAILABILITY_TYPES_ORDERED.filter(
              (key) => ![40, 50, 60, 70].includes(key)
            ).map((a) => (
              <button
                key={a}
                onClick={(_) => setSelectedBedType(a.toString())}
                className={selectedButtonClasses(
                  a.toString() === selectedBedType
                )}
              >
                {
                  AVAILABILITY_TYPES[
                    a as unknown as keyof typeof AVAILABILITY_TYPES
                  ]
                }
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GMap;
