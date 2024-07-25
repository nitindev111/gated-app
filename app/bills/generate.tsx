import React, { useState } from "react";
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
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

const GenerateBill = () => {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [billDurationFrom, setBillDurationFrom] = useState(new Date());
  const [billDurationTo, setBillDurationTo] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState({ type: "", visible: false });

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

  const handleGenerateBill = () => {};

  const handleSubmit = () => {
    console.log({
      name,
      note,
      billDurationFrom,
      billDurationTo,
      dueDate,
      invoiceDate,
    });
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
            <TextInput
              placeholder="Enter bill name"
              value={name}
              onChangeText={setName}
              className="border-gray-300 border-solid border border-1 p-2 rounded-lg shadow-sm"
            />
          </View>
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2">Note</Text>
            <TextInput
              placeholder="Enter note"
              value={note}
              multiline={true}
              numberOfLines={4}
              onChangeText={setNote}
              className="border-gray-300 border-solid border border-1 p-2 rounded-lg shadow-sm"
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
                className="border-gray-300 border-solid border border-1 p-2 rounded-lg shadow-sm"
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
                className="border-gray-300 border-solid border border-1 p-2 rounded-lg shadow-sm"
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
                className="border-gray-300 border-solid border border-1 p-2 rounded-lg shadow-sm"
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
                className="border-gray-300 border-solid border border-1 p-2 rounded-lg shadow-sm"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Pressable
          className="flex items-center p-2 bg-blue-500 px-4 py-4"
          onPress={handleSubmit}
        >
          <Text className="text-white">Submit</Text>
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
    </SafeAreaView>
  );
};

export default GenerateBill;
