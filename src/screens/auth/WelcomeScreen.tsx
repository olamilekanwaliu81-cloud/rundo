import React, { useRef, useEffect } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import { PremiumButton } from '../../components/PremiumButton';

const { width, height } = Dimensions.get('window');

function FloatingOrb({
  size,
  color,
  x,
  y,
  delay,
  duration,
}: {
  size: number;
  color: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
}) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
          delay,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -22],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        left: x,
        top: y,
        transform: [{ translateY }],
      }}
    />
  );
}

export default function WelcomeScreen({ navigation }: any) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.72)).current;
  const contentSlide = useRef(new Animated.Value(48)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const ctaSlide = useRef(new Animated.Value(64)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 70,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(contentSlide, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(ctaSlide, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(ctaOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDeep} />

      {/* Ambient orbs */}
      <FloatingOrb
        size={300}
        color="rgba(27,107,69,0.4)"
        x={-90}
        y={-80}
        delay={0}
        duration={3200}
      />
      <FloatingOrb
        size={180}
        color="rgba(34,197,122,0.18)"
        x={width - 100}
        y={height * 0.28}
        delay={600}
        duration={2800}
      />
      <FloatingOrb
        size={140}
        color="rgba(245,165,35,0.12)"
        x={50}
        y={height * 0.52}
        delay={1100}
        duration={3600}
      />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoSection,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <View style={styles.logoRing}>
          <View style={styles.logoInner}>
            <Text style={styles.logoLetter}>R</Text>
          </View>
        </View>
        <Text style={styles.brandName}>RUNDO</Text>
        <Text style={styles.tagline}>Run It. Trust It. Done.</Text>
      </Animated.View>

      {/* Hero copy */}
      <Animated.View
        style={[
          styles.contentSection,
          {
            opacity: contentOpacity,
            transform: [{ translateY: contentSlide }],
          },
        ]}
      >
        <Text style={styles.headline}>Nigeria's First{'\n'}Errand Marketplace</Text>
        <Text style={styles.subHeadline}>
          Post tasks, find trusted runners near you — tracked live, paid securely.
        </Text>

        <View style={styles.pillsRow}>
          {['✓  Verified Runners', '📍  Live GPS', '🔒  Escrow Pay'].map((label) => (
            <View key={label} style={styles.pill}>
              <Text style={styles.pillText}>{label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* CTAs */}
      <Animated.View
        style={[
          styles.ctaSection,
          { opacity: ctaOpacity, transform: [{ translateY: ctaSlide }] },
        ]}
      >
        <PremiumButton
          label="Get Started Free"
          variant="accent"
          onPress={() => navigation.navigate('Login', { isNewUser: true })}
          style={{ marginBottom: Spacing.sm }}
        />
        <PremiumButton
          label="I already have an account"
          variant="ghost"
          onPress={() => navigation.navigate('Login', { isNewUser: false })}
        />
        <Text style={styles.footer}>Lagos · Abuja · Port Harcourt · Ibadan</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDeep,
    paddingHorizontal: Spacing.lg,
    paddingTop: 70,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  logoRing: {
    width: 100,
    height: 100,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(34,197,122,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoInner: {
    width: 76,
    height: 76,
    borderRadius: 18,
    backgroundColor: Colors.primaryVivid,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.primaryDeep,
    letterSpacing: -1,
  },
  brandName: {
    fontSize: 46,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 10,
    marginBottom: 6,
  },
  tagline: {
    fontSize: FontSize.md,
    color: Colors.primaryVivid,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  headline: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: Spacing.md,
  },
  subHeadline: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  pillText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  ctaSection: {
    gap: Spacing.sm,
  },
  footer: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.3)',
    fontSize: FontSize.xs,
    letterSpacing: 1.5,
    marginTop: Spacing.md,
  },
});
