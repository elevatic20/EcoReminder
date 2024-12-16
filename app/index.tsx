import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import { useCity } from "./hooks/cityContext";

const IndexPage = () => {
  const { selectedCity, setSelectedCity } = useCity(); // Koristi CityContext za grad
  const [cities, setCities] = useState<any[]>([]); // Sprema popis gradova
  const [open, setOpen] = useState(false); // Upravljanje otvaranjem dropdowna
  const [value, setValue] = useState<string | null>(null); // Odabrani grad
  const [isLoading, setIsLoading] = useState<boolean>(true); // Stanje učitavanja

  // Ako je grad već odabran, automatski preusmjeri na početnu stranicu
  useEffect(() => {
    if (selectedCity) {
      router.push("/(tabs)/home");
    }
  }, [selectedCity]);

  // Dohvati popis gradova s API-ja
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://city-waste-api.vercel.app/cities"
        );
        if (!response.ok) {
          throw new Error(`HTTP greška! Status: ${response.status}`);
        }
        const data = await response.json();
        setCities(data); // Postavi gradove u stanje
        setIsLoading(false); // Prestani učitavati
      } catch (error) {
        console.error("Greška pri dohvaćanju gradova:", error);
        Alert.alert("Greška", "Nije moguće dohvatiti gradove.");
        setIsLoading(false); // Prestani učitavati čak i u slučaju greške
      }
    };

    fetchCities();
  }, []);

  // Obradi odabir grada
  const handleCitySelect = (cityName: string) => {
    const city = cities.find((c) => c.name === cityName);
    if (city) {
      setSelectedCity(city); // Spremi grad u kontekst
      router.push("/(tabs)/home"); // Preusmjeri na Home
    } else {
      Alert.alert("Greška", "Odabrani grad nije pronađen.");
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="rocket-outline" size={80} color="#6200EE" />
      <Text style={styles.title}>Dobrodošli u Eco Reminder</Text>
      <Text style={styles.subtitle}>Molimo odaberite svoju lokaciju:</Text>

      {/* Dropdown picker za odabir grada */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <DropDownPicker
          open={open}
          value={value}
          items={cities.map((city: any) => ({
            label: city.name, // Ime grada za prikaz
            value: city.name, // Vrijednost za upravljanje
          }))}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setCities}
          placeholder="Odaberite grad"
          containerStyle={styles.pickerContainer}
          style={styles.pickerStyle}
          labelStyle={styles.labelStyle}
          onChangeValue={(val) => setValue(val as string)}
        />
      )}

      {/* Gumb za potvrdu odabira */}
      <Button
        title="Krenimo"
        buttonStyle={styles.button}
        onPress={() => {
          if (value) {
            handleCitySelect(value); // Obradi odabir grada
          } else {
            Alert.alert("Upozorenje", "Molimo odaberite grad prije nastavka.");
          }
        }}
      />
    </View>
  );
};

// Stilovi
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 20,
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 20,
  },
  pickerStyle: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
  labelStyle: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#6200EE",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default IndexPage;
