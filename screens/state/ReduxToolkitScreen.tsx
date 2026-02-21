import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRenderCount } from '@/hooks/use-rerender-count';

type User = { id: number; name: string; email: string };

const FAKE_USERS: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com' },
];

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

const fetchUsers = createAsyncThunk(
  'users/fetch',
  async (shouldFail: boolean) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (shouldFail) {
      throw new Error('Network request failed');
    }
    return FAKE_USERS;
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [] as User[],
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
  },
  reducers: {
    clearUsers: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

function createStore() {
  return configureStore({
    reducer: {
      counter: counterSlice.reducer,
      users: usersSlice.reducer,
    },
  });
}

type AppStore = ReturnType<typeof createStore>;
type RootState = ReturnType<AppStore['getState']>;
type AppDispatch = AppStore['dispatch'];

const CounterDisplay = React.memo(() => {
  const value = useSelector((s: RootState) => s.counter.value);
  const renders = useRenderCount('ReduxCounter');
  return (
    <View style={styles.box}>
      <ThemedText type="defaultSemiBold">Counter</ThemedText>
      <ThemedText style={styles.counterValue}>{value}</ThemedText>
      <ThemedText style={styles.renderBadge}>Renders: {renders}</ThemedText>
    </View>
  );
});

const CounterActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <View style={styles.actionRow}>
      <Pressable style={styles.actionButton} onPress={() => dispatch(counterSlice.actions.decrement())}>
        <ThemedText style={styles.buttonText}>− Decrement</ThemedText>
      </Pressable>
      <Pressable style={styles.actionButton} onPress={() => dispatch(counterSlice.actions.increment())}>
        <ThemedText style={styles.buttonText}>+ Increment</ThemedText>
      </Pressable>
    </View>
  );
};

const SyncExample = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Sync Actions</ThemedText>

      <CounterDisplay />
      <CounterActions />

      <Pressable style={styles.button} onPress={() => dispatch(counterSlice.actions.reset())}>
        <ThemedText style={styles.buttonText}>Reset</ThemedText>
      </Pressable>

      <ThemedText style={styles.note}>
        createSlice generates action creators and a reducer from a single definition. Immer allows
        direct state mutation syntax while keeping updates immutable under the hood.
      </ThemedText>
    </View>
  );
};

const STATUS_COLORS: Record<string, string> = {
  idle: 'rgba(128,128,128,0.15)',
  loading: 'rgba(10,126,164,0.15)',
  succeeded: 'rgba(50,180,50,0.15)',
  failed: 'rgba(220,50,50,0.15)',
};

const UsersStatus = React.memo(() => {
  const status = useSelector((s: RootState) => s.users.status);
  const error = useSelector((s: RootState) => s.users.error);
  const renders = useRenderCount('ReduxUsersStatus');

  return (
    <View style={[styles.box, { backgroundColor: STATUS_COLORS[status] }]}>
      <ThemedText type="defaultSemiBold">Status</ThemedText>
      <View style={styles.statusRow}>
        {status === 'loading' && <ActivityIndicator size="small" color="#0a7ea4" />}
        <ThemedText>{status.toUpperCase()}</ThemedText>
      </View>
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      <ThemedText style={styles.renderBadge}>Renders: {renders}</ThemedText>
    </View>
  );
});

const UsersList = React.memo(() => {
  const users = useSelector((s: RootState) => s.users.items);
  const renders = useRenderCount('ReduxUsersList');

  if (users.length === 0) return null;

  return (
    <View style={styles.box}>
      <ThemedText type="defaultSemiBold">Users ({users.length})</ThemedText>
      {users.map((user) => (
        <View key={user.id} style={styles.userRow}>
          <ThemedText style={styles.userName}>{user.name}</ThemedText>
          <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
        </View>
      ))}
      <ThemedText style={styles.renderBadge}>Renders: {renders}</ThemedText>
    </View>
  );
});

const AsyncExample = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Async Thunks</ThemedText>

      <UsersStatus />
      <UsersList />

      <Pressable style={styles.button} onPress={() => dispatch(fetchUsers(false))}>
        <ThemedText style={styles.buttonText}>Fetch Users</ThemedText>
      </Pressable>
      <Pressable style={styles.button} onPress={() => dispatch(fetchUsers(true))}>
        <ThemedText style={styles.buttonText}>Simulate Error</ThemedText>
      </Pressable>
      <Pressable style={styles.button} onPress={() => dispatch(usersSlice.actions.clearUsers())}>
        <ThemedText style={styles.buttonText}>Clear</ThemedText>
      </Pressable>

      <ThemedText style={styles.note}>
        createAsyncThunk handles the pending/fulfilled/rejected lifecycle automatically.
        extraReducers maps each lifecycle action to a state update, enabling clean loading and error
        handling without manual action types.
      </ThemedText>
    </View>
  );
};

const DemoContent = () => {
  const [mode, setMode] = useState<'sync' | 'async'>('sync');

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.noteContainer}>
        <Collapsible title="About this demo">
          <ThemedText style={styles.noteParagraph}>
            Redux Toolkit simplifies Redux with opinionated defaults: configureStore sets up the
            store with good middleware, createSlice combines reducers and actions, and
            createAsyncThunk handles async lifecycle.
          </ThemedText>
          <ThemedText style={styles.noteParagraph}>
            The Sync tab shows basic counter state with createSlice. The Async tab demonstrates
            createAsyncThunk with loading, success, and error states.
          </ThemedText>
        </Collapsible>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, mode === 'sync' && styles.tabActive]}
          onPress={() => setMode('sync')}>
          <ThemedText style={mode === 'sync' && styles.tabTextActive}>Sync</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.tab, mode === 'async' && styles.tabActive]}
          onPress={() => setMode('async')}>
          <ThemedText style={mode === 'async' && styles.tabTextActive}>Async</ThemedText>
        </Pressable>
      </View>

      {mode === 'sync' ? <SyncExample /> : <AsyncExample />}
    </ScrollView>
  );
};

export default function ReduxToolkitScreen() {
  const store = useMemo(() => createStore(), []);

  return (
    <Provider store={store}>
      <ThemedView style={styles.container}>
        <DemoContent />
      </ThemedView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  noteContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  noteParagraph: {
    marginBottom: 8,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.4)',
  },
  tabActive: {
    borderColor: '#0a7ea4',
    backgroundColor: 'rgba(10,126,164,0.15)',
  },
  tabTextActive: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  example: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  box: {
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
  },
  renderBadge: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 4,
  },
  counterValue: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(10,126,164,0.2)',
  },
  button: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(10,126,164,0.2)',
  },
  buttonText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  note: {
    marginTop: 12,
    fontSize: 13,
    opacity: 0.9,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  errorText: {
    color: '#dc3232',
    marginTop: 4,
    fontSize: 13,
  },
  userRow: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.3)',
  },
  userName: {
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 13,
    opacity: 0.7,
  },
});
