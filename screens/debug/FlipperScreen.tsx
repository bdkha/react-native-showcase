import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type NetworkLog = {
  id: number;
  method: string;
  url: string;
  status: number | 'error';
  duration: number;
  timestamp: string;
  requestHeaders: Record<string, string>;
  responseSize: string;
};

type LayoutNode = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

let logId = 0;

const MOCK_ENDPOINTS = [
  { method: 'GET', path: '/api/users', status: 200, size: '2.4 KB' },
  { method: 'GET', path: '/api/posts?page=1', status: 200, size: '8.1 KB' },
  { method: 'POST', path: '/api/auth/login', status: 200, size: '0.3 KB' },
  { method: 'GET', path: '/api/products/42', status: 404, size: '0.1 KB' },
  { method: 'PUT', path: '/api/users/1', status: 200, size: '1.2 KB' },
  { method: 'DELETE', path: '/api/posts/5', status: 204, size: '0 B' },
  { method: 'GET', path: '/api/images', status: 500, size: '0.2 KB' },
  { method: 'POST', path: '/api/upload', status: 413, size: '0.1 KB' },
];

const NetworkInspector = () => {
  const [logs, setLogs] = useState<NetworkLog[]>([]);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const simulateRequest = useCallback(() => {
    const endpoint = MOCK_ENDPOINTS[Math.floor(Math.random() * MOCK_ENDPOINTS.length)];
    const duration = Math.floor(Math.random() * 800) + 50;
    const entry: NetworkLog = {
      id: ++logId,
      method: endpoint.method,
      url: endpoint.path,
      status: Math.random() > 0.85 ? 'error' : endpoint.status,
      duration,
      timestamp: new Date().toLocaleTimeString(),
      requestHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ***',
        'User-Agent': 'ReactNativeShowcase/1.0',
      },
      responseSize: endpoint.size,
    };
    setLogs((prev) => [entry, ...prev].slice(0, 30));
  }, []);

  const toggleSimulation = () => {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setRunning(false);
    } else {
      simulateRequest();
      intervalRef.current = setInterval(simulateRequest, 1500);
      setRunning(true);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getStatusColor = (status: number | 'error') => {
    if (status === 'error') return '#dc3232';
    if (status >= 500) return '#dc3232';
    if (status >= 400) return '#e6a700';
    if (status >= 200 && status < 300) return '#32b432';
    return '#666';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return '#0a7ea4';
      case 'POST': return '#32b432';
      case 'PUT': return '#e6a700';
      case 'DELETE': return '#dc3232';
      default: return '#666';
    }
  };

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Network Inspector</ThemedText>

      <View style={styles.actionRow}>
        <Pressable style={[styles.actionButton, running && styles.stopButton]} onPress={toggleSimulation}>
          <ThemedText style={[styles.buttonText, running && styles.stopButtonText]}>
            {running ? 'Stop Simulation' : 'Start Simulation'}
          </ThemedText>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => setLogs([])}>
          <ThemedText style={styles.buttonText}>Clear</ThemedText>
        </Pressable>
      </View>

      {logs.length === 0 ? (
        <ThemedText style={styles.emptyText}>
          No network requests captured. Tap "Start Simulation" to generate mock traffic.
        </ThemedText>
      ) : (
        logs.map((log) => (
          <Collapsible
            key={log.id}
            title={`${log.method} ${log.url} — ${log.status}`}>
            <View style={styles.logDetail}>
              <View style={styles.logHeader}>
                <ThemedText style={[styles.methodBadge, { backgroundColor: getMethodColor(log.method) + '20', color: getMethodColor(log.method) }]}>
                  {log.method}
                </ThemedText>
                <ThemedText style={[styles.statusBadge, { color: getStatusColor(log.status) }]}>
                  {log.status}
                </ThemedText>
                <ThemedText style={styles.duration}>{log.duration}ms</ThemedText>
              </View>
              <ThemedText style={styles.logUrl}>{log.url}</ThemedText>
              <ThemedText style={styles.logMeta}>Time: {log.timestamp}</ThemedText>
              <ThemedText style={styles.logMeta}>Size: {log.responseSize}</ThemedText>
              <ThemedText style={styles.logSubtitle}>Request Headers:</ThemedText>
              {Object.entries(log.requestHeaders).map(([k, v]) => (
                <ThemedText key={k} style={styles.headerLine}>{k}: {v}</ThemedText>
              ))}
            </View>
          </Collapsible>
        ))
      )}

      <ThemedText style={styles.note}>
        In a real app, Flipper's Network plugin intercepts actual HTTP traffic. This simulation
        demonstrates the inspection UI pattern — method, status, timing, headers, and response size
        for each request.
      </ThemedText>
    </View>
  );
};

