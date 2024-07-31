import { View, Text, Image, useColorScheme, Alert } from "react-native";
import React, { useState } from "react";
import images from "../../constants/images";
import { TextInput } from "react-native-paper";
import axiosInstance from "../utils/axiosInstance";
import { BACKEND_BASE_URL } from "../../config/config";
import { SEND_OTP } from "@/constants/api.constants";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import Button from "../components/common/Button";

const Login = () => {
  const themeColor = useColorScheme();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [errors, setErrors] = useState({});

  const onTextChanged = (value: string) => {
    setPhoneNumber(value.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, ""));
  };

  const isPhoneNumberValid = async (): Promise<boolean> => {
    try {
      const response = await axiosInstance.get(
        BACKEND_BASE_URL +
          `/users/validate-phoneNumber?phoneNumber=${phoneNumber}`
      );
      if (response.data) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setErrors({
        apiError: ["PHone number is not valid"],
        validationError: [],
      });
      return false;
    }
  };

  const handleContinue = async () => {
    if (phoneNumber.length === 10 && (await isPhoneNumberValid())) {
      try {
        const response = await axiosInstance.post(BACKEND_BASE_URL + SEND_OTP, {
          phoneNumber,
          channel: "SMS",
          expiry: 60,
        });
        router.replace({
          pathname: `/verify`,
          params: { phoneNumber, orderId: response.data?.orderId },
        }); // Remove the braces in params
      } catch (error) {
        Alert.alert("Something went wrong");
      }
    } else {
      Alert.alert(
        "Error",
        "This Phone number is not Associated with any Society. Please contact your Society Manager"
      );
    }
  };
  return (
    <View className="p-5 w-full">
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
        <View className="pt-2">
          <Button
            title="Submit"
            disabled={phoneNumber.length !== 10}
            onPress={handleContinue}
          />
        </View>
        {/* <Button
          textColor="#ffff"
          className="bg-secondary rounded-xl min-h-[50px] flex justify-center"
          shouldRasterizeIOS
          focusable
          disabled={phoneNumber.length !== 10}
          onPress={handleContinue}
        >
          Submit
        </Button> */}
      </View>
    </View>
  );
};

export default Login;
