import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Select } from "../../../components/Select";
import { TarefaItem, useApp } from "../../../store/AppContext";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// ─── Modal de adicionar tarefa ───────────────────────────────────────────────

type TarefaModalProps = {
  visible: boolean;
  funcionarioOptions: { label: string; value: string }[];
  onSave: (tarefa: TarefaItem) => void;
  onClose: () => void;
};

function TarefaModal({ visible, funcionarioOptions, onSave, onClose }: TarefaModalProps) {
  const [descricao, setDescricao] = useState("");
  const [funcionarioId, setFuncionarioId] = useState<string | null>(null);
  const [hora, setHora] = useState("");
  const [minuto, setMinuto] = useState("");
  const [exigeFoto, setExigeFoto] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function reset() {
    setDescricao("");
    setFuncionarioId(null);
    setHora("");
    setMinuto("");
    setExigeFoto(false);
    setErrors({});
  }

  function handleClose() {
    reset();
    onClose();
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!descricao.trim()) e.descricao = "Descrição obrigatória";
    if (!funcionarioId) e.funcionario = "Selecione o funcionário";
    const h = parseInt(hora);
    const m = parseInt(minuto);
    if (!hora || isNaN(h) || h < 0 || h > 23) e.hora = "Hora inválida (0-23)";
    if (!minuto || isNaN(m) || m < 0 || m > 59) e.minuto = "Minuto inválido (0-59)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({
      id: uid(),
      descricao: descricao.trim(),
      funcionarioId: funcionarioId!,
      horario: `${hora.padStart(2, "0")}:${minuto.padStart(2, "0")}`,
      exigeFoto,
    });
    reset();
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable className="flex-1 bg-black/40" onPress={handleClose} />

        <View className="rounded-t-3xl bg-white">
          <SafeAreaView edges={["bottom"]}>
            <View className="border-b border-gray-100 px-5 py-4">
              <Text className="text-center text-base font-bold text-gray-800">
                Nova Tarefa
              </Text>
            </View>

            <ScrollView
              className="px-5 pt-4"
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 460 }}
            >
              {/* Descrição */}
              <View className="mb-4">
                <Text className="mb-1.5 text-sm font-semibold text-gray-700">
                  O que deve ser feito? <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className={`rounded-xl border px-4 py-3 text-base text-gray-800 ${
                    errors.descricao ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
                  placeholder="Ex: Limpar a chapa, Lavar as louças..."
                  placeholderTextColor="#9ca3af"
                  value={descricao}
                  onChangeText={(v) => {
                    setDescricao(v);
                    if (errors.descricao) setErrors((e) => ({ ...e, descricao: "" }));
                  }}
                  multiline
                  textAlignVertical="top"
                  style={{ minHeight: 72 }}
                />
                {errors.descricao ? (
                  <Text className="mt-1 text-xs text-red-500">{errors.descricao}</Text>
                ) : null}
              </View>

              {/* Funcionário */}
              <View className="mb-4">
                <Text className="mb-1.5 text-sm font-semibold text-gray-700">
                  Responsável <Text className="text-red-500">*</Text>
                </Text>
                <Select
                  placeholder="Selecione o funcionário"
                  value={funcionarioId}
                  options={funcionarioOptions}
                  onSelect={(v) => {
                    setFuncionarioId(v);
                    if (errors.funcionario) setErrors((e) => ({ ...e, funcionario: "" }));
                  }}
                  error={!!errors.funcionario}
                />
                {errors.funcionario ? (
                  <Text className="mt-1 text-xs text-red-500">{errors.funcionario}</Text>
                ) : null}
              </View>

              {/* Horário */}
              <View className="mb-4">
                <Text className="mb-1.5 text-sm font-semibold text-gray-700">
                  Horário <Text className="text-red-500">*</Text>
                </Text>
                <View className="flex-row items-start gap-2">
                  <View className="flex-1">
                    <TextInput
                      className={`rounded-xl border px-4 py-3 text-center text-xl font-bold text-gray-800 ${
                        errors.hora ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                      }`}
                      placeholder="00"
                      placeholderTextColor="#9ca3af"
                      value={hora}
                      onChangeText={(v) => {
                        if (/^\d{0,2}$/.test(v)) {
                          setHora(v);
                          if (errors.hora) setErrors((e) => ({ ...e, hora: "" }));
                        }
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    <Text className="mt-1 text-center text-xs text-gray-400">hora</Text>
                  </View>
                  <Text className="mt-3 text-2xl font-bold text-gray-400">:</Text>
                  <View className="flex-1">
                    <TextInput
                      className={`rounded-xl border px-4 py-3 text-center text-xl font-bold text-gray-800 ${
                        errors.minuto ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                      }`}
                      placeholder="00"
                      placeholderTextColor="#9ca3af"
                      value={minuto}
                      onChangeText={(v) => {
                        if (/^\d{0,2}$/.test(v)) {
                          setMinuto(v);
                          if (errors.minuto) setErrors((e) => ({ ...e, minuto: "" }));
                        }
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    <Text className="mt-1 text-center text-xs text-gray-400">minuto</Text>
                  </View>
                </View>
              </View>

              {/* Exige foto */}
              <View className="mb-6 flex-row items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5">
                <View className="mr-3 flex-1">
                  <Text className="text-sm font-semibold text-gray-700">
                    Exigir foto como comprovação
                  </Text>
                  <Text className="mt-0.5 text-xs text-gray-400">
                    Funcionário deve fotografar a tarefa concluída
                  </Text>
                </View>
                <Switch
                  value={exigeFoto}
                  onValueChange={setExigeFoto}
                  trackColor={{ false: "#e5e7eb", true: "#a78bfa" }}
                  thumbColor={exigeFoto ? "#7c3aed" : "#f3f4f6"}
                />
              </View>
            </ScrollView>

            <View className="flex-row gap-3 px-5 pb-2 pt-3">
              <TouchableOpacity
                onPress={handleClose}
                className="flex-1 items-center rounded-xl bg-gray-100 py-3.5"
              >
                <Text className="font-semibold text-gray-600">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 items-center rounded-xl bg-emerald-600 py-3.5"
              >
                <Text className="font-semibold text-white">Adicionar</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Card de tarefa ───────────────────────────────────────────────────────────

function TarefaCard({
  tarefa,
  funcionarioNome,
  index,
  onRemove,
}: {
  tarefa: TarefaItem;
  funcionarioNome: string;
  index: number;
  onRemove: () => void;
}) {
  return (
    <View
      className="mb-4 overflow-hidden rounded-2xl bg-white"
      style={{
        elevation: 3,
        shadowColor: "#10b981",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      }}
    >
      {/* Cabeçalho verde */}
      <View className="flex-row items-start gap-3 bg-emerald-50 px-5 pb-4 pt-5">
        {/* Número da tarefa */}
        <View className="h-9 w-9 items-center justify-center rounded-xl bg-emerald-600">
          <Text className="text-sm font-extrabold text-white">{index + 1}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold leading-5 text-emerald-900">
            {tarefa.descricao}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onRemove}
          className="h-10 w-10 items-center justify-center rounded-xl bg-red-50"
        >
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Rodapé branco com chips */}
      <View className="flex-row flex-wrap gap-2 px-5 py-4">
        <View className="flex-row items-center gap-1.5 rounded-xl bg-sky-50 px-3 py-2">
          <Ionicons name="person-outline" size={14} color="#0369a1" />
          <Text className="text-sm font-semibold text-sky-700">
            {funcionarioNome}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2">
          <Ionicons name="time-outline" size={14} color="#b45309" />
          <Text className="text-sm font-bold text-amber-700">
            {tarefa.horario}
          </Text>
        </View>
        {tarefa.exigeFoto && (
          <View className="flex-row items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-2">
            <Ionicons name="camera-outline" size={14} color="#7c3aed" />
            <Text className="text-sm font-semibold text-purple-700">
              Foto obrigatória
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function NovoChecklistScreen() {
  const { addChecklist, state } = useApp();

  const [nome, setNome] = useState("");
  const [setorId, setSetorId] = useState<string | null>(null);
  const [subsetorId, setSubsetorId] = useState<string | null>(null);
  const [diasSemana, setDiasSemana] = useState<number[]>([]);
  const [tarefas, setTarefas] = useState<TarefaItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setorOptions = state.setores.map((s) => ({ label: s.nome, value: s.id }));

  const subsetoresDoSetor = state.subsetores.filter((s) => s.setorId === setorId);
  const subsetorOptions = subsetoresDoSetor.map((s) => ({ label: s.nome, value: s.id }));
  const temSubsetores = subsetoresDoSetor.length > 0;

  const funcionarioOptions = state.funcionarios
    .filter((f) => !setorId || f.setorId === setorId)
    .map((f) => ({ label: `${f.nome} (${f.cargo})`, value: f.id }));

  function handleSetorChange(v: string) {
    setSetorId(v);
    setSubsetorId(null);
    setTarefas([]);
    if (errors.setorId) setErrors((e) => ({ ...e, setorId: "" }));
  }

  function toggleDia(dia: number) {
    setDiasSemana((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia],
    );
    if (errors.diasSemana) setErrors((e) => ({ ...e, diasSemana: "" }));
  }

  function handleAddTarefa(tarefa: TarefaItem) {
    setTarefas((prev) => [...prev, tarefa]);
    if (errors.tarefas) setErrors((e) => ({ ...e, tarefas: "" }));
  }

  function getFuncionarioNome(id: string) {
    return state.funcionarios.find((f) => f.id === id)?.nome ?? "—";
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!nome.trim()) e.nome = "Nome é obrigatório";
    if (!setorId) e.setorId = "Selecione um setor";
    if (diasSemana.length === 0) e.diasSemana = "Selecione ao menos um dia";
    if (tarefas.length === 0) e.tarefas = "Adicione ao menos uma tarefa";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSalvar() {
    if (!validate()) return;
    addChecklist({
      nome: nome.trim(),
      setorId: setorId!,
      subsetorId: subsetorId ?? undefined,
      diasSemana,
      tarefas,
      ativo: true,
    });
    router.back();
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
          <View>
            <Text className="text-xl font-bold text-white">Novo Checklist</Text>
            <Text className="text-xs text-emerald-200">
              Configure tarefas para sua equipe
            </Text>
          </View>
        </View>
      </View>

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
                Nome do Checklist <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className={`rounded-xl border px-4 py-3.5 text-base text-gray-800 ${
                  errors.nome ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
                }`}
                placeholder="Ex: Limpeza Noturna da Cozinha"
                placeholderTextColor="#9ca3af"
                value={nome}
                onChangeText={(v) => {
                  setNome(v);
                  if (errors.nome) setErrors((e) => ({ ...e, nome: "" }));
                }}
              />
              {errors.nome ? (
                <Text className="mt-1 text-xs text-red-500">{errors.nome}</Text>
              ) : null}
            </View>

            {/* Setor */}
            <View className="mb-4">
              <Text className="mb-1.5 text-sm font-semibold text-gray-700">
                Setor <Text className="text-red-500">*</Text>
              </Text>
              <Select
                placeholder="Selecione o setor"
                value={setorId}
                options={setorOptions}
                onSelect={handleSetorChange}
                error={!!errors.setorId}
              />
              {errors.setorId ? (
                <Text className="mt-1 text-xs text-red-500">{errors.setorId}</Text>
              ) : null}
            </View>

            {/* Subsetor — só aparece se o setor tiver subsetores */}
            {temSubsetores && (
              <View className="mb-5">
                <View className="mb-1.5 flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-gray-700">
                    Subsetor{" "}
                    <Text className="font-normal text-gray-400">(opcional)</Text>
                  </Text>
                  {subsetorId && (
                    <TouchableOpacity onPress={() => setSubsetorId(null)}>
                      <Text className="text-xs text-gray-400 underline">
                        Limpar
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Chips selecionáveis */}
                <View className="flex-row flex-wrap gap-2">
                  {subsetorOptions.map((opt) => {
                    const ativo = subsetorId === opt.value;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={() =>
                          setSubsetorId(ativo ? null : opt.value)
                        }
                        className={`flex-row items-center gap-1.5 rounded-full border px-3.5 py-2 ${
                          ativo
                            ? "border-primary-500 bg-primary-600"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <Ionicons
                          name={ativo ? "checkmark-circle" : "albums-outline"}
                          size={14}
                          color={ativo ? "white" : "#7c3aed"}
                        />
                        <Text
                          className={`text-sm font-semibold ${
                            ativo ? "text-white" : "text-primary-700"
                          }`}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {!subsetorId && (
                  <View className="mt-2 flex-row items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2">
                    <Ionicons name="information-circle-outline" size={13} color="#b45309" />
                    <Text className="flex-1 text-xs text-amber-700">
                      Sem subsetor selecionado — checklist aplicado ao setor inteiro
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Dias da semana */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-gray-700">
                Dias da Semana <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row gap-1.5">
                {DIAS.map((dia, index) => {
                  const ativo = diasSemana.includes(index);
                  return (
                    <TouchableOpacity
                      key={dia}
                      onPress={() => toggleDia(index)}
                      className={`flex-1 items-center rounded-xl py-2.5 ${
                        ativo ? "bg-emerald-600" : "border border-gray-200 bg-white"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          ativo ? "text-white" : "text-gray-500"
                        }`}
                      >
                        {dia}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.diasSemana ? (
                <Text className="mt-1 text-xs text-red-500">{errors.diasSemana}</Text>
              ) : null}
            </View>

            {/* Tarefas */}
            <View className="mb-8">
              <View className="mb-3 flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-semibold text-gray-700">
                    Tarefas <Text className="text-red-500">*</Text>
                  </Text>
                  {tarefas.length > 0 && (
                    <Text className="text-xs text-gray-400">
                      {tarefas.length} adicionada{tarefas.length > 1 ? "s" : ""}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  className="flex-row items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 active:bg-emerald-700"
                >
                  <Ionicons name="add" size={16} color="white" />
                  <Text className="text-sm font-semibold text-white">Tarefa</Text>
                </TouchableOpacity>
              </View>

              {errors.tarefas ? (
                <Text className="mb-2 text-xs text-red-500">{errors.tarefas}</Text>
              ) : null}

              {tarefas.length === 0 ? (
                <View className="items-center rounded-xl border border-dashed border-gray-300 py-8">
                  <Ionicons name="list-outline" size={28} color="#d1d5db" />
                  <Text className="mt-2 text-sm text-gray-400">
                    Nenhuma tarefa adicionada ainda
                  </Text>
                </View>
              ) : (
                tarefas.map((t, i) => (
                  <TarefaCard
                    key={t.id}
                    tarefa={t}
                    index={i}
                    funcionarioNome={getFuncionarioNome(t.funcionarioId)}
                    onRemove={() =>
                      setTarefas((prev) => prev.filter((x) => x.id !== t.id))
                    }
                  />
                ))
              )}
            </View>
          </ScrollView>

          {/* Botão salvar */}
          <View className="border-t border-gray-100 bg-white px-5 py-4">
            <Pressable
              onPress={handleSalvar}
              className="items-center rounded-2xl bg-emerald-600 py-4 active:bg-emerald-700"
            >
              <Text className="text-base font-bold text-white">
                Salvar Checklist
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      <TarefaModal
        visible={modalVisible}
        funcionarioOptions={funcionarioOptions}
        onSave={(t) => {
          handleAddTarefa(t);
          setModalVisible(false);
        }}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
