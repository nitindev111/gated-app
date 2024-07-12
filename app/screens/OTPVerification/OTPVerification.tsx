import React, { useState } from "react";
import { View, Alert, KeyboardAvoidingView, Platform } from "react-native";
import styled from "styled-components/native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { Button } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  LoginScreen: undefined;
  OTPVerification: { generatedOtp: number };
  SearchScreen: undefined;
};

type OTPVerificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "OTPVerification"
>;

interface Props {
  navigation: OTPVerificationScreenNavigationProp;
  route: { params: { generatedOtp: number } };
}

const OTPVerification: React.FC<Props> = ({ navigation, route }) => {
  const { generatedOtp } = route.params;
  const [enteredOtp, setEnteredOtp] = useState<string>("");

  const handleVerification = () => {
    if (enteredOtp === generatedOtp.toString()) {
      navigation.navigate("SearchScreen");
    } else {
      Alert.alert("Invalid OTP", "Please enter the correct OTP");
    }
  };

  const handleCodeFilled = (code: string) => {
    setEnteredOtp(code); // Update entered OTP
    handleVerification(); // Verify OTP
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // Adjust offset as needed
    >
      <Container>
        <Title>Enter OTP</Title>
        <OTPInputView
          style={{ width: "80%", height: 200 }}
          pinCount={6}
          code={enteredOtp}
          onCodeChanged={(code) => setEnteredOtp(code)}
          autoFocusOnLoad
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          // onCodeFilled={handleCodeFilled} // Trigger verification on code filled
        />
        <Button mode="contained" onPress={handleVerification}>
          Verify Manually
        </Button>
      </Container>
    </KeyboardAvoidingView>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-horizontal: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const styles = {
  underlineStyleBase: {
    width: 50,
    height: 50,
    borderWidth: 0,
    borderBottomWidth: 2,
    color: "black",
    fontSize: 24,
  },
  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
};

export default OTPVerification;
