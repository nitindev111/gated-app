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
import DateTimePicker from "@react-native-community/datetimepicker"; // import DatePicker component
import { Picker } from "@react-native-picker/picker";
import { useUser } from "../context/UserProvider";
import FileUpload from "../components/common/FileUpload";

const ViewBill = () => {
  const [loading, setLoading] = useState(false);
  const { bill_id, unit_number } = useLocalSearchParams();
  const [bill, setBill] = useState<any>(null);
  const [accounts, setAccounts] = useState([]);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    account_id: "",
    date: new Date(),
    voucherCode: "",
    paymentMode: "",
    description: "",
    transaction_ref_number: "",
    attachment_urls: [""],
  });

  const { user } = useUser();

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
        `${BACKEND_BASE_URL}/accounts/view?society_id=${user?.society_id}`
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
          <Text className="text-primary">Back</Text>
        </TouchableOpacity>
      ),
      title: "  Unit: " + unit_number || "",
    });
  }, [navigation, bill]);

  const handlePaymentDetailsChange = (field: string, value: any) => {
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

  const handleUploadSuccess = (url: string) => {
    const urls = [];
    urls.push(url);
    console.log("urls", urls);
    setPaymentDetails({
      ...paymentDetails,
      attachment_urls: urls,
    });
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
          transaction_ref_number: paymentDetails.transaction_ref_number,
          attachment_urls: paymentDetails.attachment_urls,
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

  const renderMarkAsPaidModal = () => {
    return (
      <Modal
        visible={showBottomSheet}
        animationType="slide"
        transparent={false}
      >
        <View className="flex-1 bg-white p-6 gap-2">
          <Text className="text-lg font-bold mb-4">Mark as Paid</Text>
          <View className="border border-gray-300 rounded-lg">
            <Picker
              selectedValue={paymentDetails.account_id}
              onValueChange={(value) =>
                handlePaymentDetailsChange("account_id", value)
              }
            >
              <Picker.Item label="Select Payment Account" value="" />
              {accounts.map((acc: any) => {
                return <Picker.Item label={acc?.label} value={acc?._id} />;
              })}
            </Picker>
          </View>

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="border-gray-300 border-solid border border-1 p-2 rounded-lg "
          >
            <Text>{paymentDetails.date.toDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <View className="border border-gray-300 rounded-lg">
              <DateTimePicker
                value={paymentDetails.date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    handlePaymentDetailsChange("date", selectedDate);
                  }
                }}
              />
            </View>
          )}

          <View className="border border-gray-300 rounded-lg">
            <Picker
              selectedValue={paymentDetails.paymentMode}
              onValueChange={(value) =>
                handlePaymentDetailsChange("paymentMode", value)
              }
            >
              <Picker.Item label="Select Payment Mode" value="" />
              <Picker.Item
                label="Online (UPI, Bank Transfer, etc)"
                value="ONLINE"
              />
              <Picker.Item label="Cash" value="CASH" />
              <Picker.Item label="Check" value="CHECK" />
            </Picker>
          </View>
          <TextInput
            placeholder="Description"
            value={paymentDetails.description}
            onChangeText={(text) =>
              handlePaymentDetailsChange("description", text)
            }
            className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
          />
          <TextInput
            placeholder="Transaction Ref Number (Optional)"
            value={paymentDetails.transaction_ref_number}
            onChangeText={(text) =>
              handlePaymentDetailsChange("transaction_ref_number", text)
            }
            className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
          />

          <View className="flex-1 justify-center items-center">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </View>
          <View className="flex flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleMarkAsPaid}
              className="flex-1 bg-primary p-4 rounded-lg"
            >
              <Text className="text-white text-center">Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowBottomSheet(false)}
              className="flex-1 bg-red-700 p-4 rounded-lg"
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading || !bill) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <ScrollView className="flex-1">
        {/* Bill Information Section */}
        <View className="mb-6 border-b border-gray-200 pb-4">
          <Text className="text-base font-bold mb-2">{bill?.bill_name}</Text>
          <Text className="text-xs text-gray-600">
            Invoice Number: {bill?.invoice_number}
          </Text>
        </View>

        {/* Amount and Due Date Section */}
        <View className="mb-6 flex flex-row justify-between">
          <View className="flex-1 mr-4">
            <Text className="text-sm text-gray-600 font-bold mb-1">Amount</Text>
            <Text className="text-sm text-gray-800">
              {RUPEE_SYMBOL + bill?.amount}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm text-gray-600 font-bold mb-1">
              Due Date
            </Text>
            <Text className="text-sm text-gray-800">
              {new Date(bill?.due_date).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Status Section */}
        <View className="mb-6 border-b border-gray-200 pb-4">
          <View className="flex flex-row justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-sm text-gray-600 font-bold mb-1">
                Payment Status
              </Text>
              <Text
                className={`text-sm ${
                  bill?.status === "PAID"
                    ? "text-success font-bold"
                    : bill?.status === "UNPAID"
                    ? "text-red-600 font-bold"
                    : "text-yellow-600 font-bold"
                }`}
              >
                {bill?.status}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-600 font-bold mb-1">
                Verification Status
              </Text>
              <Text
                className={`text-sm ${
                  bill?.verification_status === "APPROVED"
                    ? "text-success font-bold"
                    : "text-yellow-600 font-bold"
                }`}
              >
                {bill?.verification_status}
              </Text>
            </View>
          </View>
        </View>

        {/* Category and Subcategory Section */}
        <View className="mb-6 border-b border-gray-200 pb-4">
          <Text className="text-sm text-gray-600 font-bold mb-1">Category</Text>
          <Text className="text-sm text-gray-800">{bill?.category}</Text>
          <Text className="text-sm text-gray-600 font-bold mt-2">
            Subcategory
          </Text>
          <Text className="text-sm text-gray-800">{bill?.sub_category}</Text>
        </View>

        {/* Description Section */}
        <View className="mb-6 border-b border-gray-200 pb-4">
          <Text className="text-sm text-gray-600 font-bold mb-1">
            Description
          </Text>
          <Text className="text-sm text-gray-800">{bill?.description}</Text>
        </View>

        {/* Invoice Date Section */}
        <View className="mb-6">
          <Text className="text-sm text-gray-600 font-bold mb-1">
            Invoice Date
          </Text>
          <Text className="text-sm text-gray-800">
            {new Date(bill?.invoice_date).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>

      {/* Action Button Section */}
      {(bill?.status !== "PAID" || bill.verification_status !== "APPROVED") && (
        <View className="p-4 border-t border-gray-200 bg-white">
          <TouchableOpacity
            onPress={() => setShowBottomSheet(true)}
            className="bg-primary p-3 rounded-lg"
          >
            <Text className="text-white text-center text-sm">Mark as Paid</Text>
          </TouchableOpacity>
        </View>
      )}

      {renderMarkAsPaidModal()}
    </View>
  );
};

export default ViewBill;
