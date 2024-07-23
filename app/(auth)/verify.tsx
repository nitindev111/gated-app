import { View, Text, Image, Alert } from "react-native";
import React, { useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import { Button } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import axiosInstance from "../utils/axiosInstance";
import { BACKEND_BASE_URL } from "@/config/config";
import { VERIFY_OTP } from "@/constants/api.constants";
import { useUser } from "../context/UserProvider";
import { getDecodedToken } from "../utils/storageUtils";

const Verify = () => {
  const router = useRouter();
  const [otp, setotp] = useState<string>("");
  const storage = useAsyncStorage("gated_user");
  const { setUser } = useUser();
  const { orderId, phoneNumber } = useLocalSearchParams();

  const handleOTPSubmit = async () => {
    {
      if (otp.length === 6) {
        try {
          const response = await axiosInstance.post(
            BACKEND_BASE_URL + VERIFY_OTP,
            {
              phoneNumber,
              orderId,
              otp,
            }
          );
          const accessToken = response.data?.access_token;
          storage.setItem(accessToken, async () => {
            const decodedUser = await getDecodedToken();
            setUser(decodedUser);
            router.replace("/home");
          });
        } catch (error) {
          console.log("error", error);
          Alert.alert("something went wrong");
        }
      }
    }
  };

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
          onPress={handleOTPSubmit}
        >
          Submit
        </Button>
      </View>
    </View>
  );
};

export default Verify;
