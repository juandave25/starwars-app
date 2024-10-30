/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";

export default function StarshipList({ onLogout }) {
  const [starships, setStarships] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchManufacturers();
    fetchStarships();
  }, [fetchManufacturers, fetchStarships]);

  useEffect(() => {
    fetchStarships();
  }, [fetchStarships, selectedManufacturer]);

  const fetchManufacturers = async () => {
    try {
      const response = await fetch(
        "https://localhost:5283/api/starships/manufacturers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          onLogout();
          return;
        }
        throw new Error("Failed to fetch manufacturers");
      }

      const data = await response.json();
      setManufacturers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStarships = async () => {
    setIsLoading(true);
    try {
      const url = selectedManufacturer
        ? `https://localhost:5283/api/starships?manufacturer=${encodeURIComponent(
            selectedManufacturer
          )}`
        : "https://localhost:5283/api/starships";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          onLogout();
          return;
        }
        throw new Error("Failed to fetch starships");
      }

      const data = await response.json();
      setStarships(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Star Wars Starships</h1>
        <button
          onClick={onLogout}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <select
          value={selectedManufacturer}
          onChange={(e) => setSelectedManufacturer(e.target.value)}
          className="w-full rounded border p-2 md:w-auto"
        >
          <option value="">All Manufacturers</option>
          {manufacturers.map((manufacturer) => (
            <option key={manufacturer} value={manufacturer}>
              {manufacturer}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-4 text-red-700">{error}</div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Model</th>
                <th className="p-4 text-left">Manufacturer</th>
                <th className="p-4 text-left">Crew</th>
                <th className="p-4 text-left">Passengers</th>
                <th className="p-4 text-left">Cargo Capacity</th>
              </tr>
            </thead>
            <tbody>
              {starships.map((starship, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="p-4">{starship.name}</td>
                  <td className="p-4">{starship.model}</td>
                  <td className="p-4">{starship.manufacturer}</td>
                  <td className="p-4">{starship.crew}</td>
                  <td className="p-4">{starship.passengers}</td>
                  <td className="p-4">{starship.cargoCapacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
