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
import { Select } from "../../../components/Select";
import { useApp } from "../../../store/AppContext";

export default function NovoFuncionarioScreen() {
  const { addFuncionario, state } = useApp();
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [setorId, setSetorId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setorOptions = state.setores.map((s) => ({
    label: s.nome,
    value: s.id,
  }));

  function validate() {
    const e: Record<string, string> = {};
    if (!nome.trim()) e.nome = "Nome é obrigatório";
    if (!cargo.trim()) e.cargo = "Cargo é obrigatório";
    if (!setorId) e.setorId = "Selecione um setor";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSalvar() {
    if (!validate()) return;
    addFuncionario({ nome: nome.trim(), cargo: cargo.trim(), setorId: setorId! });
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-sky-700">
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
            <Text className="text-xl font-bold text-white">
              Novo Funcionário
            </Text>
            <Text className="text-xs text-sky-200">
              Preencha os dados do funcionário
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
                Nome <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className={`rounded-xl border px-4 py-3.5 text-base text-gray-800 ${
                  errors.nome
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
                placeholder="Nome completo do funcionário"
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

            {/* Cargo */}
            <View className="mb-5">
              <Text className="mb-1.5 text-sm font-semibold text-gray-700">
                Cargo / Função <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className={`rounded-xl border px-4 py-3.5 text-base text-gray-800 ${
                  errors.cargo
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
                placeholder="Ex: Cozinheiro, Garçom, Auxiliar..."
                placeholderTextColor="#9ca3af"
                value={cargo}
                onChangeText={(v) => {
                  setCargo(v);
                  if (errors.cargo) setErrors((e) => ({ ...e, cargo: "" }));
                }}
                returnKeyType="next"
              />
              {errors.cargo ? (
                <Text className="mt-1 text-xs text-red-500">
                  {errors.cargo}
                </Text>
              ) : null}
            </View>

            {/* Setor */}
            <View className="mb-8">
              <Text className="mb-1.5 text-sm font-semibold text-gray-700">
                Setor <Text className="text-red-500">*</Text>
              </Text>

              {state.setores.length === 0 ? (
                <View className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <Text className="text-sm text-amber-700">
                    Nenhum setor cadastrado. Cadastre um setor primeiro.
                  </Text>
                </View>
              ) : (
                <Select
                  placeholder="Selecione o setor"
                  value={setorId}
                  options={setorOptions}
                  onSelect={(v) => {
                    setSetorId(v);
                    if (errors.setorId)
                      setErrors((e) => ({ ...e, setorId: "" }));
                  }}
                  error={!!errors.setorId}
                />
              )}

              {errors.setorId ? (
                <Text className="mt-1 text-xs text-red-500">
                  {errors.setorId}
                </Text>
              ) : null}
            </View>
          </ScrollView>

          {/* Botão salvar */}
          <View className="border-t border-gray-100 bg-white px-5 py-4">
            <Pressable
              onPress={handleSalvar}
              className="items-center rounded-2xl bg-sky-600 py-4 active:bg-sky-700"
            >
              <Text className="text-base font-bold text-white">
                Salvar Funcionário
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
