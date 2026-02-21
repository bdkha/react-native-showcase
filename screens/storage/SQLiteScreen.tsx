import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Todo = {
  id: number;
  title: string;
  done: number;
  created_at: string;
};

const DB_NAME = 'showcase-demo.db';

function useDatabase() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    let database: SQLite.SQLiteDatabase;

    (async () => {
      database = await SQLite.openDatabaseAsync(DB_NAME);
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          done INTEGER DEFAULT 0,
          created_at TEXT DEFAULT (datetime('now','localtime'))
        );
      `);
      setDb(database);
    })();

    return () => {
      database?.closeAsync();
    };
  }, []);

  return db;
}

export default function SQLiteScreen() {
  const db = useDatabase();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState('SELECT COUNT(*) as count FROM todos');

  const loadTodos = useCallback(async () => {
    if (!db) return;
    const result = await db.getAllAsync<Todo>('SELECT * FROM todos ORDER BY id DESC');
    setTodos(result);
  }, [db]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleAdd = async () => {
    if (!db || !title.trim()) return;
    await db.runAsync('INSERT INTO todos (title) VALUES (?)', title.trim());
    setTitle('');
    loadTodos();
  };

  const handleToggle = async (id: number, currentDone: number) => {
    if (!db) return;
    await db.runAsync('UPDATE todos SET done = ? WHERE id = ?', currentDone ? 0 : 1, id);
    loadTodos();
  };

  const handleDelete = async (id: number) => {
    if (!db) return;
    await db.runAsync('DELETE FROM todos WHERE id = ?', id);
    loadTodos();
  };

  const handleClearAll = () => {
    Alert.alert('Clear All', 'Delete all todos from the database?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!db) return;
          await db.runAsync('DELETE FROM todos');
          loadTodos();
        },
      },
    ]);
  };

  const handleRunQuery = async () => {
    if (!db || !customQuery.trim()) return;
    try {
      const result = await db.getAllAsync(customQuery.trim());
      setQueryResult(JSON.stringify(result, null, 2));
    } catch (e: any) {
      setQueryResult(`Error: ${e.message}`);
    }
  };

  const handleSeedData = async () => {
    if (!db) return;
    const items = [
      'Buy groceries',
      'Clean the house',
      'Read a book',
      'Go for a walk',
      'Write some code',
    ];
    for (const item of items) {
      await db.runAsync('INSERT INTO todos (title) VALUES (?)', item);
    }
    loadTodos();
  };

  const doneCount = todos.filter((t) => t.done).length;

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoRow}>
      <Pressable style={styles.todoCheck} onPress={() => handleToggle(item.id, item.done)}>
        <ThemedText style={styles.checkText}>{item.done ? '[x]' : '[ ]'}</ThemedText>
      </Pressable>
      <View style={styles.todoContent}>
        <ThemedText
          style={[styles.todoTitle, item.done === 1 && styles.todoDone]}
          numberOfLines={1}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.todoDate}>{item.created_at}</ThemedText>
      </View>
      <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <ThemedText style={styles.deleteText}>Del</ThemedText>
      </Pressable>
    </View>
  );

  if (!db) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.emptyText}>Opening database...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteContainer}>
          <Collapsible title="About this demo">
            <ThemedText style={styles.noteParagraph}>
              SQLite provides a full relational database on device. Unlike key-value stores, it
              supports structured queries, indexes, joins, and transactions.
            </ThemedText>
            <ThemedText style={styles.noteParagraph}>
              This demo uses expo-sqlite to manage a todo list with CRUD operations. You can also run
              custom SQL queries against the database.
            </ThemedText>
          </Collapsible>
        </View>

        <ThemedText style={styles.sectionTitle}>Add Todo</ThemedText>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            placeholder="What needs to be done?"
            placeholderTextColor="rgba(128,128,128,0.6)"
            value={title}
            onChangeText={setTitle}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <Pressable style={styles.smallButton} onPress={handleAdd}>
            <ThemedText style={styles.buttonText}>Add</ThemedText>
          </Pressable>
        </View>

        <View style={styles.listHeader}>
          <ThemedText style={styles.sectionTitle}>
            Todos ({doneCount}/{todos.length})
          </ThemedText>
          <View style={styles.headerActions}>
            <Pressable onPress={handleSeedData}>
              <ThemedText style={styles.seedText}>Seed Data</ThemedText>
            </Pressable>
            {todos.length > 0 && (
              <Pressable onPress={handleClearAll}>
                <ThemedText style={styles.clearText}>Clear All</ThemedText>
              </Pressable>
            )}
          </View>
        </View>

        {todos.length === 0 ? (
          <ThemedText style={styles.emptyText}>No todos yet. Add one above!</ThemedText>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        )}

        <ThemedText style={styles.sectionTitle}>Custom SQL Query</ThemedText>
        <TextInput
          style={[styles.input, styles.queryInput]}
          placeholder="SELECT * FROM todos WHERE done = 1"
          placeholderTextColor="rgba(128,128,128,0.6)"
          value={customQuery}
          onChangeText={setCustomQuery}
          autoCapitalize="none"
          multiline
        />
        <Pressable style={styles.button} onPress={handleRunQuery}>
          <ThemedText style={styles.buttonText}>Run Query</ThemedText>
        </Pressable>

        {queryResult !== null && (
          <View style={styles.queryResultBox}>
            <ThemedText style={styles.queryResultText}>{queryResult}</ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },
  noteContainer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  noteParagraph: { marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.4)',
    fontSize: 14,
    color: '#333',
  },
  inputFlex: { flex: 1 },
  queryInput: { minHeight: 60, textAlignVertical: 'top', marginBottom: 8 },
  button: {
    padding: 14,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(10,126,164,0.2)',
  },
  smallButton: {
    padding: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(10,126,164,0.2)',
  },
  buttonText: { color: '#0a7ea4', fontWeight: '600' },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: { flexDirection: 'row', gap: 16 },
  seedText: { color: '#0a7ea4', fontSize: 13, fontWeight: '600' },
  clearText: { color: '#dc3232', fontSize: 13, fontWeight: '600' },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.3)',
    gap: 8,
  },
  todoCheck: { padding: 4 },
  checkText: { fontSize: 16, fontFamily: 'monospace', fontWeight: '700' },
  todoContent: { flex: 1 },
  todoTitle: { fontWeight: '600', fontSize: 14 },
  todoDone: { textDecorationLine: 'line-through', opacity: 0.5 },
  todoDate: { fontSize: 12, opacity: 0.5, marginTop: 2 },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(220,50,50,0.1)',
  },
  deleteText: { color: '#dc3232', fontSize: 12, fontWeight: '600' },
  emptyText: { textAlign: 'center', opacity: 0.5, marginTop: 16 },
  queryResultBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  queryResultText: { fontSize: 12, fontFamily: 'monospace' },
});
