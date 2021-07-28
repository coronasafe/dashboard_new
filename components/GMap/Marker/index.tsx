import React, { Component } from "react";
import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
} from "../../../lib/common";

import {
  bedClasses,
  canShowBed,
  colorClasses,
  getColor,
} from "../../../utils/map";

interface MarkerProps {
  data: any;
  setFocus: (center: any, zoom: number) => void;
  lat: any;
  lng: any;
  selectedBedType: any;
  zoom: number;
}

interface PopUpProps {
  data: any;
}

const PopUp: React.FC<PopUpProps> = ({ data }) => {
  return (
    <div className="MapMarkerOverlay bg-white dark:bg-black shadow-2xl dark:text-white">
      <div className="text-xxs">
        <p className="mb-1 font-black ">{data.name}</p>
        <div>
          <div className="grid gap-4 grid-cols-3 mt-4">
            <div>
              <p className="font-semibold">Oxygen capacity</p>
              <p className="dark:text-gray-300">
                Current:{" "}
                <strong className="dark:text-white">
                  {data.oxygenCapacity}
                </strong>
              </p>
            </div>
            <div>
              <p className="font-semibold">Live Patients</p>
              <p className="dark:text-gray-300">
                Current:{" "}
                <strong className="dark:text-white">
                  {data.actualLivePatients}
                </strong>
              </p>
            </div>
            <div>
              <p className="font-semibold ">Discharged Patients</p>
              <p className="dark:text-gray-300">
                Current:{" "}
                <strong className="dark:text-white">
                  {data.actualDischargedPatients}
                </strong>
              </p>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-3 mt-4">
            {AVAILABILITY_TYPES_ORDERED.map((a) => {
              const current = data.capacity[a]?.current_capacity || 1;
              const total = data.capacity[a]?.total_capacity || 1;
              const used = ((current / total) * 100).toFixed(2);
              if (total == 1) {
                return;
              }
              return (
                <div key={a}>
                  <p className="font-semibold">{AVAILABILITY_TYPES[a]}</p>
                  {data.capacity[a]?.total_capacity ? (
                    <>
                      <p>
                        Current: <strong>{current}</strong>
                      </p>
                      <p>
                        Total: <strong>{total}</strong>
                      </p>
                      <p>
                        Used:{" "}
                        <strong
                          style={{
                            color: getColor({
                              ratio: current / total,
                            }),
                          }}
                        >
                          {used}%
                        </strong>
                      </p>
                    </>
                  ) : (
                    <p key={a}>Not available</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Marker: React.FC<MarkerProps> = (props) => {
  const [popUp, setPopUp] = React.useState(false);
  const { data, lat, lng, selectedBedType, setFocus, zoom } = props;
  const handleClick = () => {
    let center = { lat, lng };
    let zoom = 13;
    setFocus(center, zoom);
  };

  return (
    <div
      className="MarkerWrapper"
      onMouseLeave={(e) => setPopUp(false)}
      onClick={handleClick}
    >
      <div className="MapMarkerIcon" onMouseEnter={(e) => setPopUp(true)}>
        {canShowBed({
          capacity: data.capacity[selectedBedType],
          filter: selectedBedType,
        }) && (
          <div className={colorClasses(data.capacity[selectedBedType])}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="bed"
              role="img"
              className={
                colorClasses(data.capacity[selectedBedType]) + bedClasses(zoom)
              }
              viewBox="0 0 640 512"
            >
              <path
                fill="inherit"
                d="M176 256c44.11 0 80-35.89 80-80s-35.89-80-80-80-80 35.89-80 80 35.89 80 80 80zm352-128H304c-8.84 0-16 7.16-16 16v144H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v352c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16v-48h512v48c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V240c0-61.86-50.14-112-112-112z"
              />
            </svg>
          </div>
        )}
      </div>

      {popUp && <PopUp data={data} />}
    </div>
  );
};
