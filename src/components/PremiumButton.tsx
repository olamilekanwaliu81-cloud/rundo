import React, { useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Colors, Radius, FontSize, Shadow } from '../constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: string;
}

export function PremiumButton({
  label,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
  icon,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const bgColor = {
    primary: Colors.primary,
    secondary: Colors.primaryLight,
    ghost: 'transparent',
    accent: Colors.accent,
  }[variant];

  const textColor = {
    primary: Colors.white,
    secondary: Colors.primary,
    ghost: Colors.primary,
    accent: Colors.primaryDeep,
  }[variant];

  const shadow = variant === 'primary' ? Shadow.md : variant === 'accent' ? Shadow.accent : {};
  const isDisabled = disabled || loading;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={[
          styles.btn,
          { backgroundColor: bgColor },
          variant === 'ghost' && styles.ghostBorder,
          isDisabled && styles.disabled,
          shadow,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={1}
      >
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <Text style={[styles.label, { color: textColor }]}>
            {icon ? `${icon}  ` : ''}{label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 56,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  ghostBorder: {
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  disabled: { opacity: 0.45 },
  label: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
