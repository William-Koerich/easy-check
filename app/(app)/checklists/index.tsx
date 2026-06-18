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
import { Checklist, useApp } from "../../../store/AppContext";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const BG = "#d1fae5";
const BAR = "#10b981";
const ICON = "#047857";

function ChecklistCard({
  checklist,
  setorNome,
  subsetorNome,
  onDelete,
}: {
  checklist: Checklist;
  setorNome: string;
  subsetorNome?: string;
  onDelete: () => void;
}) {
  const diasLabel = [...checklist.diasSemana]
    .sort((a, b) => a - b)
    .map((d) => DIAS[d])
    .join(" · ");

  const fotoCount = checklist.tarefas.filter((t) => t.exigeFoto).length;

  function confirmDelete() {
    Alert.alert(
      "Excluir Checklist",
      `Excluir "${checklist.nome}"?`,
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
          {/* Ícone */}
          <View
            className="h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: BAR + "25" }}
          >
            <Ionicons name="checkbox" size={28} color={BAR} />
          </View>

          {/* Badge de tarefas */}
          <View
            className="rounded-full px-3 py-1.5"
            style={{ backgroundColor: BAR + "20" }}
          >
            <Text className="text-xs font-bold" style={{ color: ICON }}>
              {checklist.tarefas.length} tarefa
              {checklist.tarefas.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        <Text className="mt-3 text-xl font-bold" style={{ color: ICON }}>
          {checklist.nome}
        </Text>

        {/* Localização: setor e subsetor */}
        <View className="mt-1.5 flex-row items-center gap-1.5">
          <Text className="text-sm" style={{ color: ICON + "99" }}>
            {setorNome}
          </Text>
          {subsetorNome && (
            <>
              <Ionicons name="chevron-forward" size={12} color={ICON + "80"} />
              <Text className="text-sm font-semibold" style={{ color: ICON }}>
                {subsetorNome}
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Rodapé branco */}
      <View className="px-5 py-4">
        <View className="flex-row items-center justify-between">
          {/* Dias e foto info */}
          <View className="flex-1 gap-2">
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="calendar-outline" size={13} color="#6b7280" />
              <Text className="text-xs text-gray-500">{diasLabel}</Text>
            </View>

            {fotoCount > 0 && (
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="camera-outline" size={13} color="#7c3aed" />
                <Text className="text-xs text-purple-600">
                  {fotoCount} tarefa{fotoCount !== 1 ? "s" : ""} com foto obrigatória
                </Text>
              </View>
            )}

            {/* Preview das 2 primeiras tarefas */}
            <View className="mt-1 gap-1">
              {checklist.tarefas.slice(0, 2).map((t) => (
                <View key={t.id} className="flex-row items-center gap-2">
                  <View
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: BAR }}
                  />
                  <Text
                    className="flex-1 text-xs text-gray-500"
                    numberOfLines={1}
                  >
                    {t.descricao}
                  </Text>
                  <Text className="text-xs font-medium text-gray-400">
                    {t.horario}
                  </Text>
                </View>
              ))}
              {checklist.tarefas.length > 2 && (
                <Text className="text-xs text-gray-300">
                  +{checklist.tarefas.length - 2} mais...
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={confirmDelete}
            className="ml-4 h-10 w-10 items-center justify-center rounded-xl bg-red-50"
          >
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function ChecklistsScreen() {
  const { state, deleteChecklist } = useApp();

  function getSetorNome(setorId: string) {
    return state.setores.find((s) => s.id === setorId)?.nome ?? "—";
  }

  function getSubsetorNome(subsetorId?: string) {
    if (!subsetorId) return undefined;
    return state.subsetores.find((s) => s.id === subsetorId)?.nome;
  }

  return (
    <SafeAreaView className="flex-1 bg-emerald-700">
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
            <Text className="text-xl font-bold text-white">Checklists</Text>
            <Text className="text-xs text-emerald-200">
              {state.checklists.length} checklist
              {state.checklists.length !== 1 ? "s" : ""} cadastrado
              {state.checklists.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/(app)/checklists/novo")}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white/20"
          >
            <Ionicons name="add" size={22} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Conteúdo */}
      <View className="flex-1 rounded-t-3xl bg-gray-50 px-4 pt-6">
        {state.checklists.length === 0 ? (
          <View className="flex-1 items-center justify-center pb-20">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100">
              <Ionicons name="checkbox-outline" size={36} color={ICON} />
            </View>
            <Text className="text-base font-semibold text-gray-700">
              Nenhum checklist criado
            </Text>
            <Text className="mt-1 text-center text-sm text-gray-400">
              Crie checklists, defina tarefas e atribua{"\n"}aos funcionários com
              horário e comprovação
            </Text>
            <Pressable
              onPress={() => router.push("/(app)/checklists/novo")}
              className="mt-6 flex-row items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 active:bg-emerald-700"
            >
              <Ionicons name="add" size={18} color="white" />
              <Text className="font-semibold text-white">Novo Checklist</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={state.checklists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChecklistCard
                checklist={item}
                setorNome={getSetorNome(item.setorId)}
                subsetorNome={getSubsetorNome(item.subsetorId)}
                onDelete={() => deleteChecklist(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListFooterComponent={
              <Pressable
                onPress={() => router.push("/(app)/checklists/novo")}
                className="mt-2 flex-row items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-emerald-200 py-5"
              >
                <View className="h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                  <Ionicons name="add" size={18} color={ICON} />
                </View>
                <Text className="text-sm font-bold text-emerald-500">
                  Adicionar novo checklist
                </Text>
              </Pressable>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
