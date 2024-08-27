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
import { format } from "date-fns";

const ViewBill = () => {
  const [loading, setLoading] = useState(false);
  const { bill_id, unit_number, unit_name } = useLocalSearchParams();
  const [bill, setBill] = useState<any>(null);
  const [accounts, setAccounts] = useState([]);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEditbillDueDate, setShowEditbillDueDate] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    account_id: "",
    date: new Date(),
    voucherCode: "",
    paymentMode: "",
    description: "",
    transaction_ref_number: "",
    attachment_urls: [""],
  });
  const [showEditBottomSheet, setShowEditBottomSheet] = useState(false);
  const [editDetails, setEditDetails] = useState({
    amount: bill?.amount || "",
    due_date: bill?.due_date || new Date(),
    description: bill?.description || "",
    reason_for_change: "",
  });

  const { user } = useUser();

  const perfillEditDetails = () => {
    setEditDetails({
      amount: bill?.amount || "",
      due_date: new Date(bill?.due_date),
      description: bill?.description || "",
      reason_for_change: "",
    });
  };

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
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${BACKEND_BASE_URL}/accounts/view?society_id=${user?.society_id}`
      );
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
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
      title: "",
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

  const validateEditForm = () => {
    const { amount, due_date, description, reason_for_change } = editDetails;
    if (!amount || !due_date || !description || !reason_for_change) {
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleEditBill = async () => {
    if (!validateEditForm) return;
    setLoading(true);
    try {
      const url = `${BACKEND_BASE_URL}/bills/edit/${bill_id}`;

      const data = {
        bill_id: bill._id,
        user_id: user._id, // Tracking who made the changes
        ...editDetails,
      };

      const response = await axiosInstance.patch(url, data);
      console.log("Response:", response.data);
      Alert.alert("Bill Successfully Edited");
      setShowEditBottomSheet(false);
      await fetchBill(); // Refresh the bill data after editing
    } catch (error) {
      console.error("Failed to edit bill:", error);
    } finally {
      setLoading(false);
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
                display="compact"
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
              <Picker.Item label="Cheque" value="CHEQUE" />
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

  console.log("====================================");
  console.log("bill", bill);
  console.log("====================================");

  const renderEditBillModal = () => {
    console.log("edit", editDetails);

    return (
      <Modal
        visible={showEditBottomSheet}
        animationType="slide"
        transparent={false}
      >
        <View className="flex-1 bg-white p-6 gap-2">
          <Text className="text-lg font-bold mb-4">Edit Bill</Text>
          <TextInput
            inputMode="decimal"
            placeholder="Amount"
            value={editDetails.amount.toString()}
            onChangeText={(text) =>
              setEditDetails({ ...editDetails, amount: text })
            }
            keyboardType="numeric"
            className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
          />
          <TouchableOpacity
            onPress={() => setShowEditbillDueDate(true)}
            className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
          >
            <Text>{format(editDetails.due_date, "PPP")}</Text>
          </TouchableOpacity>
          {showEditbillDueDate && (
            <DateTimePicker
              value={editDetails.due_date}
              mode="date"
              display="compact"
              onChange={(event, selectedDate) => {
                setShowEditbillDueDate(false);
                if (selectedDate) {
                  setEditDetails({ ...editDetails, due_date: selectedDate });
                }
              }}
            />
          )}

          <TextInput
            placeholder="Description"
            value={editDetails.description}
            onChangeText={(text) =>
              setEditDetails({ ...editDetails, description: text })
            }
            className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
          />

          {/* Reason for Change Input */}
          <TextInput
            placeholder="Reason for Change"
            value={editDetails.reason_for_change}
            onChangeText={(text) =>
              setEditDetails({ ...editDetails, reason_for_change: text })
            }
            className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
          />

          <View className="flex flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleEditBill}
              className="flex-1 bg-primary p-4 rounded-lg"
            >
              <Text className="text-white text-center">Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowEditBottomSheet(false)}
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
      <ScrollView className="flex-1 ">
        <View className="mb-2 border-b border-gray-200 pb-2">
          <Text className="font-bold text-xl">Unit {unit_number}</Text>
          <Text className="text-sm mb-2 text-gray-600">{unit_name}</Text>
        </View>
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
        <View className="mb-6 flex flex-row justify-between">
          <View className="flex-1 mr-4">
            <Text className="text-sm text-gray-600 font-bold mb-1">
              Invoice Date
            </Text>
            <Text className="text-sm text-gray-800">
              {new Date(bill?.invoice_date).toLocaleDateString()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm text-gray-600 font-bold mb-1">
              Payment Date
            </Text>
            <Text className="text-sm text-gray-800">
              {bill?.payment_proof?.payment_date
                ? new Date(
                    bill?.payment_proof?.payment_date
                  ).toLocaleDateString()
                : "NA"}
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
        <View className="p-4 border-t border-gray-200 bg-white flex flex-row justify-between gap-2">
          <TouchableOpacity
            onPress={() => setShowBottomSheet(true)}
            className="bg-primary p-3 rounded-lg w-[50%]"
          >
            <Text className="text-white text-center text-sm">Mark as Paid</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              perfillEditDetails();
              setShowEditBottomSheet(true);
            }}
            className="flex-1 bg-yellow-600 p-4 rounded-lg"
          >
            <Text className=" text-white text-center">Edit Bill</Text>
          </TouchableOpacity>
        </View>
      )}
      {renderMarkAsPaidModal()}
      {renderEditBillModal()}
    </View>
  );
};

export default ViewBill;
