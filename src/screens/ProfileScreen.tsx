import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@theme/colors';
import { useCatalogs } from '@context/CatalogContext';

const ProfileScreen: React.FC = () => {
  const { catalogs } = useCatalogs();
  const [plan, setPlan] = React.useState<'free' | 'premium'>('free');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.name}>Olá, Maria Santos 👋</Text>
        <Text style={styles.email}>maria.santos@catapp.com</Text>
        <View style={[styles.tag, plan === 'premium' ? styles.tagPremium : styles.tagFree]}>
          <Text style={[styles.tagText, plan === 'premium' ? styles.tagTextPremium : undefined]}>
            {plan === 'premium' ? 'Plano premium' : 'Plano gratuito'}
          </Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Seu progresso</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsItem}>
            <Text style={styles.statsNumber}>{catalogs.length}</Text>
            <Text style={styles.statsLabel}>Catálogos criados</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsNumber}>
              {catalogs.reduce((total, catalog) => total + catalog.products.length, 0)}
            </Text>
            <Text style={styles.statsLabel}>Produtos publicados</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Plano Premium</Text>
        <Text style={styles.sectionDescription}>
          Desbloqueie produtos ilimitados, múltiplos catálogos por marca e templates profissionais.
        </Text>
        <TouchableOpacity style={styles.upgradeButton} onPress={() => setPlan('premium')}>
          <Text style={styles.upgradeText}>Quero fazer upgrade</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: 20,
    paddingBottom: 120
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#00000010',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 22,
    color: colors.text
  },
  email: {
    fontFamily: 'Inter_400Regular',
    color: colors.mutedText,
    marginTop: 4
  },
  tag: {
    marginTop: 16,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20
  },
  tagFree: {
    backgroundColor: '#E5F1FF'
  },
  tagPremium: {
    backgroundColor: '#DCFCE7'
  },
  tagText: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.primary
  },
  tagTextPremium: {
    color: colors.success
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  statsTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.text,
    marginBottom: 16
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statsItem: {
    alignItems: 'flex-start'
  },
  statsNumber: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: colors.primary
  },
  statsLabel: {
    fontFamily: 'Inter_400Regular',
    color: colors.mutedText,
    marginTop: 4
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.text,
    marginBottom: 8
  },
  sectionDescription: {
    fontFamily: 'Inter_400Regular',
    color: colors.mutedText,
    marginBottom: 16
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center'
  },
  upgradeText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    fontSize: 16
  },
  logoutButton: {
    marginTop: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#FEE2E2'
  },
  logoutText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#B91C1C'
  }
});

export default ProfileScreen;
