import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Animated,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../constants/theme';
import { Errand } from '../../types';

const mockAvailable: Errand[] = [
  {
    id: 'a1',
    senderId: 'u1',
    title: 'Collect ATM card from UBA Ikeja',
    description: 'Pick up my ATM card from UBA Ikeja branch. Need to show ID card which will be texted.',
    pickupLocation: { address: 'UBA Bank, Ikeja, Lagos', latitude: 6.6018, longitude: 3.3515 },
    dropoffLocation: { address: 'Oregun, Ikeja, Lagos', latitude: 6.612, longitude: 3.37 },
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
    pickupLocation: { address: 'Computer Village, Ikeja, Lagos', latitude: 6.605, longitude: 3.349 },
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
    dropoffLocation: { address: 'Lekki Phase 2, Lagos', latitude: 6.46, longitude: 3.59 },
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
    pickupLocation: { address: 'NIMC Office, Oshodi, Lagos', latitude: 6.5588, longitude: 3.35 },
    dropoffLocation: { address: 'Mushin, Lagos', latitude: 6.5248, longitude: 3.354 },
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

function ErrandItem({
  errand,
  onAccept,
  index,
}: {
  errand: Errand;
  onAccept: () => void;
  index: number;
}) {
  const slideAnim = useRef(new Animated.Value(36)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      tension: 200,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 200,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        marginBottom: Spacing.md,
      }}
    >
      <TouchableOpacity
        style={styles.card}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Card header */}
        <View style={styles.cardHeader}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceAmount}>₦{errand.price.toLocaleString()}</Text>
          </View>
          <Text style={styles.timeAgo}>{timeAgo(errand.createdAt)}</Text>
        </View>

        {/* Title + description */}
        <Text style={styles.errandTitle}>{errand.title}</Text>
        <Text style={styles.errandDesc} numberOfLines={2}>
          {errand.description}
        </Text>

        {/* Route */}
        <View style={styles.routeBlock}>
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.routeText} numberOfLines={1}>
              {errand.pickupLocation.address}
            </Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, { backgroundColor: Colors.accent }]} />
            <Text style={styles.routeText} numberOfLines={1}>
              {errand.dropoffLocation.address}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.valueLabel}>Item value</Text>
            <Text style={styles.valueAmount}>
              {errand.itemValue > 0 ? `₦${errand.itemValue.toLocaleString()}` : 'N/A'}
            </Text>
          </View>
          <TouchableOpacity style={styles.acceptBtn} onPress={onAccept} activeOpacity={0.85}>
            <Text style={styles.acceptBtnText}>Accept →</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const FILTERS = ['All', 'Near Me', 'High Pay', 'Quick'];

export default function AvailableErrandsScreen({ navigation }: any) {
  const [filter, setFilter] = useState('All');

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

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
            <Text style={styles.headerLabel}>Available Errands</Text>
            <Text style={styles.headerSub}>Lagos · {mockAvailable.length} near you</Text>
          </View>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </Animated.View>
      </View>

      {/* Filter chips */}
      <View style={styles.filtersRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={mockAvailable}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ErrandItem
            errand={item}
            index={index}
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
  headerLabel: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    gap: 7,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryVivid,
  },
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
    paddingVertical: 7,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: { color: Colors.white },
  list: { padding: Spacing.lg, paddingTop: Spacing.md },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  priceBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  priceAmount: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.primary },
  timeAgo: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '500' },
  errandTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  errandDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  routeBlock: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  routeDot: { width: 9, height: 9, borderRadius: 5 },
  routeLine: {
    width: 1.5,
    height: 14,
    backgroundColor: Colors.border,
    marginLeft: 4,
    marginVertical: 3,
  },
  routeText: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  valueLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 2,
  },
  valueAmount: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  acceptBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
  },
  acceptBtnText: { color: Colors.white, fontWeight: '800', fontSize: FontSize.md },
});
