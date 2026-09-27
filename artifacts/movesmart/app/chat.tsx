import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { IconButton, Screen } from '@/components/MoveUI';
import { useMove } from '@/context/MoveContext';
import { askAssistant } from '@/lib/api';
import { useColors } from '@/hooks/useColors';

type Message = { id: string; role: 'assistant' | 'user'; text: string };

export default function ChatScreen() {
  const colors = useColors();
  const router = useRouter();
  const { destination, miles, inventory, boxes, elevatorNote } = useMove();
  const [messages, setMessages] = useState<Message[]>([{ id: 'welcome', role: 'assistant', text: `👋 Hi Alex! I am your MoveSmart assistant. Your move to ${destination} is in 6 days (${miles} miles). I'm keeping track of your ${inventory.length} inventory items, ${boxes.filter((box) => box.status === 'Sealed').length} packed boxes, and key access warnings (${elevatorNote}). What would you like to check today?` }]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = draft.trim();
    if (!text || loading) return;
    const userMessage: Message = { id: `${Date.now()}`, role: 'user', text };
    const context = { destination, miles, inventoryCount: inventory.length, sealedBoxes: boxes.filter((box) => box.status === 'Sealed').length, accessWarning: elevatorNote };
    setDraft(''); setMessages((current) => [...current, userMessage]); setLoading(true);
    try {
      const result = await askAssistant({ message: text, context });
      setMessages((current) => [...current, { id: `${Date.now()}-assistant`, role: 'assistant', text: result.reply }]);
    } catch (error) {
      setMessages((current) => [...current, { id: `${Date.now()}-error`, role: 'assistant', text: error instanceof Error ? error.message : 'I could not reach the assistant. Please try again.' }]);
    } finally { setLoading(false); }
  };

  return <><Stack.Screen options={{ title: 'Ask MoveSmart', headerShown: true }} /><KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}><View style={[styles.container, { backgroundColor: colors.background }]}><View style={styles.top}><Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={colors.foreground} /></Pressable><View style={{ flex: 1 }}><Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR MOVING COMPANION</Text><Text style={[styles.title, { color: colors.foreground }]}>Ask MoveSmart</Text></View><View style={[styles.status, { backgroundColor: colors.mint }]}><View style={[styles.statusDot, { backgroundColor: colors.mintDeep }]} /><Text style={[styles.statusText, { color: colors.secondaryForeground }]}>Ready</Text></View></View><FlatList inverted data={[...messages].reverse()} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled" renderItem={({ item }) => <View style={[styles.bubble, { backgroundColor: item.role === 'assistant' ? colors.card : colors.navy, alignSelf: item.role === 'assistant' ? 'flex-start' : 'flex-end', borderColor: colors.border }]}><Text style={[styles.bubbleText, { color: item.role === 'assistant' ? colors.foreground : colors.primaryForeground }]}>{item.text}</Text></View>} ListHeaderComponent={loading ? <View style={[styles.typing, { backgroundColor: colors.card }]}><ActivityIndicator size="small" color={colors.primary} /><Text style={[styles.typingText, { color: colors.mutedForeground }]}>Thinking through your move…</Text></View> : null} /><View style={[styles.composer, { backgroundColor: colors.card, borderColor: colors.border }]}><TextInput testID="chat-input" value={draft} onChangeText={setDraft} onSubmitEditing={send} returnKeyType="send" placeholder="Ask me about your move…" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground }]} /><IconButton icon="arrow-up" onPress={send} color={draft.trim() ? colors.primary : colors.muted} /></View></View></KeyboardAvoidingView></>;
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 17 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 11 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 4 },
  title: { fontSize: 25, fontWeight: '800' },
  status: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '800' },
  list: { paddingTop: 10, paddingBottom: 12, gap: 10 },
  bubble: { maxWidth: '88%', borderRadius: 18, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 11 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  typing: { alignSelf: 'flex-start', borderRadius: 16, paddingHorizontal: 13, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  typingText: { fontSize: 12 },
  composer: { minHeight: 55, borderRadius: 19, borderWidth: 1, paddingLeft: 15, paddingRight: 8, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, fontSize: 14, minHeight: 44 },
});