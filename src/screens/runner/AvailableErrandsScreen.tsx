import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import { Errand } from '../../types';

const mockAvailable: Errand[] = [
  {
    id: 'a1',
    senderId: 'u1',
    title: 'Collect ATM card from UBA Ikeja',
    description: 'Pick up my ATM card from UBA Ikeja branch. Need to show ID card which will be texted.',
    pickupLocation: { address: 'UBA Bank, Ikeja, Lagos', latitude: 6.6018, longitude: 3.3515 },
    dropoffLocation: { address: 'Oregun, Ikeja, Lagos', latitude: 6.6120, longitude: 3.3700 },
    itemValue: 5000,
    price: 1800,
    status: 'pending',
    createdAt: new Date(),
  },
  {
    id: 'a2',
    senderId: 'u2',
    title: 'Buy phone charger from Computer Village',
    description: 'Buy a Samsung Type-C fast charger from Computer Village. Budget ₦4,500.',
    pickupLocation: { address: 'Computer Village, Ikeja, Lagos', latitude: 6.6050, longitude: 3.3490 },
    dropoffLocation: { address: 'Maryland Mall, Lagos', latitude: 6.5741, longitude: 3.3744 },
    itemValue: 4500,
    price: 2500,
    status: 'pending',
    createdAt: new Date(Date.now() - 300000),
  },
  {
    id: 'a3',
    senderId: 'u3',
    title: 'Receive package at Ajah gate',
    description: 'Wait for delivery at Ajah gate, sign for package and confirm receipt.',
    pickupLocation: { address: 'Ajah Bus Stop, Lagos', latitude: 6.4698, longitude: 3.5852 },
    dropoffLocation: { address: 'Lekki Phase 2, Lagos', latitude: 6.4600, longitude: 3.5900 },
    itemValue: 12000,
    price: 1500,
    status: 'pending',
    createdAt: new Date(Date.now() - 600000),
  },
  {
    id: 'a4',
    senderId: 'u4',
    title: 'Queue at NIMC office for NIN slip',
    description: 'Stand in queue at NIMC office, collect NIN printout slip for my aunt.',
    pickupLocation: { address: 'NIMC Office, Oshodi, Lagos', latitude: 6.5588, longitude: 3.3500 },
    dropoffLocation: { address: 'Mushin, Lagos', latitude: 6.5248, longitude: 3.3540 },
    itemValue: 0,
    price: 3200,
    status: 'pending',
    createdAt: new Date(Date.now() - 900000),
  },
];

function timeAgo(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function ErrandItem({ errand, onAccept }: { errand: Errand; onAccept: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.priceBadge}>
          <Text style={styles.priceAmount}>₦{errand.price.toLocaleString()}</Text>
        </View>
        <Text style={styles.timeAgo}>{timeAgo(errand.createdAt)}</Text>
      </View>

      <Text style={styles.errandTitle}>{errand.title}</Text>
      <Text style={styles.errandDesc} numberOfLines={2}>{errand.description}</Text>

      <View style={styles.locationRow}>
        <View style={styles.locDot} />
        <Text style={styles.locText} numberOfLines={1}>{errand.pickupLocation.address}</Text>
      </View>
      <View style={styles.locationRow}>
        <View style={[styles.locDot, { backgroundColor: Colors.accent }]} />
        <Text style={styles.locText} numberOfLines={1}>{errand.dropoffLocation.address}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.valueBadge}>
          <Text style={styles.valueLabel}>Item value</Text>
          <Text style={styles.valueAmount}>
            {errand.itemValue > 0 ? `₦${errand.itemValue.toLocaleString()}` : 'N/A'}
          </Text>
        </View>

        <TouchableOpacity style={styles.acceptBtn} onPress={onAccept} activeOpacity={0.85}>
          <Text style={styles.acceptBtnText}>Accept Errand →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AvailableErrandsScreen({ navigation }: any) {
  const [filter, setFilter] = useState('all');
  const filters = ['all', 'near me', 'high pay', 'quick'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Available Errands</Text>
          <Text style={styles.headerSub}>Lagos · {mockAvailable.length} near you</Text>
        </View>
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={mockAvailable}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ErrandItem
            errand={item}
            onAccept={() => navigation.navigate('ActiveErrand', { errand: item })}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: Spacing.xxl }} />}
      />
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
  headerLabel: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    gap: 6,
  },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  onlineText: { color: Colors.white, fontSize: FontSize.sm, fontWeight: '700' },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterChip: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600', textTransform: 'capitalize' },
  filterTextActive: { color: Colors.white },
  list: { padding: Spacing.lg },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  priceBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  priceAmount: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  timeAgo: { fontSize: FontSize.xs, color: Colors.textMuted },
  errandTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  errandDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.md },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 6 },
  locDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  locText: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  valueBadge: {},
  valueLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },
  valueAmount: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  acceptBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  acceptBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.md },
});
