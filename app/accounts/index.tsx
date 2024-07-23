import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

const Accounts = () => {
  return (
    <View className="flex flex-row p-4 gap-4 justify-center flex-wrap">
      <TouchableOpacity className="bg-red-100 p-10">
        <Link href="accounts/bank">
          <Text>Bank Balance</Text>
        </Link>
      </TouchableOpacity>
      <TouchableOpacity className="bg-red-100 p-10">
        <Link href="accounts/cash">
          <Text>Cash Balance</Text>
        </Link>
      </TouchableOpacity>
      <TouchableOpacity className="bg-red-100 p-10">
        <Link href="accounts/total">
          <Text>Total Balance</Text>
        </Link>
      </TouchableOpacity>
    </View>
  );
};

export default Accounts;
