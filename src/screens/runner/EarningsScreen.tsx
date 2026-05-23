import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';

const periods = ['Today', 'This Week', 'This Month'];
const earningsByPeriod = [3680, 10640, 38400];
const errandsByPeriod = [2, 7, 24];

const mockHistory = [
  { id: '1', title: 'ATM card pickup - Ikeja', date: 'Today, 2:14 PM', amount: 1440 },
  { id: '2', title: 'Buy groceries - Maryland', date: 'Today, 10:30 AM', amount: 2240 },
  { id: '3', title: 'Document delivery - VI', date: 'Yesterday, 4:00 PM', amount: 3200 },
  { id: '4', title: 'Package receive - Lekki', date: 'Yesterday, 1:00 PM', amount: 1200 },
  { id: '5', title: 'Queue NIMC - Oshodi', date: 'Mon, 9:00 AM', amount: 2560 },
];

function TxRow({ tx, delay }: { tx: (typeof mockHistory)[0]; delay: number }) {
  const slideAnim = useRef(new Animated.Value(24)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.txRow,
        { opacity: opacityAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.txIconCircle}>
        <Text style={styles.txIconText}>💸</Text>
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txTitle} numberOfLines={1}>{tx.title}</Text>
        <Text style={styles.txDate}>{tx.date}</Text>
      </View>
      <Text style={styles.txAmount}>+₦{tx.amount.toLocaleString()}</Text>
    </Animated.View>
  );
}

export default function EarningsScreen() {
  const [period, setPeriod] = useState(0);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const amountScale = useRef(new Animated.Value(0.85)).current;
  const amountOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(amountScale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
      Animated.timing(amountOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // Re-animate amount on period change
  const animateAmount = () => {
    amountOpacity.setValue(0);
    amountScale.setValue(0.88);
    Animated.parallel([
      Animated.spring(amountScale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
      Animated.timing(amountOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const handlePeriod = (i: number) => {
    setPeriod(i);
    animateAmount();
  };

  const progress = 34 / 50;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Earnings</Text>
          <TouchableOpacity style={styles.withdrawBtn} activeOpacity={0.85}>
            <Text style={styles.withdrawText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Period tabs */}
        <View style={styles.periodTabs}>
          {periods.map((p, i) => (
            <TouchableOpacity
              key={p}
              style={[styles.tab, period === i && styles.tabActive]}
              onPress={() => handlePeriod(i)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, period === i && styles.tabTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount */}
        <Animated.View style={{ opacity: amountOpacity, transform: [{ scale: amountScale }] }}>
          <Text style={styles.earningsAmount}>
            ₦{earningsByPeriod[period].toLocaleString()}
          </Text>
          <Text style={styles.earningsSubtext}>
            {errandsByPeriod[period]} errands completed
          </Text>
        </Animated.View>

        {/* Stats */}
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>34</Text>
            <Text style={styles.statLabel}>Total jobs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>4.7 ⭐</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>₦0</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Level progress */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeEmoji}>⭐</Text>
              <Text style={styles.levelBadgeText}>Level 2 — Trusted</Text>
            </View>
            <Text style={styles.levelNext}>16 jobs to Elite</Text>
          </View>

          <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>34 / 50 jobs · Rating 4.7 ✓</Text>

          <View style={styles.levelPerks}>
            <Text style={styles.levelPerksTitle}>🏆  Elite unlocks:</Text>
            <Text style={styles.levelPerksText}>
              No item value cap · High-value errands · Elite badge · Priority matching
            </Text>
          </View>
        </View>

        {/* Transaction history */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recent Payouts</Text>
        </View>

        {mockHistory.map((tx, i) => (
          <TxRow key={tx.id} tx={tx} delay={i * 80} />
        ))}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primaryDark,
    paddingTop: 56,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  withdrawBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 9,
  },
  withdrawText: { color: Colors.primaryDeep, fontWeight: '800', fontSize: FontSize.sm },
  periodTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  tabActive: { backgroundColor: Colors.white },
  tabText: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },
  tabTextActive: { color: Colors.primary, fontWeight: '800' },
  earningsAmount: {
    fontSize: 52,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -1,
    marginBottom: 4,
  },
  earningsSubtext: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: Spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 3,
  },
  statLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.18)' },
  scroll: { flex: 1, padding: Spacing.lg },
  levelCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  levelBadgeEmoji: { fontSize: 14 },
  levelBadgeText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  levelNext: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: Spacing.xs,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    fontWeight: '500',
  },
  levelPerks: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  levelPerksTitle: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  levelPerksText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.xs,
  },
  txIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  txIconText: { fontSize: 20 },
  txInfo: { flex: 1 },
  txTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  txDate: { fontSize: FontSize.xs, color: Colors.textMuted },
  txAmount: { fontSize: FontSize.md, fontWeight: '800', color: Colors.success },
});
