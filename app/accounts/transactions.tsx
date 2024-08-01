import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import axiosInstance from "../utils/axiosInstance";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RUPEE_SYMBOL } from "@/constants/others";
import { useUser } from "../context/UserProvider";
import { Picker } from "@react-native-picker/picker";

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
    fetchTransactions(); // Fetch all transactions initially
    fetchAccounts();
  }, []);

  const handleApplyFilters = () => {
    const filterParams: any = {};

    if (filters.accountId) {
      filterParams.account_id = filters.accountId;
    }

    if (filters.createdAtFrom) {
      filterParams.startDate = new Date(filters.createdAtFrom)
        .toISOString()
        .split("T")[0];
    }

    if (filters.createdAtTo) {
      filterParams.endDate = new Date(filters.createdAtTo)
        .toISOString()
        .split("T")[0];
    }

    if (filters.type) {
      filterParams.type = filters.type;
    }

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
    fetchTransactions(); // Fetch all transactions again with no filters
    setShowFiltersModal(false);
  };

  const renderTransactionCard = (transaction: any) => (
    <View
      key={transaction._id}
      className="p-4 mb-4 bg-white shadow-lg rounded-lg"
    >
      <Text className="font-bold text-lg">
        Amount: {RUPEE_SYMBOL + transaction.amount}
      </Text>
      <Text className="text-gray-600">
        Date: {new Date(transaction.date).toLocaleString()}
      </Text>
      <Text className="text-gray-600">
        Payment Method: {transaction.payment_method}
      </Text>
      <Text className="text-gray-600">Type: {transaction.type}</Text>
      <Text className="text-gray-600">
        Description: {transaction.description}
      </Text>
      <Text className="text-gray-600">
        Created At: {new Date(transaction.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="p-4 flex-row justify-between items-center">
        <Text className="text-lg font-bold">Transactions</Text>
        <TouchableOpacity
          onPress={() => setShowFiltersModal(true)}
          className="bg-blue-500 p-2 rounded"
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
        onRequestClose={() => setShowFiltersModal(false)} // Handles back button press on Android
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
                      (account: any) => account._id === filters.accountId
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
                className="bg-blue-500 p-2 rounded w-[48%]"
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
        visible={showAccountModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAccountModal(false)} // Handles back button press on Android
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
