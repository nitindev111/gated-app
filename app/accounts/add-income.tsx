import { BACKEND_BASE_URL } from "@/config/config";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axiosInstance from "../utils/axiosInstance";
import FileUpload from "../components/common/FileUpload";
import { useRouter } from "expo-router";

const AddIncome = ({ societyId = "668ec76634a193bb66e98ead" }) => {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
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
          (category: any) => category.type === "INCOME"
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

  const handleUploadSuccess = (url: string) => {
    const urls = [];
    urls.push(url);
    console.log("urls", urls);

    setForm({ ...form, attachment_urls: urls });
  };

  const handleInputChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
    if (field === "category") {
      const selectedCategory = categories.find(
        (category) => category.name === value
      );
      setSubCategories(selectedCategory ? selectedCategory.subcategories : []);
    }
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
      const url = `${BACKEND_BASE_URL}/income/create`;
      const data = {
        category: form.category,
        sub_category: form.sub_category,
        account_id: form.account_id,
        description: form.description,
        amount: form.amount,
        date: form.date.toISOString(),
        payment_method: form.payment_method,
        type: "INCOME",
        attachment_urls: form.attachment_urls,
        transaction_ref_number: form.transaction_ref_number,
      };

      const response = await axiosInstance.post(url, data);
      Alert.alert("Success", "Income recorded successfully.");
      // Reset form
      setForm({
        category: "",
        sub_category: "",
        account_id: "",
        description: "",
        amount: "",
        date: new Date(),
        payment_method: "",
        type: "INCOME",
        attachment_urls: [],
        transaction_ref_number: "",
      });
      router.replace("/accounts/transactions");
    } catch (error) {
      console.error("Error recording income:", error.response?.data || error);
      Alert.alert("Error", "Failed to record income. Please try again.");
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
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="p-6"
      >
        <Text className="text-lg font-bold mb-4 text-center">
          Record Income
        </Text>
        <Text className="text-sm font-semibold mb-2">Category</Text>
        <View className="border border-gray-300 rounded-lg mb-4">
          <Picker
            selectedValue={form.category}
            onValueChange={(value) => handleInputChange("category", value)}
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

        <Text className="text-sm font-semibold mb-2">Payment Account</Text>
        <View className="border border-gray-300 rounded-lg mb-4">
          <Picker
            selectedValue={form.account_id}
            onValueChange={(value) => handleInputChange("account_id", value)}
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

        <Text className="text-sm font-semibold mb-2">Payment Method</Text>
        <View className="border border-gray-300 rounded-lg mb-4">
          <Picker
            selectedValue={form.payment_method}
            onValueChange={(value) =>
              handleInputChange("payment_method", value)
            }
          >
            <Picker.Item label="Select Payment Method" value="" />
            <Picker.Item value="ONLINE" label="Online (net banking, upi etc)" />
            <Picker.Item value="CASH" label="Cash" />
            <Picker.Item value="CHEQUE" label="Cheque" />
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
          className="mb-4 border border-gray-300 rounded-lg p-4 justify-center"
        >
          <Text>{form.date.toDateString()}</Text>
        </TouchableOpacity>
        <TextInput
          value={form.transaction_ref_number}
          onChangeText={(text) =>
            handleInputChange("transaction_ref_number", text)
          }
          placeholder="UPI/Transaction/Cheque number"
          className="mb-4 border border-gray-300 rounded-lg p-2"
        />
        <Text className="text-sm font-semibold mb-2">Description</Text>
        <TextInput
          value={form.description}
          onChangeText={(text) => handleInputChange("description", text)}
          placeholder="Description"
          className="mb-4 border border-gray-300 rounded-lg p-2"
        />

        <View className="flex-1 justify-center items-center">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </View>
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
      </ScrollView>
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-primary p-4 rounded-lg absolute bottom-0 left-0 right-0"
      >
        <Text className="text-white text-center font-bold">Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddIncome;
