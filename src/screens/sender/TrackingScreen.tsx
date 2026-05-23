import React, { useState, useEffect, useRef } from 'react';
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
import { useStore } from '../../store/useStore';

const steps = [
  { id: 'matched', label: 'Runner matched', emoji: '✅' },
  { id: 'heading', label: 'Heading to pickup', emoji: '🏃' },
  { id: 'pickup', label: 'Item photographed', emoji: '📸' },
  { id: 'transit', label: 'On the way to you', emoji: '🗺️' },
  { id: 'delivered', label: 'Delivered', emoji: '📦' },
];

const mockRunner = {
  name: 'Tunde Adesanya',
  level: 2,
  rating: 4.7,
  jobs: 34,
  eta: '18 mins',
};

// Decorative "map" street lines
const streets = [
  { x1: '10%', y1: '0%', x2: '10%', y2: '100%' },
  { x1: '35%', y1: '0%', x2: '35%', y2: '100%' },
  { x1: '65%', y1: '0%', x2: '65%', y2: '100%' },
  { x1: '88%', y1: '0%', x2: '88%', y2: '100%' },
  { x1: '0%', y1: '25%', x2: '100%', y2: '25%' },
  { x1: '0%', y1: '55%', x2: '100%', y2: '55%' },
  { x1: '0%', y1: '78%', x2: '100%', y2: '78%' },
];

