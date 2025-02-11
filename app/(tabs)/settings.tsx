import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCity } from "../hooks/cityContext";

const API_BASE_URL = "https://city-waste-api.vercel.app/cities";

const SettingsScreen = () => {
  const { selectedCity, setSelectedCity } = useCity();
  const [localCity, setLocalCity] = useState(selectedCity);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [wasteSchedule, setWasteSchedule] = useState<any[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [notifyBefore, setNotifyBefore] = useState("on_day");
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadSettings();
    fetchCities();
  }, []);

  useEffect(() => {
    if (localCity) fetchWasteSchedule(localCity.id);
  }, [localCity]);

  const fetchCities = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      setCities(data);
      if (!localCity && data.length > 0) setLocalCity(data[0]);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchWasteSchedule = async (cityId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${cityId}`);
      const data = await response.json();
      setWasteSchedule(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching waste schedule:", error);
      setWasteSchedule([]);
    }
  };

  const loadSettings = async () => {
    const savedNotifications = await AsyncStorage.getItem(
      "notificationsEnabled"
    );
    const savedTime = await AsyncStorage.getItem("notificationTime");
    const savedNotifyBefore = await AsyncStorage.getItem("notifyBefore");

    if (savedNotifications)
      setNotificationsEnabled(JSON.parse(savedNotifications));
    if (savedTime) setNotificationTime(new Date(savedTime));
    if (savedNotifyBefore) setNotifyBefore(savedNotifyBefore);
  };

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Dozvola odbijena", "Nećete primati obavijesti.");
      setNotificationsEnabled(false);
    }
  };

  const saveSettings = async () => {
    if (localCity) {
      await AsyncStorage.setItem("selectedCity", JSON.stringify(localCity));
      setSelectedCity(localCity);
    }
    await AsyncStorage.setItem(
      "notificationsEnabled",
      JSON.stringify(notificationsEnabled)
    );
    await AsyncStorage.setItem(
      "notificationTime",
      notificationTime.toISOString()
    );
    await AsyncStorage.setItem("notifyBefore", notifyBefore);
    Alert.alert("Postavke spremljene!");
  };

  return (
    <View style={{ padding: 20, backgroundColor: "#f5f5f5", flex: 1 }}>
      <Text style={{ fontSize: 16, marginBottom: 5 }}>
        Odaberi grad/općinu:
      </Text>
      <View style={{ backgroundColor: "white", borderRadius: 10, padding: 5 }}>
        <Picker
          selectedValue={localCity?.id}
          onValueChange={(value) => {
            const city = cities.find((c) => c.id === value);
            setLocalCity(city || null);
          }}
        >
          {cities.map((city) => (
            <Picker.Item key={city.id} label={city.name} value={city.id} />
          ))}
        </Picker>
      </View>

      {wasteSchedule.length > 0 && ( //pogledati kaje to
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Raspored odvoza otpada:
          </Text>
          {wasteSchedule.map((item: any, index: number) => (
            <Text key={index}>{`${item.date}: ${item.type}`}</Text>
          ))}
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>
          Želite li primati obavijesti?
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={(value) => {
            setNotificationsEnabled(value);
            if (value) requestNotificationPermissions();
          }}
        />
      </View>

      {notificationsEnabled && (
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>
            Vrijeme obavijesti:
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: "white", padding: 10, borderRadius: 10 }}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={{ textAlign: "center" }}>
              {notificationTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={notificationTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setNotificationTime(selectedTime);
              }}
            />
          )}
          <Text style={{ fontSize: 16, marginBottom: 5, marginTop: 10 }}>
            Obavijesti me:
          </Text>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <Picker
              selectedValue={notifyBefore}
              onValueChange={(value) => setNotifyBefore(value)}
            >
              <Picker.Item label="Na dan odvoza" value="on_day" />
              <Picker.Item label="Dan ranije" value="day_before" />
            </Picker>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: "#6200EE",
          padding: 15,
          borderRadius: 10,
          marginTop: 20,
          alignItems: "center",
        }}
        onPress={saveSettings}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Spremi postavke
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
