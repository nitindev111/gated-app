import React, { ReactNode } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isVisible,
  onClose,
  children,
  title,
}) => {
  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View className="flex-1 justify-end items-center bg-black/40">
        <View className="bg-white rounded-t-lg p-4">
          <View className="flex flex-row justify-between px-2 items-center">
            <Text className="text-lg font-bold">{title}</Text>
            <TouchableOpacity onPress={onClose} className="">
              <Text className="text-lg font-bold">X</Text>
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default BottomSheet;
