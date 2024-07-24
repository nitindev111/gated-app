import React, { useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "@/app/components/CustomButton"; // Assuming CustomButton is a reusable styled button component

const GenerateBill = () => {
    const [name, setName] = useState("");
    const [note, setNote] = useState("");
    const [billDurationFrom, setBillDurationFrom] = useState(new Date());
    const [billDurationTo, setBillDurationTo] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [invoiceDate, setInvoiceDate] = useState(new Date());

    const handleSubmit = () => {
        // Handle bill generation logic here
        console.log({ name, note, billDurationFrom, billDurationTo, dueDate, invoiceDate });
    };

    return (
        <ScrollView className="flex-1 p-6 bg-gray-100">
            <Text className="text-3xl font-bold mb-6 text-center">Generate New Maintenance Bill</Text>
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-2">Name</Text>
                <TextInput
                    placeholder="Enter bill name"
                    value={name}
                    onChangeText={setName}
                    className="border p-4 rounded-lg bg-white shadow-sm"
                />
            </View>
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-2">Note</Text>
                <TextInput
                    placeholder="Enter note"
                    value={note}
                    onChangeText={setNote}
                    className="border p-4 rounded-lg bg-white shadow-sm"
                />
            </View>
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-2">Bill Duration From</Text>
                <DateTimePicker
                    value={billDurationFrom}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => setBillDurationFrom(selectedDate || billDurationFrom)}
                    style={{ width: '100%', marginBottom: 20 }}
                />
            </View>
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-2">Bill Duration To</Text>
                <DateTimePicker
                    value={billDurationTo}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => setBillDurationTo(selectedDate || billDurationTo)}
                    style={{ width: '100%', marginBottom: 20 }}
                />
            </View>
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-2">Due Date</Text>
                <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => setDueDate(selectedDate || dueDate)}
                    style={{ width: '100%', marginBottom: 20 }}
                />
            </View>
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-2">Invoice Date</Text>
                <DateTimePicker
                    value={invoiceDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => setInvoiceDate(selectedDate || invoiceDate)}
                    style={{ width: '100%', marginBottom: 20 }}
                />
            </View>
            <CustomButton
                title="Generate Bill"
                handlePress={handleSubmit}
                conntainerStyles="mt-6 bg-blue-500 py-4 rounded-lg shadow-md b-[-10px]"
                textStyles="text-white text-center text-lg font-bold"
            />
        </ScrollView>
    );
};

export default GenerateBill;
