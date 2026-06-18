import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Module = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  badge?: string;
  route: string;
};

const MODULES: Module[] = [
  {
    id: "setores",
    title: "Setores",
    description: "Organize os setores da empresa e defina responsabilidades",
    icon: "business-outline",
    iconColor: "#7c3aed",
    iconBg: "#ede9fe",
    route: "/(app)/setores",
  },
  {
    id: "funcionarios",
    title: "Funcionários",
    description: "Cadastre sua equipe e vincule aos setores",
    icon: "people-outline",
    iconColor: "#0369a1",
    iconBg: "#e0f2fe",
    route: "/(app)/funcionarios",
  },
  {
    id: "checklists",
    title: "Checklists",
    description: "Crie tarefas, atribua horários e exija comprovação com foto",
    icon: "checkbox-outline",
    iconColor: "#047857",
    iconBg: "#d1fae5",
    route: "/(app)/checklists",
  },
];

function ModuleCard({ module }: { module: Module }) {
  return (
    <Pressable
      onPress={() => router.push(module.route as never)}
      className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm active:opacity-80"
      style={{ elevation: 2 }}
    >
      <View className="flex-row items-center p-5">
        {/* Ícone */}
        <View
          className="mr-4 h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: module.iconBg }}
        >
          <Ionicons name={module.icon} size={28} color={module.iconColor} />
        </View>

        {/* Texto */}
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-800">
            {module.title}
          </Text>
          <Text className="mt-0.5 text-xs leading-4 text-gray-500">
            {module.description}
          </Text>
        </View>

        {/* Seta */}
        <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary-700">
      {/* Header */}
      <View className="px-6 pb-6 pt-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xs font-medium uppercase tracking-widest text-primary-300">
              EasyCheck
            </Text>
            <Text className="mt-1 text-2xl font-bold text-white">
              Cadastros
            </Text>
          </View>
          <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Ionicons name="person-outline" size={20} color="white" />
          </Pressable>
        </View>

        <Text className="mt-2 text-sm text-primary-200">
          Configure setores, funcionários e checklists
        </Text>
      </View>

      {/* Conteúdo */}
      <View className="flex-1 rounded-t-3xl bg-gray-50 px-5 pt-6">
        <Text className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Módulos
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {MODULES.map((mod) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}

          {/* Rodapé visual */}
          <View className="mb-8 mt-4 items-center">
            <Text className="text-xs text-gray-300">EasyCheck v1.0</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
