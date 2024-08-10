import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export interface TooltipProps {
  visible: boolean;
  text: string;
  onClose: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ visible, text, onClose }) => {
  if (!visible) return null;

  return (
    <View className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 p-4 rounded-lg shadow-lg">
      <Text className="text-white">{text}</Text>
      <TouchableOpacity
        onPress={onClose}
        className="mt-2 bg-gray-600 p-2 rounded-lg"
      >
        <Text className="text-center text-white">Close</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Tooltip;
