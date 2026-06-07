/**
 * Automation builder store — React Context + reducer replacement for
 * replyagent's Pinia `AutomationStore`. Holds graph state, selection,
 * sidebar / secondary-bar stack, saving state, and an undo/redo history.
 *
 * Why a hand-rolled reducer instead of a 3rd-party state library? Project
 * has no Zustand/Jotai/etc. installed and adding a runtime dep just for
 * this view is overkill. The reducer + Context pattern gives us the same
 * shape — `useAutomationStore()` for state, `useAutomationActions()` for
 * mutations.
 *
 * History: every mutation (other than selectNode / pushSecondary) pushes a
 * deep-cloned snapshot of {nodes, edges} to `past`. Undo pops `past` →
 * current, pushes old current onto `future`. Redo reverses. Selection /
 * secondary-bar / saving state aren't part of history.
 */
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import type { Node, Edge } from 'reactflow';

const HISTORY_DEPTH = 50;
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

type Snapshot = { nodes: Node[]; edges: Edge[] };

export interface AutomationBuilderState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  secondaryStack: Array<{ kind: string; payload: any }>;
  saving: boolean;
  dirty: boolean;
  mode: 'draft' | 'published';
  past: Snapshot[];
  future: Snapshot[];
}

const initialState: AutomationBuilderState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  secondaryStack: [],
  saving: false,
  dirty: false,
  mode: 'draft',
  past: [],
  future: [],
};

type Action =
  | { type: 'SET_NODES'; nodes: Node[] }
  | { type: 'SET_EDGES'; edges: Edge[] }
  | { type: 'SET_GRAPH'; nodes: Node[]; edges: Edge[] }
  | { type: 'HYDRATE'; nodes: Node[]; edges: Edge[] }
  | { type: 'SELECT_NODE'; id: string | null }
  | { type: 'UPDATE_NODE_DATA'; id: string; partial: Record<string, any> }
  | { type: 'ADD_NODE'; node: Node }
  | { type: 'REMOVE_NODE'; id: string }
  | { type: 'ADD_EDGE'; edge: Edge }
  | { type: 'REMOVE_EDGE'; id: string }
  | { type: 'PUSH_SECONDARY'; kind: string; payload?: any }
  | { type: 'POP_SECONDARY' }
  | { type: 'CLOSE_SECONDARY' }
  | { type: 'SET_MODE'; mode: 'draft' | 'published' }
  | { type: 'SET_SAVING'; saving: boolean }
  | { type: 'MARK_CLEAN' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET_HISTORY' };

function pushSnapshot(s: AutomationBuilderState): Snapshot[] {
  const snap: Snapshot = { nodes: clone(s.nodes), edges: clone(s.edges) };
  const next = [...s.past, snap];
  if (next.length > HISTORY_DEPTH) next.shift();
  return next;
}

function reducer(s: AutomationBuilderState, a: Action): AutomationBuilderState {
  switch (a.type) {
    case 'HYDRATE':
      // Initial load — don't write a history entry (nothing to undo to).
      return { ...s, nodes: a.nodes, edges: a.edges, past: [], future: [], dirty: false };
    case 'SET_NODES':
      return { ...s, nodes: a.nodes, past: pushSnapshot(s), future: [], dirty: true };
    case 'SET_EDGES':
      return { ...s, edges: a.edges, past: pushSnapshot(s), future: [], dirty: true };
    case 'SET_GRAPH':
      return {
        ...s,
        nodes: a.nodes,
        edges: a.edges,
        past: pushSnapshot(s),
        future: [],
        dirty: true,
      };
    case 'SELECT_NODE':
      return { ...s, selectedNodeId: a.id, secondaryStack: [] };
    case 'UPDATE_NODE_DATA':
      return {
        ...s,
        nodes: s.nodes.map((n) =>
          n.id === a.id ? { ...n, data: { ...n.data, ...a.partial } } : n,
        ),
        past: pushSnapshot(s),
        future: [],
        dirty: true,
      };
    case 'ADD_NODE':
      return {
        ...s,
        nodes: [...s.nodes, a.node],
        past: pushSnapshot(s),
        future: [],
        dirty: true,
      };
    case 'REMOVE_NODE':
      return {
        ...s,
        nodes: s.nodes.filter((n) => n.id !== a.id),
        edges: s.edges.filter((e) => e.source !== a.id && e.target !== a.id),
        selectedNodeId: s.selectedNodeId === a.id ? null : s.selectedNodeId,
        past: pushSnapshot(s),
        future: [],
        dirty: true,
      };
    case 'ADD_EDGE':
      return {
        ...s,
        edges: [...s.edges, a.edge],
        past: pushSnapshot(s),
        future: [],
        dirty: true,
      };
    case 'REMOVE_EDGE':
      return {
        ...s,
        edges: s.edges.filter((e) => e.id !== a.id),
        past: pushSnapshot(s),
        future: [],
        dirty: true,
      };
    case 'PUSH_SECONDARY':
      return { ...s, secondaryStack: [...s.secondaryStack, { kind: a.kind, payload: a.payload }] };
    case 'POP_SECONDARY':
      return { ...s, secondaryStack: s.secondaryStack.slice(0, -1) };
    case 'CLOSE_SECONDARY':
      return { ...s, secondaryStack: [] };
    case 'SET_MODE':
      return { ...s, mode: a.mode };
    case 'SET_SAVING':
      return { ...s, saving: a.saving };
    case 'MARK_CLEAN':
      return { ...s, dirty: false };
    case 'UNDO': {
      if (s.past.length === 0) return s;
      const previous = s.past[s.past.length - 1];
      return {
        ...s,
        nodes: previous.nodes,
        edges: previous.edges,
        past: s.past.slice(0, -1),
        future: [{ nodes: clone(s.nodes), edges: clone(s.edges) }, ...s.future],
        dirty: true,
      };
    }
    case 'REDO': {
      if (s.future.length === 0) return s;
      const next = s.future[0];
      return {
        ...s,
        nodes: next.nodes,
        edges: next.edges,
        past: [...s.past, { nodes: clone(s.nodes), edges: clone(s.edges) }].slice(-HISTORY_DEPTH),
        future: s.future.slice(1),
        dirty: true,
      };
    }
    case 'RESET_HISTORY':
      return { ...s, past: [], future: [], dirty: false };
    default:
      return s;
  }
}

interface AutomationStoreCtx {
  state: AutomationBuilderState;
  dispatch: React.Dispatch<Action>;
}

const Ctx = createContext<AutomationStoreCtx | null>(null);

export function AutomationStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return React.createElement(Ctx.Provider, { value }, children);
}

