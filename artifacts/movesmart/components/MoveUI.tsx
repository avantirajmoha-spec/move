import { Feather, Ionicons } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { BoxStatus, BoxWeight, Priority } from '@/context/MoveContext';

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const content = <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top + 14 }]}>{children}</View>;
  if (!scroll) return content;
  return <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>{content}</ScrollView>;
}

export function Header({ eyebrow, title, action, onAction }: { eyebrow?: string; title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <View style={styles.header}>
    <View style={{ flex: 1 }}>
      {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow.toUpperCase()}</Text> : null}
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
    </View>
    {action && onAction ? <Pressable onPress={onAction} hitSlop={12} style={({ pressed }) => [styles.headerAction, { backgroundColor: colors.card, opacity: pressed ? 0.7 : 1 }]}><Feather name={action as never} size={20} color={colors.foreground} /></Pressable> : null}
  </View>;
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>{action && onAction ? <Pressable onPress={onAction}><Text style={[styles.link, { color: colors.primary }]}>{action}</Text></Pressable> : null}</View>;
}

export function Card({ children, color, style }: { children: ReactNode; color?: string; style?: object }) {
  const colors = useColors();
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, color ? { borderLeftColor: color, borderLeftWidth: 5 } : null, style]}>{children}</View>;
}

export function PrimaryButton({ label, icon, onPress, secondary = false }: { label: string; icon?: keyof typeof Ionicons.glyphMap; onPress: () => void; secondary?: boolean }) {
  const colors = useColors();
  return <Pressable testID={`button-${label}`} onPress={onPress} style={({ pressed }) => [styles.primaryButton, { backgroundColor: secondary ? colors.secondary : colors.primary, opacity: pressed ? 0.82 : 1 }]}><Ionicons name={icon ?? 'arrow-forward'} size={18} color={secondary ? colors.secondaryForeground : colors.primaryForeground} /><Text style={[styles.primaryButtonText, { color: secondary ? colors.secondaryForeground : colors.primaryForeground }]}>{label}</Text></Pressable>;
}

export function IconButton({ icon, onPress, color }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void; color?: string }) {
  const colors = useColors();
  return <Pressable onPress={onPress} hitSlop={10} style={({ pressed }) => [styles.iconButton, { backgroundColor: color ?? colors.muted, opacity: pressed ? 0.65 : 1 }]}><Ionicons name={icon} size={19} color={colors.foreground} /></Pressable>;
}

export function Chip({ label, active, onPress, color }: { label: string; active?: boolean; onPress?: () => void; color?: string }) {
  const colors = useColors();
  return <Pressable disabled={!onPress} onPress={onPress} style={[styles.chip, { backgroundColor: active ? (color ?? colors.navy) : colors.muted, borderColor: active ? (color ?? colors.navy) : colors.border }]}><Text style={[styles.chipText, { color: active ? colors.primaryForeground : colors.inkSoft }]}>{label}</Text></Pressable>;
}

export function ProgressBar({ value, color }: { value: number; color?: string }) {
  const colors = useColors();
  return <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}><View style={[styles.progressFill, { width: `${Math.max(0, Math.min(value, 1)) * 100}%`, backgroundColor: color ?? colors.primary }]} /></View>;
}

export function StatusBadge({ status }: { status: BoxStatus }) {
  const colors = useColors();
  const map: Record<BoxStatus, { color: string; icon: keyof typeof Ionicons.glyphMap }> = {
    Packing: { color: colors.accent, icon: 'cube-outline' },
    Loaded: { color: colors.sky, icon: 'car-outline' },
    Sealed: { color: colors.mint, icon: 'checkmark-circle-outline' },
  };
  const item = map[status];
  return <View style={[styles.statusBadge, { backgroundColor: item.color }]}><Ionicons name={item.icon} size={14} color={colors.foreground} /><Text style={[styles.statusText, { color: colors.foreground }]}>{status}</Text></View>;
}

export function PriorityDot({ priority }: { priority: Priority }) {
  const colors = useColors();
  const dotColor = priority === 'High' ? colors.primary : priority === 'Medium' ? colors.accent : colors.mintDeep;
  return <View style={[styles.priorityDot, { backgroundColor: dotColor }]} />;
}

export function EmptyState({ title, detail, icon = 'sparkles-outline' }: { title: string; detail: string; icon?: keyof typeof Ionicons.glyphMap }) {
  const colors = useColors();
  return <Card style={{ alignItems: 'center', paddingVertical: 30 }}><View style={[styles.emptyIcon, { backgroundColor: colors.lavender }]}><Ionicons name={icon} size={24} color={colors.foreground} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.emptyDetail, { color: colors.mutedForeground }]}>{detail}</Text></Card>;
}

