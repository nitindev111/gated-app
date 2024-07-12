import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  conntainerStyles?: any;
  textStyles?: any;
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title = "Button name",
  handlePress,
  conntainerStyles = "",
  textStyles = "",
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
      className={`bg-secondary rounded-xl min-h-[50px] w-full justify-center items-center ${conntainerStyles}`}
    >
      <Text className={`text-white ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
