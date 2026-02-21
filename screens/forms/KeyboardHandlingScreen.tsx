import React from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from 'react-native-keyboard-controller';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function KeyboardHandlingScreen() {
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor(
    { light: 'rgba(128,128,128,0.4)', dark: 'rgba(255,255,255,0.2)' },
    'text',
  );

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={62}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.noteContainer}>
          <Collapsible title="About this demo">
            <ThemedText style={styles.noteParagraph}>
              This screen demonstrates keyboard handling using react-native-keyboard-controller,
              which works with Android 15 edge-to-edge mode (targetSdk 35).
            </ThemedText>
            <ThemedText style={styles.noteParagraph}>
              KeyboardAwareScrollView automatically scrolls to keep the focused input visible on
              both iOS and Android. The toolbar below the keyboard allows navigating between fields.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={styles.form}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Form Fields
          </ThemedText>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Username</ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor }]}
              placeholder="Enter username"
              placeholderTextColor="rgba(128,128,128,0.6)"
            />
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor }]}
              placeholder="Enter email"
              placeholderTextColor="rgba(128,128,128,0.6)"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Bio</ThemedText>
            <TextInput
              style={[styles.textArea, { color: textColor, borderColor }]}
              placeholder="Tell us about yourself"
              placeholderTextColor="rgba(128,128,128,0.6)"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Notes</ThemedText>
            <TextInput
              style={[styles.textArea, { color: textColor, borderColor }]}
              placeholder="Additional notes (this field is near the bottom to test keyboard avoidance)"
              placeholderTextColor="rgba(128,128,128,0.6)"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <Pressable style={styles.submitButton} onPress={Keyboard.dismiss}>
            <ThemedText style={styles.submitText}>Done</ThemedText>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  noteContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  noteParagraph: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    minHeight: 80,
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