export function MiniStat({ label, value, tint }: { label: string; value: string; tint: string }) {
  const colors = useColors();
  return <View style={[styles.miniStat, { backgroundColor: tint }]}><Text style={[styles.miniValue, { color: colors.foreground }]}>{value}</Text><Text style={[styles.miniLabel, { color: colors.inkSoft }]}>{label}</Text></View>;
}

export function MapCard({ onPress }: { onPress?: () => void }) {
  const colors = useColors();
  return <Card style={{ padding: 0, overflow: 'hidden' }}>
    <View style={[styles.mapHeader, { backgroundColor: colors.navy }]}><View><Text style={[styles.mapEyebrow, { color: colors.mint }]}>ROUTE CHECK</Text><Text style={[styles.mapTitle, { color: colors.primaryForeground }]}>Oak Street → Highland Ave</Text></View><Ionicons name="navigate-circle" size={32} color={colors.accent} /></View>
    <View style={[styles.map, { backgroundColor: colors.sky }]}>
      <View style={[styles.mapBlock, { top: 15, left: 20, width: 80, height: 58, backgroundColor: '#B9DABF' }]} /><View style={[styles.mapBlock, { top: 85, left: 18, width: 130, height: 52, backgroundColor: '#CFE3BC' }]} /><View style={[styles.mapBlock, { top: 25, right: 22, width: 100, height: 76, backgroundColor: '#C7D9EF' }]} />
      <View style={[styles.mapRoad, { top: 71, transform: [{ rotate: '-14deg' }] }]} /><View style={[styles.mapRoad, { top: 115, transform: [{ rotate: '18deg' }] }]} />
      <View style={[styles.routeLine, { backgroundColor: colors.primary, transform: [{ rotate: '-20deg' }] }]} /><View style={[styles.mapPin, { left: 50, top: 103, backgroundColor: colors.primary }]}><Ionicons name="home" size={13} color={colors.primaryForeground} /></View><View style={[styles.mapPin, { right: 46, top: 30, backgroundColor: colors.navy }]}><Ionicons name="flag" size={13} color={colors.primaryForeground} /></View>
    </View>
    <View style={styles.mapFooter}><View style={{ flex: 1 }}><Text style={[styles.mapDistance, { color: colors.foreground }]}>12.4 miles · about 28 min</Text><Text style={[styles.mapNote, { color: colors.mutedForeground }]}>4th floor · {colors ? 'access check needed' : ''}</Text></View>{onPress ? <IconButton icon="chevron-forward" onPress={onPress} color={colors.muted} /> : null}</View>
  </Card>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 18 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4, marginBottom: 5 },
  title: { fontSize: 30, fontWeight: '700', letterSpacing: -0.6 },
  headerAction: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  link: { fontSize: 13, fontWeight: '700' },
  card: { borderRadius: 22, borderWidth: 1, padding: 16, marginBottom: 12, shadowColor: '#11253D', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 1 },
  primaryButton: { borderRadius: 15, minHeight: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { fontSize: 14, fontWeight: '700' },
  iconButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  chip: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 13, borderWidth: 1, marginRight: 7 },
  chipText: { fontSize: 12, fontWeight: '700' },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  statusBadge: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
  emptyIcon: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptyDetail: { fontSize: 13, textAlign: 'center', lineHeight: 19, maxWidth: 260 },
  miniStat: { flex: 1, borderRadius: 16, padding: 13, minHeight: 74 },
  miniValue: { fontSize: 22, fontWeight: '700', marginBottom: 3 },
  miniLabel: { fontSize: 11, fontWeight: '600' },
  mapHeader: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mapEyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: 5 },
  mapTitle: { fontSize: 15, fontWeight: '700' },
  map: { height: 150, position: 'relative', overflow: 'hidden' },
  mapBlock: { position: 'absolute', borderRadius: 13, opacity: 0.8 },
  mapRoad: { position: 'absolute', width: '120%', left: -20, height: 19, backgroundColor: '#F8F2E9', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#B7C4D0' },
  routeLine: { position: 'absolute', width: 190, height: 5, left: 77, top: 82, borderRadius: 4 },
  mapPin: { position: 'absolute', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFFFFF' },
  mapFooter: { padding: 14, flexDirection: 'row', alignItems: 'center' },
  mapDistance: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  mapNote: { fontSize: 12 },
});