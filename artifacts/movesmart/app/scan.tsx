import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Chip, Header, PrimaryButton, ProgressBar, Screen, SectionHeader } from '@/components/MoveUI';
import { scanRoom } from '@/lib/api';
import { useMove } from '@/context/MoveContext';
import { useColors } from '@/hooks/useColors';

export default function ScanScreen() {
  const colors = useColors();
  const router = useRouter();
  const { inventory, homeType, setScanResult, scanSummary, scanLayout } = useMove();
  const [room, setRoom] = useState('Living room');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const runScan = async () => {
    setScanning(true); setError('');
    try {
      const result = await scanRoom({ room, homeType, items: inventory.filter((item) => item.room === room).map((item) => item.name) });
      setScanResult(result.summary, result.layout);
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : 'Room scan could not be completed.');
    } finally { setScanning(false); }
  };
  const capture = async () => {
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.55, base64: true });
    if (result.canceled) return;
    const asset = result.assets[0];
    setScanning(true); setError('');
    try {
      const scan = await scanRoom({ room, homeType, items: inventory.map((item) => item.name), imageBase64: asset.base64 ?? undefined, mimeType: asset.mimeType ?? undefined });
      setScanResult(scan.summary, scan.layout);
    } catch (scanError) { setError(scanError instanceof Error ? scanError.message : 'Room scan could not be completed.'); } finally { setScanning(false); }
  };
  return <><Stack.Screen options={{ title: 'AI room scan', headerShown: true }} /><Screen><Header eyebrow="New home planning" title="AI room scan" action="close" onAction={() => router.back()} /><Text style={[styles.intro, { color: colors.mutedForeground }]}>Show MoveSmart a room or describe what belongs there. Gemini will suggest zones, a useful layout, and the best unpack order.</Text><SectionHeader title="Which room are we planning?" /><View style={styles.wrap}>{['Living room', 'Kitchen', 'Bedroom', 'Study'].map((item) => <Chip key={item} label={item} active={room === item} color={colors.lavender} onPress={() => setRoom(item)} />)}</View><View style={styles.scanActions}><PrimaryButton label="Scan with camera" icon="camera-outline" onPress={capture} /><PrimaryButton label="Use my inventory" icon="sparkles-outline" onPress={runScan} secondary /></View>{scanning ? <Card><View style={styles.loading}><ActivityIndicator color={colors.primary} /><Text style={[styles.loadingText, { color: colors.foreground }]}>Creating a useful room plan…</Text></View><ProgressBar value={0.68} /></Card> : null}{error ? <Card color={colors.primary}><Text style={[styles.errorTitle, { color: colors.foreground }]}>Scan unavailable</Text><Text style={[styles.errorText, { color: colors.inkSoft }]}>{error}</Text><Text style={[styles.errorText, { color: colors.inkSoft }]}>Check that GEMINI_API_KEY is present in workspace secrets, then try again.</Text></Card> : null}{scanSummary ? <><SectionHeader title="Your AI room plan" /><Card color={colors.mint}><View style={styles.resultHeading}><Ionicons name="sparkles" size={20} color={colors.foreground} /><Text style={[styles.resultTitle, { color: colors.foreground }]}>A calmer first hour</Text></View><Text style={[styles.resultText, { color: colors.inkSoft }]}>{scanSummary}</Text>{scanLayout?.length ? <View style={[styles.layout, { backgroundColor: colors.sky }]}>{scanLayout.map((item) => <View key={`${item.label}-${item.x}`} style={[styles.layoutItem, { left: `${item.x}%`, top: `${item.y}%`, width: `${item.width}%`, height: `${item.height}%`, backgroundColor: colors.lavender }]}><Text style={[styles.layoutLabel, { color: colors.foreground }]}>{item.label}</Text></View>)}</View> : null}</Card></> : <Card style={{ alignItems: 'center' }}><Ionicons name="scan-outline" size={28} color={colors.primary} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Your layout will appear here</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Try the camera or inventory scan to create a plan.</Text></Card>}</Screen></>;
}

const styles = StyleSheet.create({
  intro: { fontSize: 14, lineHeight: 21, marginBottom: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  scanActions: { gap: 9, marginTop: 20, marginBottom: 10 },
  loading: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  loadingText: { fontSize: 13, fontWeight: '700' },
  errorTitle: { fontSize: 14, fontWeight: '800', marginBottom: 7 },
  errorText: { fontSize: 12, lineHeight: 18, marginBottom: 5 },
  resultHeading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  resultTitle: { fontSize: 16, fontWeight: '800' },
  resultText: { fontSize: 13, lineHeight: 20 },
  layout: { height: 160, borderRadius: 15, marginTop: 17, position: 'relative', overflow: 'hidden' },
  layoutItem: { position: 'absolute', borderRadius: 11, padding: 6, borderWidth: 2, borderColor: '#FFFFFF' },
  layoutLabel: { fontSize: 10, fontWeight: '800' },
  emptyTitle: { fontSize: 15, fontWeight: '800', marginTop: 10, marginBottom: 5 },
  emptyText: { fontSize: 12, textAlign: 'center' },
});