function useCtx(): AutomationStoreCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAutomation* must be used inside <AutomationStoreProvider>');
  return c;
}

export function useAutomationState(): AutomationBuilderState {
  return useCtx().state;
}

export function useAutomationActions() {
  const { dispatch } = useCtx();
  // Stable callbacks so consumers can pass these into deps arrays without
  // re-renders. dispatch itself is stable from useReducer.
  return useMemo(
    () => ({
      hydrate: (nodes: Node[], edges: Edge[]) => dispatch({ type: 'HYDRATE', nodes, edges }),
      setNodes: (nodes: Node[]) => dispatch({ type: 'SET_NODES', nodes }),
      setEdges: (edges: Edge[]) => dispatch({ type: 'SET_EDGES', edges }),
      setGraph: (nodes: Node[], edges: Edge[]) => dispatch({ type: 'SET_GRAPH', nodes, edges }),
      selectNode: (id: string | null) => dispatch({ type: 'SELECT_NODE', id }),
      updateNodeData: (id: string, partial: Record<string, any>) =>
        dispatch({ type: 'UPDATE_NODE_DATA', id, partial }),
      addNode: (node: Node) => dispatch({ type: 'ADD_NODE', node }),
      removeNode: (id: string) => dispatch({ type: 'REMOVE_NODE', id }),
      addEdge: (edge: Edge) => dispatch({ type: 'ADD_EDGE', edge }),
      removeEdge: (id: string) => dispatch({ type: 'REMOVE_EDGE', id }),
      pushSecondary: (kind: string, payload?: any) =>
        dispatch({ type: 'PUSH_SECONDARY', kind, payload }),
      popSecondary: () => dispatch({ type: 'POP_SECONDARY' }),
      closeSecondary: () => dispatch({ type: 'CLOSE_SECONDARY' }),
      setMode: (mode: 'draft' | 'published') => dispatch({ type: 'SET_MODE', mode }),
      setSaving: (saving: boolean) => dispatch({ type: 'SET_SAVING', saving }),
      markClean: () => dispatch({ type: 'MARK_CLEAN' }),
      undo: () => dispatch({ type: 'UNDO' }),
      redo: () => dispatch({ type: 'REDO' }),
      resetHistory: () => dispatch({ type: 'RESET_HISTORY' }),
    }),
    [dispatch],
  );
}

export function useSelectedNode(): Node | null {
  const s = useAutomationState();
  return s.nodes.find((n) => n.id === s.selectedNodeId) ?? null;
}

export function useCanUndoRedo(): { canUndo: boolean; canRedo: boolean } {
  const s = useAutomationState();
  return { canUndo: s.past.length > 0, canRedo: s.future.length > 0 };
}
