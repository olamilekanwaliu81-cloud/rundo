import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';
import { useStore, lookupRegisteredRole } from '../../store/useStore';
import { PremiumButton } from '../../components/PremiumButton';

export default function LoginScreen({ navigation, route }: any) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState<boolean>(
    route?.params?.isNewUser ?? false
  );
  const [loading, setLoading] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const setUser = useStore((s) => s.setUser);

  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(50)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    Animated.sequence([
      Animated.delay(150),
      Animated.parallel([
        Animated.spring(cardSlide, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleContinue = async () => {
    if (!phone || phone.length < 10) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    if (isNewUser) {
      // Brand new account — save user with no role yet, then pick role
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
    } else {
      // Returning user — look up their saved role and route to the right dashboard
      const savedRole = lookupRegisteredRole(phone);

      setUser({
        id: 'user_returning',
        name: 'User',
        phone,
        role: savedRole,
        rating: 4.8,
        totalJobs: 12,
        isVerified: true,
      });
      setLoading(false);

      if (savedRole === 'runner') {
        navigation.reset({ index: 0, routes: [{ name: 'RunnerTabs' }] });
      } else {
        // Default to sender if no role found (edge case)
        navigation.reset({ index: 0, routes: [{ name: 'SenderTabs' }] });
      }
    }
  };

  const isValid = phone.length >= 10;

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
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <View style={styles.backBtnInner}>
            <Text style={styles.backArrow}>←</Text>
          </View>
        </TouchableOpacity>

        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: headerOpacity, transform: [{ translateY: headerSlide }] },
          ]}
        >
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>RUNDO</Text>
          </View>
          <Text style={styles.title}>
            {isNewUser ? 'Create your\naccount' : 'Welcome\nback 👋'}
          </Text>
          <Text style={styles.subtitle}>
            {isNewUser
              ? 'Fill in your details to get started on RUNDO'
              : 'Enter your phone number to log in'}
          </Text>
        </Animated.View>

        {/* Card */}
        <Animated.View
          style={[
            styles.card,
            { opacity: cardOpacity, transform: [{ translateY: cardSlide }] },
          ]}
        >
          {isNewUser && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, nameFocused && styles.inputFocused]}
                placeholder="e.g. Emeka Okafor"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.phoneRow, phoneFocused && styles.inputFocused]}>
              <View style={styles.flagBadge}>
                <Text style={styles.flagText}>🇳🇬  +234</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="0803 000 0000"
                placeholderTextColor={Colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={11}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
              />
              {isValid && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>

          <View style={{ marginTop: Spacing.sm }}>
            <PremiumButton
              label={isNewUser ? 'Create Account' : 'Continue'}
              onPress={handleContinue}
              loading={loading}
              disabled={!isValid}
            />
          </View>
        </Animated.View>

        {/* Switch mode */}
        <TouchableOpacity onPress={() => setIsNewUser(!isNewUser)} style={styles.switchLink}>
          <Text style={styles.switchText}>
            {isNewUser ? 'Already have an account?  ' : 'New to RUNDO?  '}
            <Text style={styles.switchHighlight}>
              {isNewUser ? 'Log in' : 'Create account'}
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Trust section */}
        <View style={styles.trustSection}>
          <View style={styles.trustIconRow}>
            <Text style={styles.trustIcon}>🔒</Text>
            <Text style={styles.trustTitle}>Your data is protected</Text>
          </View>
          <Text style={styles.trustText}>
            Runners are verified with NIN & BVN. Your number is never shared with third parties.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.xxl },
  backBtn: { marginBottom: Spacing.lg },
  backBtnInner: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.xs,
  },
  backArrow: { fontSize: 18, color: Colors.textPrimary },
  header: { marginBottom: Spacing.xl },
  brandBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginBottom: Spacing.md,
  },
  brandBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 3,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    lineHeight: 40,
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
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  inputFocused: {
    borderColor: Colors.primary,
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
    paddingVertical: 14,
    backgroundColor: Colors.primaryLight,
    borderRightWidth: 1.5,
    borderRightColor: Colors.border,
  },
  flagText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  phoneInput: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  checkmark: {
    paddingRight: Spacing.md,
    fontSize: FontSize.lg,
    color: Colors.success,
    fontWeight: '700',
  },
  switchLink: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  switchText: { fontSize: FontSize.md, color: Colors.textSecondary },
  switchHighlight: { color: Colors.primary, fontWeight: '700' },
  trustSection: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  trustIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  trustIcon: { fontSize: 14 },
  trustTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  trustText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
