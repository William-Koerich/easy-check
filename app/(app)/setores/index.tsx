import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Setor, Subsetor, useApp } from "../../../store/AppContext";

const PALETTE = [
  { bg: "#ede9fe", icon: "#7c3aed", bar: "#7c3aed" },
  { bg: "#dbeafe", icon: "#1d4ed8", bar: "#3b82f6" },
  { bg: "#d1fae5", icon: "#047857", bar: "#10b981" },
  { bg: "#fef3c7", icon: "#b45309", bar: "#f59e0b" },
  { bg: "#fce7f3", icon: "#9d174d", bar: "#ec4899" },
  { bg: "#e0f2fe", icon: "#0369a1", bar: "#0ea5e9" },
];

function getPalette(index: number) {
  return PALETTE[index % PALETTE.length];
}

function SetorCard({
  setor,
  index,
  subsetores,
}: {
  setor: Setor;
  index: number;
  subsetores: Subsetor[];
}) {
  const colors = getPalette(index);
  const visíveis = subsetores.slice(0, 4);
  const extras = subsetores.length - visíveis.length;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/setores/${setor.id}` as never)}
      activeOpacity={0.88}
      className="mb-4 overflow-hidden rounded-3xl bg-white"
      style={{
        elevation: 4,
        shadowColor: colors.bar,
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      {/* Cabeçalho colorido */}
      <View
        className="px-5 pb-4 pt-5"
        style={{ backgroundColor: colors.bg }}
      >
        <View className="flex-row items-center justify-between">
          {/* Ícone */}
          <View
            className="h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: colors.bar + "25" }}
          >
            <Ionicons name="business" size={28} color={colors.bar} />
          </View>

          {/* Badge de subsetores */}
          <View
            className="rounded-full px-3 py-1.5"
            style={{ backgroundColor: colors.bar + "20" }}
          >
            <Text className="text-xs font-bold" style={{ color: colors.bar }}>
              {subsetores.length === 0
                ? "Setor geral"
                : `${subsetores.length} subsetor${subsetores.length !== 1 ? "es" : ""}`}
            </Text>
          </View>
        </View>

        <Text
          className="mt-3 text-xl font-bold"
          style={{ color: colors.icon }}
        >
          {setor.nome}
        </Text>

        {setor.descricao ? (
          <Text
            className="mt-1 text-sm leading-5"
            style={{ color: colors.icon + "99" }}
            numberOfLines={2}
          >
            {setor.descricao}
          </Text>
        ) : null}
      </View>

      {/* Rodapé branco com chips e seta */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <View className="flex-1 flex-row flex-wrap gap-2">
          {subsetores.length === 0 ? (
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="layers-outline" size={13} color="#d1d5db" />
              <Text className="text-xs text-gray-300">
                Sem subsetores cadastrados
              </Text>
            </View>
          ) : (
            <>
              {visíveis.map((s) => (
                <View
                  key={s.id}
                  className="rounded-full border px-3 py-1"
                  style={{
                    borderColor: colors.bar + "40",
                    backgroundColor: colors.bg,
                  }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: colors.icon }}
                  >
                    {s.nome}
                  </Text>
                </View>
              ))}
              {extras > 0 && (
                <View className="rounded-full bg-gray-100 px-3 py-1">
                  <Text className="text-xs font-semibold text-gray-400">
                    +{extras}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        <View
          className="ml-3 h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: colors.bg }}
        >
          <Ionicons name="chevron-forward" size={18} color={colors.bar} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SetoresScreen() {
  const { state } = useApp();

  function subsetoresDo(setorId: string) {
    return state.subsetores.filter((s) => s.setorId === setorId);
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
            <Text className="text-xl font-bold text-white">Setores</Text>
            <Text className="text-xs text-primary-200">
              {state.setores.length} setor
              {state.setores.length !== 1 ? "es" : ""} cadastrado
              {state.setores.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/(app)/setores/novo")}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white/20"
          >
            <Ionicons name="add" size={22} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Conteúdo */}
      <View className="flex-1 rounded-t-3xl bg-gray-50 px-4 pt-6">
        {state.setores.length === 0 ? (
          <View className="flex-1 items-center justify-center pb-20">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-primary-100">
              <Ionicons name="business-outline" size={36} color="#7c3aed" />
            </View>
            <Text className="text-base font-semibold text-gray-700">
              Nenhum setor cadastrado
            </Text>
            <Text className="mt-1 text-center text-sm text-gray-400">
              Crie o primeiro setor para começar{"\n"}a organizar sua empresa
            </Text>
            <Pressable
              onPress={() => router.push("/(app)/setores/novo")}
              className="mt-6 flex-row items-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 active:bg-primary-700"
            >
              <Ionicons name="add" size={18} color="white" />
              <Text className="font-semibold text-white">Novo Setor</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={state.setores}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <SetorCard
                setor={item}
                index={index}
                subsetores={subsetoresDo(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListFooterComponent={
              <Pressable
                onPress={() => router.push("/(app)/setores/novo")}
                className="mt-2 flex-row items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-primary-200 py-5"
              >
                <View className="h-7 w-7 items-center justify-center rounded-full bg-primary-100">
                  <Ionicons name="add" size={18} color="#7c3aed" />
                </View>
                <Text className="text-sm font-bold text-primary-500">
                  Adicionar novo setor
                </Text>
              </Pressable>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
