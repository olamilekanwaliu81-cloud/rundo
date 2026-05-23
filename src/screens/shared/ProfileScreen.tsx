import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Alert,
  Switch,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';
import { useStore } from '../../store/useStore';

// ─── Verification badge ───────────────────────────────────────────────────────
function VerifyBadge({
  label,
  status,
}: {
  label: string;
  status: 'verified' | 'pending' | 'unverified';
}) {
  const colors = {
    verified: { bg: Colors.successLight, text: Colors.success, dot: Colors.success },
    pending: { bg: Colors.warningLight, text: Colors.warning, dot: Colors.warning },
    unverified: { bg: Colors.background, text: Colors.textMuted, dot: Colors.textMuted },
  }[status];

  const icons = { verified: '✓', pending: '…', unverified: '!' };
  const labels = { verified: 'Verified', pending: 'Pending', unverified: 'Not submitted' };

  return (
    <View style={[styles.verifyBadge, { backgroundColor: colors.bg }]}>
      <View style={[styles.verifyDot, { backgroundColor: colors.dot }]}>
        <Text style={styles.verifyDotText}>{icons[status]}</Text>
      </View>
      <View>
        <Text style={[styles.verifyLabel, { color: Colors.textPrimary }]}>{label}</Text>
        <Text style={[styles.verifyStatus, { color: colors.text }]}>{labels[status]}</Text>
      </View>
    </View>
  );
}

