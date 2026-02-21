// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
// import { MMKV } from 'react-native-mmkv';

// import { Collapsible } from '@/components/ui/collapsible';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';

// const storage = new MMKV({ id: 'mmkv-demo' });

// type BenchmarkResult = {
//   operation: string;
//   mmkvTime: number;
//   count: number;
// };

// export default function MMKVScreen() {
//   const [key, setKey] = useState('');
//   const [value, setValue] = useState('');
//   const [readKey, setReadKey] = useState('');
//   const [readResult, setReadResult] = useState<string | null>(null);
//   const [allKeys, setAllKeys] = useState<string[]>([]);
//   const [benchmark, setBenchmark] = useState<BenchmarkResult[]>([]);
//   const [benchmarking, setBenchmarking] = useState(false);

//   const loadKeys = useCallback(() => {
//     setAllKeys(storage.getAllKeys());
//   }, []);

//   useEffect(() => {
//     loadKeys();
//   }, [loadKeys]);

//   const handleSet = () => {
//     const trimmedKey = key.trim();
//     const trimmedValue = value.trim();
//     if (!trimmedKey || !trimmedValue) return;
//     storage.set(trimmedKey, trimmedValue);
//     setKey('');
//     setValue('');
//     loadKeys();
//   };

//   const handleRead = () => {
//     const trimmedKey = readKey.trim();
//     if (!trimmedKey) return;
//     const result = storage.getString(trimmedKey);
//     setReadResult(result ?? '(not found)');
//   };

//   const handleDelete = (itemKey: string) => {
//     storage.delete(itemKey);
//     setReadResult(null);
//     loadKeys();
//   };

//   const handleClearAll = () => {
//     Alert.alert('Clear All', 'Remove all MMKV demo items?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Clear',
//         style: 'destructive',
//         onPress: () => {
//           storage.clearAll();
//           setReadResult(null);
//           loadKeys();
//         },
//       },
//     ]);
//   };

//   const runBenchmark = async () => {
//     setBenchmarking(true);
//     setBenchmark([]);

//     await new Promise((r) => setTimeout(r, 50));

//     const COUNT = 1000;
//     const results: BenchmarkResult[] = [];

//     const writeStart = performance.now();
//     for (let i = 0; i < COUNT; i++) {
//       storage.set(`bench_${i}`, `value_${i}_${'x'.repeat(100)}`);
//     }
//     const writeTime = performance.now() - writeStart;
//     results.push({ operation: 'Write', mmkvTime: writeTime, count: COUNT });

//     const readStart = performance.now();
//     for (let i = 0; i < COUNT; i++) {
//       storage.getString(`bench_${i}`);
//     }
//     const readTime = performance.now() - readStart;
//     results.push({ operation: 'Read', mmkvTime: readTime, count: COUNT });

//     const deleteStart = performance.now();
//     for (let i = 0; i < COUNT; i++) {
//       storage.delete(`bench_${i}`);
//     }
//     const deleteTime = performance.now() - deleteStart;
//     results.push({ operation: 'Delete', mmkvTime: deleteTime, count: COUNT });

//     setBenchmark(results);
//     setBenchmarking(false);
//     loadKeys();
//   };

//   return (
//     <ThemedView style={styles.container}>
//       <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
//         <View style={styles.noteContainer}>
//           <Collapsible title="About this demo">
//             <ThemedText style={styles.noteParagraph}>
//               MMKV is a high-performance key-value storage framework originally developed by WeChat.
//               It uses memory-mapped files for extremely fast synchronous read/write operations.
//             </ThemedText>
//             <ThemedText style={styles.noteParagraph}>
//               Unlike AsyncStorage, MMKV operations are synchronous — no await needed. It supports
//               string, number, boolean, and Buffer types natively.
//             </ThemedText>
//           </Collapsible>
//         </View>

//         <ThemedText style={styles.sectionTitle}>Set Item (Sync)</ThemedText>
//         <View style={styles.inputRow}>
//           <TextInput
//             style={styles.input}
//             placeholder="Key"
//             placeholderTextColor="rgba(128,128,128,0.6)"
//             value={key}
//             onChangeText={setKey}
//             autoCapitalize="none"
//           />
//           <TextInput
//             style={[styles.input, styles.inputFlex]}
//             placeholder="Value"
//             placeholderTextColor="rgba(128,128,128,0.6)"
//             value={value}
//             onChangeText={setValue}
//             autoCapitalize="none"
//           />
//         </View>
//         <Pressable style={styles.button} onPress={handleSet}>
//           <ThemedText style={styles.buttonText}>Set Item</ThemedText>
//         </Pressable>

//         <ThemedText style={styles.sectionTitle}>Get Item (Sync)</ThemedText>
//         <View style={styles.inputRow}>
//           <TextInput
//             style={[styles.input, styles.inputFlex]}
//             placeholder="Key to read"
//             placeholderTextColor="rgba(128,128,128,0.6)"
//             value={readKey}
//             onChangeText={setReadKey}
//             autoCapitalize="none"
//           />
//           <Pressable style={styles.smallButton} onPress={handleRead}>
//             <ThemedText style={styles.buttonText}>Read</ThemedText>
//           </Pressable>
//         </View>
//         {readResult !== null && (
//           <View style={styles.resultBox}>
//             <ThemedText style={styles.resultLabel}>Result:</ThemedText>
//             <ThemedText style={styles.resultValue}>{readResult}</ThemedText>
//           </View>
//         )}

