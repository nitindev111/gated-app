import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import axiosInstance from "../utils/axiosInstance";
import { RUPEE_SYMBOL } from "@/constants/others";
import { BACKEND_BASE_URL } from "@/config/config";
import icons from "@/constants/icons";

const AccountsList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [deleteAccount, setDeleteAccount] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [newAccount, setNewAccount] = useState({
    label: "",
    type: "",
    description: "",
    balance: "",
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      const url = `${BACKEND_BASE_URL}/accounts/view?society_id=668ec76634a193bb66e98ead`;

      try {
        const response = await axiosInstance.get(url);
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleAddAccount = async () => {
    if (
      newAccount.label.trim() === "" ||
      newAccount.type.trim() === "" ||
      newAccount.description.trim() === "" ||
      newAccount.balance.trim() === ""
    ) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    const url = `${BACKEND_BASE_URL}/accounts/create`;

    try {
      const response = await axiosInstance.post(url, {
        ...newAccount,
        society_id: "668ec76634a193bb66e98ead",
      });
      setAccounts([...accounts, response.data]);
      setModalVisible(false);
      Alert.alert("Success", "Account added successfully!");
    } catch (error) {
      console.error("Error adding account:", error);
      Alert.alert("Error", "Failed to add account. Please try again.");
    }
  };

  const handleEditAccount = async () => {
    if (!currentAccount) return;

    const url = `${BACKEND_BASE_URL}/accounts/update-account/${currentAccount._id}`;
    console.log("url", url);

    try {
      const response = await axiosInstance.patch(url, {
        ...newAccount,
      });
      const updatedAccounts = accounts.map((account) =>
        account._id === currentAccount._id ? response.data : account
      );
      setAccounts(updatedAccounts);
      setModalVisible(false);
      Alert.alert("Success", "Account updated successfully!");
    } catch (error) {
      console.error("Error updating account:", error);
      Alert.alert("Error", "Failed to update account. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    const accountId = deleteAccount?._id;
    const url = `${BACKEND_BASE_URL}/accounts/delete/${accountId}`;

    try {
      await axiosInstance.delete(url);
      setAccounts(accounts.filter((account) => account._id !== accountId));
      Alert.alert("Success", "Account deleted successfully!");
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error", "Failed to delete account. Please try again.");
    } finally {
      setShowDeleteConfirmation(false);
      setDeleteAccount(null);
    }
  };

  const openEditModal = (account) => {
    setIsEditing(true);
    setCurrentAccount(account);
    setNewAccount({
      label: account.label,
      type: account.type,
      description: account.description,
      balance: account.balance.toString(),
    });
    setModalVisible(true);
  };

  const handleDeleteModal = (account) => {
    setShowDeleteConfirmation(true);
    setDeleteAccount(account);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setCurrentAccount(null);
    setNewAccount({
      label: "",
      type: "",
      description: "",
      balance: "",
    });
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <ScrollView className="flex-1 p-6 bg-white">
        {accounts.map((account) => (
          <View
            key={account._id}
            className="p-4 mb-4 bg-white rounded-lg shadow-md border border-gray-200 flex-row justify-between"
          >
            <View>
              <Text className="text-sm font-bold mb-2 uppercase">
                {account.label}
              </Text>
              <Text className="text-sm text-gray-600 mb-2">
                {account.description}
              </Text>
              <Text className="text-lg text-green-500 font-semibold">
                Balance: {RUPEE_SYMBOL + account.balance}
              </Text>
              <Text className="text-xs text-gray-400 mt-2">
                Updated at: {new Date(account.updated_at).toUTCString()}
              </Text>
            </View>

            {/* Three dots menu */}
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Options",
                  "Choose an action:",
                  [
                    {
                      text: "Edit Account",
                      onPress: () => openEditModal(account),
                    },
                    {
                      text: "Delete Account",
                      onPress: () => handleDeleteModal(account),
                      style: "destructive",
                    },
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                  ],
                  { cancelable: true }
                )
              }
              style={{ padding: 10 }}
            >
              <Image
                source={icons.threeDots}
                style={{ width: 24, height: 24, position: "absolute" }}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Add/Edit Account Modal */}
      <Modal
        visible={isModalVisible}
        onRequestClose={closeEditModal}
        animationType="slide"
      >
        <View className="bg-white p-6 rounded-lg">
          <Text className="text-lg font-bold mb-4">
            {isEditing ? "Edit Account" : "Add New Account"}
          </Text>

          <TextInput
            placeholder="Account Label"
            className="border border-gray-300 rounded p-2 mb-4"
            value={newAccount.label}
            onChangeText={(text) =>
              setNewAccount({ ...newAccount, label: text })
            }
          />
          <TextInput
            placeholder="Account Type (e.g., bank, cash)"
            className="border border-gray-300 rounded p-2 mb-4"
            value={newAccount.type}
            onChangeText={(text) =>
              setNewAccount({ ...newAccount, type: text })
            }
          />
          <TextInput
            placeholder="Description"
            className="border border-gray-300 rounded p-2 mb-4"
            value={newAccount.description}
            onChangeText={(text) =>
              setNewAccount({ ...newAccount, description: text })
            }
          />
          <TextInput
            placeholder="Balance"
            className="border border-gray-300 rounded p-2 mb-4"
            value={newAccount.balance}
            onChangeText={(text) =>
              setNewAccount({ ...newAccount, balance: text })
            }
            keyboardType="numeric"
          />

          <TouchableOpacity
            onPress={isEditing ? handleEditAccount : handleAddAccount}
            className={`${
              isEditing ? "bg-green-500" : "bg-blue-500"
            } p-4 rounded-lg mb-2`}
          >
            <Text className="text-white text-center">
              {isEditing ? "Update Account" : "Add Account"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={closeEditModal}
            className="bg-gray-500 p-4 rounded-lg"
          >
            <Text className="text-white text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={showDeleteConfirmation}
        onRequestClose={() => setShowDeleteConfirmation(false)}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-lg font-bold mb-4 text-center">
              Are you sure you want to delete the account?
            </Text>
            <TouchableOpacity
              onPress={handleDeleteAccount}
              className="bg-red-500 p-4 rounded-lg mb-2"
            >
              <Text className="text-white text-center">Delete Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowDeleteConfirmation(false)}
              className="bg-gray-500 p-4 rounded-lg"
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Account Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
      >
        <Image source={icons.plusIcon} style={{ width: 48, height: 48 }} />
      </TouchableOpacity>
    </>
  );
};

export default AccountsList;
