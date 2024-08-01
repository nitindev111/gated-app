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
import { useLocalSearchParams, useNavigation } from "expo-router";
import { RUPEE_SYMBOL } from "@/constants/others";
import { BACKEND_BASE_URL } from "@/config/config";

const ViewBill = () => {
  const [loading, setLoading] = useState(false);
  const { bill_id, unit_number } = useLocalSearchParams();
  const [bill, setBill] = useState<any>(null);
  const [accounts, setAccounts] = useState([]);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const navigation = useNavigation();
  const [paymentDetails, setPaymentDetails] = useState({
    account_id: "",
    date: new Date(),
    voucherCode: "",
    paymentMode: "online",
    description: "",
  });

  const fetchBill = async () => {
    setLoading(true);
    const url = `${BACKEND_BASE_URL}/bills/fetch?id=${bill_id}`;
    try {
      const response = await axiosInstance.get(url);
      setBill(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axiosInstance.get(
        `${BACKEND_BASE_URL}/accounts/view?society_id=668ec76634a193bb66e98ead`
      );
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchBill();
    fetchAccounts();
  }, []);

  useEffect(() => {
    navigation?.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-blue-500">Back</Text>
        </TouchableOpacity>
      ),
      title: "  Unit: " + unit_number || "",
    });
  }, [navigation, bill]);

  const handlePaymentDetailsChange = (field: string, value: string) => {
    setPaymentDetails({ ...paymentDetails, [field]: value });
  };

  const validateForm = () => {
    const { account_id, date, paymentMode, description } = paymentDetails;
    if (!account_id || !date || !paymentMode || !description) {
      Alert.alert("Validation Error", "Please fill the required fields.");
      return false;
    }
    return true;
  };

  const handleMarkAsPaid = async () => {
    if (!validateForm()) return;

    try {
      const url = `${BACKEND_BASE_URL}/bills/mark-paid`;

      const data = {
        bill_ids: [bill?._id],
        payment_proof: {
          account_id: paymentDetails.account_id,
          payment_date: paymentDetails.date.toISOString(),
          voucherCode: paymentDetails.voucherCode,
          payment_method: paymentDetails.paymentMode,
          description: paymentDetails.description,
        },
      };

      const response = await axiosInstance.post(url, data);
      console.log("Response:", response.data);
      Alert.alert("Bill Successfully Marked");
      navigation.goBack();
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
          Amount: {RUPEE_SYMBOL + bill?.amount}
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
      </ScrollView>
      {(bill?.status !== "PAID" || bill.verification_status !== "APPROVED") && (
        <View className="p-6 border-t border-gray-200 bg-white">
          <TouchableOpacity
            onPress={() => setShowBottomSheet(true)}
            className="bg-blue-500 p-4 rounded-lg"
          >
            <Text className="text-white text-center">Mark as Paid</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showBottomSheet}
        animationType="slide"
        transparent={false}
      >
        <View className="flex-1 bg-white p-6">
          <Text className="text-lg font-bold mb-4">Mark as Paid</Text>
          <TouchableOpacity
            onPress={() => setShowAccountModal(true)}
            className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
          >
            <Text>
              {paymentDetails.account_id
                ? paymentDetails.account_id
                : "Select Account"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              handlePaymentDetailsChange(
                "date",
                new Date().toLocaleTimeString()
              )
            }
            className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
          >
            <Text>{paymentDetails?.date?.toDateString()}</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Voucher Code"
            value={paymentDetails.voucherCode}
            onChangeText={(text) =>
              handlePaymentDetailsChange("voucherCode", text)
            }
            className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
          />
          <TextInput
            placeholder="Payment Mode (Online or Cash)"
            value={paymentDetails.paymentMode}
            onChangeText={(text) =>
              handlePaymentDetailsChange("paymentMode", text)
            }
            className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
          />
          <TextInput
            placeholder="Description"
            value={paymentDetails.description}
            onChangeText={(text) =>
              handlePaymentDetailsChange("description", text)
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
      </Modal>

      <Modal
        visible={showAccountModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <ScrollView className="mb-4">
              {accounts.map((account: any) => (
                <TouchableOpacity
                  key={account._id}
                  onPress={() => {
                    handlePaymentDetailsChange("account_id", account._id);
                    setShowAccountModal(false);
                  }}
                  className={`border-gray-300 border-solid border border-1 p-2 rounded-lg mb-2 ${
                    paymentDetails.account_id === account._id
                      ? "bg-blue-100"
                      : ""
                  }`}
                >
                  <Text>{account.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowAccountModal(false)}
              className="bg-red-700 p-4 rounded-lg"
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ViewBill;
