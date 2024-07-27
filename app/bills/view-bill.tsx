import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import axiosInstance from "../utils/axiosInstance";
import { useLocalSearchParams } from "expo-router";

const ViewBill = () => {
  const [loading, setLoading] = useState(false);
  const { bill_id } = useLocalSearchParams();
  const [bill, setBill] = useState<any>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    date: new Date(),
    voucherCode: "",
    paymentMode: "online",
  });

  const fetchBill = async () => {
    setLoading(true);
    const url =
      process.env.EXPO_PUBLIC_BACKEND_BASE_URL + `/bills/fetch?id=` + bill_id;
    try {
      const response = await axiosInstance.get(url);
      setBill(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBill();
  }, []);

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails({ ...paymentDetails, [field]: value });
  };

  const handleMarkAsPaid = async () => {
    try {
      const url = process.env.EXPO_PUBLIC_BACKEND_BASE_URL + "/bills/mark-paid"; // replace with actual endpoint

      const data = {
        bill_ids: [bill?._id],
        payment_proof: {
          amount: paymentDetails.amount,
          payment_date: paymentDetails.date.toISOString(),
          voucherCode: paymentDetails.voucherCode,
          payment_method: paymentDetails.paymentMode,
        },
      };

      console.log("data", data);
      const response = await axiosInstance.post(url, data);
      console.log("Response:", response.data);
      Alert.alert("Bill Successfully Marked");
      // handle success
      setShowBottomSheet(false);
    } catch (error) {
      console.error("Failed to mark bill as paid:", error);
    }
  };

  if (loading || !bill) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        <Text className="text-lg font-bold mb-4">{bill?.bill_name}</Text>
        <Text className="text-sm text-gray-600 mb-2">
          Amount: ${bill?.amount}
        </Text>
        <Text className="text-sm text-gray-600 mb-2">
          Due Date: {new Date(bill?.due_date).toLocaleDateString()}
        </Text>
        <Text className="text-sm text-gray-600 mb-2">
          Status: {bill?.status}
        </Text>
        <Text className="text-sm text-gray-600 mb-2">
          Description: {bill?.description}
        </Text>
        {/* Add other bill details here */}
      </ScrollView>
      {(bill?.status !== "PAID" || bill.verification_status !== "VERIFIED") && (
        <View className="p-6 border-t border-gray-200 bg-white">
          <TouchableOpacity
            onPress={() => setShowBottomSheet(true)}
            className="bg-blue-500 p-4 rounded-lg"
          >
            <Text className="text-white text-center">Mark as Paid</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={showBottomSheet} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end">
          <View className="bg-gray-200 p-6 rounded-t-lg">
            <Text className="text-lg font-bold mb-4">Mark as Paid</Text>
            <TextInput
              placeholder="Amount"
              value={paymentDetails.amount}
              onChangeText={(text) =>
                handlePaymentDetailsChange("amount", text)
              }
              className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
            />
            <TouchableOpacity
              onPress={() => handlePaymentDetailsChange("date", new Date())}
            >
              <Text className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4">
                {paymentDetails?.date?.toDateString()}
              </Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Voucher Code"
              value={paymentDetails?.voucherCode}
              onChangeText={(text) =>
                handlePaymentDetailsChange("voucherCode", text)
              }
              className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
            />
            <TextInput
              placeholder="Payment Mode (Online or Cash)"
              value={paymentDetails?.paymentMode}
              onChangeText={(text) =>
                handlePaymentDetailsChange("paymentMode", text)
              }
              className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
            />
            <View className="flex flex-row gap-2 items-center w-full">
              <TouchableOpacity
                onPress={handleMarkAsPaid}
                className="w-[50%] bg-blue-500 p-4 rounded-lg"
              >
                <Text className="text-white text-center">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowBottomSheet(false)}
                className="w-[50%] bg-red-700 p-4 rounded-lg"
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ViewBill;
