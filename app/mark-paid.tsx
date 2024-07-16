import { View, Text } from "react-native";
import React from "react";
import PaidAmountDetails from "./components/bills/PaidAmountDetails";

const MarkPaid = () => {
  return (
    <View className="flex-1">
      <PaidAmountDetails />
    </View>
  );
};

export default MarkPaid;
