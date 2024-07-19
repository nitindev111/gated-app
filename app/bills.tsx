import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import axios from "axios";
import { format, getMonth } from "date-fns";
import CheckBox from "expo-checkbox";
import CustomButton from "./components/CustomButton";
import { router } from "expo-router";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBills, setSelectedBills] = useState([]);
  const [showCheckBoxes, setShowCheckBoxes] = useState(false);

  const toggleBillSelection = (billId: string) => {
    setSelectedBills((prevSelectedBills: any) => {
      if (prevSelectedBills.includes(billId)) {
        return prevSelectedBills.filter((id: string) => id !== billId);
      } else {
        return [...prevSelectedBills, billId];
      }
    });
  };

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      const url = process.env.EXPO_PUBLIC_BACKEND_BASE_URL + `/bills/fetchAll`;
      console.log("====================================");
      console.log("url", url);
      console.log("====================================");
      try {
        const response = await axios.post(url, {
          filters: {},
          sortCriteria: { verification_status: -1 },
        });
        setBills(response.data);
      } catch (error) {
        console.error("Error fetching bills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FFA001" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex m-4 items-center border-solid border-2">
        <Text className="text-m">Total Due</Text>
        <Text className="text-red-500 text-m">Rs. 1200</Text>
      </View>
      <ScrollView className="flex-1 p-4">
        {bills.map((bill: any) => (
          <View
            key={bill._id}
            className="bg-white p-4 mb-4 rounded-lg shadow-md"
          >
            <View className="flex flex-row items-center">
              {showCheckBoxes && (
                <CheckBox
                  // @ts-ignore
                  value={selectedBills.includes(bill._id)}
                  onValueChange={() => toggleBillSelection(bill._id)}
                  style={{ marginRight: 10 }}
                />
              )}

              <Text className="text-md font-bold  mb-1 capitalize">
                {bill?.bill_category}{" "}
                {format(new Date(bill?.generated_at), "LLLL yyyy")}
              </Text>
            </View>

            <View className="flex flex-row gap-2 items-center">
              <Text
                className={`text-xs ${
                  bill.verification_status === "verified"
                    ? "text-green-600 "
                    : "text-red-600 bg-red-200 rounded-md p-1"
                } uppercase`}
              >
                {bill?.verification_status}
              </Text>

              <Text className="text-m text-black-600 mb-1 capitalize">
                {format(new Date(bill?.generated_at), "dd MMM yyyy")}
              </Text>
            </View>

            <Text className="text-m text-gray-600 mb-1">
              Amount: {bill?.amount}
            </Text>
            <Text className="text-sm text-gray-600">
              Due Date {format(new Date(bill?.due_date), "dd MMM yyyy")}
            </Text>
            <CustomButton
              handlePress={() => {
                router.push({
                  pathname: "/mark-paid",
                  params: { bill_id: bill._id },
                });
              }}
              title="Mark as Paid"
              conntainerStyles={"h-[30px] w-full mt-2 text-s"}
              textStyles={"text-s"}
              isDisabled={
                bill.verification_status === "pending" ||
                bill.verification_status === "verified"
              }
            />
          </View>
        ))}
      </ScrollView>
      <View></View>
    </View>
  );
};

export default Bills;
