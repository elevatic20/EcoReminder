import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface City {
  id: string;
  name: string;
}

interface CityContextType {
  selectedCity: City | null;
  setSelectedCity: (city: City) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCity, setSelectedCityState] = useState<City | null>(null);

  const setSelectedCity = async (city: City) => {
    setSelectedCityState(city);
    await AsyncStorage.setItem("selectedCity", JSON.stringify(city));
  };

  useEffect(() => {
    const loadSelectedCity = async () => {
      const savedCity = await AsyncStorage.getItem("selectedCity");
      if (savedCity) {
        setSelectedCityState(JSON.parse(savedCity));
      }
    };

    loadSelectedCity();
  }, []);

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
};

export default CityContext;
