import { View, Text, Image, useColorScheme } from "react-native";
import React, { useState } from "react";
import images from "../../constants/images";
import { Button, TextInput } from "react-native-paper";
import { router } from "expo-router";

const Login = () => {
  const themeColor = useColorScheme();
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const onTextChanged = (value: string) => {
    console.log("====================================");
    console.log("value", value);
    console.log("===============================90=====");
    // code to remove non-numeric characters from text
    setPhoneNumber(value.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, ""));
  };
  return (
    <View className="p-5 w-full">
      <Image
        source={images.logo}
        className="w-[100px] h-[100px] m-auto"
        resizeMode="contain"
      />
      <View className="flex gap-4 ">
        <TextInput
          keyboardType="number-pad"
          label={"Phone Number"}
          value={phoneNumber}
          onChangeText={onTextChanged}
          maxLength={10}
          autoFocus
          className="color-secondary"
        />
        <Button
          textColor="#ffff"
          className="bg-secondary rounded-xl min-h-[50px] flex justify-center"
          shouldRasterizeIOS
          focusable
          disabled={phoneNumber.length !== 10}
          onPress={() => {
            if (phoneNumber.length === 10) {
              router.replace("/verify");
            }
          }}
        >
          Submit
        </Button>
      </View>
    </View>
  );
};

export default Login;
