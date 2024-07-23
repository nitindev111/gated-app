import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomButton from "../CustomButton";
import { format } from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ViewBillDetailsProps {
  bill: any;
  handleApproveBill: () => void;
}

const ViewBillDetails: React.FC<ViewBillDetailsProps> = ({
  bill,
  handleApproveBill,
}) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center h-full">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 flex-col justify-between">
      <ScrollView className="flex-column gap-2 bg-white py-2">
        <View className="bg-red-50 flex-row items-center justify-evenly">
          <Ionicons name="business" size={32} color="green" />
          <View className="p-2">
            <Text className="text-sm">
              Unit Number: {bill?.unit?.unit_number}
            </Text>
            <Text className="text-sm mb-2">
              Owner Name: {bill?.unit?.owner}
            </Text>
          </View>
        </View>
        <View>
          <Text className="font-bold text-lg">Payment Details</Text>
          <View className="p-2">
            <Text className="text-sm">Total Amount: {bill?.amount}</Text>
            <Text className="text-sm">Category: {bill?.bill_category}</Text>
            <Text className="text-sm">
              Payment Date:{" "}
              {format(new Date(bill?.payment_proof?.payment_date), "P")}
            </Text>
            <Text className="text-sm">
              Payment Type: {bill?.payment_proof?.payment_type}
            </Text>
            <Text className="text-sm">
              Transaction/Check No. : {bill?.payment_proof?.transaction_id}
            </Text>
            <Text className="text-sm">
              Description : {bill?.payment_proof?.description || "NA"}
            </Text>
            {bill?.payment_proof?.payment_screenshot_url && (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                  source={{ uri: bill.payment_proof.payment_screenshot_url }}
                  className="w-32 h-32 mt-4"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      <View className="bottom-8 p-4">
        <CustomButton
          title="Approve Bill"
          handlePress={handleApproveBill}
          conntainerStyles={"p-4"}
        />
      </View>
      {bill?.payment_proof?.payment_screenshot_url && (
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/60">
            <View className="bg-white p-4 rounded-lg">
              <Image
                source={{ uri: bill.payment_proof?.payment_screenshot_url }}
                className="w-[80vw] h-80"
                resizeMode="contain"
              />
              <CustomButton
                title="Close"
                handlePress={() => setModalVisible(false)}
                conntainerStyles={
                  "flex text-center w-[100px] p-2 mt-4 self-center"
                }
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ViewBillDetails;
