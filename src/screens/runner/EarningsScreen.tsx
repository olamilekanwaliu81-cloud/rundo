import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';

const periods = ['Today', 'This Week', 'This Month'];

const mockHistory = [
  { id: '1', title: 'ATM card pickup - Ikeja', date: 'Today, 2:14 PM', amount: 1440, status: 'paid' },
  { id: '2', title: 'Buy groceries - Maryland', date: 'Today, 10:30 AM', amount: 2240, status: 'paid' },
  { id: '3', title: 'Document delivery - VI', date: 'Yesterday, 4:00 PM', amount: 3200, status: 'paid' },
  { id: '4', title: 'Package receive - Lekki', date: 'Yesterday, 1:00 PM', amount: 1200, status: 'paid' },
  { id: '5', title: 'Queue NIMC - Oshodi', date: 'Mon, 9:00 AM', amount: 2560, status: 'paid' },
];

const earningsByPeriod = [3680, 10640, 38400];

export default function EarningsScreen({ navigation }: any) {
  const [period, setPeriod] = useState(0);
  const level = 2;
  const jobsToNextLevel = 50 - 34;
  const progress = 34 / 50;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Earnings</Text>
        <TouchableOpacity style={styles.withdrawBtn}>
          <Text style={styles.withdrawText}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      {/* Main earnings card */}
      <View style={styles.earningsCard}>
        <View style={styles.periodTabs}>
          {periods.map((p, i) => (
            <TouchableOpacity
              key={p}
              style={[styles.tab, period === i && styles.tabActive]}
              onPress={() => setPeriod(i)}
            >
              <Text style={[styles.tabText, period === i && styles.tabTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.earningsAmount}>₦{earningsByPeriod[period].toLocaleString()}</Text>
        <Text style={styles.earningsSubtext}>
          {period === 0 ? '2 errands completed' : period === 1 ? '7 errands completed' : '24 errands completed'}
        </Text>

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
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Level progress */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={[styles.levelBadge, { backgroundColor: Colors.primaryLight }]}>
              <Text style={[styles.levelBadgeText, { color: Colors.primary }]}>Level {level} — Trusted</Text>
            </View>
            <Text style={styles.levelNext}>Level 3 in {jobsToNextLevel} jobs</Text>
          </View>

          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>34 / 50 jobs · 4.7 / 4.5 rating ✓</Text>

          <View style={styles.levelPerks}>
            <Text style={styles.levelPerksTitle}>Level 3 unlocks:</Text>
            <Text style={styles.levelPerksText}>No item value cap · High-value errands · Elite badge</Text>
          </View>
        </View>

        {/* Transaction history */}
        <Text style={styles.sectionTitle}>Recent Payouts</Text>
        {mockHistory.map((tx) => (
          <View key={tx.id} style={styles.txRow}>
            <View style={styles.txIcon}>
              <Text style={styles.txIconText}>💸</Text>
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txTitle} numberOfLines={1}>{tx.title}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
            <Text style={styles.txAmount}>+₦{tx.amount.toLocaleString()}</Text>
          </View>
        ))}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.lg,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  withdrawBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
  },
  withdrawText: { color: Colors.dark, fontWeight: '700', fontSize: FontSize.md },
  earningsCard: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  periodTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: Radius.md },
  tabActive: { backgroundColor: Colors.white },
  tabText: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  tabTextActive: { color: Colors.primary, fontWeight: '800' },
  earningsAmount: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -1,
    marginBottom: 4,
  },
  earningsSubtext: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginBottom: Spacing.lg },
  statRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white, marginBottom: 2 },
  statLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.65)' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
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
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  levelBadgeText: { fontSize: FontSize.sm, fontWeight: '700' },
  levelNext: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: Spacing.sm,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.md },
  levelPerks: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  levelPerksTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary, marginBottom: 2 },
  levelPerksText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  txIconText: { fontSize: 20 },
  txInfo: { flex: 1 },
  txTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  txDate: { fontSize: FontSize.xs, color: Colors.textMuted },
  txAmount: { fontSize: FontSize.md, fontWeight: '800', color: Colors.success },
});
