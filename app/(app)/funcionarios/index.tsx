import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Funcionario, useApp } from "../../../store/AppContext";

const BG = "#e0f2fe";
const BAR = "#0ea5e9";
const ICON = "#0369a1";

function FuncionarioCard({
  funcionario,
  setorNome,
  onDelete,
}: {
  funcionario: Funcionario;
  setorNome: string;
  onDelete: () => void;
}) {
  const initials = funcionario.nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  function confirmDelete() {
    Alert.alert(
      "Excluir Funcionário",
      `Excluir "${funcionario.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: onDelete },
      ],
    );
  }

  return (
    <View
      className="mb-4 overflow-hidden rounded-3xl bg-white"
      style={{
        elevation: 4,
        shadowColor: BAR,
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      {/* Cabeçalho colorido */}
      <View className="px-5 pb-4 pt-5" style={{ backgroundColor: BG }}>
        <View className="flex-row items-center justify-between">
          {/* Avatar com iniciais */}
          <View
            className="h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: BAR + "25" }}
          >
            <Text className="text-xl font-extrabold" style={{ color: BAR }}>
              {initials}
            </Text>
          </View>

          {/* Badge do cargo */}
          <View
            className="rounded-full px-3 py-1.5"
            style={{ backgroundColor: BAR + "20" }}
          >
            <Text className="text-xs font-bold" style={{ color: ICON }}>
              {funcionario.cargo}
            </Text>
          </View>
        </View>

        <Text className="mt-3 text-xl font-bold" style={{ color: ICON }}>
          {funcionario.nome}
        </Text>
      </View>

      {/* Rodapé branco */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="business-outline" size={13} color={ICON} />
          <Text className="text-sm font-semibold" style={{ color: ICON }}>
            {setorNome}
          </Text>
        </View>

        <TouchableOpacity
          onPress={confirmDelete}
          className="h-10 w-10 items-center justify-center rounded-xl bg-red-50"
        >
          <Ionicons name="trash-outline" size={15} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function FuncionariosScreen() {
  const { state, deleteFuncionario } = useApp();

  function getSetorNome(setorId: string) {
    return state.setores.find((s) => s.id === setorId)?.nome ?? "—";
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
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">Funcionários</Text>
            <Text className="text-xs text-sky-200">
              {state.funcionarios.length} funcionário
              {state.funcionarios.length !== 1 ? "s" : ""} cadastrado
              {state.funcionarios.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/(app)/funcionarios/novo")}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white/20"
          >
            <Ionicons name="add" size={22} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Conteúdo */}
      <View className="flex-1 rounded-t-3xl bg-gray-50 px-4 pt-6">
        {state.funcionarios.length === 0 ? (
          <View className="flex-1 items-center justify-center pb-20">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-sky-100">
              <Ionicons name="people-outline" size={36} color={ICON} />
            </View>
            <Text className="text-base font-semibold text-gray-700">
              Nenhum funcionário cadastrado
            </Text>
            <Text className="mt-1 text-center text-sm text-gray-400">
              Cadastre os membros da equipe e vincule{"\n"}a um setor da empresa
            </Text>
            <Pressable
              onPress={() => router.push("/(app)/funcionarios/novo")}
              className="mt-6 flex-row items-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 active:bg-sky-700"
            >
              <Ionicons name="add" size={18} color="white" />
              <Text className="font-semibold text-white">Novo Funcionário</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={state.funcionarios}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FuncionarioCard
                funcionario={item}
                setorNome={getSetorNome(item.setorId)}
                onDelete={() => deleteFuncionario(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListFooterComponent={
              <Pressable
                onPress={() => router.push("/(app)/funcionarios/novo")}
                className="mt-2 flex-row items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-sky-200 py-5"
              >
                <View className="h-7 w-7 items-center justify-center rounded-full bg-sky-100">
                  <Ionicons name="add" size={18} color={ICON} />
                </View>
                <Text className="text-sm font-bold text-sky-500">
                  Adicionar novo funcionário
                </Text>
              </Pressable>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
