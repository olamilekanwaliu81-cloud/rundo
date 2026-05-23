import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import { Errand } from '../../types';

const statusColors: Record<string, string> = {
  pending: Colors.warning,
  matched: Colors.primary,
  in_progress: Colors.primary,
  delivered: Colors.success,
  confirmed: Colors.success,
  cancelled: Colors.error,
  disputed: Colors.error,
};

const statusLabels: Record<string, string> = {
  pending: 'Looking for runner',
  matched: 'Runner assigned',
  in_progress: 'On the way',
  delivered: 'Delivered',
  confirmed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
};

function ErrandCard({ errand, onPress }: { errand: Errand; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.errandCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.errandCardHeader}>
        <View style={[styles.statusDot, { backgroundColor: statusColors[errand.status] }]} />
        <Text style={styles.errandStatus}>{statusLabels[errand.status]}</Text>
        <Text style={styles.errandPrice}>₦{errand.price.toLocaleString()}</Text>
      </View>
      <Text style={styles.errandTitle} numberOfLines={1}>{errand.title}</Text>
      <View style={styles.locationRow}>
        <View style={styles.locationPill}>
          <Text style={styles.locationLabel}>FROM</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {errand.pickupLocation.address}
          </Text>
        </View>
        <Text style={styles.arrow}>→</Text>
        <View style={styles.locationPill}>
          <Text style={styles.locationLabel}>TO</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {errand.dropoffLocation.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SenderHomeScreen({ navigation }: any) {
  const { user, errands } = useStore();
  const myErrands = errands.filter((e) => e.senderId === 'user1').slice(0, 5);
  const activeErrands = myErrands.filter((e) =>
    ['pending', 'matched', 'in_progress'].includes(e.status)
  );

  const quickActions = [
    { icon: '🏃', label: 'Run an\nErrand', onPress: () => navigation.navigate('ErrandForm') },
    { icon: '📄', label: 'Pick up\nDocuments', onPress: () => navigation.navigate('ErrandForm') },
    { icon: '🛒', label: 'Buy\nGroceries', onPress: () => navigation.navigate('ErrandForm') },
    { icon: '📦', label: 'Receive\nPackage', onPress: () => navigation.navigate('ErrandForm') },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day 👋</Text>
          <Text style={styles.userName}>{user?.name || 'Friend'}</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Text style={styles.notifIcon}>🔔</Text>
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Post errand CTA */}
        <TouchableOpacity
          style={styles.postBtn}
          onPress={() => navigation.navigate('ErrandForm')}
          activeOpacity={0.9}
        >
          <View>
            <Text style={styles.postBtnLabel}>What do you need done?</Text>
            <Text style={styles.postBtnSub}>Tap to post an errand</Text>
          </View>
          <View style={styles.postBtnIcon}>
            <Text style={{ fontSize: 24 }}>+</Text>
          </View>
        </TouchableOpacity>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((qa) => (
            <TouchableOpacity
              key={qa.label}
              style={styles.quickAction}
              onPress={qa.onPress}
              activeOpacity={0.8}
            >
              <Text style={styles.qaIcon}>{qa.icon}</Text>
              <Text style={styles.qaLabel}>{qa.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active errands */}
        {activeErrands.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active Errands</Text>
            {activeErrands.map((errand) => (
              <ErrandCard
                key={errand.id}
                errand={errand}
                onPress={() => navigation.navigate('Tracking', { errandId: errand.id })}
              />
            ))}
          </>
        )}

        {/* Past errands */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recent Errands</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        {myErrands.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No errands yet. Post your first one!</Text>
          </View>
        ) : (
          myErrands.map((errand) => (
            <ErrandCard
              key={errand.id}
              errand={errand}
              onPress={() => navigation.navigate('Tracking', { errandId: errand.id })}
            />
          ))
        )}
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
  greeting: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  userName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  notifBtn: { position: 'relative', padding: Spacing.xs },
  notifIcon: { fontSize: 22 },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  scroll: { flex: 1, padding: Spacing.lg },
  postBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginTop: -Spacing.sm,
    ...Shadow.strong,
  },
  postBtnLabel: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.white },
  postBtnSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  postBtnIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  seeAll: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  quickAction: {
    width: '22%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    ...Shadow.card,
  },
  qaIcon: { fontSize: 24, marginBottom: 4 },
  qaLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  errandCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  errandCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  errandStatus: { fontSize: FontSize.xs, color: Colors.textSecondary, flex: 1 },
  errandPrice: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  errandTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationPill: { flex: 1, backgroundColor: Colors.background, borderRadius: Radius.sm, padding: 6 },
  locationLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, marginBottom: 1 },
  locationText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  arrow: { fontSize: 16, color: Colors.textMuted, paddingHorizontal: 2 },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary },
});
