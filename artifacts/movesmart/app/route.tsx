import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Chip, MapCard, PrimaryButton, Screen, SectionHeader } from '@/components/MoveUI';
import { useMove } from '@/context/MoveContext';
import { useColors } from '@/hooks/useColors';

export default function RouteScreen() {
  const colors = useColors();
  const router = useRouter();
  const { elevator, setElevator, homeType, setHomeType } = useMove();
  return <><Stack.Screen options={{ title: 'Route & access', headerShown: true }} /><Screen><View style={styles.top}><Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={colors.foreground} /></Pressable><View><Text style={[styles.eyebrow, { color: colors.primary }]}>DELIVERY PLAN</Text><Text style={[styles.title, { color: colors.foreground }]}>Route & access</Text></View></View><MapCard /><View style={[styles.notice, { backgroundColor: elevator ? colors.mint : colors.accent }]}><Ionicons name={elevator ? 'checkmark-circle-outline' : 'alert-circle-outline'} size={24} color={colors.foreground} /><View style={{ flex: 1 }}><Text style={[styles.noticeTitle, { color: colors.foreground }]}>{elevator ? 'Elevator access noted' : 'No elevator is currently noted'}</Text><Text style={[styles.noticeText, { color: colors.inkSoft }]}>{elevator ? 'Share the move-in booking window with your movers.' : 'Solution: book a loading window, reserve a stair-carry team, and protect the stair corners.'}</Text></View></View><SectionHeader title="Does the destination have an elevator?" /><View style={styles.choiceRow}><Chip label="Yes, there is one" active={elevator} color={colors.mintDeep} onPress={() => setElevator(true)} /><Chip label="No elevator" active={!elevator} color={colors.primary} onPress={() => setElevator(false)} /></View><SectionHeader title="How furnished is the new home?" /><View style={styles.choiceRow}>{(['Furnished', 'Semi-furnished', 'Unfurnished'] as const).map((type) => <Chip key={type} label={type} active={homeType === type} color={colors.lavender} onPress={() => setHomeType(type)} />)}</View><Card color={colors.lavender}><View style={styles.insightTop}><Ionicons name="bulb-outline" size={20} color={colors.foreground} /><Text style={[styles.insightTitle, { color: colors.foreground }]}>Duplicate furniture check</Text></View><Text style={[styles.insightText, { color: colors.inkSoft }]}>{homeType === 'Furnished' ? 'Your furnished destination may already include a sofa, bed, and dining set. Compare your inventory before carrying duplicates upstairs.' : homeType === 'Semi-furnished' ? 'Ask which rooms already have large pieces. Your sofa and dining chairs are the first items worth comparing.' : 'No furnished duplicates flagged. Keep your inventory decisions as planned.'}</Text></Card><PrimaryButton label="Save delivery plan" icon="checkmark" onPress={() => router.back()} /></Screen></>;
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 20 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.3, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: '800' },
  notice: { borderRadius: 18, padding: 15, flexDirection: 'row', gap: 10, marginTop: 4 },
  noticeTitle: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  noticeText: { fontSize: 12, lineHeight: 18 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  insightTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 },
  insightTitle: { fontSize: 14, fontWeight: '800' },
  insightText: { fontSize: 12, lineHeight: 18 },
});