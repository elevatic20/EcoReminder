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
  const sortedDates = [...dates].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Podijeli datume na danas i sljedeće
  const today = new Date().toLocaleDateString("hr-HR"); // Dobivanje lokalnog datuma u formatu hr-HR
  const todayDates = sortedDates.filter(
    (date) => new Date(date.date).toLocaleDateString("hr-HR") === today
  );
  const upcomingDates = sortedDates.filter(
    (date) => new Date(date.date).getTime() > new Date().getTime()
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datumi za grad: {selectedCity?.name}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <>
          {/* Prikaz današnjeg datuma */}
          {todayDates.length > 0 ? (
            <View style={styles.todayContainer}>
              <Text style={styles.todayTitle}>Danas:</Text>
              {todayDates.map((date, index) => {
                const { dayOfWeek, formattedDate } = formatDate(date.date);
                return (
                  <View
                    key={index}
                    style={[
                      styles.dateContainer,
                      new Date(date.date) < new Date() && styles.pastDate,
                    ]}
                  >
                    <Ionicons
                      name={
                        date.waste_type === "Papir"
                          ? "document-text"
                          : date.waste_type === "Plastika"
                          ? "logo-buffer"
                          : date.waste_type === "Bio"
                          ? "leaf"
                          : "trash"
                      }
                      size={40}
                      color={
                        date.waste_type === "Papir"
                          ? "#1E90FF"
                          : date.waste_type === "Plastika"
                          ? "#FFEB3B"
                          : date.waste_type === "Bio"
                          ? "#8B4513"
                          : "#212121"
                      }
                      style={styles.icon}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.wasteType}>{date.waste_type}</Text>
                      <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
                      <Text style={styles.date}>{formattedDate}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.noWasteToday}>Danas ne ide ni jedna kanta</Text>
          )}

          {/* Prikaz budućih datuma */}
          {upcomingDates.length > 0 && (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.upcomingTitle}>Sljedeći datumi:</Text>
              {upcomingDates.map((date, index) => {
                const { dayOfWeek, formattedDate } = formatDate(date.date);
                return (
                  <View
                    key={index}
                    style={[
                      styles.dateContainer,
                      new Date(date.date) < new Date() && styles.pastDate,
                    ]}
                  >
                    <Ionicons
                      name={
                        date.waste_type === "Papir"
                          ? "document-text"
                          : date.waste_type === "Plastika"
                          ? "logo-buffer"
                          : date.waste_type === "Bio"
                          ? "leaf"
                          : "trash"
                      }
                      size={40}
                      color={
                        date.waste_type === "Papir"
                          ? "#1E90FF"
                          : date.waste_type === "Plastika"
                          ? "#FFEB3B"
                          : date.waste_type === "Bio"
                          ? "#8B4513"
                          : "#212121"
                      }
                      style={styles.icon}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.wasteType}>{date.waste_type}</Text>
                      <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
                      <Text style={styles.date}>{formattedDate}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </>
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
  todayContainer: {
    width: "100%",
    marginBottom: 20,
  },
  todayTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 10,
    fontFamily: "Roboto",
  },
  noWasteToday: {
    fontSize: 18,
    color: "#FF0000", // Crvena boja za poruku
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 20,
  },
  upcomingTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 10,
    fontFamily: "Roboto",
  },
  scrollContainer: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: "#ffffff",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    elevation: 3,
  },
  pastDate: {
    backgroundColor: "#f2f2f2", // Pozadina za prošle datume
  },
  icon: {
    marginRight: 20,
    backgroundColor: "#f4f4f9",
    borderRadius: 25,
    padding: 10,
    elevation: 2,
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
