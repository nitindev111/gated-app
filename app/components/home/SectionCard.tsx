import { View, Text } from "react-native";
import React from "react";
import { styled } from "nativewind";

const Card = styled(View);

interface SectionCardProps {
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ children }) => {
  return (
    <Card className="flex-1 bg-red-200 h-32 justify-center items-center m-2">
      <Text className="text-lg font-bold">{children}</Text>
    </Card>
  );
};

export default SectionCard;
