import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useCity } from "../hooks/cityContext";
import Icon from "react-native-vector-icons/Ionicons";

interface WasteDate {
  date: string;
  waste_type: string;
}

const wasteColors: { [key: string]: string } = {
  Plastika: "#FFEB3B",
  Papir: "#1E90FF",
  Bio: "#8B4513",
  Komunalni: "#212121",
};

const CalendarPage = () => {
  const { selectedCity } = useCity();
  const [dates, setDates] = useState<WasteDate[]>([]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDateDetails, setSelectedDateDetails] = useState<
    WasteDate[] | null
  >(null);

  useEffect(() => {
    const fetchDates = async () => {
      if (!selectedCity) return;

      setLoading(true);

      try {
        const response = await fetch(
          `https://city-waste-api.vercel.app/cities/${selectedCity.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDates(data.dates);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        Alert.alert("Error", "Unable to fetch calendar data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, [selectedCity]);

  useEffect(() => {
    const newMarkedDates: { [key: string]: any } = {};

    dates.forEach((wasteDate) => {
      const color = wasteColors[wasteDate.waste_type] || "#CCCCCC";

      if (newMarkedDates[wasteDate.date]) {
        newMarkedDates[wasteDate.date].dots.push({ color });
      } else {
        newMarkedDates[wasteDate.date] = {
          dots: [{ color }],
        };
      }
    });

    setMarkedDates(newMarkedDates);
  }, [dates]);

  const handleDayPress = (day: { dateString: string }) => {
    const selectedWasteDates = dates.filter(
      (wasteDate) => wasteDate.date === day.dateString
    );
    if (selectedWasteDates.length > 0) {
      setSelectedDateDetails(selectedWasteDates);
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedDateDetails(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`;
  };

  const getWasteIcon = (wasteType: string) => {
    switch (wasteType) {
      case "Papir":
        return "document-text"; // Ikona za papir
      case "Plastika":
        return "logo-buffer"; // Ikona za plastiku
      case "Bio":
        return "leaf"; // Ikona za bio
      default:
        return "trash"; // Ikona za ostale vrste otpada
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <>
          <Calendar
            markingType="multi-dot"
            markedDates={markedDates}
            onDayPress={handleDayPress}
            theme={{
              backgroundColor: "#f0f0f5", // Soft light background
              calendarBackground: "#fff", // White background for the calendar
              textSectionTitleColor: "#3b3b3b", // Dark text for section titles
              selectedDayBackgroundColor: "#6200ee", // Purple for selected day
              selectedDayTextColor: "#ffffff", // White text for selected day
              todayTextColor: "#ff0000", // Red for today's date
              arrowColor: "#6200ee", // Purple arrows
              monthTextColor: "#6200ee", // Purple month text
              textMonthFontWeight: "bold",
              textDayFontSize: 16,
              textMonthFontSize: 20,
            }}
          />

          {selectedDateDetails && (
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={handleCloseModal}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    Datum: {formatDate(selectedDateDetails[0].date)}
                  </Text>
                  <ScrollView style={styles.modalScroll}>
                    {selectedDateDetails.map((wasteDate, index) => (
                      <View key={index} style={styles.wasteCard}>
                        <Icon
                          name={getWasteIcon(wasteDate.waste_type)}
                          size={30}
                          color={wasteColors[wasteDate.waste_type] || "#212121"}
                          style={styles.wasteIcon}
                        />
                        <Text style={styles.wasteType}>
                          {wasteDate.waste_type}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleCloseModal}
                  >
                    <Text style={styles.closeButtonText}>Zatvori</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f5",
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6200ee",
  },
  modalScroll: {
    width: "100%",
    marginBottom: 20,
  },
  wasteCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  wasteIcon: {
    marginRight: 10,
  },
  wasteType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
  },
  closeButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default CalendarPage;
