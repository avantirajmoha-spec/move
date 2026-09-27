import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Header, MapCard, MiniStat, ProgressBar, Screen, SectionHeader } from '@/components/MoveUI';
import { useMove } from '@/context/MoveContext';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { userName, destination, miles, boxes, tasks, inventory, elevatorNote } = useMove();
  const packed = boxes.filter((box) => box.status === 'Sealed').length;
  const openTask = tasks.find((task) => !task.done);
  const days = 6;

  return <Screen>
    <Header eyebrow="Your move, made clearer" title={`Good morning, ${userName}`} action="settings" onAction={() => router.push('/settings')} />
    <View style={[styles.hero, { backgroundColor: colors.navy }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.heroKicker, { color: colors.mint }]}>MOVE DAY · OCT 3</Text>
        <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>{destination} is {days} days away.</Text>
        <Text style={[styles.heroDetail, { color: colors.inkSoft }]}>Your plan is moving in the right direction. Let’s handle one useful thing next.</Text>
      </View>
      <View style={[styles.heroBadge, { backgroundColor: colors.primary }]}><Text style={[styles.heroBadgeText, { color: colors.primaryForeground }]}>{packed}/{boxes.length}</Text><Text style={[styles.heroBadgeLabel, { color: colors.primaryForeground }]}>sealed</Text></View>
    </View>
    <View style={styles.statsRow}><MiniStat label="items tracked" value={`${inventory.length}`} tint={colors.mint} /><MiniStat label="miles to go" value={`${miles}`} tint={colors.lavender} /><MiniStat label="days left" value={`${days}`} tint={colors.accent} /></View>
    <SectionHeader title="Your next best step" action="Open tasks" onAction={() => router.push('/tasks')} />
    <Card color={colors.primary}><View style={styles.taskRow}><View style={[styles.taskIcon, { backgroundColor: colors.lavender }]}><Ionicons name="time-outline" size={22} color={colors.foreground} /></View><View style={{ flex: 1 }}><Text style={[styles.taskTitle, { color: colors.foreground }]}>{openTask?.title ?? 'Everything is caught up'}</Text><Text style={[styles.taskDetail, { color: colors.mutedForeground }]}>{openTask?.detail ?? 'Enjoy a quiet minute before the next move.'}</Text></View><Ionicons name="arrow-forward-circle" size={25} color={colors.primary} /></View><View style={{ marginTop: 16 }}><ProgressBar value={tasks.filter((task) => task.done).length / tasks.length} /><Text style={[styles.progressText, { color: colors.mutedForeground }]}>{tasks.filter((task) => task.done).length} of {tasks.length} tasks complete</Text></View></Card>
    <SectionHeader title="Route & access" action="Review" onAction={() => router.push('/route')} /><MapCard onPress={() => router.push('/route')} />
    <View style={[styles.warning, { backgroundColor: colors.accent }]}><Ionicons name="warning-outline" size={20} color={colors.foreground} /><View style={{ flex: 1 }}><Text style={[styles.warningTitle, { color: colors.foreground }]}>Delivery heads-up</Text><Text style={[styles.warningDetail, { color: colors.inkSoft }]}>{elevatorNote}. Movers need a clear carry plan for the last flight.</Text></View></View>
    <SectionHeader title="Make the new place yours" /><View style={styles.actionGrid}><Pressable onPress={() => router.push('/scan')} style={({ pressed }) => [styles.actionCard, { backgroundColor: colors.lavender, opacity: pressed ? 0.75 : 1 }]}><Ionicons name="scan-outline" size={24} color={colors.foreground} /><Text style={[styles.actionTitle, { color: colors.foreground }]}>AI room scan</Text><Text style={[styles.actionDetail, { color: colors.inkSoft }]}>Get a layout and unpack order</Text></Pressable><Pressable onPress={() => router.push('/chat')} style={({ pressed }) => [styles.actionCard, { backgroundColor: colors.mint, opacity: pressed ? 0.75 : 1 }]}><Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.foreground} /><Text style={[styles.actionTitle, { color: colors.foreground }]}>Ask MoveSmart</Text><Text style={[styles.actionDetail, { color: colors.inkSoft }]}>Your plan, in plain language</Text></Pressable></View>
    <SectionHeader title="First-night survival kit" action="Pack kit" onAction={() => router.push('/boxes')} /><Card color={colors.mintDeep}><Text style={[styles.kitTitle, { color: colors.foreground }]}>Keep this one with you, not in the truck.</Text><View style={styles.kitRow}><KitItem icon="flash-outline" label="Tech" /><KitItem icon="shirt-outline" label="Clothes" /><KitItem icon="document-text-outline" label="Documents" /><KitItem icon="medkit-outline" label="Care" /></View></Card>
    <View style={{ height: 20 }} />
  </Screen>;
}

function KitItem({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const colors = useColors();
  return <View style={styles.kitItem}><Ionicons name={icon} size={20} color={colors.foreground} /><Text style={[styles.kitLabel, { color: colors.inkSoft }]}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  hero: { borderRadius: 26, padding: 20, minHeight: 165, flexDirection: 'row', marginBottom: 13 },
  heroKicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.3, marginBottom: 12 },
  heroTitle: { fontSize: 25, lineHeight: 31, fontWeight: '700', maxWidth: 230, letterSpacing: -0.5 },
  heroDetail: { fontSize: 13, lineHeight: 19, marginTop: 10, maxWidth: 235 },
  heroBadge: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  heroBadgeText: { fontSize: 18, fontWeight: '800' },
  heroBadgeLabel: { fontSize: 10, fontWeight: '700', marginTop: 1 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 2 },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  taskIcon: { width: 45, height: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  taskTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  taskDetail: { fontSize: 12, lineHeight: 17 },
  progressText: { fontSize: 11, marginTop: 7 },
  warning: { borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 4 },
  warningTitle: { fontSize: 13, fontWeight: '800', marginBottom: 3 },
  warningDetail: { fontSize: 12, lineHeight: 17 },
  actionGrid: { flexDirection: 'row', gap: 10 },
  actionCard: { flex: 1, borderRadius: 20, padding: 16, minHeight: 138 },
  actionTitle: { fontSize: 14, fontWeight: '800', marginTop: 17, marginBottom: 5 },
  actionDetail: { fontSize: 11, lineHeight: 16 },
  kitTitle: { fontSize: 15, fontWeight: '800', marginBottom: 16 },
  kitRow: { flexDirection: 'row', justifyContent: 'space-between' },
  kitItem: { alignItems: 'center', gap: 6 },
  kitLabel: { fontSize: 11, fontWeight: '700' },
});
