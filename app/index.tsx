import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import { useCity } from "./hooks/cityContext"; // Import CityContext hook

const IndexPage = () => {
  const { setSelectedCity } = useCity(); // Use context to set the selected city
  const [cities, setCities] = useState<any[]>([]); // Holds city data for dropdown
  const [open, setOpen] = useState(false); // Controls whether the dropdown is open or closed
  const [value, setValue] = useState<string | null>(null); // Selected city ID
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://city-waste-api.vercel.app/cities"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCities(data); // Store cities in state
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching cities:", error);
        Alert.alert("Error", "Ne mogu dohvatiti gradove!");
        setIsLoading(false); // If error occurs, stop loading
      }
    };

    fetchCities();
  }, []);

  // Handle city selection
  const handleCitySelect = (cityName: string) => {
    const selectedCity = cities.find((city) => city.name === cityName);
    if (selectedCity) {
      setSelectedCity(selectedCity); // Save selected city to context
      router.push("/(tabs)/home"); // Navigate to Home page
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="rocket-outline" size={80} color="#6200EE" />
      <Text style={styles.title}>Dobrodošli u Eco Reminder</Text>
      <Text style={styles.title_grad}>Odaberite lokaciju:</Text>

      {/* Dropdown picker */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <DropDownPicker
          open={open}
          value={value}
          items={cities.map((city: any) => ({
            label: city.name, // Display city name
            value: city.name, // Use city name as value
          }))}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setCities}
          placeholder="Odaberite grad"
          containerStyle={styles.pickerContainer}
          style={styles.pickerStyle}
          labelStyle={styles.labelStyle}
        />
      )}

      <Button
        title="Krenimo"
        buttonStyle={{
          backgroundColor: "#6200EE",
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
        onPress={() => {
          if (value) {
            handleCitySelect(value); // Call handleCitySelect on button press
          }
        }}
      />
    </View>
  );
};

// Styles
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
    marginBottom: 20,
    color: "white",
  },
  title_grad: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 25,
  },
  pickerStyle: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
  labelStyle: {
    fontSize: 18,
    color: "#333",
  },
  selectedText: {
    fontSize: 18,
    color: "#333",
    marginTop: 10,
  },
});

export default IndexPage;
