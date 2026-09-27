import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { BoxWeight, useMove } from '@/context/MoveContext';
import { Card, Chip, Header, IconButton, PrimaryButton, Screen, SectionHeader, StatusBadge } from '@/components/MoveUI';
import { useColors } from '@/hooks/useColors';

const weights: { label: BoxWeight; icon: keyof typeof Ionicons.glyphMap }[] = [{ label: 'Light', icon: 'leaf-outline' }, { label: 'Medium', icon: 'scale-outline' }, { label: 'Heavy', icon: 'speedometer-outline' }];
const cycleStatus = { Packing: 'Tap to mark loaded', Loaded: 'Tap to mark sealed', Sealed: 'Tap to reopen packing' };

export default function BoxesScreen() {
  const colors = useColors();
  const { boxes, addBox, advanceBox } = useMove();
  const [showAdd, setShowAdd] = useState(false);
  const [label, setLabel] = useState('');
  const [room, setRoom] = useState('Living room');
  const [weight, setWeight] = useState<BoxWeight>('Medium');
  const counts = { Packing: boxes.filter((box) => box.status === 'Packing').length, Loaded: boxes.filter((box) => box.status === 'Loaded').length, Sealed: boxes.filter((box) => box.status === 'Sealed').length };
  const save = () => { if (!label.trim()) return; addBox({ label: label.trim(), room, weight, status: 'Packing', itemCount: 0, color: weight === 'Heavy' ? colors.primary : weight === 'Medium' ? colors.accent : colors.sky }); setLabel(''); setShowAdd(false); };
  return <Screen><Header eyebrow="Pack with confidence" title="Boxes" action="add" onAction={() => setShowAdd(true)} /><View style={styles.summary}><Summary title="Packing" value={counts.Packing} color={colors.accent} /><Summary title="Loaded" value={counts.Loaded} color={colors.sky} /><Summary title="Sealed" value={counts.Sealed} color={colors.mint} /></View><Text style={[styles.helper, { color: colors.mutedForeground }]}>Each status is independent, so the top count always reflects the box you just changed.</Text><SectionHeader title={`${boxes.length} boxes`} action="Add box" onAction={() => setShowAdd(true)} />{boxes.map((box) => <Card key={box.id} color={box.color}><View style={styles.boxTop}><View style={[styles.boxIcon, { backgroundColor: box.color }]}><Ionicons name="cube-outline" size={24} color={colors.foreground} /></View><View style={{ flex: 1 }}><Text style={[styles.boxTitle, { color: colors.foreground }]}>Box {box.number} · {box.label}</Text><Text style={[styles.boxMeta, { color: colors.mutedForeground }]}>{box.room} · {box.itemCount || 'No'} items · {box.weight} box</Text></View><StatusBadge status={box.status} /></View><View style={styles.statusLine}><Text style={[styles.statusHint, { color: colors.mutedForeground }]}>{cycleStatus[box.status]}</Text><IconButton icon={box.status === 'Sealed' ? 'refresh-outline' : 'checkmark'} color={colors.secondary} onPress={() => advanceBox(box.id)} /></View></Card>)}<Modal visible={showAdd} transparent animationType="slide" onRequestClose={() => setShowAdd(false)}><View style={styles.modalBackdrop}><View style={[styles.modal, { backgroundColor: colors.card }]}><View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: colors.foreground }]}>New box</Text><IconButton icon="close" onPress={() => setShowAdd(false)} /></View><TextInput value={label} onChangeText={setLabel} placeholder="Label, e.g. bathroom / fragile" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} /><Text style={[styles.label, { color: colors.inkSoft }]}>Room</Text><View style={styles.wrap}>{['Living room', 'Kitchen', 'Bedroom', 'Study'].map((item) => <Chip key={item} label={item} active={room === item} onPress={() => setRoom(item)} />)}</View><Text style={[styles.label, { color: colors.inkSoft }]}>Weight guidance</Text><View style={styles.wrap}>{weights.map((item) => <Chip key={item.label} label={item.label} active={weight === item.label} color={item.label === 'Heavy' ? colors.primary : item.label === 'Medium' ? colors.accent : colors.sky} onPress={() => setWeight(item.label)} />)}</View><PrimaryButton label="Create box" icon="cube-outline" onPress={save} /></View></View></Modal></Screen>;
}

function Summary({ title, value, color }: { title: string; value: number; color: string }) {
  const colors = useColors();
  return <View style={[styles.summaryItem, { backgroundColor: color }]}><Text style={[styles.summaryValue, { color: colors.foreground }]}>{value}</Text><Text style={[styles.summaryTitle, { color: colors.inkSoft }]}>{title}</Text></View>;
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  summaryItem: { flex: 1, borderRadius: 17, paddingVertical: 13, paddingHorizontal: 10 },
  summaryValue: { fontSize: 24, fontWeight: '800' },
  summaryTitle: { fontSize: 11, fontWeight: '700', marginTop: 3 },
  helper: { fontSize: 12, lineHeight: 17, maxWidth: 330 },
  boxTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  boxIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  boxTitle: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  boxMeta: { fontSize: 11 },
  statusLine: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E8DDD1', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusHint: { fontSize: 11, fontWeight: '600' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(17,37,61,0.42)', justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 35 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  modalTitle: { fontSize: 22, fontWeight: '800' },
  input: { height: 48, borderWidth: 1, borderRadius: 14, paddingHorizontal: 13, fontSize: 14 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 16 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 5 },
});