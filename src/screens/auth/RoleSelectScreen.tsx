import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import { UserRole } from '../../types';

const roles = [
  {
    id: 'sender' as UserRole,
    icon: '📦',
    title: 'I need an errand done',
    subtitle: 'Post tasks, track runners live, pay securely.',
    features: ['Post any errand', 'Live GPS tracking', 'Escrow payment', 'Rate your runner'],
    color: Colors.primary,
    bg: Colors.primaryLight,
  },
  {
    id: 'runner' as UserRole,
    icon: '🏃',
    title: 'I want to run errands',
    subtitle: 'Earn money completing tasks in your area.',
    features: ['Browse nearby errands', 'Earn per job', 'Build your reputation', 'Get paid fast'],
    color: Colors.accent,
    bg: Colors.accentLight,
  },
];

export default function RoleSelectScreen({ navigation }: any) {
  const [selected, setSelected] = useState<UserRole>(null);
  const setRole = useStore((s) => s.setRole);

  const handleContinue = () => {
    if (!selected) return;
    setRole(selected);
    if (selected === 'sender') {
      navigation.reset({ index: 0, routes: [{ name: 'SenderTabs' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'RunnerTabs' }] });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <Text style={styles.brandSmall}>RUNDO</Text>
        <Text style={styles.title}>How will you use RUNDO?</Text>
        <Text style={styles.subtitle}>
          You can switch between roles at any time from your profile.
        </Text>
      </View>

      <View style={styles.cards}>
        {roles.map((role) => {
          const isSelected = selected === role.id;
          return (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleCard,
                isSelected && { borderColor: role.color, borderWidth: 2.5 },
              ]}
              onPress={() => setSelected(role.id)}
              activeOpacity={0.85}
            >
              {isSelected && (
                <View style={[styles.selectedBadge, { backgroundColor: role.color }]}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}

              <View style={[styles.iconBubble, { backgroundColor: role.bg }]}>
                <Text style={styles.iconText}>{role.icon}</Text>
              </View>

              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleSubtitle}>{role.subtitle}</Text>

              <View style={styles.features}>
                {role.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <View style={[styles.featureDot, { backgroundColor: role.color }]} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.continueBtn, !selected && styles.btnDisabled]}
        onPress={handleContinue}
        disabled={!selected}
        activeOpacity={0.85}
      >
        <Text style={styles.continueBtnText}>
          {selected === 'runner' ? 'Start Earning →' : selected === 'sender' ? 'Post an Errand →' : 'Choose a role'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    paddingTop: 60,
  },
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
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary },
  cards: { flex: 1, gap: Spacing.md, justifyContent: 'center' },
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
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconText: { fontSize: 28 },
  roleTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  features: { gap: 6 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  featureDot: { width: 6, height: 6, borderRadius: 3 },
  featureText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  continueBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  btnDisabled: { backgroundColor: Colors.border },
  continueBtnText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});
