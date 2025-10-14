import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Catalog } from '@types/catalog';
import { colors } from '@theme/colors';

interface CatalogPreviewProps {
  catalog: Catalog;
}

const CatalogPreview: React.FC<CatalogPreviewProps> = ({ catalog }) => {
  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{catalog.name}</Text>
        <View style={styles.palette}>
          {catalog.colors
            .filter(Boolean)
            .map((tone, index) => (
              <View key={`${catalog.id}-preview-${tone}-${index}`} style={[styles.colorDot, { backgroundColor: tone! }]} />
            ))}
        </View>
      </View>
      <FlatList
        data={catalog.products}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>
              {formatCurrency(item.promotionalPrice ?? item.price)}
              {item.promotionalPrice && (
                <Text style={styles.oldPrice}> (de {formatCurrency(item.price)})</Text>
              )}
            </Text>
            {item.description ? <Text style={styles.productDescription}>{item.description}</Text> : null}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum produto adicionado ainda.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#00000010',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.text
  },
  palette: {
    flexDirection: 'row'
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 8
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16
  },
  productName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.text
  },
  productPrice: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.primary,
    marginTop: 4
  },
  oldPrice: {
    fontFamily: 'Inter_400Regular',
    color: colors.mutedText
  },
  productDescription: {
    fontFamily: 'Inter_400Regular',
    color: colors.mutedText,
    marginTop: 4
  },
  empty: {
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    color: colors.mutedText
  }
});

export default CatalogPreview;