// ─── Setting row ─────────────────────────────────────────────────────────────
function SettingRow({
  emoji,
  label,
  sublabel,
  onPress,
  danger,
  toggle,
  toggleValue,
  onToggle,
}: {
  emoji: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  danger?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
}) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={toggle ? 1 : 0.7}
      disabled={toggle}
    >
      <View style={[styles.settingIcon, danger && { backgroundColor: Colors.errorLight }]}>
        <Text style={styles.settingEmoji}>{emoji}</Text>
      </View>
      <View style={styles.settingText}>
        <Text style={[styles.settingLabel, danger && { color: Colors.error }]}>{label}</Text>
        {sublabel ? <Text style={styles.settingSubLabel}>{sublabel}</Text> : null}
      </View>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: Colors.border, true: Colors.primary }}
          thumbColor={Colors.white}
        />
      ) : (
        <Text style={[styles.chevron, danger && { color: Colors.error }]}>›</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Level pill ──────────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  1: { label: 'Starter', color: Colors.levelStarter, bg: Colors.background },
  2: { label: 'Trusted', color: Colors.levelTrusted, bg: Colors.primaryLight },
  3: { label: 'Elite', color: Colors.levelElite, bg: Colors.accentLight },
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }: any) {
  const { user, role } = useStore();
  const [notifEnabled, setNotifEnabled] = useState(true);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(0.92)).current;
  const contentSlide = useRef(new Animated.Value(32)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(headerScale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(contentSlide, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
        Animated.timing(contentOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const isRunner = role === 'runner';
  const level = 2 as 1 | 2 | 3;
  const levelCfg = LEVEL_CONFIG[level];

  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] }),
      },
    ]);
  };

  const handleSwitchRole = () => {
    Alert.alert(
      'Switch Role',
      `Switch to ${isRunner ? 'Sender' : 'Runner'} mode?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch',
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: isRunner ? 'SenderTabs' : 'RunnerTabs' }],
            }),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* ── Header ── */}
      <Animated.View
        style={[styles.header, { opacity: headerOpacity, transform: [{ scale: headerScale }] }]}
      >
        {/* Avatar */}
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userPhone}>{user?.phone || '—'}</Text>

        {/* Role + level badges */}
        <View style={styles.badgeRow}>
          <View style={[styles.roleBadge, { backgroundColor: isRunner ? Colors.accentLight : Colors.primaryLight }]}>
            <Text style={[styles.roleBadgeText, { color: isRunner ? Colors.accentDark : Colors.primary }]}>
              {isRunner ? '🏃 Runner' : '📦 Sender'}
            </Text>
          </View>
          {isRunner && (
            <View style={[styles.levelBadge, { backgroundColor: levelCfg.bg }]}>
              <Text style={[styles.levelBadgeText, { color: levelCfg.color }]}>
                ⭐ Lv.{level} {levelCfg.label}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.body,
          { opacity: contentOpacity, transform: [{ translateY: contentSlide }] },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* ── Stats ── */}
          <View style={styles.statsCard}>
            {isRunner ? (
              <>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>34</Text>
                  <Text style={styles.statLabel}>Jobs done</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>4.7</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>₦38k</Text>
                  <Text style={styles.statLabel}>Earned</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>5</Text>
                  <Text style={styles.statLabel}>Errands posted</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>4.9</Text>
                  <Text style={styles.statLabel}>Avg runner rating</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>₦12k</Text>
                  <Text style={styles.statLabel}>Total spent</Text>
                </View>
              </>
            )}
          </View>

          {/* ── Verification ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Identity Verification</Text>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>Required for errands</Text>
              </View>
            </View>

            <View style={styles.verifyCard}>
              <VerifyBadge label="NIN" status="pending" />
              <View style={styles.verifyDividerLine} />
              <VerifyBadge label="BVN" status="unverified" />
            </View>

            <TouchableOpacity style={styles.verifyCtaBtn} activeOpacity={0.85}>
              <Text style={styles.verifyCtaText}>🛡️  Complete Verification</Text>
            </TouchableOpacity>
            <Text style={styles.verifyNote}>
              Verified runners can accept higher-value errands and earn the Trusted badge.
            </Text>
          </View>

          {/* ── Runner level progress (runner only) ── */}
          {isRunner && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Level Progress</Text>
              <View style={styles.levelCard}>
                <View style={styles.levelCardHeader}>
                  <View style={[styles.levelPill, { backgroundColor: levelCfg.bg }]}>
                    <Text style={[styles.levelPillText, { color: levelCfg.color }]}>
                      Level {level} — {levelCfg.label}
                    </Text>
                  </View>
                  <Text style={styles.levelNextText}>16 jobs to Elite</Text>
                </View>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: '68%' }]} />
                </View>
                <Text style={styles.progressCaption}>34 / 50 jobs · Rating 4.7 / 4.5 ✓</Text>
                <View style={styles.unlockBox}>
                  <Text style={styles.unlockTitle}>🏆  Elite unlocks</Text>
                  <Text style={styles.unlockText}>
                    No item value cap · Priority job matching · Elite badge
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* ── Settings ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <View style={styles.settingsCard}>
              <SettingRow
                emoji="🔔"
                label="Push Notifications"
                sublabel="Errand updates & alerts"
                toggle
                toggleValue={notifEnabled}
                onToggle={setNotifEnabled}
              />
              <View style={styles.rowDivider} />
              <SettingRow
                emoji="💳"
                label="Payment Methods"
                sublabel="Add bank account or card"
                onPress={() => Alert.alert('Coming soon', 'Paystack integration coming soon.')}
              />
              <View style={styles.rowDivider} />
              <SettingRow
                emoji="🔄"
                label={`Switch to ${isRunner ? 'Sender' : 'Runner'} mode`}
                sublabel={isRunner ? 'Post errands instead' : 'Earn by running errands'}
                onPress={handleSwitchRole}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.settingsCard}>
              <SettingRow
                emoji="❓"
                label="Help & Support"
                onPress={() => Alert.alert('Support', 'WhatsApp: +234 800 RUNDO 00')}
              />
              <View style={styles.rowDivider} />
              <SettingRow
                emoji="📄"
                label="Terms of Service"
                onPress={() => Alert.alert('Terms', 'Full terms available at rundo.ng/terms')}
              />
              <View style={styles.rowDivider} />
              <SettingRow
                emoji="🔏"
                label="Privacy Policy"
                onPress={() => Alert.alert('Privacy', 'Full policy at rundo.ng/privacy')}
              />
            </View>
          </View>

          {/* ── Danger zone ── */}
          <View style={styles.section}>
            <View style={styles.settingsCard}>
              <SettingRow
                emoji="🚪"
                label="Log Out"
                danger
                onPress={handleLogout}
              />
            </View>
          </View>

          <Text style={styles.versionText}>RUNDO v1.0.0 · Lagos, Nigeria</Text>

          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    backgroundColor: Colors.primaryDark,
    paddingTop: 60,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: Colors.primaryVivid,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white },
  userName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  userPhone: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', marginBottom: Spacing.md },
  badgeRow: { flexDirection: 'row', gap: Spacing.sm },
  roleBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  roleBadgeText: { fontSize: FontSize.sm, fontWeight: '700' },
  levelBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  levelBadgeText: { fontSize: FontSize.sm, fontWeight: '700' },

  // Body
  body: { flex: 1 },
  scrollContent: { padding: Spacing.lg },

  // Stats
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textPrimary, marginBottom: 3 },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '500', textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: Colors.border },

  // Sections
  section: { marginBottom: Spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  sectionBadge: {
    backgroundColor: Colors.warningLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  sectionBadgeText: { fontSize: FontSize.xs, color: Colors.warning, fontWeight: '700' },

  // Verification
  verifyCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  verifyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  verifyDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyDotText: { color: Colors.white, fontWeight: '900', fontSize: FontSize.sm },
  verifyLabel: { fontSize: FontSize.md, fontWeight: '700' },
  verifyStatus: { fontSize: FontSize.xs, fontWeight: '600', marginTop: 1 },
  verifyDividerLine: { height: 1, backgroundColor: Colors.border, marginVertical: 2 },
  verifyCtaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadow.md,
  },
  verifyCtaText: { color: Colors.white, fontWeight: '800', fontSize: FontSize.md },
  verifyNote: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 18,
    textAlign: 'center',
  },

  // Level
  levelCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  levelCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  levelPill: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  levelPillText: { fontSize: FontSize.sm, fontWeight: '700' },
  levelNextText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  progressBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: Spacing.xs,
    overflow: 'hidden',
  },
  progressFill: { height: 8, backgroundColor: Colors.primary, borderRadius: 4 },
  progressCaption: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.md },
  unlockBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  unlockTitle: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary, marginBottom: 3 },
  unlockText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },

  // Settings
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.xs,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingEmoji: { fontSize: 20 },
  settingText: { flex: 1 },
  settingLabel: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  settingSubLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  chevron: { fontSize: 22, color: Colors.textMuted, fontWeight: '300' },
  rowDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 68 },

  versionText: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    letterSpacing: 0.5,
  },
});
