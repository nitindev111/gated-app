import { View, Text, Pressable } from "react-native";
import React from "react";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
}) => {
  return (
    <Pressable
      className="flex items-center w-full p-2 bg-primary px-4 py-4 rounded-md"
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="text-white">{title}</Text>
    </Pressable>
  );
};

export default Button;
