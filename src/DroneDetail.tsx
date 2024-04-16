import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDroneById, getDroneImage } from "./api/drones";
import Loader from "./Loader";

const DroneDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [drone, setDrone] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getDroneById(id || "")
      .then((response) => {
        setDrone(response.data);
        fetchDroneImage(response.data.drone_code);
      })
      .catch((error) => {
        console.error("Fetching drone details failed:", error);
        setError("Failed to fetch drone details.");
      });
  }, [id]);

  const fetchDroneImage = (droneCode: string) => {
    getDroneImage(droneCode)
      .then((response) => {
        const blob = response.data;
        const imageUrl = URL.createObjectURL(blob);
        setImageUrl(imageUrl);
      })
      .catch((error) => {
        console.error("Fetching image failed:", error);
        setError("Failed to load drone image.");
      });
  };

  if (error)
    return (
      <div className="text-red-500 text-center font-medium mt-10">{error}</div>
    );

  if (!drone) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-5">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {drone.name}
          </h3>
          {imageUrl && (
            <img src={imageUrl} alt={drone.name} className="w-full h-auto" />
          )}

          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Drone details and specifications.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Drone Code</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {drone.drone_code}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Range</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {drone.range} km
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Release Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(drone.release_date).toLocaleDateString()}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Cameras</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc pl-5 space-y-2">
                  {drone.cameras.map((camera: any) => (
                    <li key={camera.name}>
                      <p className="text-sm text-gray-600">
                        {camera.name} - {camera.megapixels} Megapixels (
                        {camera.type})
                      </p>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default DroneDetail;
