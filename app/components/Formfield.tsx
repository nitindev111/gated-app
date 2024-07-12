import { View, Text, TextInput } from "react-native";
import React from "react";

interface FormFieldProps {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: () => void;
  otherStyles: string;
}

const Formfield: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
}) => {
  return (
    <View className="space-y-2">
      <Text className="text-primary">{title}</Text>
      <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl">
        <TextInput
          className="flex-1 text-base"
          value={value}
          placeholder={placeholder}
          onChange={handleChangeText}
        />
      </View>
    </View>
  );
};

export default Formfield;
