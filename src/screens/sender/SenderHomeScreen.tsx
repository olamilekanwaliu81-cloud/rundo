import React, { useRef, useEffect } from 'react';
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
import { useStore } from '../../store/useStore';
import { Errand } from '../../types';
import { AnimatedCard } from '../../components/AnimatedCard';

const statusColors: Record<string, string> = {
  pending: Colors.warning,
  matched: Colors.primary,
  in_progress: Colors.primaryVivid,
  delivered: Colors.success,
  confirmed: Colors.success,
  cancelled: Colors.error,
  disputed: Colors.error,
};

const statusLabels: Record<string, string> = {
  pending: 'Finding runner…',
  matched: 'Runner assigned',
  in_progress: 'On the way',
  delivered: 'Delivered',
  confirmed: 'Completed ✓',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
};

function ErrandCard({ errand, onPress, delay }: { errand: Errand; onPress: () => void; delay: number }) {
  return (
    <AnimatedCard onPress={onPress} delay={delay} style={styles.errandCard}>
      <View style={styles.errandCardHeader}>
        <View style={[styles.statusPill, { backgroundColor: statusColors[errand.status] + '22' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColors[errand.status] }]} />
          <Text style={[styles.errandStatus, { color: statusColors[errand.status] }]}>
            {statusLabels[errand.status]}
          </Text>
        </View>
        <Text style={styles.errandPrice}>₦{errand.price.toLocaleString()}</Text>
      </View>
      <Text style={styles.errandTitle} numberOfLines={1}>
        {errand.title}
      </Text>
      <View style={styles.locationRow}>
        <View style={styles.locationPill}>
          <Text style={styles.locationLabel}>FROM</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {errand.pickupLocation.address}
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
        <View style={styles.locationPill}>
          <Text style={styles.locationLabel}>TO</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {errand.dropoffLocation.address}
          </Text>
        </View>
      </View>
    </AnimatedCard>
  );
}

const quickActions = [
  { emoji: '🏃', label: 'Run\nErrand' },
  { emoji: '📄', label: 'Pick Up\nDocs' },
  { emoji: '🛒', label: 'Buy\nItems' },
  { emoji: '📦', label: 'Receive\nPackage' },
];

export default function SenderHomeScreen({ navigation }: any) {
  const { user, errands } = useStore();
  const myErrands = errands.filter((e) => e.senderId === 'user1').slice(0, 5);
  const activeErrands = myErrands.filter((e) =>
    ['pending', 'matched', 'in_progress'].includes(e.status)
  );

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-16)).current;
  const postBtnAnim = useRef(new Animated.Value(0)).current;
  const postBtnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
    ]).start();

    Animated.sequence([
      Animated.delay(300),
      Animated.timing(postBtnAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const handlePostPressIn = () => {
    Animated.spring(postBtnScale, { toValue: 0.97, tension: 200, friction: 10, useNativeDriver: true }).start();
  };
  const handlePostPressOut = () => {
    Animated.spring(postBtnScale, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.headerContent,
            { opacity: headerOpacity, transform: [{ translateY: headerSlide }] },
          ]}
        >
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.userName}>{user?.name || 'Friend'}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <View style={styles.notifRing}>
              <Text style={styles.notifIcon}>🔔</Text>
              <View style={styles.notifDot} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Post errand CTA */}
        <Animated.View
          style={{
            opacity: postBtnAnim,
            transform: [{ scale: postBtnScale }],
            marginBottom: Spacing.lg,
          }}
        >
          <TouchableOpacity
            style={styles.postBtn}
            onPress={() => navigation.navigate('ErrandForm')}
            onPressIn={handlePostPressIn}
            onPressOut={handlePostPressOut}
            activeOpacity={1}
          >
            <View style={styles.postBtnLeft}>
              <Text style={styles.postBtnLabel}>What do you need done?</Text>
              <Text style={styles.postBtnSub}>Tap to post an errand now</Text>
            </View>
            <View style={styles.postBtnIcon}>
              <Text style={styles.postBtnPlus}>+</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick actions */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.quickGrid}>
          {quickActions.map((qa, i) => (
            <AnimatedCard
              key={qa.label}
              onPress={() => navigation.navigate('ErrandForm')}
              delay={i * 60}
              style={styles.quickCard}
            >
              <Text style={styles.qaEmoji}>{qa.emoji}</Text>
              <Text style={styles.qaLabel}>{qa.label}</Text>
            </AnimatedCard>
          ))}
        </View>

        {/* Active errands */}
        {activeErrands.length > 0 && (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Active Errands</Text>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>{activeErrands.length} live</Text>
              </View>
            </View>
            {activeErrands.map((errand, i) => (
              <ErrandCard
                key={errand.id}
                errand={errand}
                delay={i * 80}
                onPress={() => navigation.navigate('Tracking', { errandId: errand.id })}
              />
            ))}
          </>
        )}

        {/* Recent errands */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recent Errands</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {myErrands.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>No errands yet</Text>
            <Text style={styles.emptyText}>Post your first errand and get it done fast.</Text>
          </View>
        ) : (
          myErrands.map((errand, i) => (
            <ErrandCard
              key={errand.id}
              errand={errand}
              delay={i * 60}
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
    backgroundColor: Colors.primaryDark,
    paddingTop: 56,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 2,
    fontWeight: '500',
  },
  userName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  notifBtn: {},
  notifRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifIcon: { fontSize: 20 },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.accent,
    borderWidth: 1.5,
    borderColor: Colors.primaryDark,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingTop: Spacing.lg },
  postBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadow.strong,
  },
  postBtnLeft: { flex: 1 },
  postBtnLabel: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white, marginBottom: 3 },
  postBtnSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.65)' },
  postBtnIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
  postBtnPlus: { fontSize: 28, color: Colors.primaryDeep, fontWeight: '900', lineHeight: 32 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  seeAll: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  activeBadge: {
    backgroundColor: Colors.success + '22',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  activeBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.success,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  quickCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadow.xs,
  },
  qaEmoji: { fontSize: 26, marginBottom: 6 },
  qaLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 16,
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
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  errandStatus: { fontSize: FontSize.xs, fontWeight: '700' },
  errandPrice: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
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
  locationPill: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    padding: 7,
  },
  locationLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    marginBottom: 1,
    letterSpacing: 0.5,
  },
  locationText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  arrow: { fontSize: 18, color: Colors.textMuted, paddingHorizontal: 2 },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    ...Shadow.xs,
  },
  emptyEmoji: { fontSize: 52, marginBottom: Spacing.md },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
});
