import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';
import { useStore, saveRegisteredRole } from '../../store/useStore';
import { UserRole } from '../../types';
import { PremiumButton } from '../../components/PremiumButton';

const roles = [
  {
    id: 'sender' as UserRole,
    emoji: '📦',
    title: 'I need an errand done',
    subtitle: 'Post tasks, track runners live, pay securely.',
    features: ['Post any errand', 'Live GPS tracking', 'Escrow payment', 'Rate your runner'],
    accentColor: Colors.primary,
    accentBg: Colors.primaryLight,
    accentBorder: Colors.primaryMid,
  },
  {
    id: 'runner' as UserRole,
    emoji: '🏃',
    title: 'I want to earn by running errands',
    subtitle: 'Complete tasks nearby and get paid fast.',
    features: ['Browse nearby errands', 'Earn per job', 'Build your reputation', 'Get paid fast'],
    accentColor: Colors.accent,
    accentBg: Colors.accentLight,
    accentBorder: '#FFE4A3',
  },
];

function RoleCard({
  role,
  selected,
  onSelect,
  delay,
}: {
  role: (typeof roles)[0];
  selected: boolean;
  onSelect: () => void;
  delay: number;
}) {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      tension: 200,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 200,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={[
          styles.roleCard,
          selected && {
            borderColor: role.accentColor,
            borderWidth: 2.5,
            backgroundColor: role.accentBg,
          },
        ]}
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {selected && (
          <View style={[styles.selectedBadge, { backgroundColor: role.accentColor }]}>
            <Text style={styles.selectedBadgeText}>✓</Text>
          </View>
        )}

        <View style={[styles.emojiCircle, { backgroundColor: selected ? role.accentColor : role.accentBg }]}>
          <Text style={styles.emoji}>{role.emoji}</Text>
        </View>

        <Text style={[styles.roleTitle, selected && { color: role.accentColor }]}>
          {role.title}
        </Text>
        <Text style={styles.roleSubtitle}>{role.subtitle}</Text>

        <View style={styles.featureList}>
          {role.features.map((f) => (
            <View key={f} style={styles.featureRow}>
              <View style={[styles.featureDot, { backgroundColor: role.accentColor }]} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function RoleSelectScreen({ navigation }: any) {
  const [selected, setSelected] = useState<UserRole>(null);
  const setRole = useStore((s) => s.setRole);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinue = () => {
    if (!selected) return;
    setRole(selected);

    // Persist phone → role so login can route them back to the right dashboard
    const phone = useStore.getState().user?.phone;
    if (phone && selected) {
      saveRegisteredRole(phone, selected);
    }

    if (selected === 'sender') {
      navigation.reset({ index: 0, routes: [{ name: 'SenderTabs' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'RunnerTabs' }] });
    }
  };

  const ctaLabel =
    selected === 'runner' ? 'Start Earning →' : selected === 'sender' ? 'Post an Errand →' : 'Choose a role above';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
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
          <Text style={styles.title}>How will you{'\n'}use RUNDO?</Text>
          <Text style={styles.subtitle}>
            You can switch between roles at any time from your profile.
          </Text>
        </Animated.View>

        {/* Role cards */}
        <View style={styles.cards}>
          {roles.map((role, i) => (
            <RoleCard
              key={role.id}
              role={role}
              selected={selected === role.id}
              onSelect={() => setSelected(role.id)}
              delay={i * 120}
            />
          ))}
        </View>

        <View style={styles.ctaWrapper}>
          <PremiumButton
            label={ctaLabel}
            onPress={handleContinue}
            disabled={!selected}
            variant={selected === 'runner' ? 'accent' : 'primary'}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.xxl },
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
    lineHeight: 42,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  cards: { gap: Spacing.md, marginBottom: Spacing.xl },
  roleCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  selectedBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: { color: Colors.white, fontWeight: '900', fontSize: 15 },
  emojiCircle: {
    width: 60,
    height: 60,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emoji: { fontSize: 28 },
  roleTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
    paddingRight: 40,
  },
  roleSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  featureList: { gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  featureDot: { width: 6, height: 6, borderRadius: 3 },
  featureText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  ctaWrapper: {},
});
