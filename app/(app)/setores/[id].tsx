import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Subsetor, useApp } from "../../../store/AppContext";

export default function SetorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, addSubsetor, deleteSubsetor, deleteSetor } = useApp();

  const setor = state.setores.find((s) => s.id === id);
  const subsetores = state.subsetores.filter((s) => s.setorId === id);

  const [nomeSubsetor, setNomeSubsetor] = useState("");
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<TextInput>(null);

  if (!setor) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-400">Setor não encontrado</Text>
      </SafeAreaView>
    );
  }

  function handleAdicionarSubsetor() {
    const nome = nomeSubsetor.trim();
    if (!nome) return;
    addSubsetor({ nome, setorId: id });
    setNomeSubsetor("");
    Keyboard.dismiss();
    setAdding(false);
  }

  function handleDeleteSetor() {
    Alert.alert(
      "Excluir Setor",
      `Excluir "${setor!.nome}" irá remover também os ${subsetores.length} subsetor(es). Continuar?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            deleteSetor(id);
            router.back();
          },
        },
      ],
    );
  }

  function handleDeleteSubsetor(sub: Subsetor) {
    Alert.alert("Excluir Subsetor", `Excluir "${sub.nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => deleteSubsetor(sub.id),
      },
    ]);
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
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">{setor.nome}</Text>
            {setor.descricao ? (
              <Text className="text-xs text-primary-200" numberOfLines={1}>
                {setor.descricao}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={handleDeleteSetor}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white/20"
          >
            <Ionicons name="trash-outline" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo */}
      <View className="flex-1 rounded-t-3xl bg-gray-50 px-5 pt-6">
        {/* Cabeçalho da seção */}
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-bold text-gray-700">Subsetores</Text>
            <Text className="text-xs text-gray-400">
              {subsetores.length === 0
                ? "Nenhum subsetor — as tarefas ficam direto no setor"
                : `${subsetores.length} subsetor${subsetores.length !== 1 ? "es" : ""}`}
            </Text>
          </View>
          {!adding && (
            <TouchableOpacity
              onPress={() => {
                setAdding(true);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
              className="flex-row items-center gap-2 rounded-2xl bg-primary-600 px-4 py-2.5 active:bg-primary-700"
            >
              <Ionicons name="add" size={18} color="white" />
              <Text className="text-sm font-bold text-white">Subsetor</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Input inline para novo subsetor */}
        {adding && (
          <View
            className="mb-4 overflow-hidden rounded-2xl bg-white"
            style={{ elevation: 3, shadowColor: "#7c3aed", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
          >
            <View className="flex-row items-center gap-3 px-5 py-4">
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary-100">
                <Ionicons name="albums-outline" size={20} color="#7c3aed" />
              </View>
              <TextInput
                ref={inputRef}
                className="flex-1 text-base font-medium text-gray-800"
                placeholder="Nome do subsetor..."
                placeholderTextColor="#9ca3af"
                value={nomeSubsetor}
                onChangeText={setNomeSubsetor}
                onSubmitEditing={handleAdicionarSubsetor}
                returnKeyType="done"
              />
            </View>
            <View className="flex-row border-t border-gray-100">
              <TouchableOpacity
                onPress={() => {
                  setAdding(false);
                  setNomeSubsetor("");
                  Keyboard.dismiss();
                }}
                className="flex-1 items-center py-4"
              >
                <Text className="text-sm font-bold text-gray-400">Cancelar</Text>
              </TouchableOpacity>
              <View className="w-px bg-gray-100" />
              <TouchableOpacity
                onPress={handleAdicionarSubsetor}
                className="flex-1 items-center py-4"
              >
                <Text className="text-sm font-bold text-primary-600">Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Lista de subsetores */}
        {subsetores.length === 0 && !adding ? (
          <View className="mt-10 items-center">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-gray-100">
              <Ionicons name="albums-outline" size={32} color="#d1d5db" />
            </View>
            <Text className="text-base font-semibold text-gray-400">
              Sem subsetores — opcional
            </Text>
            <Text className="mt-1 text-center text-sm text-gray-300">
              Você pode usar o setor direto{"\n"}nas tarefas do checklist
            </Text>
          </View>
        ) : (
          <FlatList
            data={subsetores}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => (
              <View
                className="mb-3 flex-row items-center overflow-hidden rounded-2xl bg-white px-5 py-4"
                style={{ elevation: 2, shadowColor: "#7c3aed", shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}
              >
                <View className="mr-4 h-11 w-11 items-center justify-center rounded-xl bg-primary-100">
                  <Ionicons name="albums-outline" size={20} color="#7c3aed" />
                </View>
                <Text className="flex-1 text-base font-semibold text-gray-800">
                  {item.nome}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDeleteSubsetor(item)}
                  className="h-10 w-10 items-center justify-center rounded-xl bg-red-50"
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
