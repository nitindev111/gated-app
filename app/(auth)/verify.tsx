import React, { useEffect, useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { View, Text, Image, Alert, Pressable } from "react-native";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import axiosInstance from "../utils/axiosInstance";
import { BACKEND_BASE_URL } from "@/config/config";
import { RESEND_OTP, VERIFY_OTP } from "@/constants/api.constants";
import { useUser } from "../context/UserProvider";
import { getDecodedToken } from "../utils/storageUtils";
import Button from "../components/common/Button";
import Toast from "react-native-root-toast";

const Verify = () => {
  const router = useRouter();
  const [otp, setotp] = useState<string>("");
  const storage = useAsyncStorage("gated_user");
  const { setUser, loading, user } = useUser();
  const { orderId, phoneNumber } = useLocalSearchParams();
  const { uid, setUid } = useState(orderId);
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const isVerifyButtonDisabled = otp?.length < 6 || loading;

  const handleOTPSubmit = async () => {
    {
      if (otp.length === 6) {
        try {
          const response = await axiosInstance.post(
            BACKEND_BASE_URL + VERIFY_OTP,
            {
              phoneNumber,
              orderId: uid,
              otp,
            }
          );
          const accessToken = response.data?.access_token;
          storage.setItem(accessToken, async () => {
            const decodedUser = await getDecodedToken();
            setUser(decodedUser);
            Toast.show("Logged in Successfully", {
              position: Toast.positions.TOP,
            });
            router.replace("/home");
          });
        } catch (error) {
          console.log("error", error);
          Alert.alert("something went wrong");
        }
      }
    }
  };

  useEffect(() => {
    let interval: any = null;
    interval = setInterval(() => {
      setTimer((prev: number) => {
        if (prev <= 1) {
          setIsTimerActive(false);
          clearInterval(interval);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerActive]);

  const handleResend = async () => {
    try {
      const response = await axiosInstance.post(BACKEND_BASE_URL + RESEND_OTP, {
        orderId,
      });
      const newOrderId = response.data?.order_id;
      Toast.show("Resent OTP successfully", {
        position: Toast.positions.TOP,
      });
      if (newOrderId) {
        setUid(newOrderId);
      }
      setIsTimerActive(true);
      setTimer(60); // Reset the timer to 60 seconds
    } catch (error) {
      console.log("error", error);
      Alert.alert("something went wrong");
    }
  };

  return (
    <View className="pt-10 w-full h-full  bg-white">
      <Text className="text-2xl font-bold text-center">OTP Verification</Text>
      <Text className="text-sm text-gray-400 text-center">
        Enter One time password
      </Text>
      <OtpInput
        theme={{
          containerStyle: {
            padding: 20,
          },
          pinCodeContainerStyle: {
            height: 50,
            width: 40,
          },
        }}
        numberOfDigits={6}
        onTextChange={(text) => setotp(text)}
      />
      <View className="flex items-end mx-6">
        <Text className="text-primary" onPress={() => router.replace("/login")}>
          Change Phone Number
        </Text>
      </View>
      <View className="pt-2">
        <View className="m-4">
          <Pressable
            className={`flex items-center p-4 rounded-md ${
              isVerifyButtonDisabled ? "bg-gray-300" : "bg-primary"
            }`}
            onPress={handleOTPSubmit}
            disabled={isVerifyButtonDisabled}
          >
            <Text className="text-white">Verify</Text>
          </Pressable>
        </View>
        <Text className="text-sm text-primary  text-center">
          Didn't receive the code ?{" "}
        </Text>
        <Text onPress={handleResend} className="text-error text-center">
          Resend code {isTimerActive ? `in ${timer}s` : ""}
        </Text>
      </View>
    </View>
  );
};

export default Verify;
