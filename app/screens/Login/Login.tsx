import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import { Button, TextInput as PaperTextInput } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  LoginScreen: undefined;
  OTPVerification: { generatedOtp: number };
  SearchScreen: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handlePhoneSubmit = () => {
    if (/^\d{10}$/.test(phoneNumber)) {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000);
      console.log("Generated OTP:", generatedOtp);
      navigation.navigate("OTPVerification", { generatedOtp });
    } else {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid 10 digit phone number"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // Adjust offset as needed
    >
      <Container>
        <Title>Enter Your Phone Number</Title>
        <StyledTextInput
          label="Phone Number"
          mode="outlined"
          keyboardType="numeric"
          maxLength={10}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <Button mode="contained" onPress={handlePhoneSubmit}>
          Submit
        </Button>
      </Container>
    </KeyboardAvoidingView>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const StyledTextInput = styled(PaperTextInput)`
  width: 100%;
  margin-bottom: 20px;
`;

export default LoginScreen;
