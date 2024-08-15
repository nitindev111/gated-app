import {
  View,
  Text,
  Image,
  useColorScheme,
  Alert,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import images from "../../constants/images";
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
  const [loading, setLoading] = useState(false);

  const isSendButtonDisabled = phoneNumber?.length < 10 || loading;

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
        apiError: ["Phone number is not valid"],
        validationError: [],
      });
      return false;
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);
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
      } finally {
        setLoading(false);
      }
    } else {
      const message = ` base url - ${BACKEND_BASE_URL} : This Phone number is not Associated with any Society. Please contact your Society Manager`;
      Alert.alert("Error", message);
      setLoading(false);
    }
  };
  // https://reactnative.dev/docs/keyboardavoidingview
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="p-5 w-full h-full justify-between"
    >
      <View className="pt-10 flex gap-4 ">
        <Text className="text-2xl font-bold">Enter your mobile number</Text>
        <View className="flex flex-row items-center">
          {/* <Text>🇮🇳</Text> */}
          <TextInput
            className="text-sm p-2 rounded-lg font-bold"
            value="+91"
            editable={false}
          />
          <TextInput
            keyboardType="number-pad"
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={onTextChanged}
            maxLength={10}
            autoFocus
            className="flex-1 text-sm border border-gray-300 rounded-lg p-2"
          />
        </View>
      </View>
      <View className="">
        <Pressable
          className={`flex items-center p-4 rounded-md ${
            isSendButtonDisabled ? "bg-gray-300" : "bg-primary"
          }`}
          onPress={handleSendOTP}
          disabled={isSendButtonDisabled}
        >
          <Text className="text-white">Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
