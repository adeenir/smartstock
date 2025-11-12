import React from "react";
import { Alert } from "react-native";
import { Button, Div, Input, Text } from "react-native-magnus";
import Icon from "@react-native-vector-icons/fontawesome6";
import { useRoute, useNavigation } from "@react-navigation/native";
import {navigate} from '../navigation/AppNavigator.tsx';
import LogoComponent from "../components/LogoComponent.tsx";

export default function ResetPasswordScreen() {
  const route = useRoute();
  const token = route.params;

  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Preencha todos os campos!");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:3000/usuarios/atualizar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(data.message || "Erro ao redefinir senha");
        return;
      }

      Alert.alert("Senha redefinida com sucesso!");
      navigate("Login"); // Redireciona para login
    } catch (err) {
      console.error(err);
      Alert.alert("Erro ao conectar com o servidor");
    }
  };

  return (
    <Div flex={1} bg="white" p="lg">
      <LogoComponent />
      <Text fontSize="6xl" fontWeight="900" mb="lg" color="gray900" textAlign="left">
        Nova Senha
      </Text>
      <Text fontSize="lg" mb="lg" color="gray600">
        Digite sua nova senha abaixo.
      </Text>

      <Div row alignItems="center" mb="md">
        <Icon name="lock" size={25} color="gray400" iconStyle="solid" />
        <Input
          placeholder="Nova senha"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          mb="md"
          borderWidth={0}
          borderBottomWidth={2}
          borderBottomColor="gray400"
          fontSize={15}
        />
      </Div>

      <Div row alignItems="center" mb="lg">
        <Icon name="lock" size={25} color="gray400" iconStyle="solid" />
        <Input
          placeholder="Confirme a nova senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          mb="md"
          borderWidth={0}
          borderBottomWidth={2}
          borderBottomColor="gray400"
          fontSize={15}
        />
      </Div>

      <Button block bg="#314401" py="lg" rounded="circle" onPress={handleUpdatePassword}>
        <Text color="white" fontWeight="bold" fontSize={15}>
          Redefinir senha
        </Text>
      </Button>
    </Div>
  );
}
