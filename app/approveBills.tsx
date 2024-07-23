import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import { format } from "date-fns";
import CustomButton from "./components/CustomButton";
import axiosInstance from "./utils/axiosInstance";
import ViewBill from "./viewBill";
import { useRouter } from "expo-router";

const ApproveBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<any>(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const router = useRouter();

  const fetchBills = async () => {
    setLoading(true);
    const url = `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/bills/verification-pending?society_id=668ec76634a193bb66e98ead`;
    try {
      const response = await axiosInstance.get(url);
      setBills(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeBottomSheet = () => {
    setSelectedIndex(null);
    setIsBottomSheetVisible(false);
  };

  const handleApproveBill = async () => {
    setLoading(true);
    const url = `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/bills/approve`;
    try {
      const response = await axiosInstance.patch(url, {
        // @ts-expect-error
        billIds: [bills[selectedIndex]._id],
      });
      closeBottomSheet();
      Alert.alert(
        "Success",
        "Bills marked successfully",
        [
          {
            text: "Okay",
            onPress: async () => {
              setShouldRefetch(true);
              router.navigate("/approveBills");
            },
            style: "default",
          },
        ],
        {
          cancelable: false,
        }
      );
      console.log("response", response);
    } catch (error) {
      console.error("Error Approving bills:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    if (shouldRefetch) {
      fetchBills();
      setShouldRefetch(false); // Reset refetch trigger
    }
  }, [shouldRefetch]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FFA001" />
      </View>
    );
  }

  return (
    <>
      <View className="flex-1">
        <ScrollView className="flex-1 p-4 pt-2">
          {bills?.map((bill: any, index: number) => (
            <View
              key={bill._id}
              className="bg-white p-4 mb-4 rounded-lg shadow-md"
            >
              <View className="flex flex-row items-center">
                <Text className="text-md font-bold mb-1 capitalize">
                  {bill?.bill_category} {""}
                  {format(new Date(bill?.generated_at), "LLLL yyyy")}
                </Text>
              </View>
              <Text className="text-m text-gray-600 mb-1">
                Unit : {bill?.unit?.unit_number}
              </Text>
              <Text className="text-sm text-gray-600">
                Owner : {bill?.unit?.owner}
              </Text>
              <CustomButton
                handlePress={() => {
                  setIsBottomSheetVisible(true);
                  setSelectedIndex(index);
                }}
                title="View Bill"
                conntainerStyles={"h-[30px] w-full mt-2 text-s"}
                textStyles={"text-s"}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      <ViewBill
        isBottomSheetVisible={isBottomSheetVisible}
        closeBottomSheet={closeBottomSheet}
        bill={bills[selectedIndex]}
        handleApproveBill={handleApproveBill}
      />
    </>
  );
};

export default ApproveBills;
