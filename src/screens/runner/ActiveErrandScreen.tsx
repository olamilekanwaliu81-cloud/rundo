import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';

const phases = [
  { id: 'accepted', label: 'Errand Accepted', done: true },
  { id: 'heading', label: 'Heading to Pickup', done: true },
  { id: 'pickup_photo', label: 'Photo at Pickup', done: false },
  { id: 'in_transit', label: 'In Transit', done: false },
  { id: 'dropoff_photo', label: 'Photo at Drop-off', done: false },
  { id: 'done', label: 'Confirmed & Paid', done: false },
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
  const [pickupPhoto, setPickupPhoto] = useState<string | null>(null);
  const [dropoffPhoto, setDropoffPhoto] = useState<string | null>(null);

  const handleTakePhoto = (type: 'pickup' | 'dropoff') => {
    Alert.alert(
      `📸 ${type === 'pickup' ? 'Pickup' : 'Drop-off'} Photo`,
      'Take a clear photo of the item. This is mandatory and visible to the sender.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Take Photo',
          onPress: () => {
            // In production: expo-camera or expo-image-picker
            const mockPhoto = 'https://via.placeholder.com/300x200';
            if (type === 'pickup') {
              setPickupPhoto(mockPhoto);
              setPhase(3);
            } else {
              setDropoffPhoto(mockPhoto);
              setPhase(5);
            }
          },
        },
      ]
    );
  };

  const handleComplete = () => {
    Alert.alert(
      '✅ Errand Complete!',
      `₦${(errand.price * 0.8).toLocaleString()} will be released to your wallet once the sender confirms.`,
      [{ text: 'View Earnings', onPress: () => navigation.navigate('Earnings') }]
    );
  };

  const ctaConfig = [
    { label: 'Navigate to Pickup →', action: () => setPhase(2) },
    { label: '📍 I\'m at Pickup — Take Photo', action: () => handleTakePhoto('pickup') },
    { label: 'Navigate to Drop-off →', action: () => setPhase(4) },
    { label: '📍 I\'m at Drop-off — Take Photo', action: () => handleTakePhoto('dropoff') },
    { label: '✅ Mark as Delivered', action: handleComplete },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Errand</Text>
        <TouchableOpacity style={styles.sosBtn}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Earnings bar */}
        <View style={styles.earningsBar}>
          <Text style={styles.earningsLabel}>You earn</Text>
          <Text style={styles.earningsAmount}>₦{(errand.price * 0.8).toLocaleString()}</Text>
          <View style={styles.escrowBadge}>
            <Text style={styles.escrowText}>🔒 In Escrow</Text>
          </View>
        </View>

        {/* Errand info */}
        <View style={styles.errandCard}>
          <Text style={styles.errandTitle}>{errand.title}</Text>
          <Text style={styles.errandDesc}>{errand.description}</Text>

          <View style={styles.locationBlock}>
            <View style={styles.locRow}>
              <View style={[styles.locIcon, { backgroundColor: Colors.primaryLight }]}>
                <Text style={styles.locEmoji}>📍</Text>
              </View>
              <View>
                <Text style={styles.locLabel}>PICKUP</Text>
                <Text style={styles.locAddress}>{errand.pickupLocation.address}</Text>
              </View>
            </View>
            <View style={styles.locConnector} />
            <View style={styles.locRow}>
              <View style={[styles.locIcon, { backgroundColor: Colors.accentLight }]}>
                <Text style={styles.locEmoji}>🎯</Text>
              </View>
              <View>
                <Text style={styles.locLabel}>DROP-OFF</Text>
                <Text style={styles.locAddress}>{errand.dropoffLocation.address}</Text>
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
                <View style={[styles.phaseDot, done && styles.phaseDotDone, current && styles.phaseDotCurrent]}>
                  <Text style={[styles.phaseDotText, (done || current) && { color: Colors.white }]}>
                    {done ? '✓' : (i + 1).toString()}
                  </Text>
                </View>
                {i < phases.length - 1 && (
                  <View style={[styles.phaseLine, done && styles.phaseLineDone]} />
                )}
                <Text style={[styles.phaseLabel, done && styles.phaseLabelDone, current && styles.phaseLabelCurrent]}>
                  {p.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Photos */}
        {(pickupPhoto || dropoffPhoto) && (
          <View style={styles.photosSection}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <View style={styles.photosRow}>
              {pickupPhoto && (
                <View style={styles.photoCard}>
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoPlaceholderText}>📸 Pickup Photo\nCaptured</Text>
                  </View>
                  <Text style={styles.photoLabel}>Pickup</Text>
                </View>
              )}
              {dropoffPhoto && (
                <View style={styles.photoCard}>
                  <View style={[styles.photoPlaceholder, { backgroundColor: Colors.accentLight }]}>
                    <Text style={styles.photoPlaceholderText}>📸 Drop-off Photo\nCaptured</Text>
                  </View>
                  <Text style={styles.photoLabel}>Drop-off</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CTA */}
      {phase < ctaConfig.length && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={ctaConfig[phase].action}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>{ctaConfig[phase].label}</Text>
          </TouchableOpacity>
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
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backArrow: { fontSize: 24, color: Colors.textPrimary, marginRight: Spacing.md },
  headerTitle: { flex: 1, fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  sosBtn: {
    backgroundColor: Colors.error,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  sosText: { color: Colors.white, fontWeight: '800', fontSize: FontSize.sm },
  scroll: { flex: 1 },
  earningsBar: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  earningsLabel: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', flex: 1 },
  earningsAmount: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  escrowBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  escrowText: { fontSize: FontSize.xs, color: Colors.white, fontWeight: '600' },
  errandCard: {
    backgroundColor: Colors.white,
    margin: Spacing.lg,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  errandTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  errandDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.lg },
  locationBlock: {},
  locRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  locIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  locEmoji: { fontSize: 18 },
  locConnector: { width: 2, height: 20, backgroundColor: Colors.border, marginLeft: 17, marginVertical: 4 },
  locLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1, marginBottom: 2 },
  locAddress: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  progressCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  phaseRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  phaseDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  phaseDotDone: { backgroundColor: Colors.primary },
  phaseDotCurrent: { backgroundColor: Colors.accent },
  phaseDotText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textMuted },
  phaseLine: { position: 'absolute', left: 13, top: 28, width: 2, height: 20, backgroundColor: Colors.border },
  phaseLineDone: { backgroundColor: Colors.primary },
  phaseLabel: { fontSize: FontSize.md, color: Colors.textMuted, paddingTop: 4 },
  phaseLabelDone: { color: Colors.textSecondary },
  phaseLabelCurrent: { color: Colors.textPrimary, fontWeight: '700' },
  photosSection: { marginBottom: Spacing.lg },
  photosRow: { flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.lg },
  photoCard: { flex: 1 },
  photoPlaceholder: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  photoPlaceholderText: { textAlign: 'center', fontSize: FontSize.sm, color: Colors.primary },
  photoLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', fontWeight: '600' },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaBtnText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '700' },
});
