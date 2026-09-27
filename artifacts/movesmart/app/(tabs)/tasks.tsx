import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Chip, Header, PriorityDot, Screen, SectionHeader } from '@/components/MoveUI';
import { Priority, useMove } from '@/context/MoveContext';
import { useColors } from '@/hooks/useColors';

const priorities: (Priority | 'All')[] = ['All', 'High', 'Medium', 'Low'];

export default function TasksScreen() {
  const colors = useColors();
  const { tasks, toggleTask, snoozeTask } = useMove();
  const [filter, setFilter] = useState<Priority | 'All'>('All');
  const filtered = tasks.filter((task) => filter === 'All' || task.priority === filter);
  return <Screen><Header eyebrow="Keep momentum" title="Tasks" action="add" onAction={() => undefined} /><Text style={[styles.intro, { color: colors.mutedForeground }]}>Three clear priority colors keep urgent work visible without making the whole move feel urgent.</Text><View style={styles.filterRow}>{priorities.map((priority) => <Chip key={priority} label={priority} active={filter === priority} color={priority === 'High' ? colors.primary : priority === 'Medium' ? colors.accent : colors.mintDeep} onPress={() => setFilter(priority)} />)}</View><SectionHeader title={`${filtered.filter((task) => !task.done).length} still to do`} />{filtered.map((task) => <Card key={task.id} style={task.done ? { opacity: 0.55 } : undefined}><Pressable testID={`task-${task.id}`} onPress={() => toggleTask(task.id)} style={styles.taskRow}><View style={[styles.check, { borderColor: task.done ? colors.mintDeep : colors.border, backgroundColor: task.done ? colors.mint : colors.card }]}>{task.done ? <Ionicons name="checkmark" size={15} color={colors.mintDeep} /> : null}</View><View style={{ flex: 1 }}><View style={styles.taskHeading}><PriorityDot priority={task.priority} /><Text style={[styles.taskTitle, { color: colors.foreground, textDecorationLine: task.done ? 'line-through' : 'none' }]}>{task.title}</Text></View><Text style={[styles.taskDetail, { color: colors.mutedForeground }]}>{task.detail}</Text><Text style={[styles.taskDue, { color: colors.inkSoft }]}>{task.due} · {task.priority} priority</Text></View></Pressable>{!task.done ? <Pressable onPress={() => snoozeTask(task.id)} style={[styles.snooze, { backgroundColor: colors.muted }]}><Ionicons name="time-outline" size={14} color={colors.foreground} /><Text style={[styles.snoozeText, { color: colors.foreground }]}>Snooze</Text></Pressable> : null}</Card>)}</Screen>;
}

const styles = StyleSheet.create({
  intro: { fontSize: 14, lineHeight: 21, maxWidth: 340, marginBottom: 15 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  taskRow: { flexDirection: 'row', gap: 12 },
  check: { width: 25, height: 25, borderWidth: 1.5, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  taskHeading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  taskTitle: { fontSize: 14, fontWeight: '800', flex: 1 },
  taskDetail: { fontSize: 12, lineHeight: 17, paddingRight: 8 },
  taskDue: { fontSize: 11, marginTop: 8, fontWeight: '600' },
  snooze: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-end', marginTop: 12 },
  snoozeText: { fontSize: 11, fontWeight: '700' },
});