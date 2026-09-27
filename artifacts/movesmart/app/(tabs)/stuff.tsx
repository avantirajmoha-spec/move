import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, Chip, Header, IconButton, PrimaryButton, Screen, SectionHeader } from '@/components/MoveUI';
import { InventoryItem, ItemAction, useMove } from '@/context/MoveContext';
import { useColors } from '@/hooks/useColors';

const actions: { key: ItemAction; label: string; colorKey: 'mint' | 'accent' | 'lavender' | 'sky'; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'move', label: 'Move', colorKey: 'mint', icon: 'arrow-forward-circle-outline' },
  { key: 'sell', label: 'Sell', colorKey: 'accent', icon: 'pricetag-outline' },
  { key: 'donate', label: 'Donate', colorKey: 'lavender', icon: 'heart-outline' },
  { key: 'later', label: 'Later', colorKey: 'sky', icon: 'time-outline' },
];

export default function StuffScreen() {
  const colors = useColors();
  const { inventory, updateInventoryAction, addInventory } = useMove();
  const [filter, setFilter] = useState<ItemAction | 'all'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('Living room');
  const [photoUri, setPhotoUri] = useState<string>();
  const filtered = filter === 'all' ? inventory : inventory.filter((item) => item.action === filter);

  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.7 });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };
  const save = () => {
    if (!name.trim()) return;
    addInventory({ name: name.trim(), room, action: 'move', color: colors.primary, icon: 'cube-outline', photoUri });
    setName(''); setPhotoUri(undefined); setShowAdd(false);
  };

  return <Screen><Header eyebrow="Inventory decisions" title="My stuff" action="add" onAction={() => setShowAdd(true)} />
    <Text style={[styles.intro, { color: colors.mutedForeground }]}>Give every item a clear next step. Photos make the sell pile easier to recognize later.</Text>
    <View style={styles.filterRow}><Chip label={`All ${inventory.length}`} active={filter === 'all'} onPress={() => setFilter('all')} />{actions.map((action) => <Chip key={action.key} label={action.label} active={filter === action.key} color={colors[action.colorKey]} onPress={() => setFilter(action.key)} />)}</View>
    <SectionHeader title={`${filtered.length} items in view`} />
    {filtered.map((item) => <InventoryCard key={item.id} item={item} onAction={(action) => updateInventoryAction(item.id, action)} />)}
    <PrimaryButton label="Add something to your move" icon="add" onPress={() => setShowAdd(true)} />
    <Modal visible={showAdd} transparent animationType="slide" onRequestClose={() => setShowAdd(false)}><View style={styles.modalBackdrop}><View style={[styles.modal, { backgroundColor: colors.card }]}><View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: colors.foreground }]}>Add an item</Text><IconButton icon="close" onPress={() => setShowAdd(false)} /></View><Text style={[styles.label, { color: colors.inkSoft }]}>What are you deciding about?</Text><TextInput testID="input-item-name" value={name} onChangeText={setName} placeholder="e.g. armchair, art print" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} /><Text style={[styles.label, { color: colors.inkSoft }]}>Room</Text><View style={styles.chipWrap}>{['Living room', 'Kitchen', 'Bedroom', 'Study'].map((itemRoom) => <Chip key={itemRoom} label={itemRoom} active={room === itemRoom} onPress={() => setRoom(itemRoom)} />)}</View><Pressable onPress={choosePhoto} style={[styles.photoButton, { backgroundColor: colors.secondary }]}><Ionicons name="camera-outline" size={19} color={colors.secondaryForeground} /><Text style={[styles.photoText, { color: colors.secondaryForeground }]}>{photoUri ? 'Photo attached' : 'Add a photo'}</Text></Pressable><PrimaryButton label="Save item" icon="checkmark" onPress={save} /></View></View></Modal>
  </Screen>;
}

function InventoryCard({ item, onAction }: { item: InventoryItem; onAction: (action: ItemAction) => void }) {
  const colors = useColors();
  const current = actions.find((action) => action.key === item.action) ?? actions[0];
  return <Card color={item.color}><View style={styles.itemTop}>{item.photoUri ? <View style={styles.photoThumb}><Text style={{ color: colors.mutedForeground }}>IMG</Text></View> : <View style={[styles.itemIcon, { backgroundColor: item.color }]}><Ionicons name={item.icon as never} size={23} color={colors.foreground} /></View>}<View style={{ flex: 1 }}><Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text><Text style={[styles.itemRoom, { color: colors.mutedForeground }]}>{item.room}</Text></View><View style={[styles.actionPill, { backgroundColor: colors[current.colorKey] }]}><Ionicons name={current.icon} size={14} color={colors.foreground} /><Text style={[styles.actionPillText, { color: colors.foreground }]}>{current.label}</Text></View></View>{item.action === 'sell' ? <Text style={[styles.saleCopy, { color: colors.inkSoft }]}>{item.saleDescription ?? 'Add a marketplace description so this item is ready to list.'}</Text> : null}<View style={styles.actionRow}>{actions.map((action) => <Pressable key={action.key} onPress={() => onAction(action.key)} style={[styles.smallAction, { backgroundColor: item.action === action.key ? colors[action.colorKey] : colors.muted }]}><Ionicons name={action.icon} size={14} color={colors.foreground} /><Text style={[styles.smallActionText, { color: colors.foreground }]}>{action.label}</Text></Pressable>)}</View></Card>;
}

const styles = StyleSheet.create({
  intro: { fontSize: 14, lineHeight: 21, marginBottom: 15, maxWidth: 335 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
  itemTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  itemIcon: { width: 45, height: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  photoThumb: { width: 45, height: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ECE8E2' },
  itemName: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  itemRoom: { fontSize: 12 },
  actionPill: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionPillText: { fontSize: 10, fontWeight: '800' },
  saleCopy: { fontSize: 12, lineHeight: 17, marginTop: 13, paddingLeft: 56 },
  actionRow: { flexDirection: 'row', gap: 6, marginTop: 14 },
  smallAction: { flex: 1, minHeight: 31, borderRadius: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  smallActionText: { fontSize: 10, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(17,37,61,0.42)', justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 35 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  modalTitle: { fontSize: 22, fontWeight: '800' },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 7, marginTop: 10 },
  input: { height: 48, borderWidth: 1, borderRadius: 14, paddingHorizontal: 13, fontSize: 14 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 14 },
  photoButton: { minHeight: 46, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 },
  photoText: { fontSize: 13, fontWeight: '700' },
});