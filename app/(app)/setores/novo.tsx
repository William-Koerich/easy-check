import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../../store/AppContext";

export default function NovoSetorScreen() {
  const { addSetor } = useApp();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!nome.trim()) e.nome = "Nome é obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSalvar() {
    if (!validate()) return;
    addSetor({ nome: nome.trim(), descricao: descricao.trim() });
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-700">
      {/* Header */}
      <View className="px-6 pb-6 pt-4">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white/20"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </Pressable>
          <View>
            <Text className="text-xl font-bold text-white">Novo Setor</Text>
            <Text className="text-xs text-primary-200">
              Preencha os dados do setor
            </Text>
          </View>
        </View>
      </View>

      {/* Formulário */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 rounded-t-3xl bg-gray-50">
          <ScrollView
            className="flex-1 px-5 pt-6"
            keyboardShouldPersistTaps="handled"
          >
            {/* Nome */}
            <View className="mb-5">
              <Text className="mb-1.5 text-sm font-semibold text-gray-700">
                Nome do Setor <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className={`rounded-xl border px-4 py-3.5 text-base text-gray-800 ${
                  errors.nome
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
                placeholder="Ex: Cozinha, Salão, Recepção..."
                placeholderTextColor="#9ca3af"
                value={nome}
                onChangeText={(v) => {
                  setNome(v);
                  if (errors.nome) setErrors((e) => ({ ...e, nome: "" }));
                }}
                returnKeyType="next"
              />
              {errors.nome ? (
                <Text className="mt-1 text-xs text-red-500">{errors.nome}</Text>
              ) : null}
            </View>

            {/* Descrição */}
            <View className="mb-8">
              <Text className="mb-1.5 text-sm font-semibold text-gray-700">
                Descrição{" "}
                <Text className="font-normal text-gray-400">(opcional)</Text>
              </Text>
              <TextInput
                className="rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-800"
                placeholder="Descreva as responsabilidades deste setor..."
                placeholderTextColor="#9ca3af"
                value={descricao}
                onChangeText={setDescricao}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{ minHeight: 100 }}
              />
            </View>
          </ScrollView>

          {/* Botão salvar */}
          <View className="border-t border-gray-100 bg-white px-5 py-4">
            <Pressable
              onPress={handleSalvar}
              className="items-center rounded-2xl bg-primary-600 py-4 active:bg-primary-700"
            >
              <Text className="text-base font-bold text-white">
                Salvar Setor
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