export default function TrackingScreen({ route, navigation }: any) {
  const { errandId } = route.params || {};
  const { errands } = useStore();
  const errand = errands.find((e) => e.id === errandId) || errands[0];
  const [currentStep, setCurrentStep] = useState(1);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;
  const etaAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(60)).current;
  const sheetOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse runner marker
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, { toValue: 1.6, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0, duration: 900, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // ETA bounce in
    Animated.spring(etaAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }).start();

    // Bottom sheet slide up
    Animated.parallel([
      Animated.spring(sheetAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      Animated.timing(sheetOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Simulate progress
    const timer = setInterval(() => {
      setCurrentStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const initials = mockRunner.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Tracking</Text>
        <TouchableOpacity style={styles.sosBtn}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Stylised map area */}
      <View style={styles.mapArea}>
        {/* Street grid */}
        {streets.map((s, i) => (
          <View
            key={i}
            style={[
              styles.street,
              {
                left: s.x1,
                top: s.y1,
                right: s.x2 === '100%' ? 0 : undefined,
                bottom: s.y2 === '100%' ? 0 : undefined,
                width: s.x1 === s.x2 ? 1.5 : undefined,
                height: s.y1 === s.y2 ? 1.5 : undefined,
              },
            ]}
          />
        ))}

        {/* Location label */}
        <View style={styles.mapLabel}>
          <Text style={styles.mapLabelText}>📍 Lagos, Nigeria</Text>
        </View>

        {/* Pickup marker */}
        <View style={[styles.mapMarker, { top: '28%', left: '22%' }]}>
          <View style={[styles.markerBubble, { backgroundColor: Colors.primary }]}>
            <Text style={styles.markerBubbleText}>P</Text>
          </View>
          <Text style={styles.markerLabel}>Pickup</Text>
        </View>

        {/* Drop-off marker */}
        <View style={[styles.mapMarker, { top: '58%', right: '14%' }]}>
          <View style={[styles.markerBubble, { backgroundColor: Colors.accent }]}>
            <Text style={[styles.markerBubbleText, { color: Colors.primaryDeep }]}>D</Text>
          </View>
          <Text style={styles.markerLabel}>Drop-off</Text>
        </View>

        {/* Runner */}
        <View style={[styles.runnerPosition, { top: '42%', left: '42%' }]}>
          <Animated.View
            style={[
              styles.runnerPulseRing,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseOpacity,
              },
            ]}
          />
          <View style={styles.runnerMarker}>
            <Text style={styles.runnerMarkerEmoji}>🏃</Text>
          </View>
        </View>

        {/* ETA chip */}
        <Animated.View
          style={[
            styles.etaBadge,
            {
              transform: [
                {
                  scale: etaAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
              ],
              opacity: etaAnim,
            },
          ]}
        >
          <Text style={styles.etaLabel}>ETA</Text>
          <Text style={styles.etaValue}>{mockRunner.eta}</Text>
        </Animated.View>
      </View>

      {/* Bottom sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { opacity: sheetOpacity, transform: [{ translateY: sheetAnim }] },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Runner card */}
          <View style={styles.runnerCard}>
            <View style={styles.runnerAvatar}>
              <Text style={styles.runnerAvatarText}>{initials}</Text>
            </View>
            <View style={styles.runnerInfo}>
              <Text style={styles.runnerName}>{mockRunner.name}</Text>
              <View style={styles.runnerMeta}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Lv.{mockRunner.level} Trusted</Text>
                </View>
                <Text style={styles.runnerStat}>⭐ {mockRunner.rating}</Text>
                <Text style={styles.runnerStat}>{mockRunner.jobs} jobs</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.chatBtn}>
              <Text style={styles.chatBtnText}>💬 Chat</Text>
            </TouchableOpacity>
          </View>

          {/* Progress */}
          <Text style={styles.sectionTitle}>Errand Progress</Text>
          <View style={styles.progressSteps}>
            {steps.map((step, i) => {
              const isDone = i < currentStep;
              const isCurrent = i === currentStep;
              return (
                <View key={step.id} style={styles.stepRow}>
                  <View style={styles.stepLeft}>
                    <View
                      style={[
                        styles.stepCircle,
                        isDone && styles.stepDone,
                        isCurrent && styles.stepCurrent,
                      ]}
                    >
                      <Text style={styles.stepIcon}>{isDone ? '✓' : step.emoji}</Text>
                    </View>
                    {i < steps.length - 1 && (
                      <View
                        style={[styles.stepConnector, isDone && styles.stepConnectorDone]}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isDone && styles.stepLabelDone,
                      isCurrent && styles.stepLabelCurrent,
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Errand details */}
          <View style={styles.errandDetails}>
            <Text style={styles.sectionTitle}>Errand Details</Text>
            <Text style={styles.errandTitle}>{errand?.title}</Text>
            <View style={styles.locRow}>
              <View style={[styles.locDot, { backgroundColor: Colors.primary }]} />
              <Text style={styles.locText}>{errand?.pickupLocation.address}</Text>
            </View>
            <View style={styles.locRow}>
              <View style={[styles.locDot, { backgroundColor: Colors.accent }]} />
              <Text style={styles.locText}>{errand?.dropoffLocation.address}</Text>
            </View>
          </View>

          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryDark },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  backArrow: { fontSize: 18, color: Colors.white },
  headerTitle: { flex: 1, fontSize: FontSize.lg, fontWeight: '700', color: Colors.white },
  sosBtn: {
    backgroundColor: Colors.error,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
  },
  sosText: { color: Colors.white, fontWeight: '900', fontSize: FontSize.sm },
  mapArea: {
    height: 240,
    backgroundColor: '#e8f5ee',
    position: 'relative',
    overflow: 'hidden',
  },
  street: {
    position: 'absolute',
    backgroundColor: 'rgba(27,107,69,0.12)',
  },
  mapLabel: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    ...Shadow.xs,
  },
  mapLabelText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary },
  mapMarker: { position: 'absolute', alignItems: 'center' },
  markerBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.xs,
  },
  markerBubbleText: {
    fontSize: FontSize.sm,
    fontWeight: '900',
    color: Colors.white,
  },
  markerLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 3,
    ...Shadow.xs,
  },
  runnerPosition: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  runnerPulseRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    opacity: 0.4,
  },
  runnerMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.card,
  },
  runnerMarkerEmoji: { fontSize: 20 },
  etaBadge: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    ...Shadow.strong,
  },
  etaLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '700',
    letterSpacing: 1,
  },
  etaValue: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.white },
  sheet: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -Radius.xl,
    padding: Spacing.lg,
    ...Shadow.strong,
  },
  runnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  runnerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  runnerAvatarText: { color: Colors.white, fontWeight: '900', fontSize: FontSize.lg },
  runnerInfo: { flex: 1 },
  runnerName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  runnerMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  levelBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  levelText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary },
  runnerStat: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '500' },
  chatBtn: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  chatBtnText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.sm },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  progressSteps: { marginBottom: Spacing.lg },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 },
  stepLeft: { alignItems: 'center', marginRight: Spacing.md },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDone: { backgroundColor: Colors.primary },
  stepCurrent: { backgroundColor: Colors.accent },
  stepConnector: {
    width: 2,
    height: 22,
    backgroundColor: Colors.border,
    marginTop: 3,
  },
  stepConnectorDone: { backgroundColor: Colors.primary },
  stepIcon: { fontSize: 15, color: Colors.white },
  stepLabel: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    paddingTop: 9,
    flex: 1,
    lineHeight: 22,
  },
  stepLabelDone: { color: Colors.textSecondary },
  stepLabelCurrent: { color: Colors.textPrimary, fontWeight: '700' },
  errandDetails: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  errandTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 8,
  },
  locDot: { width: 8, height: 8, borderRadius: 4 },
  locText: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
});
