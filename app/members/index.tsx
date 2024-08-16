import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Linking,
} from "react-native";
import axiosInstance from "../utils/axiosInstance";
import { BACKEND_BASE_URL } from "@/config/config";
import { useUser } from "../context/UserProvider";
import { RUPEE_SYMBOL } from "@/constants/others";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
const UNITS_API = "/units";

const ViewUnits = () => {
  const [unitsData, setUnitsData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [maintenanceData, setMaintenanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showAdditionalStartDatePicker, setShowAdditionalStartDatePicker] =
    useState(false);
  const [showAdditionalEndDatePicker, setShowAdditionalEndDatePicker] =
    useState(false);

  const { user } = useUser();

  const clearSearch = () => {
    setSearchQuery("");
  };

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const unitsUrl =
        BACKEND_BASE_URL + UNITS_API + "/society/" + user?.society_id;
      const unitsResponse = await axiosInstance.get(unitsUrl);
      setUnitsData(unitsResponse.data);
    } catch (error) {
      console.error("Failed to fetch units or users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredUnits(unitsData);
    } else {
      setFilteredUnits(
        unitsData.filter(
          (unit: any) =>
            unit.unit_number
              .toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (unit.name &&
              unit.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    }
  }, [searchQuery, unitsData]);

  const fetchMaintenance = async (unitId: string) => {
    try {
      const response = await axiosInstance.get(
        `${BACKEND_BASE_URL}/units/${user?.society_id}/maintenance/${unitId}`
      );
      setMaintenanceData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch maintenance data:", error);
    }
  };

  useEffect(() => {
    if (user?.society_id) {
      fetchUnits();
    }
  }, [user?.society_id]);

  const handleDeleteUnit = async (unitId) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`${BACKEND_BASE_URL}${UNITS_API}/${unitId}`);
      fetchUnits();
    } catch (error) {
      console.error("Failed to delete unit:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (unitId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this unit?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteUnit(unitId),
        },
      ]
    );
  };

  const handleView = (unit) => {
    setSelectedUnit(unit);
    setModalVisible(true);
    fetchMaintenance(unit?._id);
  };

  const handleUpdate = (unit) => {
    setSelectedUnit(unit);
    setUpdateModalVisible(true);
  };

  const handleMakeCall = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleUpdateSubmit = async () => {
    const payload = { ...selectedUnit };
    delete payload._id;
    delete payload.society_id;
    // delete payload.society_id;

    Alert.alert(
      "Confirm Update",
      "Are you sure you want to update this unit?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Update",
          onPress: async () => {
            try {
              await axiosInstance.patch(
                `${BACKEND_BASE_URL}${UNITS_API}/update/${selectedUnit._id}`,
                { ...payload }
              );
              setUpdateModalVisible(false);
              fetchUnits();
            } catch (error) {
              console.error("Failed to update unit:", error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (unitsData.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-white">
        <Text className="text-lg text-gray-600">No units to display</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-6 bg-gray-200">
      <View className="flex-row items-center border border-white mb-4 rounded-2xl">
        <TextInput
          className="flex-1 bg-white p-2 rounded-2xl"
          placeholder="Search by Unit or Owner Name"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} className="p-1">
            <Ionicons name="close-circle" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>
      {filteredUnits.map((unit, index) => (
        <View
          key={index}
          className=" p-4  mb-4 bg-white shadow-md rounded-lg border border-gray-200"
        >
          <Text className="text-lg font-semibold mb-2">
            Unit : {unit.unit_number}
          </Text>
          <Text className="text-sm  mb-2">Owner: {unit.name || "Unknown"}</Text>
          <Text className="text-sm text-gray-600 mb-2">
            Unit Type: {unit.unit_type || "Unknown"}
          </Text>
          <View className="flex-row justify-between mt-2">
            <TouchableOpacity
              onPress={() => handleView(unit)}
              className="bg-primary p-2 rounded-lg flex-1 mr-2"
            >
              <Text className="text-white text-center">View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleUpdate(unit)}
              className="bg-green-600 p-2 rounded-lg flex-1 ml-2"
            >
              <Text className="text-white text-center">Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-gray-900 bg-opacity-50">
          <View className="bg-white p-6 rounded-t-3xl">
            {selectedUnit && (
              <>
                <View className="mb-4">
                  <Text className="text-lg font-bold text-gray-800">
                    Unit : {selectedUnit.unit_number}
                  </Text>
                  <Text className="mt-2 text-sm text-gray-700">
                    Owner: {selectedUnit?.name || "Unknown"}
                  </Text>
                </View>

                <View className="border-t border-gray-200 pt-4">
                  <TouchableOpacity
                    onPress={() => handleMakeCall(selectedUnit?.phoneNumber)}
                  >
                    <View className="flex-row items-center mb-3">
                      <Text className="text-sm text-gray-600">
                        Phone Number:
                      </Text>
                      <Text className="ml-2 text-primary">
                        {selectedUnit?.phoneNumber || "N/A"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View className="flex-row items-center mb-3">
                    <Text className="text-sm text-gray-600">
                      Has Construction:
                    </Text>
                    <Text className="ml-2 text-gray-800">
                      {selectedUnit.has_construction ? "Yes" : "No"}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-3">
                    <Text className="text-sm text-gray-600">
                      Construction Started:
                    </Text>
                    <Text className="ml-2 text-gray-800">
                      {new Date(
                        selectedUnit.construction_start_date
                      ).toLocaleDateString() || "-"}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-3">
                    <Text className="text-sm text-gray-600">
                      Construction Ending:
                    </Text>
                    <Text className="ml-2 text-gray-800">
                      {new Date(
                        selectedUnit.construction_end_date
                      ).toLocaleDateString() || "-"}
                    </Text>
                  </View>
                </View>

                <View className="border-t border-gray-200 pt-4 mt-4">
                  <View className="flex-row items-center mb-3">
                    <Text className="text-sm text-gray-600">
                      Monthly Charges:
                    </Text>
                    <Text className="ml-2 text-gray-800">
                      {RUPEE_SYMBOL +
                        maintenanceData?.monthly_maintenance.total}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-3">
                    <Text className="text-sm text-gray-600">
                      Annual Charges:
                    </Text>
                    <Text className="ml-2 text-gray-800">
                      {RUPEE_SYMBOL + maintenanceData?.annual_maintenance.total}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="mt-6 bg-primary p-3 rounded-lg"
                >
                  <Text className="text-center text-white font-semibold">
                    Close
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isUpdateModalVisible}
        onRequestClose={() => setUpdateModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-gray-200 bg-opacity-200">
          <View className="bg-white rounded-t-lg max-h-[90%]">
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 80,
              }}
              showsVerticalScrollIndicator={false}
            >
              {selectedUnit && (
                <>
                  <Text className="text-lg font-bold mb-4">
                    Update Unit Details
                  </Text>

                  <TextInput
                    className="border border-gray-300 p-2 mb-4 rounded"
                    placeholder="Owner Name"
                    value={selectedUnit.name}
                    onChangeText={(text) =>
                      setSelectedUnit({ ...selectedUnit, name: text })
                    }
                  />
                  <TextInput
                    className="border border-gray-300 p-2 mb-4 rounded"
                    placeholder="Phone Number"
                    value={selectedUnit.phoneNumber}
                    onChangeText={(text) =>
                      setSelectedUnit({ ...selectedUnit, phoneNumber: text })
                    }
                  />

                  <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">
                      Unit Type:
                    </Text>
                    <View className="border border-gray-300 rounded mb-2">
                      <Picker
                        selectedValue={selectedUnit.unit_type}
                        onValueChange={(itemValue) =>
                          setSelectedUnit({
                            ...selectedUnit,
                            unit_type: itemValue,
                          })
                        }
                      >
                        <Picker.Item label="NORMAL" value="NORMAL" />
                        <Picker.Item
                          label="UNDER_CONSTRUCTION"
                          value="UNDER_CONSTRUCTION"
                        />
                        <Picker.Item
                          label="MISC_CONSTRUCTION"
                          value="MISC_CONSTRUCTION"
                        />
                      </Picker>
                    </View>
                  </View>

                  {selectedUnit.unit_type === "UNDER_CONSTRUCTION" && (
                    <>
                      <TextInput
                        className="border border-gray-300 p-2 mb-4 rounded"
                        placeholder="Construction Start Date"
                        value={new Date(
                          selectedUnit?.construction_start_date || Date.now()
                        )?.toLocaleDateString()}
                        onFocus={() => setShowStartDatePicker(true)}
                        editable
                      />
                      {showStartDatePicker && (
                        <DateTimePicker
                          value={new Date(
                            selectedUnit.construction_end_date || Date.now()
                          ).toLocaleDateString()}
                          mode="date"
                          display="spinner"
                          onChange={(event, selectedDate) => {
                            setShowStartDatePicker(false);
                            if (selectedDate) {
                              setSelectedUnit({
                                ...selectedUnit,
                                construction_start_date: selectedDate
                                  .toISOString()
                                  .split("T")[0],
                              });
                            }
                          }}
                        />
                      )}

                      <TextInput
                        className="border border-gray-300 p-2 mb-4 rounded"
                        placeholder="Construction End Date"
                        value={selectedUnit.construction_end_date}
                        onFocus={() => setShowEndDatePicker(true)}
                      />
                      {showEndDatePicker && (
                        <DateTimePicker
                          value={
                            new Date(
                              selectedUnit.construction_end_date || Date.now()
                            )
                          }
                          mode="date"
                          display="spinner"
                          onChange={(event, selectedDate) => {
                            setShowEndDatePicker(false);
                            if (selectedDate) {
                              setSelectedUnit({
                                ...selectedUnit,
                                construction_end_date: selectedDate
                                  .toISOString()
                                  .split("T")[0],
                              });
                            }
                          }}
                        />
                      )}

                      <TextInput
                        className="border border-gray-300 p-2 mb-4 rounded"
                        placeholder="Number of Floors"
                        value={selectedUnit.construction_floors}
                        onChangeText={(text) =>
                          setSelectedUnit({
                            ...selectedUnit,
                            construction_floors: text,
                          })
                        }
                      />
                    </>
                  )}

                  {selectedUnit.unit_type === "MISC_CONSTRUCTION" && (
                    <>
                      <TextInput
                        className="border border-gray-300 p-2 mb-4 rounded"
                        placeholder="Additional Charge"
                        value={selectedUnit.additional_charge}
                        onChangeText={(text) =>
                          setSelectedUnit({
                            ...selectedUnit,
                            additional_charge: text,
                          })
                        }
                      />

                      <TextInput
                        className="border border-gray-300 p-2 mb-4 rounded"
                        placeholder="Additional Charge Start Date"
                        value={selectedUnit.additional_charge_start_date}
                        onFocus={() => setShowAdditionalStartDatePicker(true)}
                      />
                      {showAdditionalStartDatePicker && (
                        <DateTimePicker
                          value={
                            new Date(
                              selectedUnit.additional_charge_start_date ||
                                Date.now()
                            )
                          }
                          mode="date"
                          display="spinner"
                          onChange={(event, selectedDate) => {
                            setShowAdditionalStartDatePicker(false);
                            if (selectedDate) {
                              setSelectedUnit({
                                ...selectedUnit,
                                additional_charge_start_date: selectedDate
                                  .toISOString()
                                  .split("T")[0],
                              });
                            }
                          }}
                        />
                      )}

                      <TextInput
                        className="border border-gray-300 p-2 mb-4 rounded"
                        placeholder="Additional Charge End Date"
                        value={selectedUnit.additional_charge_end_date}
                        onFocus={() => setShowAdditionalEndDatePicker(true)}
                      />
                      {showAdditionalEndDatePicker && (
                        <DateTimePicker
                          value={
                            new Date(
                              selectedUnit.additional_charge_end_date ||
                                Date.now()
                            )
                          }
                          mode="date"
                          display="spinner"
                          onChange={(event, selectedDate) => {
                            setShowAdditionalEndDatePicker(false);
                            if (selectedDate) {
                              setSelectedUnit({
                                ...selectedUnit,
                                additional_charge_end_date: selectedDate
                                  .toISOString()
                                  .split("T")[0],
                              });
                            }
                          }}
                        />
                      )}
                    </>
                  )}

                  <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">
                      Has Tenant:
                    </Text>
                    <View className="border border-gray-300 rounded mb-2">
                      <Picker
                        selectedValue={selectedUnit.has_tenants}
                        onValueChange={(itemValue) =>
                          setSelectedUnit({
                            ...selectedUnit,
                            has_tenants: itemValue,
                          })
                        }
                      >
                        <Picker.Item label="Yes" value={true} />
                        <Picker.Item label="No" value={false} />
                      </Picker>
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Status:</Text>
                    <View className="border border-gray-300 rounded mb-2">
                      <Picker
                        selectedValue={selectedUnit.status}
                        onValueChange={(itemValue) =>
                          setSelectedUnit({
                            ...selectedUnit,
                            status: itemValue,
                          })
                        }
                      >
                        <Picker.Item label="Active" value="ACTIVE" />
                        <Picker.Item label="Inactive" value="INACTIVE" />
                      </Picker>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
            <View className="absolute bottom-0 left-0 right-0 flex-row bg-white p-4 border-t border-gray-200">
              <TouchableOpacity
                onPress={handleUpdateSubmit}
                className="flex-1 bg-primary p-3 rounded-lg mr-2"
              >
                <Text className="text-center text-white">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUpdateModalVisible(false)}
                className="flex-1 bg-gray-300 p-3 rounded-lg"
              >
                <Text className="text-center text-black">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ViewUnits;
