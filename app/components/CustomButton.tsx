import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheetRuntime } from "nativewind/dist/style-sheet";

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  conntainerStyles?: string;
  textStyles?: any;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
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
      } rounded-xl min-h-[20px] w-full justify-center items-center sticky bottom-0  ${conntainerStyles}`}
    >
      <Text
        className={`${isDisabled ? "text-black" : "text-white"} ${textStyles}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
