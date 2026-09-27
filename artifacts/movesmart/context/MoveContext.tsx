import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type ItemAction = 'move' | 'sell' | 'donate' | 'later';
export type BoxWeight = 'Light' | 'Medium' | 'Heavy';
export type BoxStatus = 'Packing' | 'Loaded' | 'Sealed';
export type Priority = 'High' | 'Medium' | 'Low';

export interface InventoryItem {
  id: string;
  name: string;
  room: string;
  action: ItemAction;
  color: string;
  icon: string;
  photoUri?: string;
  saleDescription?: string;
}

export interface MoveBox {
  id: string;
  number: number;
  label: string;
  room: string;
  weight: BoxWeight;
  status: BoxStatus;
  itemCount: number;
  color: string;
}

export interface MoveTask {
  id: string;
  title: string;
  detail: string;
  priority: Priority;
  due: string;
  done: boolean;
}

export interface ConditionLog {
  id: string;
  title: string;
  detail: string;
  room: string;
  type: 'damage' | 'appliance';
  status: string;
  timestamp: string;
}

interface MoveState {
  userName: string;
  destination: string;
  moveDate: string;
  miles: number;
  origin: string;
  elevator: boolean;
  elevatorNote: string;
  homeType: 'Furnished' | 'Semi-furnished' | 'Unfurnished';
  inventory: InventoryItem[];
  boxes: MoveBox[];
  tasks: MoveTask[];
  conditionLogs: ConditionLog[];
  completedSettle: string[];
  scanSummary?: string;
  scanLayout?: { label: string; x: number; y: number; width: number; height: number }[];
}

interface MoveContextValue extends MoveState {
  hydrated: boolean;
  setHomeType: (type: MoveState['homeType']) => void;
  setElevator: (value: boolean) => void;
  addInventory: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryAction: (id: string, action: ItemAction, saleDescription?: string) => void;
  addBox: (box: Omit<MoveBox, 'id' | 'number'>) => void;
  advanceBox: (id: string) => void;
  addTask: (task: Omit<MoveTask, 'id' | 'done'>) => void;
  toggleTask: (id: string) => void;
  snoozeTask: (id: string) => void;
  addConditionLog: (log: Omit<ConditionLog, 'id' | 'timestamp'>) => void;
  toggleSettleItem: (id: string) => void;
  setScanResult: (summary: string, layout: MoveState['scanLayout']) => void;
  resetMove: () => void;
}

const initialState: MoveState = {
  userName: 'Alex',
  destination: 'Highland Ave',
  moveDate: '2026-10-03',
  miles: 12.4,
  origin: 'Oak Street',
  elevator: false,
  elevatorNote: '4th floor · no elevator',
  homeType: 'Semi-furnished',
  inventory: [
    { id: 'i1', name: 'Sofa', room: 'Living room', action: 'move', color: '#F45B4C', icon: 'bed-outline' },
    { id: 'i2', name: 'Standing lamp', room: 'Living room', action: 'sell', color: '#FFC857', icon: 'bulb-outline', saleDescription: 'Warm brass standing lamp, good condition.' },
    { id: 'i3', name: 'Desk setup', room: 'Study', action: 'move', color: '#8D83E6', icon: 'desktop-outline' },
    { id: 'i4', name: 'Winter clothes', room: 'Bedroom', action: 'later', color: '#5AA7D9', icon: 'shirt-outline' },
    { id: 'i5', name: 'Bookshelf', room: 'Study', action: 'donate', color: '#2E8B70', icon: 'library-outline' },
    { id: 'i6', name: 'Dining chairs', room: 'Kitchen', action: 'move', color: '#F39C6B', icon: 'grid-outline' },
    { id: 'i7', name: 'Mirror', room: 'Bedroom', action: 'move', color: '#A88AD8', icon: 'square-outline' },
    { id: 'i8', name: 'Toaster', room: 'Kitchen', action: 'move', color: '#75B7B0', icon: 'restaurant-outline' },
  ],
  boxes: [
    { id: 'b1', number: 1, label: 'Kitchen essentials', room: 'Kitchen', weight: 'Medium', status: 'Sealed', itemCount: 8, color: '#FFC857' },
    { id: 'b2', number: 2, label: 'Desk cables', room: 'Study', weight: 'Light', status: 'Loaded', itemCount: 5, color: '#8D83E6' },
    { id: 'b3', number: 3, label: 'Books', room: 'Study', weight: 'Heavy', status: 'Packing', itemCount: 14, color: '#2E8B70' },
    { id: 'b4', number: 4, label: 'First-night clothes', room: 'Bedroom', weight: 'Light', status: 'Packing', itemCount: 6, color: '#5AA7D9' },
  ],
  tasks: [
    { id: 't1', title: 'Confirm loading window', detail: 'Share the 9:00–11:00 AM slot with your movers.', priority: 'High', due: 'Today', done: false },
    { id: 't2', title: 'Pack a first-night box', detail: 'Keep chargers, toiletries, sheets, and a change of clothes close.', priority: 'Medium', due: 'Tomorrow', done: false },
    { id: 't3', title: 'Measure the study doorway', detail: 'Check the desk can make the turn into the study.', priority: 'Low', due: 'Sep 30', done: false },
    { id: 't4', title: 'Update your delivery notes', detail: 'Mention the 4th-floor walk-up before moving day.', priority: 'High', due: 'Sep 29', done: true },
  ],
  conditionLogs: [
    { id: 'c1', title: 'Hardwood floor near south window', detail: '2-inch surface scratch and light water mark from previous tenant potted plant.', room: 'Living Room', type: 'damage', status: 'Pre-existing Damage', timestamp: 'Sep 24 · 2:15 PM' },
    { id: 'c2', title: 'Provided refrigerator & freezer', detail: 'Clean shelves, cooling down to 37°F as expected.', room: 'Kitchen', type: 'appliance', status: 'Good', timestamp: 'Sep 24 · 2:18 PM' },
  ],
  completedSettle: [],
};

