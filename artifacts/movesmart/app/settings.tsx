import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Header, Screen, SectionHeader } from '@/components/MoveUI';
import { useMove } from '@/context/MoveContext';
import { useColors } from '@/hooks/useColors';

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { userName, destination, moveDate, homeType, resetMove } = useMove();
  const logout = () => Alert.alert('Log out of MoveSmart?', 'Your move is saved on this device. You can come back anytime.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Log out', style: 'destructive', onPress: () => router.replace('/') }]);
  return <><Stack.Screen options={{ title: 'Settings', headerShown: true }} /><Screen><Header eyebrow="Keep your plan yours" title="Settings" action="close" onAction={() => router.back()} /><Card><View style={styles.profile}><View style={[styles.avatar, { backgroundColor: colors.primary }]}><Text style={[styles.avatarText, { color: colors.primaryForeground }]}>{userName.slice(0, 1)}</Text></View><View><Text style={[styles.name, { color: colors.foreground }]}>{userName}</Text><Text style={[styles.muted, { color: colors.mutedForeground }]}>MoveSmart member</Text></View></View></Card><SectionHeader title="Move details" /><Card><Row icon="navigate-outline" label="Destination" value={destination} /><Row icon="calendar-outline" label="Move date" value={moveDate} /><Row icon="home-outline" label="Home type" value={homeType} /></Card><SectionHeader title="Privacy & account" /><Card><Row icon="lock-closed-outline" label="Local-first storage" value="On this device" /><Row icon="sparkles-outline" label="AI guidance" value="Gemini API" /><Pressable onPress={logout} style={styles.logout}><Ionicons name="log-out-outline" size={19} color={colors.destructive} /><Text style={[styles.logoutText, { color: colors.destructive }]}>Log out</Text></Pressable></Card><Text style={[styles.footer, { color: colors.mutedForeground }]}>MoveSmart keeps your day-to-day move plan on this device. You can reset it from the app data controls when you are ready for a new move.</Text></Screen></>;
}

function Row({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  const colors = useColors();
  return <View style={styles.row}><Ionicons name={icon} size={18} color={colors.primary} /><Text style={[styles.rowLabel, { color: colors.inkSoft }]}>{label}</Text><Text style={[styles.rowValue, { color: colors.foreground }]}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 21, fontWeight: '800' },
  name: { fontSize: 16, fontWeight: '800', marginBottom: 3 },
  muted: { fontSize: 12 },
  row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: '#E8DDD1' },
  rowLabel: { fontSize: 12, flex: 1 },
  rowValue: { fontSize: 13, fontWeight: '700' },
  logout: { minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoutText: { fontSize: 13, fontWeight: '800' },
  footer: { fontSize: 11, lineHeight: 17, marginTop: 8, paddingHorizontal: 4 },
});