import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DroneDetail from './DroneDetail';
import DroneList from './DroneList';
import AddDroneForm from './AddDroneForm';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<DroneList/>} />
        <Route path="/drone/:id" element={<DroneDetail/>} />
        <Route path="/add-drone" element={<AddDroneForm/>} />
      </Routes>
    </div>
  );
};

export default App;

