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
  TextInput,
  Share,
  Clipboard,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';
import { useStore } from '../../store/useStore';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function makeReferralCode(phone: string): string {
  const seed = phone.replace(/\D/g, '').slice(-6);
  return ('RUN' + seed).toUpperCase();
}

// ─── Verification badge ───────────────────────────────────────────────────────
function VerifyBadge({
  label,
  status,
}: {
  label: string;
  status: 'verified' | 'pending' | 'unverified';
}) {
  const cfg = {
    verified: { bg: Colors.successLight, text: Colors.success, dot: Colors.success, icon: '✓', word: 'Verified' },
    pending:  { bg: Colors.warningLight,  text: Colors.warning,  dot: Colors.warning,  icon: '…', word: 'Pending' },
    unverified: { bg: Colors.background, text: Colors.textMuted, dot: Colors.textMuted, icon: '!', word: 'Not submitted' },
  }[status];

  return (
    <View style={[styles.verifyBadge, { backgroundColor: cfg.bg }]}>
      <View style={[styles.verifyDot, { backgroundColor: cfg.dot }]}>
        <Text style={styles.verifyDotText}>{cfg.icon}</Text>
      </View>
      <View>
        <Text style={styles.verifyLabel}>{label}</Text>
        <Text style={[styles.verifyStatus, { color: cfg.text }]}>{cfg.word}</Text>
      </View>
    </View>
  );
}

