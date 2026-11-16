import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import React from "react";
import { useTheme } from "native-base";

function Welcome({ navigation }) {
  const { colors } = useTheme();
  console.log(colors.primary["600"]);
  // No splash screen handling here: the native splash auto-hides on the
  // first React frame, before this screen mounts, so calling
  // SplashScreen.preventAutoHideAsync/hideAsync from here always rejects.

  return (
    // <SafeAreaView>
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: colors.primary["50"],
      }}
    >
      {console.log("app loaded")}
      <Pressable
        onPress={() => {
          console.log("Going to login page");
          navigation.navigate("Login");
        }}
      >
        <Text style={styles.buttons}>Login</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          console.log("Going to register page");
          navigation.navigate("Register");
        }}
      >
        <Text style={styles.buttons}>Register</Text>
      </Pressable>
    </SafeAreaView>
    // </SafeAreaView>
  );
}

export default React.memo(Welcome);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    fontSize: 30,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
});
