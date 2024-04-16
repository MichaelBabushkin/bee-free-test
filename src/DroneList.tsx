import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDrones, getDroneImage } from "./api/drones";

const DroneList = () => {
  interface Drone {
    drone_code: string;
    name: string;
    imageUrl?: string;
    imageBase64?: string;
    range: number;
    release_date: string;
  }

  const [drones, setDrones] = useState<Drone[]>([]);
  console.log(drones);

  useEffect(() => {
    const localDrones = JSON.parse(localStorage.getItem("drones") || "[]");

    getAllDrones()
      .then((response) => {
        const apiDrones = response.data;
        const combinedDrones = mergeDrones(localDrones, apiDrones);
        setDrones(combinedDrones);
        combinedDrones.forEach((drone) => {
          fetchAndCacheImage(drone.drone_code);
        });
      })
      .catch((error) => {
        console.error("Fetching drones from API failed:", error);
        setDrones(localDrones);
        localDrones.forEach((drone:Drone) => {
          fetchAndCacheImage(drone.drone_code);
        });
      });
  }, []);

  const fetchAndCacheImage = async (droneCode: string) => {
    const cache = await caches.open("drone-images");
    const cacheKey = `images/${droneCode}`;
    const fromCache = await cache.match(cacheKey);

    if (fromCache) {
      const imageUrl = URL.createObjectURL(await fromCache.blob());

      updateDroneImage(droneCode, imageUrl);
    } else {
      getDroneImage(droneCode)
        .then((response) => {
          const blob = response.data;
          return blob;
        })
        .then((blob) => {
          const imageUrl = URL.createObjectURL(blob);
          cache.put(cacheKey, new Response(blob));
          updateDroneImage(droneCode, imageUrl);
        })
        .catch((error) => console.error("Fetching image failed:", error));
    }
  };

  const updateDroneImage = (droneCode: string, imageUrl: string) => {
    setDrones((prevDrones) =>
      prevDrones.map((drone) =>
        drone.drone_code === droneCode ? { ...drone, imageUrl } : drone
      )
    );
  };

  const mergeDrones = (localDrones: any[], apiDrones: any[]) => {
    const combined = [...localDrones];
    const localCodes = new Set(localDrones.map((drone) => drone.drone_code));

    apiDrones.forEach((drone) => {
      if (!localCodes.has(drone.drone_code)) {
        combined.push(drone);
      }
    });

    return combined;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className=" text-center text-xl font-semibold text-gray-800 leading-tight my-6">
        Drones List
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {drones.map((drone) => (
          <Link
            to={`/drone/${drone.drone_code}`}
            key={drone.drone_code}
            className="block"
          >
            <div className=" text-center bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between leading-normal h-full">
              <h5 className="text-gray-900 font-bold text-lg mb-2">
                {drone.name}
              </h5>
              {drone.imageUrl && (
                <img
                  src={drone.imageUrl}
                  alt={drone.name}
                  className="w-full h-auto mb-4"
                />
              )}
              {drone.imageBase64 && (
                <img
                  src={drone.imageBase64}
                  alt={drone.name}
                  className="w-full h-auto mb-4"
                />
              )}

              <p className="text-gray-700 text-base">
                Code: {drone.drone_code} <br />
                Range: {drone.range} km <br />
                Released: {new Date(drone.release_date).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DroneList;
