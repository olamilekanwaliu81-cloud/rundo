import React, { useState } from 'react';
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
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import { Errand } from '../../types';

const errandTypes = [
  { id: 'pickup', icon: '📄', label: 'Pick Up' },
  { id: 'delivery', icon: '📦', label: 'Delivery' },
  { id: 'shopping', icon: '🛒', label: 'Shopping' },
  { id: 'queue', icon: '⏳', label: 'Queue' },
  { id: 'other', icon: '🏃', label: 'Other' },
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

  const isStep1Valid = type && title && description;
  const isStep2Valid = pickup && dropoff;
  const isStep3Valid = itemValue && budget;

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
      'Errand Posted!',
      'We\'re finding a verified runner near you. You\'ll be notified when one accepts.',
      [{ text: 'Track it', onPress: () => navigation.replace('Tracking', { errandId: newErrand.id }) }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(s => s - 1) : navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post an Errand</Text>
        <Text style={styles.stepIndicator}>{step}/3</Text>
      </View>

      {/* Step progress */}
      <View style={styles.progressBar}>
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            style={[styles.progressSegment, s <= step && styles.progressActive]}
          />
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Step 1: Errand details */}
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>What needs to be done?</Text>

            <Text style={styles.label}>Errand Type</Text>
            <View style={styles.typeGrid}>
              {errandTypes.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.typeCard, type === t.id && styles.typeCardActive]}
                  onPress={() => setType(t.id)}
                >
                  <Text style={styles.typeIcon}>{t.icon}</Text>
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

        {/* Step 2: Locations */}
        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>Where from and to?</Text>

            <View style={styles.locationCard}>
              <View style={styles.locationDot} />
              <View style={styles.locationLine} />
              <View style={[styles.locationDot, styles.locationDotEnd]} />

              <View style={styles.locationInputs}>
                <View style={styles.locationInputGroup}>
                  <Text style={styles.locationLabel}>PICKUP LOCATION</Text>
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
                  <Text style={styles.locationLabel}>DROP-OFF LOCATION</Text>
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
                Include street number, building name, or landmark. E.g. "GTBank Ikeja, Allen Avenue, opposite Chicken Republic."
              </Text>
            </View>
          </View>
        )}

        {/* Step 3: Value & Budget */}
        {step === 3 && (
          <View>
            <Text style={styles.stepTitle}>Set the value & budget</Text>

            <Text style={styles.label}>Item Value (₦)</Text>
            <TextInput
              style={styles.input}
              placeholder="How much is the item worth?"
              placeholderTextColor={Colors.textMuted}
              value={itemValue}
              onChangeText={setItemValue}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Your Budget for the Errand (₦)</Text>
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
                A fair budget for Lagos errands is ₦1,500–₦5,000 depending on distance and task. Higher budgets attract runners faster.
              </Text>
            </View>

            {budget ? (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Payment Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Runner earns</Text>
                  <Text style={styles.summaryVal}>₦{(Number(budget) * 0.8).toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>RUNDO service fee</Text>
                  <Text style={styles.summaryVal}>₦{(Number(budget) * 0.2 + 300).toLocaleString()}</Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryTotal]}>
                  <Text style={styles.summaryTotalKey}>Total you pay</Text>
                  <Text style={styles.summaryTotalVal}>₦{(Number(budget) + 300).toLocaleString()}</Text>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextBtn,
            ((step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)) && styles.btnDisabled,
          ]}
          onPress={() => step < 3 ? setStep(s => s + 1) : handlePost()}
          disabled={
            (step === 1 && !isStep1Valid) ||
            (step === 2 && !isStep2Valid) ||
            (step === 3 && !isStep3Valid) ||
            loading
          }
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.nextBtnText}>
              {step < 3 ? `Next →` : '🚀 Post Errand & Pay'}
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
  backArrow: { fontSize: 24, color: Colors.textPrimary, marginRight: Spacing.md },
  headerTitle: { flex: 1, fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  stepIndicator: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
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
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  stepTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  textarea: { minHeight: 100 },
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
  typeIcon: { fontSize: 20, marginBottom: 2 },
  typeLabel: { fontSize: 9, color: Colors.textMuted, fontWeight: '600', textAlign: 'center' },
  typeLabelActive: { color: Colors.primary },
  locationCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    ...Shadow.card,
  },
  locationDot: {
    position: 'absolute',
    left: 28,
    top: 36,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    zIndex: 1,
  },
  locationLine: {
    position: 'absolute',
    left: 33,
    top: 52,
    width: 2,
    height: 40,
    backgroundColor: Colors.border,
  },
  locationDotEnd: {
    top: 96,
    backgroundColor: Colors.accent,
  },
  locationInputs: { flex: 1, marginLeft: Spacing.lg },
  locationInputGroup: { paddingVertical: Spacing.sm },
  locationLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  locationInput: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  locationDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.xs },
  infoBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  infoTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  infoText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
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
  },
  summaryTotalKey: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  summaryTotalVal: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnDisabled: { backgroundColor: Colors.border },
  nextBtnText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '700' },
});
