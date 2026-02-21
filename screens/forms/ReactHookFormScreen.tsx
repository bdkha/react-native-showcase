import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function ReactHookFormScreen() {
  const [submitted, setSubmitted] = useState<FormData | null>(null);
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor(
    { light: 'rgba(128,128,128,0.4)', dark: 'rgba(255,255,255,0.2)' },
    'text',
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = (data: FormData) => {
    setSubmitted(data);
    Alert.alert('Success', `Account created for ${data.name}`);
  };

  const handleReset = () => {
    reset();
    setSubmitted(null);
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={62}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
          <View style={styles.noteContainer}>
            <Collapsible title="About this demo">
              <ThemedText style={styles.noteParagraph}>
                This screen demonstrates form handling with React Hook Form including field
                validation, error messages, and controlled inputs.
              </ThemedText>
              <ThemedText style={styles.noteParagraph}>
                Try submitting with empty or invalid fields to see validation in action.
              </ThemedText>
            </Collapsible>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <ThemedText style={styles.label}>Name</ThemedText>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      { color: textColor, borderColor: errors.name ? '#e53935' : borderColor },
                    ]}
                    placeholder="Enter your name"
                    placeholderTextColor="rgba(128,128,128,0.6)"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                  />
                )}
              />
              {errors.name && (
                <ThemedText style={styles.error}>{errors.name.message}</ThemedText>
              )}
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      { color: textColor, borderColor: errors.email ? '#e53935' : borderColor },
                    ]}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(128,128,128,0.6)"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.email && (
                <ThemedText style={styles.error}>{errors.email.message}</ThemedText>
              )}
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: textColor,
                        borderColor: errors.password ? '#e53935' : borderColor,
                      },
                    ]}
                    placeholder="Enter password"
                    placeholderTextColor="rgba(128,128,128,0.6)"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
              />
              {errors.password && (
                <ThemedText style={styles.error}>{errors.password.message}</ThemedText>
              )}
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Confirm Password</ThemedText>
              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: textColor,
                        borderColor: errors.confirmPassword ? '#e53935' : borderColor,
                      },
                    ]}
                    placeholder="Re-enter password"
                    placeholderTextColor="rgba(128,128,128,0.6)"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
              />
              {errors.confirmPassword && (
                <ThemedText style={styles.error}>{errors.confirmPassword.message}</ThemedText>
              )}
            </View>

            <View style={styles.buttons}>
              <Pressable
                style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}>
                <ThemedText style={styles.submitText}>
                  {isSubmitting ? 'Submitting...' : 'Create Account'}
                </ThemedText>
              </Pressable>
              <Pressable style={styles.resetButton} onPress={handleReset}>
                <ThemedText style={styles.resetText}>Reset</ThemedText>
              </Pressable>
            </View>

            {submitted && (
              <View style={[styles.resultBox, { borderColor }]}>
                <ThemedText type="defaultSemiBold" style={styles.resultTitle}>
                  Submitted Data
                </ThemedText>
                <ThemedText style={styles.resultRow}>Name: {submitted.name}</ThemedText>
                <ThemedText style={styles.resultRow}>Email: {submitted.email}</ThemedText>
                <ThemedText style={styles.resultRow}>
                  Password: {'*'.repeat(submitted.password.length)}
                </ThemedText>
              </View>
            )}
          </View>
      </KeyboardAwareScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  noteContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  noteParagraph: {
    marginBottom: 8,
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 12,
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
  error: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.4)',
    alignItems: 'center',
  },
  resetText: {
    fontWeight: '600',
    fontSize: 15,
  },
  resultBox: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  resultTitle: {
    marginBottom: 8,
  },
  resultRow: {
    fontSize: 14,
    marginBottom: 4,
  },
});
