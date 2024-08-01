import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, Alert } from "react-native";
import CheckBox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import axiosInstance from "@/app/utils/axiosInstance";

const PaidAmountDetails = () => {
  const router = useLocalSearchParams();
  const navRouter = useRouter();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [description, setDescription] = useState("");
  const [bill, setBill] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      const url = BACKEND_BASE_URL + `/bills/fetch?id=${router?.bill_id}`;

      try {
        const response = await axiosInstance.get(url);
        setBill(response.data);
      } catch (error) {
        console.error("Error fetching bill:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [router?.bill_id]);

  const handleOnSubmit = async (data: any) => {
    if (!date || !paymentType) {
      Alert.alert("Error", "Date and Type of Payment are mandatory");
      return;
    }
    if ((paymentType === "UPI" || paymentType === "Check") && !transactionId) {
      Alert.alert("Error", "Transaction ID or Check Number is mandatory");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "http://192.168.1.2:3000/api/bills/mark-paid",
        {
          bill_ids: [router?.bill_id],
          payment_proof: data,
        }
      );

      Alert.alert(
        "Success",
        "Bills marked successfully",
        [
          {
            text: "Okay",
            onPress: () => navRouter.navigate("/bills"),
            style: "default",
          },
        ],
        {
          cancelable: false,
        }
      );
    } catch (error) {
      console.error("Error submitting payment proof:", error);
      Alert.alert("Error", "Failed to mark payment as paid");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const renderTransactionInput = () => {
    if (paymentType === "UPI") {
      return (
        <TextInput
          className="border p-2 mb-4"
          placeholder="Transaction ID"
          value={transactionId}
          onChangeText={setTransactionId}
        />
      );
    } else if (paymentType === "Check") {
      return (
        <TextInput
          className="border p-2 mb-4"
          placeholder="Check Number"
          value={transactionId}
          onChangeText={setTransactionId}
        />
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-lg mb-2">Total Amount to be Paid</Text>
      <TextInput
        className="border p-2 mb-4"
        placeholder="Enter Amount"
        value={bill?.amount?.toString()}
        editable={false}
      />

      <Text className="text-lg mb-2">Date of Payment</Text>
      <View>
        <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Text className="text-lg mt-2">{date.toDateString()}</Text>
      </View>

      <Text className="text-lg mb-2 mt-4">Type of Payment</Text>
      <View className="flex-row items-center mb-4">
        <CheckBox
          value={paymentType === "Cash"}
          onValueChange={() => setPaymentType("Cash")}
          className="mr-2"
        />
        <Text className="mr-4">Cash</Text>

        <CheckBox
          value={paymentType === "UPI"}
          onValueChange={() => setPaymentType("UPI")}
          className="mr-2"
        />
        <Text className="mr-4">UPI</Text>

        <CheckBox
          value={paymentType === "Check"}
          onValueChange={() => setPaymentType("Check")}
          className="mr-2"
        />
        <Text>Check</Text>
      </View>

      {renderTransactionInput()}

      <Text className="text-lg mb-2">Description</Text>
      <TextInput
        className="border p-2 mb-4 h-20"
        placeholder="Enter Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Button
        title="Submit"
        onPress={() => {
          const data = {
            payment_date: date,
            payment_method: paymentType,
            transaction_id: transactionId,
            description,
            payment_screenshot_url: "http://google.com", // Placeholder URL
          };
          handleOnSubmit(data);
        }}
      />
    </ScrollView>
  );
};

export default PaidAmountDetails;
