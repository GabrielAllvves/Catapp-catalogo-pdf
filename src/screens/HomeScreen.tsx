import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FeedStackParamList } from '@navigation/FeedStackNavigator';
import { useCatalogs } from '@context/CatalogContext';
import CatalogCard from '@components/CatalogCard';
import EmptyState from '@components/EmptyState';
import { colors } from '@theme/colors';
import { exportCatalogToPdf } from '@services/pdf/exportCatalog';

export type HomeScreenProps = NativeStackScreenProps<FeedStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { catalogs, isLoaded, refreshCatalogs } = useCatalogs();
  const [refreshing, setRefreshing] = React.useState(false);

  const summaries = useMemo(() => catalogs, [catalogs]);

  const handleExport = async (catalogId: string) => {
    const catalog = catalogs.find((item) => item.id === catalogId);
    if (!catalog) return;
    try {
      await exportCatalogToPdf(catalog, { share: true });
    } catch (error) {
      console.error('Erro ao exportar catálogo', error);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loaderText}>Carregando seus catálogos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={summaries}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              refreshCatalogs().finally(() => setRefreshing(false));
            }}
          />
        }
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>Catapp</Text>
            <Text style={styles.subtitle}>Transforme seus produtos em catálogos elegantes e profissionais.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <CatalogCard
            catalog={item}
            onPress={() => navigation.navigate('CatalogDetails', { catalogId: item.id })}
            onExport={() => handleExport(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Bem-vindo ao Catapp!"
            description="Crie seu primeiro catálogo tocando no botão azul abaixo. Você pode adicionar até 20 produtos na versão gratuita."
          />
        }
        contentContainerStyle={summaries.length === 0 ? styles.emptyContent : styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background
  },
  loaderText: {
    marginTop: 12,
    fontFamily: 'Inter_500Medium',
    color: colors.mutedText
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 26,
    color: colors.text
  },
  subtitle: {
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
    color: colors.mutedText,
    fontSize: 14
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120
  },
  emptyContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingBottom: 80
  }
});

export default HomeScreen;
