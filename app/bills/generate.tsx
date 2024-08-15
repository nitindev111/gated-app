import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Switch,
  Modal,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import axiosInstance from "../utils/axiosInstance";
import { GENERATE_BILL } from "@/constants/api.constants";
import { useRouter } from "expo-router";
import { BACKEND_BASE_URL } from "@/config/config";
import { Picker } from "@react-native-picker/picker";

const GenerateBill = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [billDurationFrom, setBillDurationFrom] = useState(new Date());
  const [billDurationTo, setBillDurationTo] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState({ type: "", visible: false });
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [enableFixedBill, setEnableFixedBill] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const validateForm = () => {
    if (
      !category ||
      !subCategory ||
      !billDurationFrom ||
      !billDurationTo ||
      !invoiceDate ||
      !amount ||
      !name ||
      !dueDate
    ) {
      Alert.alert("Validation Error", "All fields are required.");
      return false;
    }
    if (Number(amount) <= 0) {
      Alert.alert("Validation Error", "Amount should be a positive number.");
      return false;
    }
    return true;
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    const selectedCategory = categories.find(
      (category: any) => category.name === value
    );
    setSubCategories(selectedCategory.subcategories || []);
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date
  ): void => {
    if (selectedDate) {
      if (showPicker.type === "from") setBillDurationFrom(selectedDate);
      if (showPicker.type === "to") setBillDurationTo(selectedDate);
      if (showPicker.type === "due") setDueDate(selectedDate);
      if (showPicker.type === "invoice") setInvoiceDate(selectedDate);
    }
    setShowPicker({ type: "", visible: false });
  };

  const handleGenerateBill = async () => {
    if (validateForm()) {
      setLoading(true);
      const payload = {
        bill_name: name?.trim(),
        description,
        duration_from: billDurationFrom.toISOString(),
        duration_to: billDurationTo.toISOString(),
        due_date: dueDate.toISOString(),
        invoice_date: invoiceDate.toISOString(),
        generated_at: new Date(),
        society_id: "668ec76634a193bb66e98ead",
        amount,
        category,
        sub_category: subCategory,
      };

      try {
        const url = BACKEND_BASE_URL + GENERATE_BILL;
        const response = await axiosInstance.post(url, payload);
        Alert.alert("Success", "Bill generated successfully", [
          {
            text: "OK",
            onPress: () => {
              resetForm();
              router.push("/bills/generated-bills");
            },
          },
        ]);
      } catch (error: any) {
        console.error("Error generating bill:", error.response.data);
        Alert.alert(
          "Error",
          error?.response?.data?.message || "Failed to generate Bills"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setCategory("");
    setName("");
    setSubCategory(""), setAmount("");
    setDescription("");
    setBillDurationFrom(new Date());
    setBillDurationTo(new Date());
    setDueDate(new Date());
    setInvoiceDate(new Date());
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 p-6"
          contentContainerStyle={{ paddingBottom: 100 }} // Ensure space for sticky button
        >
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2">Name</Text>
            <Switch
              value={enableFixedBill}
              onValueChange={setEnableFixedBill}
              className="border-gray-300 border-solid border p-2 rounded-lg shadow-sm"
            />
          </View>
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2">Name</Text>
            <TextInput
              autoFocus
              placeholder="Enter bill name"
              value={name}
              onChangeText={setName}
              className="border-gray-300 border-solid border p-2 rounded-lg shadow-sm"
            />
          </View>
          <View className="border border-gray-300 rounded-lg mb-4">
            <Picker
              selectedValue={category}
              onValueChange={handleCategoryChange}
              className="h-10"
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
                  selectedValue={subCategory}
                  onValueChange={setSubCategory}
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
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2">Base amount</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="Enter bill name"
              value={amount}
              onChangeText={setAmount}
              className="border-gray-300 border-solid border p-2 rounded-lg shadow-sm"
            />
          </View>
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2">Description</Text>
            <TextInput
              placeholder="Enter description"
              value={description}
              multiline={true}
              numberOfLines={4}
              onChangeText={setDescription}
              className="border-gray-300 border-solid border p-2 rounded-lg shadow-sm"
            />
          </View>
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2">
              Bill Duration From
            </Text>
            <TouchableOpacity
              onPress={() => setShowPicker({ type: "from", visible: true })}
            >
              <TextInput
                placeholder="Select Date"
                value={billDurationFrom.toDateString()}
                editable={false}
                className="border-gray-300 border-solid border p-2 rounded-lg shadow-sm"
              />
            </TouchableOpacity>
          </View>
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2">
              Bill Duration To
            </Text>
            <TouchableOpacity
              onPress={() => setShowPicker({ type: "to", visible: true })}
            >
              <TextInput
                placeholder="Select Date"
                value={billDurationTo.toDateString()}
                editable={false}
                className="border-gray-300 border-solid border p-2 rounded-lg shadow-sm"
              />
            </TouchableOpacity>
          </View>
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2">Due Date</Text>
            <TouchableOpacity
              onPress={() => setShowPicker({ type: "due", visible: true })}
            >
              <TextInput
                placeholder="Select Date"
                value={dueDate.toDateString()}
                editable={false}
                className="border-gray-300 border-solid border p-2 rounded-lg shadow-sm"
              />
            </TouchableOpacity>
          </View>
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2">Invoice Date</Text>
            <TouchableOpacity
              onPress={() => setShowPicker({ type: "invoice", visible: true })}
            >
              <TextInput
                placeholder="Select Date"
                value={invoiceDate.toDateString()}
                editable={false}
                className="border-gray-300 border-solid border p-2 rounded-lg shadow-sm"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Pressable
          className="flex items-center p-2 bg-primary px-4 py-4"
          onPress={() => setShowBillPreview(true)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white">Submit</Text>
          )}
        </Pressable>
        {showPicker.visible && (
          <DateTimePicker
            value={
              showPicker.type === "from"
                ? billDurationFrom
                : showPicker.type === "to"
                ? billDurationTo
                : showPicker.type === "due"
                ? dueDate
                : invoiceDate
            }
            mode="date"
            display="default"
            onChange={(event, data) => handleDateChange(event, data as Date)}
            style={{ width: "100%" }}
          />
        )}
      </KeyboardAvoidingView>
      <Modal
        visible={showBillPreview}
        onRequestClose={() => setShowBillPreview(false)}
        transparent={true}
      >
        <View className="flex-1 justify-end bg-gray-900 bg-opacity-50">
          <View className="bg-white rounded-t-lg max-h-[90%] min-h-[50%] p-2">
            <Text className="text-2xl font-bold">Bill Preview</Text>
            <View className="mt-2 border border-solid border-gray-100">
              <Text className="text-sm p-2">Bill Name : {name}</Text>
              <Text className="text-sm p-2">Bill Category : {category}</Text>
              <Text className="text-sm p-2">
                Bill Sub Category : {subCategory}
              </Text>
              <Text className="text-sm p-2">Amount : {amount}</Text>
              <Text className="text-sm p-2">
                Due Date : {dueDate.toDateString()}
              </Text>
              <Text className="text-sm p-2">
                Bill Duration : {billDurationFrom.toLocaleDateString()} -{" "}
                {billDurationTo.toLocaleDateString()}
              </Text>
              <Text className="text-sm p-2">
                Bill Type :{" "}
                {enableFixedBill
                  ? "Fixed Amount"
                  : "Variable Amount (Based on Unit type)"}
              </Text>
            </View>
            <View className="absolute bottom-0 left-0 right-0 flex-row bg-white p-4 border-t border-gray-200">
              <TouchableOpacity
                onPress={handleGenerateBill}
                className="flex-1 bg-primary p-3 rounded-lg mr-2"
              >
                <Text className="text-center text-white">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowBillPreview(false)}
                className="flex-1 bg-gray-300 p-3 rounded-lg"
              >
                <Text className="text-center text-black">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GenerateBill;
