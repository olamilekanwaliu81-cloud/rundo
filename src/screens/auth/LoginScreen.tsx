import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';
import { useStore } from '../../store/useStore';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useStore((s) => s.setUser);

  const handleContinue = async () => {
    if (!phone || phone.length < 10) return;
    setLoading(true);
    // Simulate auth
    await new Promise((r) => setTimeout(r, 1200));
    setUser({
      id: 'user_' + Date.now(),
      name: name || 'User',
      phone,
      role: null,
      rating: 5.0,
      totalJobs: 0,
      isVerified: false,
    });
    setLoading(false);
    navigation.navigate('RoleSelect');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.brandSmall}>RUNDO</Text>
          <Text style={styles.title}>
            {isNewUser ? 'Create your account' : 'Welcome back'}
          </Text>
          <Text style={styles.subtitle}>
            Enter your Nigerian phone number to continue
          </Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          {isNewUser && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Emeka Okafor"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneRow}>
              <View style={styles.flagBadge}>
                <Text style={styles.flagText}>🇳🇬 +234</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="0803 000 0000"
                placeholderTextColor={Colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={11}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.continueBtn, (!phone || phone.length < 10) && styles.btnDisabled]}
            onPress={handleContinue}
            disabled={!phone || phone.length < 10 || loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={Colors.dark} />
            ) : (
              <Text style={styles.continueBtnText}>Continue →</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setIsNewUser(!isNewUser)} style={styles.switchLink}>
          <Text style={styles.switchText}>
            {isNewUser ? 'Already have an account? ' : 'New to RUNDO? '}
            <Text style={styles.switchHighlight}>
              {isNewUser ? 'Log in' : 'Create account'}
            </Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.trustSection}>
          <Text style={styles.trustTitle}>Your data is protected</Text>
          <Text style={styles.trustText}>
            We use NIN and BVN verification to keep all runners accountable. Your number is
            never shared.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.xxl },
  backBtn: { marginBottom: Spacing.lg },
  backArrow: { fontSize: 24, color: Colors.textPrimary },
  header: { marginBottom: Spacing.xl },
  brandSmall: {
    fontSize: FontSize.sm,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 4,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  inputGroup: { marginBottom: Spacing.md },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
  flagBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primaryLight,
    borderRightWidth: 1.5,
    borderRightColor: Colors.border,
  },
  flagText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.primary },
  phoneInput: {
    flex: 1,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  continueBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  btnDisabled: { backgroundColor: Colors.border },
  continueBtnText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  switchLink: { alignItems: 'center', marginBottom: Spacing.xl },
  switchText: { fontSize: FontSize.md, color: Colors.textSecondary },
  switchHighlight: { color: Colors.primary, fontWeight: '700' },
  trustSection: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  trustTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  trustText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
