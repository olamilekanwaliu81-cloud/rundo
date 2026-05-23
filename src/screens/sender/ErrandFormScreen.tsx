import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import { Errand } from '../../types';

const errandTypes = [
  { id: 'pickup', emoji: '📄', label: 'Pick Up' },
  { id: 'delivery', emoji: '📦', label: 'Delivery' },
  { id: 'shopping', emoji: '🛒', label: 'Shopping' },
  { id: 'queue', emoji: '⏳', label: 'Queue' },
  { id: 'other', emoji: '🏃', label: 'Other' },
];

export default function ErrandFormScreen({ navigation }: any) {
  const { addErrand } = useStore();
  const [type, setType] = useState('pickup');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [itemValue, setItemValue] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const isStep1Valid = !!(type && title && description);
  const isStep2Valid = !!(pickup && dropoff);
  const isStep3Valid = !!(itemValue && budget);

  const animateStep = (direction: 1 | -1) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30 * direction, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      slideAnim.setValue(30 * direction);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      ]).start();
    });
  };

  const goNext = () => {
    animateStep(1);
    setStep((s) => s + 1);
  };
  const goBack = () => {
    if (step > 1) {
      animateStep(-1);
      setStep((s) => s - 1);
    } else {
      navigation.goBack();
    }
  };

  const handlePost = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const newErrand: Errand = {
      id: 'errand_' + Date.now(),
      senderId: 'user1',
      title,
      description,
      pickupLocation: {
        address: pickup,
        latitude: 6.5244 + Math.random() * 0.1,
        longitude: 3.3792 + Math.random() * 0.1,
      },
      dropoffLocation: {
        address: dropoff,
        latitude: 6.4698 + Math.random() * 0.1,
        longitude: 3.5852 + Math.random() * 0.1,
      },
      itemValue: Number(itemValue),
      price: Number(budget),
      status: 'pending',
      createdAt: new Date(),
    };
    addErrand(newErrand);
    setLoading(false);
    Alert.alert(
      '🎉 Errand Posted!',
      "We're finding a verified runner near you. You'll be notified when one accepts.",
      [
        {
          text: 'Track it live',
          onPress: () => navigation.replace('Tracking', { errandId: newErrand.id }),
        },
      ]
    );
  };

  const stepTitles = [
    'What needs to be done?',
    'Where from and to?',
    'Set value & budget',
  ];

  const isCurrentValid = step === 1 ? isStep1Valid : step === 2 ? isStep2Valid : isStep3Valid;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post an Errand</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>{step}/3</Text>
        </View>
      </View>

      {/* Step progress */}
      <View style={styles.progressBar}>
        {[1, 2, 3].map((s) => (
          <Animated.View
            key={s}
            style={[styles.progressSegment, s <= step && styles.progressActive]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}
        >
          <Text style={styles.stepTitle}>{stepTitles[step - 1]}</Text>

          {/* Step 1 */}
          {step === 1 && (
            <View>
              <Text style={styles.label}>Errand Type</Text>
              <View style={styles.typeGrid}>
                {errandTypes.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.typeCard, type === t.id && styles.typeCardActive]}
                    onPress={() => setType(t.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.typeEmoji}>{t.emoji}</Text>
                    <Text style={[styles.typeLabel, type === t.id && styles.typeLabelActive]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Errand Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Collect documents from GTBank Ikeja"
                placeholderTextColor={Colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Describe exactly what needs to be done. Include any specific instructions for the runner."
                placeholderTextColor={Colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <View>
              <View style={styles.locationCard}>
                <View style={styles.locationVisual}>
                  <View style={[styles.locationDot, { backgroundColor: Colors.primary }]} />
                  <View style={styles.locationLine} />
                  <View style={[styles.locationDot, { backgroundColor: Colors.accent }]} />
                </View>

                <View style={styles.locationInputs}>
                  <View style={styles.locationInputGroup}>
                    <Text style={styles.locationMiniLabel}>PICKUP LOCATION</Text>
                    <TextInput
                      style={styles.locationInput}
                      placeholder="Where should the runner go first?"
                      placeholderTextColor={Colors.textMuted}
                      value={pickup}
                      onChangeText={setPickup}
                    />
                  </View>
                  <View style={styles.locationDivider} />
                  <View style={styles.locationInputGroup}>
                    <Text style={styles.locationMiniLabel}>DROP-OFF LOCATION</Text>
                    <TextInput
                      style={styles.locationInput}
                      placeholder="Where should it be delivered?"
                      placeholderTextColor={Colors.textMuted}
                      value={dropoff}
                      onChangeText={setDropoff}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>📍 Be specific</Text>
                <Text style={styles.infoText}>
                  Include street number, building name, or a landmark. E.g. "GTBank Ikeja, Allen
                  Avenue, opposite Chicken Republic."
                </Text>
              </View>
            </View>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <View>
              <Text style={styles.label}>Item Value (₦)</Text>
              <TextInput
                style={styles.input}
                placeholder="How much is the item worth?"
                placeholderTextColor={Colors.textMuted}
                value={itemValue}
                onChangeText={setItemValue}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Your Budget for Runner (₦)</Text>
              <TextInput
                style={styles.input}
                placeholder="How much will you pay the runner?"
                placeholderTextColor={Colors.textMuted}
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
              />

              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>💡 Pricing tip</Text>
                <Text style={styles.infoText}>
                  A fair budget for Lagos errands is ₦1,500–₦5,000 depending on distance and
                  task. Higher budgets attract runners faster.
                </Text>
              </View>

              {!!budget && (
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Payment Summary</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryKey}>Runner earns</Text>
                    <Text style={styles.summaryVal}>
                      ₦{(Number(budget) * 0.8).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryKey}>RUNDO service fee</Text>
                    <Text style={styles.summaryVal}>
                      ₦{(Number(budget) * 0.2 + 300).toLocaleString()}
                    </Text>
                  </View>
                  <View style={[styles.summaryRow, styles.summaryTotal]}>
                    <Text style={styles.summaryTotalKey}>Total you pay</Text>
                    <Text style={styles.summaryTotalVal}>
                      ₦{(Number(budget) + 300).toLocaleString()}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, !isCurrentValid && styles.btnDisabled]}
          onPress={() => (step < 3 ? goNext() : handlePost())}
          disabled={!isCurrentValid || loading}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.nextBtnText}>
              {step < 3 ? 'Next  →' : '🚀  Post Errand & Pay'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  backArrow: { fontSize: 18, color: Colors.textPrimary },
  headerTitle: {
    flex: 1,
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stepBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  stepBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: Colors.primary,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  progressActive: { backgroundColor: Colors.primary },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  stepTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    lineHeight: 28,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  textarea: { minHeight: 110 },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  typeCard: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  typeCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  typeEmoji: { fontSize: 20, marginBottom: 2 },
  typeLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },
  typeLabelActive: { color: Colors.primary },
  locationCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'stretch',
    ...Shadow.card,
  },
  locationVisual: {
    alignItems: 'center',
    marginRight: Spacing.md,
    paddingTop: Spacing.md,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  locationLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
    minHeight: 40,
  },
  locationInputs: { flex: 1 },
  locationInputGroup: { paddingVertical: Spacing.sm },
  locationMiniLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  locationInput: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    paddingBottom: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.border,
  },
  locationDivider: { height: 12 },
  infoBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  infoTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    ...Shadow.card,
  },
  summaryTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryKey: { fontSize: FontSize.sm, color: Colors.textSecondary },
  summaryVal: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
    marginBottom: 0,
  },
  summaryTotalKey: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  summaryTotalVal: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.primary },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 17,
    alignItems: 'center',
    ...Shadow.md,
  },
  btnDisabled: { backgroundColor: Colors.border, shadowOpacity: 0 },
  nextBtnText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '800' },
});
