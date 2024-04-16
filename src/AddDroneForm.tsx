import React, { useState } from "react";

interface DroneData {
  drone_code: string;
  name: string;
  range: number | string;
  release_date: string;
  imageBase64: string | null;
}

const AddDroneForm = () => {
  const [drone, setDrone] = useState<DroneData>({
    drone_code: "",
    name: "",
    range: 0,
    release_date: "",
    imageBase64: null,
  });
  const [errors, setErrors] = useState<Partial<DroneData>>({});

  const validateForm = () => {
    const newErrors: Partial<DroneData> = {};
    if (!drone.drone_code.trim())
      newErrors.drone_code = "Drone code is required";
    if (!drone.name.trim()) newErrors.name = "Drone name is required";
    if (Number(drone.range) <= 0)
      newErrors.range = "Range must be greater than 0";
    if (!drone.release_date.trim())
      newErrors.release_date = "Release date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrone({
      ...drone,
      [e.target.name]:
        e.target.type === "number"
          ? parseFloat(e.target.value) || 0
          : e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files ? e.target.files[0] : null;

    reader.onloadend = () => {
      setDrone({
        ...drone,
        imageBase64: reader.result as string,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Submitting", drone);

      // Retrieve existing drones from local storage
      const existingDrones = JSON.parse(localStorage.getItem("drones") || "[]");

      // Add new drone to the array
      existingDrones.push(drone);

      // Save updated drones array back to local storage
      localStorage.setItem("drones", JSON.stringify(existingDrones));

      // Reset form after successful submission
      setDrone({
        drone_code: "",
        name: "",
        range: 0,
        release_date: "",
        imageBase64: null,
      });

      alert("Drone added successfully!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="drone_code"
          >
            Drone Code
          </label>
          <input
            type="text"
            name="drone_code"
            value={drone.drone_code}
            onChange={handleChange}
            placeholder="Enter drone code"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.drone_code && (
            <p className="text-red-500 text-xs italic">{errors.drone_code}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={drone.name}
            onChange={handleChange}
            placeholder="Enter drone name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic">{errors.name}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="range"
          >
            Range (km)
          </label>
          <input
            type="number"
            name="range"
            value={drone.range}
            onChange={handleChange}
            placeholder="Enter range"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.range && (
            <p className="text-red-500 text-xs italic">{errors.range}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="release_date"
          >
            Release Date
          </label>
          <input
            type="date"
            name="release_date"
            value={drone.release_date}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.release_date && (
            <p className="text-red-500 text-xs italic">{errors.release_date}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="image"
          >
            Drone Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />

        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Drone
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDroneForm;
