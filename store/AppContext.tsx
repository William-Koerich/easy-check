import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Setor = {
  id: string;
  nome: string;
  descricao: string;
  createdAt: string;
};

export type Subsetor = {
  id: string;
  nome: string;
  setorId: string;
  createdAt: string;
};

export type Funcionario = {
  id: string;
  nome: string;
  cargo: string;
  setorId: string;
  createdAt: string;
};

export type TarefaItem = {
  id: string;
  descricao: string;
  funcionarioId: string;
  horario: string;
  exigeFoto: boolean;
};

export type Checklist = {
  id: string;
  nome: string;
  setorId: string;
  subsetorId?: string;
  diasSemana: number[];
  tarefas: TarefaItem[];
  ativo: boolean;
  createdAt: string;
};

// ─── State & Actions ─────────────────────────────────────────────────────────

type State = {
  setores: Setor[];
  subsetores: Subsetor[];
  funcionarios: Funcionario[];
  checklists: Checklist[];
  loaded: boolean;
};

type Action =
  | { type: "LOAD"; payload: Omit<State, "loaded"> }
  | { type: "ADD_SETOR"; payload: Setor }
  | { type: "ADD_SUBSETOR"; payload: Subsetor }
  | { type: "ADD_FUNCIONARIO"; payload: Funcionario }
  | { type: "ADD_CHECKLIST"; payload: Checklist }
  | { type: "DELETE_SETOR"; id: string }
  | { type: "DELETE_SUBSETOR"; id: string }
  | { type: "DELETE_FUNCIONARIO"; id: string }
  | { type: "DELETE_CHECKLIST"; id: string };

const initial: State = {
  setores: [],
  subsetores: [],
  funcionarios: [],
  checklists: [],
  loaded: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD":
      return {
        ...initial,
        ...action.payload,
        // garante campo subsetores mesmo em dados antigos
        subsetores: action.payload.subsetores ?? [],
        loaded: true,
      };
    case "ADD_SETOR":
      return { ...state, setores: [...state.setores, action.payload] };
    case "ADD_SUBSETOR":
      return { ...state, subsetores: [...state.subsetores, action.payload] };
    case "ADD_FUNCIONARIO":
      return { ...state, funcionarios: [...state.funcionarios, action.payload] };
    case "ADD_CHECKLIST":
      return { ...state, checklists: [...state.checklists, action.payload] };
    case "DELETE_SETOR":
      return {
        ...state,
        setores: state.setores.filter((s) => s.id !== action.id),
        subsetores: state.subsetores.filter((s) => s.setorId !== action.id),
      };
    case "DELETE_SUBSETOR":
      return {
        ...state,
        subsetores: state.subsetores.filter((s) => s.id !== action.id),
      };
    case "DELETE_FUNCIONARIO":
      return {
        ...state,
        funcionarios: state.funcionarios.filter((f) => f.id !== action.id),
      };
    case "DELETE_CHECKLIST":
      return {
        ...state,
        checklists: state.checklists.filter((c) => c.id !== action.id),
      };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "@easy_check_data";

type Ctx = {
  state: State;
  addSetor: (data: Omit<Setor, "id" | "createdAt">) => void;
  addSubsetor: (data: Omit<Subsetor, "id" | "createdAt">) => void;
  addFuncionario: (data: Omit<Funcionario, "id" | "createdAt">) => void;
  addChecklist: (data: Omit<Checklist, "id" | "createdAt">) => void;
  deleteSetor: (id: string) => void;
  deleteSubsetor: (id: string) => void;
  deleteFuncionario: (id: string) => void;
  deleteChecklist: (id: string) => void;
};

const AppCtx = createContext<Ctx | null>(null);

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw);
          dispatch({ type: "LOAD", payload: parsed });
        } else {
          dispatch({ type: "LOAD", payload: initial });
        }
      })
      .catch(() => dispatch({ type: "LOAD", payload: initial }));
  }, []);

  useEffect(() => {
    if (!state.loaded) return;
    const { setores, subsetores, funcionarios, checklists } = state;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ setores, subsetores, funcionarios, checklists }),
    );
  }, [state]);

  const addSetor = useCallback((data: Omit<Setor, "id" | "createdAt">) => {
    dispatch({
      type: "ADD_SETOR",
      payload: { ...data, id: uid(), createdAt: new Date().toISOString() },
    });
  }, []);

  const addSubsetor = useCallback(
    (data: Omit<Subsetor, "id" | "createdAt">) => {
      dispatch({
        type: "ADD_SUBSETOR",
        payload: { ...data, id: uid(), createdAt: new Date().toISOString() },
      });
    },
    [],
  );

  const addFuncionario = useCallback(
    (data: Omit<Funcionario, "id" | "createdAt">) => {
      dispatch({
        type: "ADD_FUNCIONARIO",
        payload: { ...data, id: uid(), createdAt: new Date().toISOString() },
      });
    },
    [],
  );

  const addChecklist = useCallback(
    (data: Omit<Checklist, "id" | "createdAt">) => {
      dispatch({
        type: "ADD_CHECKLIST",
        payload: { ...data, id: uid(), createdAt: new Date().toISOString() },
      });
    },
    [],
  );

  const deleteSetor = useCallback(
    (id: string) => dispatch({ type: "DELETE_SETOR", id }),
    [],
  );
  const deleteSubsetor = useCallback(
    (id: string) => dispatch({ type: "DELETE_SUBSETOR", id }),
    [],
  );
  const deleteFuncionario = useCallback(
    (id: string) => dispatch({ type: "DELETE_FUNCIONARIO", id }),
    [],
  );
  const deleteChecklist = useCallback(
    (id: string) => dispatch({ type: "DELETE_CHECKLIST", id }),
    [],
  );

  return (
    <AppCtx.Provider
      value={{
        state,
        addSetor,
        addSubsetor,
        addFuncionario,
        addChecklist,
        deleteSetor,
        deleteSubsetor,
        deleteFuncionario,
        deleteChecklist,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
