import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Option = { label: string; value: string };

type Props = {
  placeholder: string;
  value: string | null;
  options: Option[];
  onSelect: (value: string) => void;
  error?: boolean;
};

export function Select({ placeholder, value, options, onSelect, error }: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className={`flex-row items-center justify-between rounded-xl border px-4 py-3.5 ${
          error
            ? "border-red-400 bg-red-50"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <Text
          className={`text-base ${selected ? "text-gray-800" : "text-gray-400"}`}
        >
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#9ca3af" />
      </Pressable>

      <Modal visible={open} transparent animationType="slide">
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setOpen(false)}
        />
        <View className="rounded-t-3xl bg-white">
          <SafeAreaView edges={["bottom"]}>
            <View className="border-b border-gray-100 px-5 py-4">
              <Text className="text-center text-sm font-semibold text-gray-700">
                {placeholder}
              </Text>
            </View>

            {options.length === 0 ? (
              <View className="items-center py-10">
                <Text className="text-sm text-gray-400">
                  Nenhuma opção disponível
                </Text>
              </View>
            ) : (
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                style={{ maxHeight: 320 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(item.value);
                      setOpen(false);
                    }}
                    className="flex-row items-center justify-between border-b border-gray-50 px-5 py-4"
                  >
                    <Text className="text-base text-gray-800">
                      {item.label}
                    </Text>
                    {item.value === value && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color="#7c3aed"
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}

            <TouchableOpacity
              onPress={() => setOpen(false)}
              className="mx-5 mb-2 mt-3 items-center rounded-xl bg-gray-100 py-3.5"
            >
              <Text className="font-semibold text-gray-600">Cancelar</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}
