import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@theme/colors';

const predefinedColors = ['#1089ED', '#0F6FCC', '#1FB6FF', '#10B981', '#6366F1', '#F59E0B', '#EC4899'];

interface ColorSelectorProps {
  selectedColors: string[];
  onChange: (colors: string[]) => void;
}

const toggleColor = (value: string, selected: string[]): string[] => {
  if (selected.includes(value)) {
    return selected.filter((color) => color !== value);
  }
  if (selected.length >= 3) {
    const [, ...rest] = selected;
    return [...rest, value];
  }
  return [...selected, value];
};

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColors, onChange }) => {
  return (
    <View>
      <Text style={styles.title}>Paleta do catálogo</Text>
      <Text style={styles.subtitle}>Escolha até 3 cores para personalizar seu PDF.</Text>
      <View style={styles.colorGrid}>
        {predefinedColors.map((colorValue) => {
          const isSelected = selectedColors.includes(colorValue);
          return (
            <TouchableOpacity
              key={colorValue}
              onPress={() => onChange(toggleColor(colorValue, selectedColors))}
              style={[styles.colorDot, { backgroundColor: colorValue }, isSelected && styles.selected]}
              activeOpacity={0.8}
            >
              {isSelected && <Text style={styles.dotLabel}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.text
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.mutedText,
    marginTop: 4,
    marginBottom: 12
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  colorDot: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#00000010',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  selected: {
    borderColor: colors.primary
  },
  dotLabel: {
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    fontSize: 16
  }
});

export default ColorSelector;
