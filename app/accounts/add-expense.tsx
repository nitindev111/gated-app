import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Keyboard,
} from "react-native";
import axiosInstance from "../utils/axiosInstance";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BACKEND_BASE_URL } from "@/config/config";
import FileUpload from "../components/common/FileUpload";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AddExpense = ({ societyId = "668ec76634a193bb66e98ead" }) => {
  const router = useRouter();
  const [categories, setCategories] = useState(["Electricity", "Salary"]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);
  const [form, setForm] = useState({
    category: "",
    sub_category: "",
    account_id: "",
    description: "",
    amount: "",
    date: new Date(),
    payment_method: "",
    type: "INCOME",
    attachment_urls: [""],
    transaction_ref_number: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

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

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          `${BACKEND_BASE_URL}/categories/fetchAll`
        );
        const incomeCategories = response.data.filter(
          (category: any) => category.type === "EXPENSE"
        );
        setCategories(incomeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchAccounts();
      await fetchCategories();
      setLoading(false);
    };

    fetchData();
  }, [societyId]);

  const handleInputChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
    if (field === "category") {
      const selectedCategory = categories.find(
        (category) => category.name === value
      );
      setSubCategories(selectedCategory ? selectedCategory.subcategories : []);
    }
  };

  const handleUploadSuccess = (url: string) => {
    const urls = [];
    urls.push(url);
    console.log("urls", urls);

    setForm({ ...form, attachment_urls: urls });
  };

  const validateForm = () => {
    if (
      !form.category ||
      !form.sub_category ||
      !form.account_id ||
      !form.description ||
      !form.amount ||
      !form.date ||
      !form.payment_method
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
    setLoading(true);
    try {
      const url = `${BACKEND_BASE_URL}/expense/create`;
      const data = {
        category: form.category,
        sub_category: form.sub_category,
        account_id: form.account_id,
        description: form.description,
        amount: form.amount,
        date: form.date.toISOString(),
        payment_method: form.payment_method,
        type: "EXPENSE",
        attachment_urls: form.attachment_urls,
        transaction_ref_number: form.transaction_ref_number,
      };
      console.log("DATA", data);

      const response = await axiosInstance.post(url, data);
      console.log("Expense recorded successfully:", response.data);
      Alert.alert("Success", "Expense recorded successfully.");
      // Reset form
      setForm({
        category: "",
        sub_category: "",
        account_id: "",
        description: "",
        amount: "",
        date: new Date(),
        payment_method: "",
        type: "EXPENSE",
        attachment_urls: [],
        transaction_ref_number: "",
      });
      router.replace("/accounts/transactions");
    } catch (error) {
      console.error("Error recording expense:", error.response.data);
      Alert.alert("Error", "Failed to record expense. Please try again.");
    } finally {
      setLoading(false);
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
    <View className="flex-1">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} // Add padding to prevent hiding input
        extraScrollHeight={Platform.OS === "ios" ? 100 : 280}
        className="p-6"
      >
        <Text className="text-lg font-bold mb-4">Record Expense</Text>
        <Text className="text-sm font-semibold mb-2">Category</Text>
        <View className="border border-gray-300 rounded-lg mb-4">
          <Picker
            selectedValue={form.category}
            onValueChange={(value) => handleInputChange("category", value)}
            className="h-10"
            onFocus={dismissKeyboard}
          >
            <Picker.Item label="Select Category" value="" />
            {categories.map((category, index) => (
              <Picker.Item
                key={index}
                label={category.name}
                value={category.name}
              />
            ))}
          </Picker>
        </View>

        {subCategories.length > 0 && (
          <>
            <Text className="text-sm font-semibold mb-2">Sub Category</Text>
            <View className="border border-gray-300 rounded-lg mb-4">
              <Picker
                selectedValue={form.sub_category}
                onValueChange={(value) =>
                  handleInputChange("sub_category", value)
                }
                onFocus={dismissKeyboard}
                className="h-10"
              >
                <Picker.Item label="Select Sub Category" value="" />
                {subCategories.map((subCategory, index) => (
                  <Picker.Item
                    key={index}
                    label={subCategory}
                    value={subCategory}
                  />
                ))}
              </Picker>
            </View>
          </>
        )}
        <Text className="text-sm font-semibold mb-2">Payment Method</Text>
        <View className="border border-gray-300 rounded-lg mb-4">
          <Picker
            selectedValue={form.payment_method}
            onValueChange={(value) =>
              handleInputChange("payment_method", value)
            }
            className="h-10"
            onFocus={dismissKeyboard}
          >
            <Picker.Item label="Select Account" value="" />
            <Picker.Item value="ONLINE" label="Online (net banking, upi etc)" />
            <Picker.Item value="CASH" label="Cash" />
            <Picker.Item value="CHEQUE" label="Cheque" />
          </Picker>
        </View>

        <Text className="text-sm font-semibold mb-2">Payment From</Text>
        <View className="border border-gray-300 rounded-lg mb-4">
          <Picker
            selectedValue={form.account_id}
            onValueChange={(value) => handleInputChange("account_id", value)}
            onFocus={dismissKeyboard}
            className="h-10"
          >
            <Picker.Item label="Select Account" value="" />
            {accounts.map((account: any) => (
              <Picker.Item
                key={account._id}
                label={account.label}
                value={account._id}
              />
            ))}
          </Picker>
        </View>

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
            display="compact"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                handleInputChange("date", selectedDate);
              }
            }}
          />
        )}
        <Text className="text-sm font-semibold mb-2">Description</Text>
        <TextInput
          value={form.description}
          onChangeText={(text) => handleInputChange("description", text)}
          placeholder="Description"
          className="mb-4 border border-gray-300 rounded-lg p-2"
        />

        <Text className="text-sm font-semibold mb-2">
          Transaction Ref Number (Optional)
        </Text>
        <TextInput
          value={form.transaction_ref_number}
          onChangeText={(text) =>
            handleInputChange("transaction_ref_number", text)
          }
          placeholder="UPI/Transaction/Cheque number"
          className="mb-4 border border-gray-300 rounded-lg p-2"
        />

        <View className="flex-1 justify-center items-center">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </View>
      </KeyboardAwareScrollView>
      <View className="sticky bottom-0 left-0 right-0">
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-primary p-4 rounded-lg"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size={"small"} />
          ) : (
            <Text className="text-white text-center font-bold">Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddExpense;
