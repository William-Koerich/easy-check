import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  function handleLogin() {
    router.push("/(app)/home");
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-700">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header / logo */}
        <View className="flex-1 items-center justify-center px-8 pb-4">
          <View className="mb-2 h-20 w-20 items-center justify-center rounded-3xl bg-white/20">
            <Text className="text-4xl font-bold text-white">EC</Text>
          </View>
          <Text className="mt-4 text-3xl font-bold tracking-tight text-white">
            EasyCheck
          </Text>
          <Text className="mt-1 text-sm text-primary-200">
            Acesse sua conta para continuar
          </Text>
        </View>

        {/* Card de login */}
        <View className="rounded-t-3xl bg-white px-8 pb-10 pt-8 shadow-xl">
          <Text className="mb-6 text-xl font-semibold text-gray-800">
            Entrar
          </Text>

          {/* Campo e-mail */}
          <View className="mb-4">
            <Text className="mb-1.5 text-sm font-medium text-gray-600">
              E-mail
            </Text>
            <TextInput
              className={`rounded-xl border px-4 py-3.5 text-base text-gray-800 ${
                emailFocused
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 bg-gray-50"
              }`}
              placeholder="seu@email.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>

          {/* Campo senha */}
          <View className="mb-6">
            <Text className="mb-1.5 text-sm font-medium text-gray-600">
              Senha
            </Text>
            <TextInput
              className={`rounded-xl border px-4 py-3.5 text-base text-gray-800 ${
                passwordFocused
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 bg-gray-50"
              }`}
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          {/* Esqueceu a senha */}
          <Pressable className="mb-6 self-end">
            <Text className="text-sm font-medium text-primary-600">
              Esqueceu a senha?
            </Text>
          </Pressable>

          {/* Botão entrar */}
          <Pressable
            className="items-center rounded-2xl bg-primary-600 py-4 active:bg-primary-700"
            onPress={handleLogin}
          >
            <Text className="text-base font-bold text-white">Entrar</Text>
          </Pressable>

          {/* Rodapé */}
          <View className="mt-8 flex-row items-center justify-center">
            <Text className="text-sm text-gray-500">Não tem uma conta? </Text>
            <Pressable>
              <Text className="text-sm font-semibold text-primary-600">
                Cadastre-se
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
