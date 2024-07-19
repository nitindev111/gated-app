import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  conntainerStyles?: any;
  textStyles?: any;
  isLoading?: boolean;
  isDisabled: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title = "Click Me",
  handlePress,
  conntainerStyles = "",
  textStyles = "",
  isLoading = false,
  isDisabled,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading || isDisabled}
      className={`${
        isDisabled ? "bg-gray-200" : "bg-secondary"
      } rounded-xl min-h-[20px] w-full justify-center items-center ${conntainerStyles}`}
    >
      <Text
        className={`${isDisabled ? "text-black" : "text-white"} ${textStyles}`}
      >
        {isDisabled ? "Pending" : title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
