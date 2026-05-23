import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';
import { PremiumButton } from '../../components/PremiumButton';

const phases = [
  { id: 'accepted', label: 'Errand Accepted' },
  { id: 'heading', label: 'Heading to Pickup' },
  { id: 'pickup_photo', label: 'Photo at Pickup' },
  { id: 'in_transit', label: 'In Transit' },
  { id: 'dropoff_photo', label: 'Photo at Drop-off' },
  { id: 'done', label: 'Confirmed & Paid' },
];

export default function ActiveErrandScreen({ route, navigation }: any) {
  const errand = route?.params?.errand || {
    id: 'a1',
    title: 'Collect ATM card from UBA Ikeja',
    description: 'Pick up ATM card from UBA Ikeja branch.',
    pickupLocation: { address: 'UBA Bank, Ikeja, Lagos' },
    dropoffLocation: { address: 'Oregun, Ikeja, Lagos' },
    price: 1800,
    itemValue: 5000,
  };

  const [phase, setPhase] = useState(1);
  const [pickupPhoto, setPickupPhoto] = useState(false);
  const [dropoffPhoto, setDropoffPhoto] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const earningsAnim = useRef(new Animated.Value(0.8)).current;
  const earningsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(earningsAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(earningsOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleTakePhoto = (type: 'pickup' | 'dropoff') => {
    Alert.alert(
      `📸 ${type === 'pickup' ? 'Pickup' : 'Drop-off'} Photo`,
      'Take a clear photo of the item. This is mandatory and visible to the sender.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Take Photo',
          onPress: () => {
            if (type === 'pickup') {
              setPickupPhoto(true);
              setPhase(3);
            } else {
              setDropoffPhoto(true);
              setPhase(5);
            }
          },
        },
      ]
    );
  };

  const handleComplete = () => {
    Alert.alert(
      '🎉 Errand Complete!',
      `₦${(errand.price * 0.8).toLocaleString()} will be released to your wallet once the sender confirms.`,
      [{ text: 'View Earnings', onPress: () => navigation.navigate('Earnings') }]
    );
  };

  const ctaConfig = [
    { label: 'Navigate to Pickup  →', action: () => setPhase(2), variant: 'primary' as const },
    {
      label: '📍  I\'m at Pickup — Take Photo',
      action: () => handleTakePhoto('pickup'),
      variant: 'primary' as const,
    },
    { label: 'Navigate to Drop-off  →', action: () => setPhase(4), variant: 'primary' as const },
    {
      label: '📍  I\'m at Drop-off — Take Photo',
      action: () => handleTakePhoto('dropoff'),
      variant: 'primary' as const,
    },
    {
      label: '✅  Mark as Delivered',
      action: handleComplete,
      variant: 'accent' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Errand</Text>
        <TouchableOpacity style={styles.sosBtn}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Earnings banner */}
      <Animated.View
        style={[
          styles.earningsBanner,
          { opacity: earningsOpacity, transform: [{ scale: earningsAnim }] },
        ]}
      >
        <View style={styles.earningsLeft}>
          <Text style={styles.earningsLabel}>You earn for this errand</Text>
          <Text style={styles.earningsAmount}>₦{(errand.price * 0.8).toLocaleString()}</Text>
        </View>
        <View style={styles.escrowBadge}>
          <Text style={styles.escrowEmoji}>🔒</Text>
          <Text style={styles.escrowText}>In Escrow</Text>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Errand info card */}
        <View style={styles.errandCard}>
          <Text style={styles.errandTitle}>{errand.title}</Text>
          <Text style={styles.errandDesc}>{errand.description}</Text>

          <View style={styles.routeBlock}>
            <View style={styles.routeRow}>
              <View style={[styles.routeIconCircle, { backgroundColor: Colors.primaryLight }]}>
                <Text style={styles.routeEmoji}>📍</Text>
              </View>
              <View style={styles.routeDetails}>
                <Text style={styles.routeMiniLabel}>PICKUP</Text>
                <Text style={styles.routeAddress}>{errand.pickupLocation.address}</Text>
              </View>
            </View>

            <View style={styles.routeConnector}>
              <View style={styles.routeLine} />
            </View>

            <View style={styles.routeRow}>
              <View style={[styles.routeIconCircle, { backgroundColor: Colors.accentLight }]}>
                <Text style={styles.routeEmoji}>🎯</Text>
              </View>
              <View style={styles.routeDetails}>
                <Text style={styles.routeMiniLabel}>DROP-OFF</Text>
                <Text style={styles.routeAddress}>{errand.dropoffLocation.address}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Phase progress */}
        <Text style={styles.sectionTitle}>Progress</Text>
        <View style={styles.progressCard}>
          {phases.map((p, i) => {
            const done = i < phase;
            const current = i === phase;
            return (
              <View key={p.id} style={styles.phaseRow}>
                <View style={styles.phaseLeft}>
                  <View
                    style={[
                      styles.phaseDot,
                      done && styles.phaseDotDone,
                      current && styles.phaseDotCurrent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.phaseDotText,
                        (done || current) && { color: Colors.white },
                      ]}
                    >
                      {done ? '✓' : (i + 1).toString()}
                    </Text>
                  </View>
                  {i < phases.length - 1 && (
                    <View style={[styles.phaseLine, done && styles.phaseLineDone]} />
                  )}
                </View>
                <Text
                  style={[
                    styles.phaseLabel,
                    done && styles.phaseLabelDone,
                    current && styles.phaseLabelCurrent,
                  ]}
                >
                  {p.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Photos captured */}
        {(pickupPhoto || dropoffPhoto) && (
          <View style={styles.photosSection}>
            <Text style={styles.sectionTitle}>Photos Taken</Text>
            <View style={styles.photosRow}>
              {pickupPhoto && (
                <View style={styles.photoCard}>
                  <View style={[styles.photoPlaceholder, { borderColor: Colors.primary }]}>
                    <Text style={styles.photoEmoji}>📸</Text>
                    <Text style={styles.photoCardText}>Pickup Photo{'\n'}Captured ✓</Text>
                  </View>
                  <Text style={styles.photoLabel}>Pickup</Text>
                </View>
              )}
              {dropoffPhoto && (
                <View style={styles.photoCard}>
                  <View style={[styles.photoPlaceholder, { borderColor: Colors.accent }]}>
                    <Text style={styles.photoEmoji}>📸</Text>
                    <Text style={styles.photoCardText}>Drop-off Photo{'\n'}Captured ✓</Text>
                  </View>
                  <Text style={styles.photoLabel}>Drop-off</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CTA Footer */}
      {phase < ctaConfig.length && (
        <View style={styles.footer}>
          <PremiumButton
            label={ctaConfig[phase].label}
            variant={ctaConfig[phase].variant}
            onPress={ctaConfig[phase].action}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
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
  earningsBanner: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  earningsLeft: { flex: 1 },
  earningsLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  earningsAmount: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.white },
  escrowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
  },
  escrowEmoji: { fontSize: 13 },
  escrowText: { fontSize: FontSize.xs, color: Colors.white, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg },
  errandCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  errandTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  errandDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  routeBlock: {},
  routeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  routeIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeEmoji: { fontSize: 18 },
  routeDetails: { flex: 1, paddingTop: 2 },
  routeMiniLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  routeAddress: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  routeConnector: { paddingLeft: 18, paddingVertical: 4 },
  routeLine: { width: 2, height: 20, backgroundColor: Colors.border },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  progressCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  phaseRow: { flexDirection: 'row', alignItems: 'flex-start' },
  phaseLeft: { alignItems: 'center', marginRight: Spacing.md },
  phaseDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseDotDone: { backgroundColor: Colors.primary },
  phaseDotCurrent: { backgroundColor: Colors.accent },
  phaseDotText: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  phaseLine: {
    width: 2,
    height: 22,
    backgroundColor: Colors.border,
    marginTop: 3,
  },
  phaseLineDone: { backgroundColor: Colors.primary },
  phaseLabel: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    paddingTop: 6,
    flex: 1,
    lineHeight: 22,
    paddingBottom: 12,
  },
  phaseLabelDone: { color: Colors.textSecondary },
  phaseLabelCurrent: { color: Colors.textPrimary, fontWeight: '700' },
  photosSection: { marginBottom: Spacing.lg },
  photosRow: { flexDirection: 'row', gap: Spacing.md },
  photoCard: { flex: 1 },
  photoPlaceholder: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  photoEmoji: { fontSize: 22 },
  photoCardText: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
    lineHeight: 16,
  },
  photoLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
