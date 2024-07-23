import React, { useEffect, useState } from "react";
import { OTPWidget } from "@msg91comm/sendotp-react-native";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const widgetId = "34676474656b393432313636";
const tokenAuth = "425708TVphEVhj66870303P1";

const Login = () => {
  useEffect(() => {
    OTPWidget.initializeWidget(widgetId, tokenAuth); //Widget initialization
  }, []);

  const [number, setNumber] = useState("");

  const handleSendOtp = async () => {
    const data = {
      identifier: "919028234693",
    };
    const response = await OTPWidget.sendOTP(data);
  };

  return (
    <View>
      <TextInput
        placeholder="Number"
        value={number}
        keyboardType="numeric"
        style={{ backgroundColor: "#ededed", margin: 10 }}
        onChangeText={(text) => {
          setNumber(text);
        }}
      />
      <TouchableOpacity
        style={{
          alignItems: "center",
          padding: 10,
          height: 50,
        }}
        onPress={() => {
          handleSendOtp();
        }}
      >
        <Text>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