const LayoutInspector = () => {
  const [nodes, setNodes] = useState<LayoutNode[]>([]);
  const [selected, setSelected] = useState<LayoutNode | null>(null);

  const handleLayout = (name: string) => (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setNodes((prev) => {
      const existing = prev.findIndex((n) => n.name === name);
      const node: LayoutNode = {
        id: name,
        name,
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(width),
        height: Math.round(height),
      };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = node;
        return updated;
      }
      return [...prev, node];
    });
  };

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Layout Inspector</ThemedText>

      <ThemedText style={styles.subtitle}>Tap a component to inspect its layout:</ThemedText>

      <View style={styles.layoutDemo} onLayout={handleLayout('Container')}>
        <Pressable
          style={styles.layoutBox1}
          onLayout={handleLayout('Header')}
          onPress={() => setSelected(nodes.find((n) => n.name === 'Header') ?? null)}>
          <ThemedText style={styles.layoutLabel}>Header</ThemedText>
        </Pressable>

        <View style={styles.layoutRow} onLayout={handleLayout('Row')}>
          <Pressable
            style={styles.layoutBox2}
            onLayout={handleLayout('Sidebar')}
            onPress={() => setSelected(nodes.find((n) => n.name === 'Sidebar') ?? null)}>
            <ThemedText style={styles.layoutLabel}>Sidebar</ThemedText>
          </Pressable>
          <Pressable
            style={styles.layoutBox3}
            onLayout={handleLayout('Content')}
            onPress={() => setSelected(nodes.find((n) => n.name === 'Content') ?? null)}>
            <ThemedText style={styles.layoutLabel}>Content</ThemedText>
          </Pressable>
        </View>

        <Pressable
          style={styles.layoutBox4}
          onLayout={handleLayout('Footer')}
          onPress={() => setSelected(nodes.find((n) => n.name === 'Footer') ?? null)}>
          <ThemedText style={styles.layoutLabel}>Footer</ThemedText>
        </Pressable>
      </View>

      {selected && (
        <View style={styles.inspectorBox}>
          <ThemedText type="defaultSemiBold">{selected.name}</ThemedText>
          <View style={styles.propsGrid}>
            <View style={styles.propItem}>
              <ThemedText style={styles.propLabel}>x</ThemedText>
              <ThemedText style={styles.propValue}>{selected.x}</ThemedText>
            </View>
            <View style={styles.propItem}>
              <ThemedText style={styles.propLabel}>y</ThemedText>
              <ThemedText style={styles.propValue}>{selected.y}</ThemedText>
            </View>
            <View style={styles.propItem}>
              <ThemedText style={styles.propLabel}>width</ThemedText>
              <ThemedText style={styles.propValue}>{selected.width}</ThemedText>
            </View>
            <View style={styles.propItem}>
              <ThemedText style={styles.propLabel}>height</ThemedText>
              <ThemedText style={styles.propValue}>{selected.height}</ThemedText>
            </View>
          </View>
        </View>
      )}

      <View style={styles.nodeList}>
        <ThemedText type="defaultSemiBold">All Layout Nodes ({nodes.length})</ThemedText>
        {nodes.map((node) => (
          <Pressable
            key={node.id}
            style={[styles.nodeRow, selected?.id === node.id && styles.nodeRowSelected]}
            onPress={() => setSelected(node)}>
            <ThemedText style={styles.nodeName}>{node.name}</ThemedText>
            <ThemedText style={styles.nodeProps}>
              {node.width}x{node.height} @ ({node.x},{node.y})
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText style={styles.note}>
        Flipper's Layout Inspector shows the view hierarchy with computed positions and dimensions.
        This demo uses onLayout to capture real measurements of rendered components.
      </ThemedText>
    </View>
  );
};

export default function FlipperScreen() {
  const [mode, setMode] = useState<'network' | 'layout'>('network');

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteContainer}>
          <Collapsible title="About this demo">
            <ThemedText style={styles.noteParagraph}>
              Flipper is a desktop debugging platform for mobile apps. Its most-used plugins are
              the Network inspector (view HTTP requests/responses) and the Layout inspector (view
              component hierarchy and dimensions).
            </ThemedText>
            <ThemedText style={styles.noteParagraph}>
              This screen simulates both plugins to demonstrate the concepts. In production, Flipper
              connects to the app over a bridge for real-time inspection.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, mode === 'network' && styles.tabActive]}
            onPress={() => setMode('network')}>
            <ThemedText style={mode === 'network' && styles.tabTextActive}>Network</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, mode === 'layout' && styles.tabActive]}
            onPress={() => setMode('layout')}>
            <ThemedText style={mode === 'layout' && styles.tabTextActive}>Layout</ThemedText>
          </Pressable>
        </View>

        {mode === 'network' ? <NetworkInspector /> : <LayoutInspector />}
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
  tabs: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.4)',
  },
  tabActive: { borderColor: '#0a7ea4', backgroundColor: 'rgba(10,126,164,0.15)' },
  tabTextActive: { color: '#0a7ea4', fontWeight: '600' },
  example: { gap: 8 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  subtitle: { fontSize: 14, opacity: 0.7 },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionButton: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(10,126,164,0.2)',
  },
  stopButton: { backgroundColor: 'rgba(220,50,50,0.15)' },
  buttonText: { color: '#0a7ea4', fontWeight: '600' },
  stopButtonText: { color: '#dc3232' },
  emptyText: { textAlign: 'center', opacity: 0.5, marginTop: 16, marginBottom: 8 },
  logDetail: { gap: 4 },
  logHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  methodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
  },
  statusBadge: { fontWeight: '700', fontSize: 14 },
  duration: { fontSize: 13, opacity: 0.6 },
  logUrl: { fontSize: 13, fontFamily: 'monospace' },
  logMeta: { fontSize: 12, opacity: 0.6 },
  logSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  headerLine: { fontSize: 11, fontFamily: 'monospace', opacity: 0.7 },
  note: { marginTop: 12, fontSize: 13, opacity: 0.9 },
  layoutDemo: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    gap: 8,
  },
  layoutRow: { flexDirection: 'row', gap: 8 },
  layoutBox1: {
    padding: 16,
    borderRadius: 6,
    backgroundColor: 'rgba(10,126,164,0.15)',
    alignItems: 'center',
  },
  layoutBox2: {
    flex: 1,
    padding: 16,
    borderRadius: 6,
    backgroundColor: 'rgba(50,180,50,0.15)',
    alignItems: 'center',
  },
  layoutBox3: {
    flex: 2,
    padding: 16,
    borderRadius: 6,
    backgroundColor: 'rgba(230,167,0,0.15)',
    alignItems: 'center',
  },
  layoutBox4: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(220,50,50,0.15)',
    alignItems: 'center',
  },
  layoutLabel: { fontSize: 13, fontWeight: '600' },
  inspectorBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0a7ea4',
    backgroundColor: 'rgba(10,126,164,0.08)',
    gap: 8,
  },
  propsGrid: { flexDirection: 'row', gap: 12 },
  propItem: { alignItems: 'center' },
  propLabel: { fontSize: 11, opacity: 0.6, fontWeight: '600' },
  propValue: { fontSize: 16, fontWeight: '700', fontFamily: 'monospace' },
  nodeList: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    gap: 4,
  },
  nodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  nodeRowSelected: { backgroundColor: 'rgba(10,126,164,0.1)' },
  nodeName: { fontWeight: '600', fontSize: 13 },
  nodeProps: { fontSize: 12, fontFamily: 'monospace', opacity: 0.6 },
});
