import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Header, PrimaryButton, Screen, SectionHeader } from '@/components/MoveUI';
import { useMove } from '@/context/MoveContext';
import { useColors } from '@/hooks/useColors';

const checklist = [
  { id: 'rooms', title: 'Photograph every room before unpacking', detail: 'Protect your security deposit before boxes cover marks.', icon: 'camera-outline' as const },
  { id: 'locks', title: 'Test all deadbolts and window locks', detail: 'A two-minute check can prevent a long first week.', icon: 'lock-closed-outline' as const },
  { id: 'wifi', title: 'Set up Wi-Fi and test the study', detail: 'Make sure your first workday has a reliable corner.', icon: 'wifi-outline' as const },
  { id: 'utilities', title: 'Locate water shut-off and breaker box', detail: 'Save both locations in your mental map.', icon: 'flash-outline' as const },
  { id: 'appliances', title: 'Test kitchen appliances', detail: 'Stove, oven, refrigerator cooling, and water supply.', icon: 'restaurant-outline' as const },
  { id: 'mail', title: 'Forward mail and update billing addresses', detail: 'USPS, bank, subscriptions, and deliveries.', icon: 'mail-outline' as const },
];

export default function SettleScreen() {
  const colors = useColors();
  const { conditionLogs, completedSettle, toggleSettleItem, addConditionLog } = useMove();
  const completed = completedSettle.length;
  const logPhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled) {
      addConditionLog({ title: 'New move-in photo', detail: 'Photo captured for your move-in condition record.', room: 'Unassigned room', type: 'damage', status: 'Needs review' });
      Alert.alert('Photo saved', 'The timestamped record is ready for you to add a room and note.');
    }
  };
  return <Screen><Header eyebrow="New home arrival" title="Settle in" action="camera" onAction={logPhoto} /><View style={[styles.introCard, { backgroundColor: colors.lavender }]}><Ionicons name="shield-checkmark-outline" size={26} color={colors.foreground} /><Text style={[styles.introTitle, { color: colors.foreground }]}>Protect your deposit, then make it home.</Text><Text style={[styles.introDetail, { color: colors.inkSoft }]}>Document pre-existing damage with timestamped photos before unpacking. Your future self will be glad you did.</Text><PrimaryButton label="Log inspection photo" icon="camera-outline" onPress={logPhoto} /></View><SectionHeader title={`Day 1 checklist · ${completed}/${checklist.length}`} /><Card><Text style={[styles.progressCopy, { color: colors.mutedForeground }]}>{completed === checklist.length ? 'You are ready to settle in.' : 'A short list that prevents expensive surprises.'}</Text>{checklist.map((item) => <Pressable key={item.id} onPress={() => toggleSettleItem(item.id)} style={styles.checkRow}><View style={[styles.check, { backgroundColor: completedSettle.includes(item.id) ? colors.mint : colors.muted }]}>{completedSettle.includes(item.id) ? <Ionicons name="checkmark" size={15} color={colors.mintDeep} /> : <Ionicons name={item.icon} size={16} color={colors.foreground} />}</View><View style={{ flex: 1 }}><Text style={[styles.checkTitle, { color: colors.foreground, textDecorationLine: completedSettle.includes(item.id) ? 'line-through' : 'none' }]}>{item.title}</Text><Text style={[styles.checkDetail, { color: colors.mutedForeground }]}>{item.detail}</Text></View></Pressable>)}</Card><SectionHeader title={`Move-in condition log · ${conditionLogs.length} recorded`} action="Add record" onAction={logPhoto} />{conditionLogs.map((log) => <Card key={log.id} color={log.type === 'damage' ? colors.primary : colors.mintDeep}><View style={styles.logTop}><View style={[styles.logIcon, { backgroundColor: log.type === 'damage' ? colors.lavender : colors.mint }]}><Ionicons name={log.type === 'damage' ? 'warning-outline' : 'snow-outline'} size={19} color={colors.foreground} /></View><View style={{ flex: 1 }}><Text style={[styles.logTitle, { color: colors.foreground }]}>{log.title}</Text><Text style={[styles.logMeta, { color: colors.mutedForeground }]}>{log.room} · {log.timestamp}</Text></View><Text style={[styles.logStatus, { color: colors.mintDeep }]}>{log.status}</Text></View><Text style={[styles.logDetail, { color: colors.inkSoft }]}>{log.detail}</Text></Card>)}</Screen>;
}

const styles = StyleSheet.create({
  introCard: { borderRadius: 23, padding: 18, marginBottom: 8 },
  introTitle: { fontSize: 19, fontWeight: '800', lineHeight: 25, marginTop: 14, marginBottom: 7 },
  introDetail: { fontSize: 13, lineHeight: 19, marginBottom: 17 },
  progressCopy: { fontSize: 12, marginBottom: 8 },
  checkRow: { flexDirection: 'row', gap: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E8DDD1' },
  check: { width: 29, height: 29, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  checkTitle: { fontSize: 13, fontWeight: '700', lineHeight: 18 },
  checkDetail: { fontSize: 11, lineHeight: 16, marginTop: 3 },
  logTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  logTitle: { fontSize: 13, fontWeight: '800', marginBottom: 3 },
  logMeta: { fontSize: 10 },
  logStatus: { fontSize: 10, fontWeight: '800' },
  logDetail: { fontSize: 12, lineHeight: 18, marginTop: 12, paddingLeft: 48 },
});