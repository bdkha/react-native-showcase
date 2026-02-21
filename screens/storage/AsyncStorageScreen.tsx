import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type StoredItem = { key: string; value: string };

const DEMO_PREFIX = 'demo_';

export default function AsyncStorageScreen() {
  const [items, setItems] = useState<StoredItem[]>([]);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [readResult, setReadResult] = useState<string | null>(null);
  const [readKey, setReadKey] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const demoKeys = allKeys.filter((k) => k.startsWith(DEMO_PREFIX));
      if (demoKeys.length === 0) {
        setItems([]);
        return;
      }
      const pairs = await AsyncStorage.multiGet(demoKeys);
      setItems(
        pairs.map(([k, v]) => ({ key: k.replace(DEMO_PREFIX, ''), value: v ?? '' })),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleSet = async () => {
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();
    if (!trimmedKey || !trimmedValue) return;
    await AsyncStorage.setItem(`${DEMO_PREFIX}${trimmedKey}`, trimmedValue);
    setKey('');
    setValue('');
    loadAll();
  };

  const handleRead = async () => {
    const trimmedKey = readKey.trim();
    if (!trimmedKey) return;
    const result = await AsyncStorage.getItem(`${DEMO_PREFIX}${trimmedKey}`);
    setReadResult(result);
  };

  const handleDelete = async (itemKey: string) => {
    await AsyncStorage.removeItem(`${DEMO_PREFIX}${itemKey}`);
    setReadResult(null);
    loadAll();
  };

  const handleClearAll = () => {
    Alert.alert('Clear All', 'Remove all demo items from AsyncStorage?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          const allKeys = await AsyncStorage.getAllKeys();
          const demoKeys = allKeys.filter((k) => k.startsWith(DEMO_PREFIX));
          await AsyncStorage.multiRemove(demoKeys);
          setReadResult(null);
          loadAll();
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: StoredItem }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemContent}>
        <ThemedText style={styles.itemKey}>{item.key}</ThemedText>
        <ThemedText style={styles.itemValue} numberOfLines={1}>
          {item.value}
        </ThemedText>
      </View>
      <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.key)}>
        <ThemedText style={styles.deleteText}>Delete</ThemedText>
      </Pressable>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteContainer}>
          <Collapsible title="About this demo">
            <ThemedText style={styles.noteParagraph}>
              AsyncStorage is a simple, unencrypted, asynchronous key-value storage system. It's the
              most basic persistence option for React Native apps.
            </ThemedText>
            <ThemedText style={styles.noteParagraph}>
              Operations are asynchronous and return Promises. Suitable for small amounts of data like
              user preferences, tokens, and simple app state.
            </ThemedText>
          </Collapsible>
        </View>

        <ThemedText style={styles.sectionTitle}>Set Item</ThemedText>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Key"
            placeholderTextColor="rgba(128,128,128,0.6)"
            value={key}
            onChangeText={setKey}
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, styles.inputFlex]}
            placeholder="Value"
            placeholderTextColor="rgba(128,128,128,0.6)"
            value={value}
            onChangeText={setValue}
            autoCapitalize="none"
          />
        </View>
        <Pressable style={styles.button} onPress={handleSet}>
          <ThemedText style={styles.buttonText}>Set Item</ThemedText>
        </Pressable>

        <ThemedText style={styles.sectionTitle}>Get Item</ThemedText>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            placeholder="Key to read"
            placeholderTextColor="rgba(128,128,128,0.6)"
            value={readKey}
            onChangeText={setReadKey}
            autoCapitalize="none"
          />
          <Pressable style={styles.smallButton} onPress={handleRead}>
            <ThemedText style={styles.buttonText}>Read</ThemedText>
          </Pressable>
        </View>
        {readResult !== null && (
          <View style={styles.resultBox}>
            <ThemedText style={styles.resultLabel}>Result:</ThemedText>
            <ThemedText style={styles.resultValue}>{readResult}</ThemedText>
          </View>
        )}

        <View style={styles.listHeader}>
          <ThemedText style={styles.sectionTitle}>
            Stored Items ({items.length})
          </ThemedText>
          {items.length > 0 && (
            <Pressable onPress={handleClearAll}>
              <ThemedText style={styles.clearText}>Clear All</ThemedText>
            </Pressable>
          )}
        </View>

        {loading ? (
          <ThemedText style={styles.emptyText}>Loading...</ThemedText>
        ) : items.length === 0 ? (
          <ThemedText style={styles.emptyText}>No items stored yet</ThemedText>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
            scrollEnabled={false}
          />
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
    flex: 0,
    width: 100,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.4)',
    fontSize: 14,
    color: '#333',
  },
  inputFlex: { flex: 1, width: undefined },
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
  resultBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(50,180,50,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(50,180,50,0.3)',
    gap: 8,
    marginTop: 4,
  },
  resultLabel: { fontWeight: '600', fontSize: 14 },
  resultValue: { flex: 1, fontSize: 14 },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearText: { color: '#dc3232', fontSize: 13, fontWeight: '600' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.3)',
    gap: 8,
  },
  itemContent: { flex: 1 },
  itemKey: { fontWeight: '600', fontSize: 14 },
  itemValue: { fontSize: 13, opacity: 0.7, marginTop: 2 },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(220,50,50,0.1)',
  },
  deleteText: { color: '#dc3232', fontSize: 12, fontWeight: '600' },
  emptyText: { textAlign: 'center', opacity: 0.5, marginTop: 16 },
});
