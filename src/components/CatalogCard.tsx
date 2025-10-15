import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, GestureResponderEvent } from 'react-native';
import { Catalog } from '@types/catalog';
import { colors } from '@theme/colors';
import { Feather } from '@expo/vector-icons';

interface CatalogCardProps {
  catalog: Catalog;
  onPress: () => void;
  onExport: () => void;
}

const CatalogCard: React.FC<CatalogCardProps> = ({ catalog, onPress, onExport }) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        {catalog.logoUri ? (
          <Image source={{ uri: catalog.logoUri }} style={styles.logo} resizeMode="contain" />
        ) : (
          <View style={[styles.logo, styles.placeholderLogo]}>
            <Feather name="image" size={18} color={colors.mutedText} />
          </View>
        )}
        <View style={styles.headerContent}>
          <Text style={styles.title}>{catalog.name}</Text>
          <Text style={styles.subtitle}>
            Atualizado em {new Date(catalog.updatedAt).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={(event: GestureResponderEvent) => {
            event.stopPropagation();
            onExport();
          }}
          style={styles.exportButton}
        >
          <Feather name="share-2" size={18} color={colors.primary} />
          <Text style={styles.exportText}>Exportar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.colorPalette}>
        {catalog.colors
          .filter(Boolean)
          .map((tone, index) => (
            <View key={`${catalog.id}-${tone}-${index}`} style={[styles.colorDot, { backgroundColor: tone! }]} />
          ))}
      </View>
      <Text style={styles.productCount}>{catalog.products.length} produtos adicionados</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#00000010',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerContent: {
    flex: 1,
    marginLeft: 12
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderLogo: {
    borderWidth: 1,
    borderColor: colors.border
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    marginBottom: 2
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.mutedText
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E3F2FF'
  },
  exportText: {
    marginLeft: 4,
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.primary
  },
  colorPalette: {
    flexDirection: 'row',
    marginTop: 12
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ffffff'
  },
  productCount: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.mutedText
  }
});

export default CatalogCard;