const STORAGE_KEY = 'movesmart-state-v1';
const MoveContext = createContext<MoveContextValue | null>(null);

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function MoveProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MoveState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setState(JSON.parse(stored) as MoveState);
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [state, hydrated]);

  const value = useMemo<MoveContextValue>(() => ({
    ...state,
    hydrated,
    setHomeType: (homeType) => setState((current) => ({ ...current, homeType })),
    setElevator: (elevator) => setState((current) => ({ ...current, elevator, elevatorNote: elevator ? '4th floor · elevator available' : '4th floor · no elevator' })),
    addInventory: (item) => setState((current) => ({ ...current, inventory: [{ ...item, id: makeId('item') }, ...current.inventory] })),
    updateInventoryAction: (id, action, saleDescription) => setState((current) => ({ ...current, inventory: current.inventory.map((item) => item.id === id ? { ...item, action, saleDescription: saleDescription ?? item.saleDescription } : item) })),
    addBox: (box) => setState((current) => ({ ...current, boxes: [...current.boxes, { ...box, id: makeId('box'), number: current.boxes.length + 1 }] })),
    advanceBox: (id) => setState((current) => ({ ...current, boxes: current.boxes.map((box) => {
      if (box.id !== id) return box;
      const next: Record<BoxStatus, BoxStatus> = { Packing: 'Loaded', Loaded: 'Sealed', Sealed: 'Packing' };
      return { ...box, status: next[box.status] };
    }) })),
    addTask: (task) => setState((current) => ({ ...current, tasks: [{ ...task, id: makeId('task'), done: false }, ...current.tasks] })),
    toggleTask: (id) => setState((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task) })),
    snoozeTask: (id) => setState((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === id ? { ...task, due: 'Later this week' } : task) })),
    addConditionLog: (log) => setState((current) => ({ ...current, conditionLogs: [{ ...log, id: makeId('condition'), timestamp: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) }, ...current.conditionLogs] })),
    toggleSettleItem: (id) => setState((current) => ({ ...current, completedSettle: current.completedSettle.includes(id) ? current.completedSettle.filter((item) => item !== id) : [...current.completedSettle, id] })),
    setScanResult: (scanSummary, scanLayout) => setState((current) => ({ ...current, scanSummary, scanLayout })),
    resetMove: () => setState(initialState),
  }), [state, hydrated]);

  return <MoveContext.Provider value={value}>{children}</MoveContext.Provider>;
}

export function useMove() {
  const context = useContext(MoveContext);
  if (!context) throw new Error('useMove must be used within MoveProvider');
  return context;
}