import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import CustomButton from "../components/CustomButton";
import images from "../../constants/images";
import { Button } from "react-native-paper";
import { router } from "expo-router";

const Verify = () => {
  const [otp, setotp] = useState<string>("");

  return (
    <View className="p-5 w-full  bg-white">
      <Text className="text-2xl font-bold text-center">Verify OTP</Text>
      <OtpInput
        theme={{
          containerStyle: {
            padding: 20,
          },
        }}
        numberOfDigits={6}
        onTextChange={(text) => setotp(text)}
      />
      <View className="">
        <Button
          textColor="#ffff"
          className="bg-secondary rounded-xl min-h-[50px] flex justify-center"
          shouldRasterizeIOS
          focusable
          disabled={otp.length !== 6}
          onPress={() => {
            if (otp.length === 6) {
              router.replace("/home");
            }
          }}
        >
          Submit
        </Button>
      </View>
    </View>
  );
};

export default Verify;