// ─── Setting row ─────────────────────────────────────────────────────────────
function SettingRow({
  emoji, label, sublabel, onPress, danger, toggle, toggleValue, onToggle,
}: {
  emoji: string; label: string; sublabel?: string; onPress?: () => void;
  danger?: boolean; toggle?: boolean; toggleValue?: boolean; onToggle?: (v: boolean) => void;
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

// ─── Level config ─────────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  1: { label: 'Starter', color: Colors.levelStarter, bg: Colors.background },
  2: { label: 'Trusted', color: Colors.levelTrusted, bg: Colors.primaryLight },
  3: { label: 'Elite',   color: Colors.levelElite,   bg: Colors.accentLight },
};

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }: any) {
  const { user, role, setUser } = useStore();
  const [notifEnabled, setNotifEnabled] = useState(true);

  // — Name editing state —
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(user?.name || '');
  const nameInputRef = useRef<TextInput>(null);

  // — Copy feedback —
  const [copied, setCopied] = useState(false);

  // — Animations —
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerScale  = useRef(new Animated.Value(0.92)).current;
  const contentSlide = useRef(new Animated.Value(32)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const editScaleAnim  = useRef(new Animated.Value(1)).current;

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
  const referralCode = makeReferralCode(user?.phone || '000000');

  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // — Name edit handlers —
  const startEditing = () => {
    setDraftName(user?.name || '');
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
    Animated.spring(editScaleAnim, { toValue: 1.04, tension: 200, friction: 8, useNativeDriver: true }).start();
  };

  const saveName = () => {
    const trimmed = draftName.trim();
    if (trimmed.length < 2) {
      Alert.alert('Name too short', 'Please enter at least 2 characters.');
      return;
    }
    if (user) setUser({ ...user, name: trimmed });
    setEditingName(false);
    Animated.spring(editScaleAnim, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }).start();
  };

  const cancelEditing = () => {
    setDraftName(user?.name || '');
    setEditingName(false);
    Animated.spring(editScaleAnim, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }).start();
  };

  // — Referral handlers —
  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareReferral = async () => {
    try {
      await Share.share({
        message:
          `Join me on RUNDO — Nigeria's errand marketplace!\n\n` +
          `Use my referral code *${referralCode}* when you sign up and we both get ₦500 credit.\n\n` +
          `Download: rundo.ng/app`,
        title: 'Join RUNDO',
      });
    } catch {
      // user cancelled
    }
  };

  // — Other handlers —
  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out', style: 'destructive',
        onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] }),
      },
    ]);
  };

  const handleSwitchRole = () => {
    Alert.alert('Switch Role', `Switch to ${isRunner ? 'Sender' : 'Runner'} mode?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Switch',
        onPress: () => navigation.reset({
          index: 0,
          routes: [{ name: isRunner ? 'SenderTabs' : 'RunnerTabs' }],
        }),
      },
    ]);
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

        {/* Editable name */}
        <Animated.View
          style={[styles.nameRow, { transform: [{ scale: editScaleAnim }] }]}
        >
          {editingName ? (
            <View style={styles.nameEditRow}>
              <TextInput
                ref={nameInputRef}
                style={styles.nameInput}
                value={draftName}
                onChangeText={setDraftName}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={saveName}
                selectionColor={Colors.primaryVivid}
                maxLength={40}
              />
              <TouchableOpacity style={styles.nameSaveBtn} onPress={saveName}>
                <Text style={styles.nameSaveBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nameCancelBtn} onPress={cancelEditing}>
                <Text style={styles.nameCancelBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.nameDisplayRow} onPress={startEditing} activeOpacity={0.8}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <View style={styles.editChip}>
                <Text style={styles.editChipText}>✏️ Edit</Text>
              </View>
            </TouchableOpacity>
          )}
        </Animated.View>

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

      {/* ── Body ── */}
      <Animated.View
        style={[styles.body, { opacity: contentOpacity, transform: [{ translateY: contentSlide }] }]}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Stats */}
          <View style={styles.statsCard}>
            {isRunner ? (
              <>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>34</Text>
                  <Text style={styles.statLabel}>Jobs done</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>4.7 ⭐</Text>
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
                  <Text style={styles.statValue}>4.9 ⭐</Text>
                  <Text style={styles.statLabel}>Runner rating</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>₦12k</Text>
                  <Text style={styles.statLabel}>Total spent</Text>
                </View>
              </>
            )}
          </View>

          {/* ── Referral Code ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Refer & Earn</Text>
            <View style={styles.referralCard}>
              <View style={styles.referralTop}>
                <View>
                  <Text style={styles.referralHeadline}>Invite friends, earn ₦500 each</Text>
                  <Text style={styles.referralSub}>
                    Your friend gets ₦500 credit too when they complete their first errand.
                  </Text>
                </View>
                <Text style={styles.referralEmoji}>🎁</Text>
              </View>

              {/* Code display */}
              <View style={styles.codeRow}>
                <View style={styles.codeBox}>
                  <Text style={styles.codeLabel}>YOUR CODE</Text>
                  <Text style={styles.codeValue}>{referralCode}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.copyBtn, copied && styles.copyBtnDone]}
                  onPress={handleCopyCode}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.copyBtnText, copied && styles.copyBtnTextDone]}>
                    {copied ? '✓ Copied' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Stats row */}
              <View style={styles.referralStatsRow}>
                <View style={styles.referralStat}>
                  <Text style={styles.referralStatValue}>0</Text>
                  <Text style={styles.referralStatLabel}>Invited</Text>
                </View>
                <View style={styles.referralStatDivider} />
                <View style={styles.referralStat}>
                  <Text style={styles.referralStatValue}>₦0</Text>
                  <Text style={styles.referralStatLabel}>Earned</Text>
                </View>
                <View style={styles.referralStatDivider} />
                <View style={styles.referralStat}>
                  <Text style={styles.referralStatValue}>0</Text>
                  <Text style={styles.referralStatLabel}>Active</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.shareBtn} onPress={handleShareReferral} activeOpacity={0.85}>
                <Text style={styles.shareBtnText}>🔗  Share Invite Link</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Verification ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Identity Verification</Text>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>Required</Text>
              </View>
            </View>

            <View style={styles.verifyCard}>
              <VerifyBadge label="NIN — National ID" status="pending" />
              <View style={styles.verifyDividerLine} />
              <VerifyBadge label="BVN — Bank Verification" status="unverified" />
            </View>

            <TouchableOpacity style={styles.verifyCtaBtn} activeOpacity={0.85}>
              <Text style={styles.verifyCtaText}>🛡️  Complete Verification</Text>
            </TouchableOpacity>
            <Text style={styles.verifyNote}>
              {isRunner
                ? 'Verified runners unlock higher-value errands and earn the Trusted badge.'
                : 'Verification helps protect you and ensures runner accountability.'}
            </Text>
          </View>

          {/* ── Runner level progress ── */}
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

          {/* ── Account Settings ── */}
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

          {/* ── Support ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.settingsCard}>
              <SettingRow
                emoji="❓"
                label="Help & Support"
                sublabel="WhatsApp: +234 800 RUNDO 00"
                onPress={() => Alert.alert('Support', 'WhatsApp: +234 800 RUNDO 00')}
              />
              <View style={styles.rowDivider} />
              <SettingRow
                emoji="📄"
                label="Terms of Service"
                onPress={() => Alert.alert('Terms', 'Full terms at rundo.ng/terms')}
              />
              <View style={styles.rowDivider} />
              <SettingRow
                emoji="🔏"
                label="Privacy Policy"
                onPress={() => Alert.alert('Privacy', 'Full policy at rundo.ng/privacy')}
              />
            </View>
          </View>

          {/* ── Logout ── */}
          <View style={styles.section}>
            <View style={styles.settingsCard}>
              <SettingRow emoji="🚪" label="Log Out" danger onPress={handleLogout} />
            </View>
          </View>

          <Text style={styles.versionText}>RUNDO v1.0.0 · Lagos, Nigeria</Text>
          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
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

  // Name edit
  nameRow: { alignItems: 'center', marginBottom: 4 },
  nameDisplayRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  userName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  editChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  editChipText: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  nameInput: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.white,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primaryVivid,
    paddingBottom: 3,
    minWidth: 140,
    textAlign: 'center',
  },
  nameSaveBtn: {
    backgroundColor: Colors.primaryVivid,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
  },
  nameSaveBtnText: { color: Colors.primaryDeep, fontWeight: '800', fontSize: FontSize.sm },
  nameCancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
  },
  nameCancelBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.sm },

  userPhone: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', marginBottom: Spacing.md },
  badgeRow: { flexDirection: 'row', gap: Spacing.sm },
  roleBadge: { borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: 5 },
  roleBadgeText: { fontSize: FontSize.sm, fontWeight: '700' },
  levelBadge: { borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: 5 },
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

  // Section
  section: { marginBottom: Spacing.lg },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: Spacing.md,
  },
  sectionBadgeText: { fontSize: FontSize.xs, color: Colors.warning, fontWeight: '700' },

  // Referral
  referralCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.strong,
  },
  referralTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  referralHeadline: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 5,
    flex: 1,
    paddingRight: Spacing.sm,
  },
  referralSub: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
    flex: 1,
    paddingRight: Spacing.sm,
  },
  referralEmoji: { fontSize: 40 },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    gap: Spacing.md,
  },
  codeBox: { flex: 1 },
  codeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  codeValue: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    color: Colors.primaryVivid,
    letterSpacing: 3,
  },
  copyBtn: {
    backgroundColor: Colors.primaryVivid,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
  },
  copyBtnDone: { backgroundColor: Colors.success },
  copyBtnText: { color: Colors.primaryDeep, fontWeight: '800', fontSize: FontSize.sm },
  copyBtnTextDone: { color: Colors.white },
  referralStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  referralStat: { flex: 1, alignItems: 'center' },
  referralStatValue: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.white, marginBottom: 2 },
  referralStatLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.55)', fontWeight: '500' },
  referralStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  shareBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 13,
    alignItems: 'center',
  },
  shareBtnText: { color: Colors.primaryDeep, fontWeight: '800', fontSize: FontSize.md },

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
  verifyLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
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
  levelPill: { borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: 5 },
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
  unlockBox: { backgroundColor: Colors.primaryLight, borderRadius: Radius.md, padding: Spacing.md },
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
