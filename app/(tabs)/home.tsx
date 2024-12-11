// screens/Home.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCity } from "../hooks/cityContext";

// Funkcija za formatiranje datuma
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const dayOfWeek = new Intl.DateTimeFormat("hr-HR", {
    weekday: "long",
  }).format(date);
  const formattedDate = new Intl.DateTimeFormat("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  return { dayOfWeek, formattedDate };
};

const Home = () => {
  const { selectedCity } = useCity(); // Dohvati odabrani grad iz contexta
  const [dates, setDates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDates = async () => {
      if (!selectedCity) return; // Ako nije odabran grad, ne dohvaćaj podatke

      setLoading(true); // Pokreni animaciju učitavanja

      try {
        const response = await fetch(
          `https://city-waste-api.vercel.app/cities/${selectedCity.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDates(data.dates); // Spremi datume u stanje
      } catch (error) {
        console.error("Error fetching dates:", error);
      } finally {
        setLoading(false); // Zaustavi animaciju učitavanja
      }
    };

    fetchDates();
  }, [selectedCity]);

  // Sortiraj datume uzlazno
  const sortedDates = [...dates]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((date) => new Date(date.date).getTime() >= new Date().getTime()); // Filtriraj prošle datume

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datumi za grad: {selectedCity?.name}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : sortedDates.length === 0 ? (
        <Text style={styles.noDates}>No dates available</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {sortedDates.map((date, index) => {
            const { dayOfWeek, formattedDate } = formatDate(date.date); // Formatiraj datum

            return (
              <View
                key={index}
                style={[
                  styles.dateContainer,
                  new Date(date.date) < new Date() && styles.pastDate, // Stil za prošli datum
                ]}
              >
                {/* Ikona */}
                <Ionicons
                  name={
                    date.waste_type === "Papir"
                      ? "document-text" // Promijenjeno ime ikone za papir
                      : date.waste_type === "Plastika"
                      ? "logo-buffer" // Ikona za plastiku
                      : date.waste_type === "Bio"
                      ? "leaf" // Ikona za bio
                      : "trash" // Default ikona za ostale
                  }
                  size={40}
                  color={
                    date.waste_type === "Papir"
                      ? "#795548"
                      : date.waste_type === "Plastika"
                      ? "#FFEB3B"
                      : date.waste_type === "Bio"
                      ? "#8BC34A"
                      : "#212121"
                  }
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  {/* Naziv vrste otpada */}
                  <Text style={styles.wasteType}>{date.waste_type}</Text>

                  {/* Dan u tjednu */}
                  <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>

                  {/* Datum */}
                  <Text style={styles.date}>{formattedDate}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
    fontFamily: "Roboto",
  },
  noDates: {
    fontSize: 18,
    color: "#6200ee",
    fontStyle: "italic",
    textAlign: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
  },
  dateContainer: {
    flexDirection: "row", // Poravnanje ikone, naziva i datuma u jedan red
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: "#ffffff",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    elevation: 3, // Samo za Android uređaje, za shadow
  },
  pastDate: {
    backgroundColor: "#f2f2f2", // Pozadina za prošle datume
  },
  icon: {
    marginRight: 20, // Razmak između ikone i teksta
    backgroundColor: "#f4f4f9",
    borderRadius: 25,
    padding: 10,
    elevation: 2, // Mala sjena oko ikone
  },
  textContainer: {
    flex: 1,
  },
  wasteType: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    fontFamily: "Roboto",
  },
  dayOfWeek: {
    fontSize: 18,
    color: "#555",
    marginBottom: 5,
    fontFamily: "Roboto",
  },
  date: {
    fontSize: 18,
    color: "#333",
    fontFamily: "Roboto",
  },
});

export default Home;
