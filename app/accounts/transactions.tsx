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
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    accountId: "",
    createdAtFrom: null,
    createdAtTo: null,
    type: "",
    category: "",
    sub_category: "",
  });

  const getSubCategories = (category: string) => {
    if (!category) {
      return [];
    }
    const cat = categories.find((c) => c.name === category);
    if (cat) {
      return cat?.subcategories || [];
    }
  };

  const subCats = getSubCategories(filters.category);
  console.log("filrers", filters);

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
      const fetchedTransactions = response.data;
      setTransactions(fetchedTransactions);
      setTotalCount(fetchedTransactions.length); // Set total count based on length
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const url = `${BACKEND_BASE_URL}/categories/fetchAll`;
      const response = await axiosInstance.get(url);
      const categoriesResp = response.data;
      setCategories(categoriesResp);
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
    fetchCategories();
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
    if (filters.category) {
      filterParams.category = filters.category;
    }
    if (filters.sub_category) {
      filterParams.sub_category = filters.sub_category;
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

  const handleClearIndividualFilter = (filterKey) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: filterKey.includes("Date") ? null : "",
    }));
    handleApplyFilters();
  };

  const renderTransactionCard = (transaction: any) => (
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
          <Text className="text-gray-600 text-sm font-medium">Category</Text>
          <Text className="text-gray-800 text-sm">
            {transaction?.category || "NA"}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-gray-600 text-sm font-medium">
            Sub Category
          </Text>
          <Text className="text-gray-800 text-sm">
            {transaction?.sub_category || "NA"}
          </Text>
        </View>
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
            {transaction.attachment_urls.map((url, index) => {
              if (url) {
                return (
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
                );
              }
              return null;
            })}
          </View>
        )}
    </View>
  );

  const renderAppliedFilters = () => {
    const appliedFilters = Object.keys(filters).filter(
      (key) => filters[key] && filters[key] !== ""
    );

    if (appliedFilters.length === 0) {
      return null;
    }

    return (
      <View className="p-4 bg-white shadow-md rounded-lg mb-4">
        <Text className="text-sm text-gray-600 mb-2">Applied Filters:</Text>
        <View className="flex-row flex-wrap">
          {appliedFilters?.map((key) => {
            let displayValue;
            if (key === "createdAtFrom" || key === "createdAtTo") {
              displayValue = new Date(filters[key]).toDateString();
            } else if (key === "accountId") {
              displayValue =
                accounts.find((account) => account._id === filters[key])
                  ?.label || "Unknown Account";
            } else {
              displayValue = filters[key];
            }

            return (
              <View
                key={key}
                className="bg-primary-100 px-2 py-1 rounded-full flex-row items-center mb-2 mr-2"
              >
                <Text className="text-sm text-primary">
                  {`${
                    key === "accountId"
                      ? "Account"
                      : key === "createdAtFrom"
                      ? "From"
                      : key === "createdAtTo"
                      ? "To"
                      : key === "type"
                      ? "Type"
                      : key === "category"
                      ? "category"
                      : key
                  }: ${displayValue}`}
                </Text>
                <TouchableOpacity
                  onPress={() => handleClearIndividualFilter(key)}
                  className="ml-2"
                >
                  <Text className="text-red-500 font-bold">×</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <TouchableOpacity
          onPress={handleClearFilters}
          className="bg-secondary p-2 rounded w-full mt-2"
        >
          <Text className="text-white text-center">Clear All Filters</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  // if (transactions.length === 0) {
  //   return (
  //     <View className="flex-1 justify-center items-center p-6 bg-white">
  //       <Text className="text-lg text-gray-600">
  //         No Transactions to display
  //       </Text>
  //     </View>
  //   );
  // }

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

      {renderAppliedFilters()}

      {/* Display total count */}
      <View className="p-4 bg-white shadow-md rounded-lg mb-4">
        <Text className="text-sm text-gray-600">
          Total Results: {totalCount}
        </Text>
      </View>

      <ScrollView className="p-4">
        {transactions.map((transaction) => renderTransactionCard(transaction))}
      </ScrollView>

      {/* Filters Modal */}
      <Modal
        visible={showFiltersModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFiltersModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-lg font-bold mb-4">Apply Filters</Text>

            {/* Account Filter */}
            <Text className="text-sm font-medium mb-2">Account</Text>
            <View className="border border-gray-300 rounded-lg mb-4">
              <Picker
                selectedValue={filters.accountId}
                onValueChange={(value) =>
                  setFilters({ ...filters, accountId: value })
                }
              >
                <Picker.Item label="Select Account" value="" />
                {accounts.map((account) => (
                  <Picker.Item
                    key={account._id}
                    label={account.label}
                    value={account._id}
                  />
                ))}
              </Picker>
            </View>

            {/* Date Filters */}
            <Text className="text-sm font-medium mb-2">Date Range</Text>
            <TouchableOpacity
              onPress={() =>
                setShowDatePicker({ field: "createdAtFrom", visible: true })
              }
              className="border border-gray-300 p-2 rounded-lg mb-4"
            >
              <Text className="text-gray-600">
                {filters.createdAtFrom
                  ? new Date(filters.createdAtFrom).toDateString()
                  : "From Date"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setShowDatePicker({ field: "createdAtTo", visible: true })
              }
              className="border border-gray-300 p-2 rounded-lg mb-4"
            >
              <Text className="text-gray-600">
                {filters.createdAtTo
                  ? new Date(filters.createdAtTo).toDateString()
                  : "To Date"}
              </Text>
            </TouchableOpacity>

            {/* Type Filter */}
            <Text className="text-sm font-medium mb-2">Type</Text>
            <View className="border border-gray-300 rounded-lg mb-4">
              <Picker
                selectedValue={filters.type}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <Picker.Item label="Select Type" value="" />
                <Picker.Item label="Income" value="INCOME" />
                <Picker.Item label="Expense" value="EXPENSE" />
              </Picker>
            </View>
            <Text className="text-sm font-medium mb-2">Category</Text>
            <View className="border border-gray-300 rounded-lg mb-4">
              <Picker
                selectedValue={filters.category}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value, sub_category: "" })
                }
              >
                <Picker.Item label="Select Category" value="" />
                {categories?.map((c) => {
                  return <Picker.Item label={c.name} value={c.name} />;
                })}
              </Picker>
            </View>
            {subCats?.length > 0 && (
              <>
                <Text className="text-sm font-medium mb-2">Sub Category</Text>
                <View className="border border-gray-300 rounded-lg mb-4">
                  <Picker
                    selectedValue={filters.sub_category}
                    onValueChange={(value) =>
                      setFilters({ ...filters, sub_category: value })
                    }
                  >
                    <Picker.Item label="Select Category" value="" />
                    {subCats?.map((c) => {
                      return <Picker.Item label={c} value={c} />;
                    })}
                  </Picker>
                </View>
              </>
            )}

            {/* Apply and Clear Buttons */}
            <TouchableOpacity
              onPress={handleApplyFilters}
              className="bg-primary p-2 rounded mb-2"
            >
              <Text className="text-white text-center">Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleClearFilters}
              className="bg-secondary p-2 rounded"
            >
              <Text className="text-white text-center">Clear Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* DateTime Picker */}
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
                [showDatePicker.field]: selectedDate.toISOString(),
              }));
            }
            setShowDatePicker({ field: "", visible: false });
          }}
        />
      )}

      {/* Image Modal */}
      {selectedImage && (
        <Modal
          visible={true}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setSelectedImage(null)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-75">
            <Image
              source={{ uri: selectedImage }}
              className="w-4/5 h-4/5 rounded-lg object-contain"
            />
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              className="absolute top-10 right-10"
            >
              <Text className="text-white text-3xl font-bold">×</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Transactions;
