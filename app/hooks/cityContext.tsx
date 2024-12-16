import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface City {
  id: string;
  name: string;
}

interface CityContextType {
  selectedCity: City | null;
  setSelectedCity: (city: City | null) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) throw new Error("useCity must be used within a CityProvider");
  return context;
};

export const CityProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  useEffect(() => {
    const loadCityFromStorage = async () => {
      const cityData = await AsyncStorage.getItem("selectedCity");
      if (cityData) {
        setSelectedCity(JSON.parse(cityData));
      }
    };
    loadCityFromStorage();
  }, []);

  const saveCityToStorage = async (city: City) => {
    await AsyncStorage.setItem("selectedCity", JSON.stringify(city));
  };

  const handleSetCity = (city: City | null) => {
    setSelectedCity(city);
    if (city) {
      saveCityToStorage(city);
    } else {
      AsyncStorage.removeItem("selectedCity");
    }
  };

  return (
    <CityContext.Provider
      value={{ selectedCity, setSelectedCity: handleSetCity }}
    >
      {children}
    </CityContext.Provider>
  );
};
export default CityContext;
