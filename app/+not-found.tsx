import { Text, View, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Opss! Not found!" }} />
      <View style={styles.container}>
        <Link href="./(tabs)/index" style={styles.button}>
          Go to Home
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
  },
  button: {
    margin: 5,
    backgroundColor: "#fafafa",
    padding: 15,
    borderRadius: 10,
  },
});
