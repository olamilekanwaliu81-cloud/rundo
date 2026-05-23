import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Background decoration */}
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />

      {/* Logo section */}
      <View style={styles.logoSection}>
        <View style={styles.iconContainer}>
          <View style={styles.runnerIcon}>
            {/* Abstract runner: head */}
            <View style={styles.runnerHead} />
            {/* Body */}
            <View style={styles.runnerBody} />
            {/* Arms */}
            <View style={[styles.runnerArm, styles.armLeft]} />
            <View style={[styles.runnerArm, styles.armRight]} />
            {/* Legs */}
            <View style={[styles.runnerLeg, styles.legLeft]} />
            <View style={[styles.runnerLeg, styles.legRight]} />
          </View>
        </View>

        <Text style={styles.brandName}>RUNDO</Text>
        <Text style={styles.tagline}>Run It. Trust It. Done.</Text>
      </View>

      {/* Description */}
      <View style={styles.descSection}>
        <Text style={styles.descTitle}>Nigeria's Errand Marketplace</Text>
        <Text style={styles.descText}>
          Send an errand. Get it done by a verified local runner near you — tracked live,
          paid securely.
        </Text>

        <View style={styles.pillsRow}>
          {['Verified Runners', 'Live GPS', 'Escrow Pay'].map((label) => (
            <View key={label} style={styles.pill}>
              <Text style={styles.pillText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA buttons */}
      <View style={styles.ctaSection}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>I already have an account</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Lagos · Abuja · Port Harcourt · Ibadan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.xl,
  },
  topCircle: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.primaryDark,
    opacity: 0.4,
  },
  bottomCircle: {
    position: 'absolute',
    bottom: -120,
    left: -60,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: Colors.primaryDark,
    opacity: 0.3,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  runnerIcon: {
    width: 48,
    height: 56,
    position: 'relative',
  },
  runnerHead: {
    position: 'absolute',
    top: 0,
    left: 16,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.white,
  },
  runnerBody: {
    position: 'absolute',
    top: 16,
    left: 18,
    width: 10,
    height: 18,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  runnerArm: {
    position: 'absolute',
    top: 18,
    width: 14,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.white,
  },
  armLeft: { left: 4, transform: [{ rotate: '-30deg' }] },
  armRight: { right: 2, transform: [{ rotate: '30deg' }] },
  runnerLeg: {
    position: 'absolute',
    bottom: 0,
    width: 6,
    height: 20,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
  legLeft: { left: 14, transform: [{ rotate: '-15deg' }] },
  legRight: { right: 14, transform: [{ rotate: '15deg' }] },
  brandName: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 6,
    marginBottom: 4,
  },
  tagline: {
    fontSize: FontSize.md,
    color: Colors.accent,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  descSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  descTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  descText: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  pillText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  ctaSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: Colors.dark,
    fontSize: FontSize.lg,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    borderRadius: Radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  secondaryBtnText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.45)',
    fontSize: FontSize.xs,
    letterSpacing: 1,
  },
});
