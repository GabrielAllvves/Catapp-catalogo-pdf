import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@theme/colors';

interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => (
  <View style={styles.container}>
    <View style={styles.iconContainer}>
      <Feather name="layers" size={32} color={colors.primary} />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E9F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: colors.text,
    textAlign: 'center'
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.mutedText,
    textAlign: 'center'
  }
});

export default EmptyState;
