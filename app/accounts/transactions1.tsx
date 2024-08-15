import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
} from "react-native";
import axiosInstance from "../utils/axiosInstance";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RUPEE_SYMBOL } from "@/constants/others";
import { useUser } from "../context/UserProvider";
import { Picker } from "@react-native-picker/picker";
import { BACKEND_BASE_URL } from "@/config/config";

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [filters, setFilters] = useState({
    accountId: "",
    createdAtFrom: null,
    createdAtTo: null,
    type: "",
  });
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState({
    field: "",
    visible: false,
  });
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useUser();
  const societyId = user?.society_id;

  const fetchTransactions = async (filterParams = {}) => {
    setLoading(true);
    try {
      const url = `${BACKEND_BASE_URL}/transactions/fetchAll`;
      const response = await axiosInstance.get(url, { params: filterParams });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    const url = `${BACKEND_BASE_URL}/accounts/view?society_id=${societyId}`;
    try {
      const response = await axiosInstance.get(url);
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, []);

  const handleApplyFilters = () => {
    const filterParams = {};

    if (filters.accountId) {
      filterParams.account_id = filters.accountId;
    }

    if (filters.createdAtFrom) {
      filterParams.startDate = new Date(filters.createdAtFrom);
    }

    if (filters.createdAtTo) {
      filterParams.endDate = new Date(filters.createdAtTo);
    }

    if (filters.type) {
      filterParams.type = filters.type;
    }
    console.log("filter", filterParams);

    fetchTransactions(filterParams);
    setShowFiltersModal(false);
  };

  const handleClearFilters = () => {
    setFilters({
      accountId: "",
      createdAtFrom: null,
      createdAtTo: null,
      type: "",
    });
    fetchTransactions();
    setShowFiltersModal(false);
  };

  const renderTransactionCard = (transaction) => (
    <View
      key={transaction._id}
      className="p-3 mb-4 bg-white shadow-md rounded-lg border border-gray-200"
    >
      <View className="flex-row justify-between items-center mb-1">
        <Text className="font-bold text-base">
          {RUPEE_SYMBOL + transaction.amount}
        </Text>
        <Text className="text-gray-500 text-sm">
          {new Date(transaction.date).toLocaleDateString()}
        </Text>
      </View>

      <View className="mb-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-gray-600 text-sm font-medium">
            Payment Method:
          </Text>
          <Text className="text-gray-800 text-sm">
            {transaction.payment_method}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-gray-600 text-sm font-medium">Type:</Text>
          <Text
            className={`text-${
              transaction.type === "INCOME" ? "green" : "red"
            }-600 text-sm`}
          >
            {transaction.type}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-gray-600 text-sm font-medium">
            Description:
          </Text>
          <Text className="text-gray-800 text-sm">
            {transaction.description}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600 text-sm font-medium">Created At:</Text>
          <Text className="text-gray-800 text-sm">
            {new Date(transaction.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>

      {transaction.attachment_urls &&
        transaction.attachment_urls.length > 0 && (
          <View className="flex-row flex-wrap mt-2">
            {transaction.attachment_urls.map((url, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(url)}
                className="mr-1 mb-1"
              >
                <Image
                  source={{ uri: url }}
                  className="w-12 h-12 rounded-lg border border-gray-300 bg-gray-200 object-cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-white">
        <Text className="text-lg text-gray-600">
          No Transactions to display
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="p-4 flex-row justify-between items-center">
        <Text className="text-lg font-bold">Transactions</Text>
        <TouchableOpacity
          onPress={() => setShowFiltersModal(true)}
          className="bg-primary p-2 rounded"
        >
          <Text className="text-white">Filter</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="p-4">
        {transactions.map((transaction) => renderTransactionCard(transaction))}
      </ScrollView>

      <Modal
        visible={showFiltersModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFiltersModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <Text className="text-lg font-bold mb-4">Filter Transactions</Text>
            <TouchableOpacity
              onPress={() => setShowAccountModal(true)}
              className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
            >
              <Text>
                {filters.accountId
                  ? accounts.find(
                      (account) => account._id === filters.accountId
                    )?.label
                  : "Select Account"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setShowDatePicker({ field: "createdAtFrom", visible: true })
              }
              className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
            >
              <Text>
                {filters.createdAtFrom
                  ? new Date(filters.createdAtFrom).toDateString()
                  : "Select From Date"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setShowDatePicker({ field: "createdAtTo", visible: true })
              }
              className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4"
            >
              <Text>
                {filters.createdAtTo
                  ? new Date(filters.createdAtTo).toDateString()
                  : "Select To Date"}
              </Text>
            </TouchableOpacity>
            <View className="border-gray-300 border-solid border border-1 p-2 rounded-lg mb-4">
              <Picker
                selectedValue={filters.type}
                onValueChange={(value) =>
                  setFilters((prevFilters) => ({ ...prevFilters, type: value }))
                }
              >
                <Picker.Item label="Select Type" value="" />
                <Picker.Item label="INCOME" value="INCOME" />
                <Picker.Item label="EXPENSE" value="EXPENSE" />
              </Picker>
            </View>
            <View className="flex flex-row justify-between">
              <TouchableOpacity
                onPress={handleClearFilters}
                className="bg-red-500 p-2 rounded w-[48%]"
              >
                <Text className="text-white text-center">Clear Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApplyFilters}
                className="bg-primary p-2 rounded w-[48%]"
              >
                <Text className="text-white text-center">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showDatePicker.visible && (
        <DateTimePicker
          value={
            filters[showDatePicker.field]
              ? new Date(filters[showDatePicker.field])
              : new Date()
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setFilters((prevFilters) => ({
                ...prevFilters,
                [showDatePicker.field]: selectedDate,
              }));
            }
            setShowDatePicker({ field: "", visible: false });
          }}
        />
      )}

      <Modal
        visible={!!selectedImage}
        transparent={false}
        onRequestClose={() => setSelectedImage(null)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-80">
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2"
          >
            <Text className="text-white text-lg">Close</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage || "" }}
            className="w-full h-[80vh] object-contain"
          />
        </View>
      </Modal>

      <Modal
        visible={showAccountModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAccountModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <ScrollView className="mb-4">
              {accounts.map((account) => (
                <TouchableOpacity
                  key={account._id}
                  onPress={() => {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      accountId: account._id,
                    }));
                    setShowAccountModal(false);
                  }}
                  className={`border-gray-300 border-solid border border-1 p-2 rounded-lg mb-2 ${
                    filters.accountId === account._id ? "bg-blue-100" : ""
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

export default Transactions;
