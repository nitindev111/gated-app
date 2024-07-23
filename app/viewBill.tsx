import React from "react";
import { Text, View } from "react-native";
import BottomSheet from "./components/common/BottomSheet";
import ViewBillDetails from "./components/bills/ViewBillDetails";

interface ViewBillProps {
  isBottomSheetVisible: boolean;
  closeBottomSheet: () => void;
  bill: any;
  handleApproveBill: () => void;
}

const ViewBill: React.FC<ViewBillProps> = ({
  isBottomSheetVisible,
  closeBottomSheet,
  bill,
  handleApproveBill,
}) => {
  if (!bill) {
    return null;
  }
  return (
    <BottomSheet
      title="Approve Bill"
      isVisible={isBottomSheetVisible}
      onClose={closeBottomSheet}
    >
      <View className="h-full pt-4">
        <ViewBillDetails handleApproveBill={handleApproveBill} bill={bill} />
      </View>
    </BottomSheet>
  );
};

export default ViewBill;
