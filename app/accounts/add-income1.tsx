import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import axiosInstance from "../utils/axiosInstance";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Modalize } from "react-native-modalize";
import { BACKEND_BASE_URL } from "@/config/config";

const AddIncome = ({ societyId = "668ec76634a193bb66e98ead" }) => {
  const [categories, setCategories] = useState(["Electricity", "Salary"]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    category: "",
    account: "",
    description: "",
    amount: "",
    date: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categoryModalRef = useRef(null);
  const accountModalRef = useRef(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axiosInstance.get(
          `${BACKEND_BASE_URL}/accounts/view?society_id=${societyId}`
        );
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAccounts()]);
      setLoading(false);
    };

    fetchData();
  }, [societyId]);

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validateForm = () => {
    if (
      !form.category ||
      !form.account ||
      !form.description ||
      !form.amount ||
      !form.date
    ) {
      Alert.alert("Validation Error", "All fields are required.");
      return false;
    }
    if (Number(form.amount) <= 0) {
      Alert.alert("Validation Error", "Amount should be a positive number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const url = `${BACKEND_BASE_URL}/income/create`;
      const data = {
        category: form.category,
        account: form.account,
        description: form.description,
        amount: form.amount,
        date: form.date.toISOString(),
      };
      const response = await axiosInstance.post(url, data);
      console.log("Income recorded successfully:", response.data);
      Alert.alert("Success", "Income recorded successfully.");
      // Reset form
      setForm({
        category: "",
        account: "",
        description: "",
        amount: "",
        date: new Date(),
      });
    } catch (error) {
      console.error("Error recording income:", error);
      Alert.alert("Error", "Failed to record income. Please try again.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="p-6"
      >
        <Text className="text-lg font-bold mb-4">Record Income</Text>
        <Text className="text-sm font-semibold mb-2">Category</Text>
        <TouchableOpacity
          onPress={() => categoryModalRef.current?.open()}
          className="mb-4 border border-gray-300 rounded-lg p-2"
        >
          <Text>{form.category || "Select Category"}</Text>
        </TouchableOpacity>

        <Text className="text-sm font-semibold mb-2">Payment Account</Text>
        <TouchableOpacity
          onPress={() => accountModalRef.current?.open()}
          className="mb-4 border border-gray-300 rounded-lg p-2"
        >
          <Text>{form.account || "Select Account"}</Text>
        </TouchableOpacity>

        <Text className="text-sm font-semibold mb-2">Description</Text>
        <TextInput
          value={form.description}
          onChangeText={(text) => handleInputChange("description", text)}
          placeholder="Description"
          className="mb-4 border border-gray-300 rounded-lg p-2"
        />

        <Text className="text-sm font-semibold mb-2">Amount</Text>
        <TextInput
          value={form.amount}
          onChangeText={(text) => handleInputChange("amount", text)}
          placeholder="Amount"
          keyboardType="numeric"
          className="mb-4 border border-gray-300 rounded-lg p-2"
        />

        <Text className="text-sm font-semibold mb-2">Transaction Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="mb-4 border border-gray-300 rounded-lg p-2 justify-center"
        >
          <Text>{form.date.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={form.date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                handleInputChange("date", selectedDate);
              }
            }}
          />
        )}
      </ScrollView>
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-500 p-4 rounded-lg absolute bottom-0 left-0 right-0"
      >
        <Text className="text-white text-center font-bold">Submit</Text>
      </TouchableOpacity>

      {/* Category Bottom Sheet */}
      <Modalize ref={categoryModalRef} adjustToContentHeight>
        <View className="p-4">
          <Text className="text-lg font-bold mb-4">Select Category</Text>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                handleInputChange("category", category);
                categoryModalRef.current?.close();
              }}
              className="p-4 border-b border-gray-300"
            >
              <Text>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modalize>

      {/* Account Bottom Sheet */}
      <Modalize ref={accountModalRef} adjustToContentHeight>
        <View className="p-4">
          <Text className="text-lg font-bold mb-4">Select Account</Text>
          {accounts.map((account) => (
            <TouchableOpacity
              key={account._id}
              onPress={() => {
                handleInputChange("account", account.description);
                accountModalRef.current?.close();
              }}
              className="p-4 border-b border-gray-300"
            >
              <Text>{account.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modalize>
    </View>
  );
};

export default AddIncome;
