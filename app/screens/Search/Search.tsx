import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

const Search: React.FC = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter search query"
        autoFocus={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

export default Search;
