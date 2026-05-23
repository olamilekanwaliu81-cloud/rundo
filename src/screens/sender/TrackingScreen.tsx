import React, { useState, useEffect } from 'react';
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
  { id: 'matched', icon: '✅', label: 'Runner matched', done: true },
  { id: 'heading', icon: '🏃', label: 'Heading to pickup', done: true },
  { id: 'pickup', icon: '📸', label: 'Item photographed at pickup', done: false },
  { id: 'transit', icon: '🗺️', label: 'On the way to you', done: false },
  { id: 'delivered', icon: '📦', label: 'Delivered', done: false },
];

const mockRunner = {
  name: 'Tunde Adesanya',
  level: 2,
  rating: 4.7,
  jobs: 34,
  eta: '18 mins',
  phone: '+234 803 000 1122',
};

export default function TrackingScreen({ route, navigation }: any) {
  const { errandId } = route.params || {};
  const { errands } = useStore();
  const errand = errands.find((e) => e.id === errandId) || errands[0];
  const [currentStep, setCurrentStep] = useState(1);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Simulate progress
    const timer = setInterval(() => {
      setCurrentStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Tracking</Text>
        <TouchableOpacity style={styles.sosBtn}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Map placeholder */}
      <View style={styles.mapArea}>
        <View style={styles.mapGrid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} style={styles.mapGridLine} />
          ))}
        </View>
        <Text style={styles.mapLabel}>📍 Lagos, Nigeria</Text>

        {/* Pickup marker */}
        <View style={[styles.mapMarker, { top: '30%', left: '25%' }]}>
          <Text style={styles.markerIcon}>🟢</Text>
          <Text style={styles.markerLabel}>Pickup</Text>
        </View>

        {/* Dropoff marker */}
        <View style={[styles.mapMarker, { top: '60%', right: '20%' }]}>
          <Text style={styles.markerIcon}>🔴</Text>
          <Text style={styles.markerLabel}>Drop-off</Text>
        </View>

        {/* Runner position (animated) */}
        <Animated.View
          style={[
            styles.runnerMarker,
            { top: '42%', left: '40%', transform: [{ scale: pulseAnim }] },
          ]}
        >
          <View style={styles.runnerPulse} />
          <Text style={styles.runnerMarkerIcon}>🏃</Text>
        </Animated.View>

        {/* ETA badge */}
        <View style={styles.etaBadge}>
          <Text style={styles.etaLabel}>ETA</Text>
          <Text style={styles.etaValue}>{mockRunner.eta}</Text>
        </View>
      </View>

      {/* Bottom sheet */}
      <ScrollView style={styles.sheet} showsVerticalScrollIndicator={false}>
        {/* Runner info */}
        <View style={styles.runnerCard}>
          <View style={styles.runnerAvatar}>
            <Text style={styles.runnerAvatarText}>
              {mockRunner.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.runnerInfo}>
            <Text style={styles.runnerName}>{mockRunner.name}</Text>
            <View style={styles.runnerMeta}>
              <View style={[styles.levelBadge, { backgroundColor: Colors.primaryLight }]}>
                <Text style={[styles.levelText, { color: Colors.primary }]}>
                  Level {mockRunner.level} Trusted
                </Text>
              </View>
              <Text style={styles.runnerRating}>⭐ {mockRunner.rating}</Text>
              <Text style={styles.runnerJobs}>{mockRunner.jobs} jobs</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Text style={styles.callBtnText}>💬 Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Progress steps */}
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
                    <Text style={styles.stepIcon}>{isDone ? '✓' : step.icon}</Text>
                  </View>
                  {i < steps.length - 1 && (
                    <View style={[styles.stepConnector, isDone && styles.stepConnectorDone]} />
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
          <Text style={styles.sectionTitle}>Errand</Text>
          <Text style={styles.errandTitle}>{errand?.title}</Text>
          <View style={styles.errandLocations}>
            <Text style={styles.locText}>📍 {errand?.pickupLocation.address}</Text>
            <Text style={styles.locText}>🎯 {errand?.dropoffLocation.address}</Text>
          </View>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.md,
  },
  backArrow: { fontSize: 24, color: Colors.white, marginRight: Spacing.md },
  headerTitle: { flex: 1, fontSize: FontSize.lg, fontWeight: '700', color: Colors.white },
  sosBtn: {
    backgroundColor: Colors.error,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  sosText: { color: Colors.white, fontWeight: '800', fontSize: FontSize.sm },
  mapArea: {
    height: 260,
    backgroundColor: '#d4edda',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mapGridLine: {
    width: '8.33%',
    height: '100%',
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(27,107,69,0.1)',
  },
  mapLabel: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  mapMarker: { position: 'absolute', alignItems: 'center' },
  markerIcon: { fontSize: 20 },
  markerLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  runnerMarker: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  runnerPulse: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(27,107,69,0.2)',
  },
  runnerMarkerIcon: { fontSize: 28 },
  etaBadge: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  etaLabel: { fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  etaValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  sheet: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -Radius.xl,
    padding: Spacing.lg,
  },
  runnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
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
  runnerAvatarText: { color: Colors.white, fontWeight: '800', fontSize: FontSize.lg },
  runnerInfo: { flex: 1 },
  runnerName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  runnerMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  levelBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  levelText: { fontSize: FontSize.xs, fontWeight: '700' },
  runnerRating: { fontSize: FontSize.xs, color: Colors.textSecondary },
  runnerJobs: { fontSize: FontSize.xs, color: Colors.textSecondary },
  callBtn: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  callBtnText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.sm },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  progressSteps: { marginBottom: Spacing.lg },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
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
  stepConnector: { width: 2, height: 24, backgroundColor: Colors.border, marginTop: 2 },
  stepConnectorDone: { backgroundColor: Colors.primary },
  stepIcon: { fontSize: 14 },
  stepLabel: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    paddingTop: 8,
    flex: 1,
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
    marginBottom: Spacing.sm,
  },
  errandLocations: { gap: 6 },
  locText: { fontSize: FontSize.sm, color: Colors.textSecondary },
});