//         <View style={styles.listHeader}>
//           <ThemedText style={styles.sectionTitle}>
//             Stored Keys ({allKeys.length})
//           </ThemedText>
//           {allKeys.length > 0 && (
//             <Pressable onPress={handleClearAll}>
//               <ThemedText style={styles.clearText}>Clear All</ThemedText>
//             </Pressable>
//           )}
//         </View>

//         {allKeys.length === 0 ? (
//           <ThemedText style={styles.emptyText}>No items stored yet</ThemedText>
//         ) : (
//           allKeys.map((k) => (
//             <View key={k} style={styles.itemRow}>
//               <View style={styles.itemContent}>
//                 <ThemedText style={styles.itemKey}>{k}</ThemedText>
//                 <ThemedText style={styles.itemValue} numberOfLines={1}>
//                   {storage.getString(k) ?? ''}
//                 </ThemedText>
//               </View>
//               <Pressable style={styles.deleteButton} onPress={() => handleDelete(k)}>
//                 <ThemedText style={styles.deleteText}>Delete</ThemedText>
//               </Pressable>
//             </View>
//           ))
//         )}

//         <ThemedText style={styles.sectionTitle}>Performance Benchmark</ThemedText>
//         <ThemedText style={styles.benchNote}>
//           Runs 1,000 write, read, and delete operations to measure MMKV's synchronous performance.
//         </ThemedText>
//         <Pressable style={styles.button} onPress={runBenchmark} disabled={benchmarking}>
//           <ThemedText style={styles.buttonText}>
//             {benchmarking ? 'Running...' : 'Run Benchmark (1,000 ops)'}
//           </ThemedText>
//         </Pressable>

//         {benchmark.length > 0 && (
//           <View style={styles.benchResults}>
//             {benchmark.map((r) => (
//               <View key={r.operation} style={styles.benchRow}>
//                 <ThemedText style={styles.benchOp}>{r.operation}</ThemedText>
//                 <ThemedText style={styles.benchTime}>{r.mmkvTime.toFixed(2)}ms</ThemedText>
//                 <ThemedText style={styles.benchRate}>
//                   {(r.count / (r.mmkvTime / 1000)).toFixed(0)} ops/s
//                 </ThemedText>
//               </View>
//             ))}
//           </View>
//         )}
//       </ScrollView>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   scroll: { flex: 1 },
//   scrollContent: { padding: 16, paddingBottom: 24 },
//   noteContainer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
//   noteParagraph: { marginBottom: 8 },
//   sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8 },
//   inputRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
//   input: {
//     flex: 0,
//     width: 100,
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(128,128,128,0.4)',
//     fontSize: 14,
//     color: '#333',
//   },
//   inputFlex: { flex: 1, width: undefined },
//   button: {
//     padding: 14,
//     alignItems: 'center',
//     borderRadius: 8,
//     backgroundColor: 'rgba(10,126,164,0.2)',
//   },
//   smallButton: {
//     padding: 12,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     borderRadius: 8,
//     backgroundColor: 'rgba(10,126,164,0.2)',
//   },
//   buttonText: { color: '#0a7ea4', fontWeight: '600' },
//   resultBox: {
//     flexDirection: 'row',
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: 'rgba(50,180,50,0.1)',
//     borderWidth: 1,
//     borderColor: 'rgba(50,180,50,0.3)',
//     gap: 8,
//     marginTop: 4,
//   },
//   resultLabel: { fontWeight: '600', fontSize: 14 },
//   resultValue: { flex: 1, fontSize: 14 },
//   listHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   clearText: { color: '#dc3232', fontSize: 13, fontWeight: '600' },
//   itemRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: 'rgba(128,128,128,0.3)',
//     gap: 8,
//   },
//   itemContent: { flex: 1 },
//   itemKey: { fontWeight: '600', fontSize: 14 },
//   itemValue: { fontSize: 13, opacity: 0.7, marginTop: 2 },
//   deleteButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6,
//     backgroundColor: 'rgba(220,50,50,0.1)',
//   },
//   deleteText: { color: '#dc3232', fontSize: 12, fontWeight: '600' },
//   emptyText: { textAlign: 'center', opacity: 0.5, marginTop: 16 },
//   benchNote: { fontSize: 13, opacity: 0.7, marginBottom: 8 },
//   benchResults: {
//     marginTop: 12,
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(128,128,128,0.3)',
//     gap: 8,
//   },
//   benchRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   benchOp: { fontWeight: '600', fontSize: 14, width: 60 },
//   benchTime: { fontSize: 14, width: 80, fontFamily: 'monospace' },
//   benchRate: { flex: 1, fontSize: 13, opacity: 0.7, textAlign: 'right' },
// });
