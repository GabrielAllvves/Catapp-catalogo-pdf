import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { CatalogProduct } from '@types/catalog';
import { colors } from '@theme/colors';
import { Feather } from '@expo/vector-icons';

interface ProductFormProps {
  product: CatalogProduct;
  onChange: (product: CatalogProduct) => void;
  onRemove: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onChange, onRemove }) => {
  const handleChange = <K extends keyof CatalogProduct>(key: K, value: CatalogProduct[K]) => {
    onChange({ ...product, [key]: value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Produto</Text>
        <TouchableOpacity onPress={onRemove}>
          <Feather name="trash-2" size={18} color={colors.warning} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        placeholderTextColor={colors.mutedText}
        value={product.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Preço</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0,00"
            value={product.price ? product.price.toString() : ''}
            onChangeText={(text) => handleChange('price', Number(text.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0)}
          />
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Preço promocional</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Opcional"
            value={product.promotionalPrice ? product.promotionalPrice.toString() : ''}
            onChangeText={(text) =>
              handleChange('promotionalPrice', text ? Number(text.replace(/[^0-9.,]/g, '').replace(',', '.')) : undefined)
            }
          />
        </View>
      </View>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Descrição"
        placeholderTextColor={colors.mutedText}
        value={product.description}
        onChangeText={(text) => handleChange('description', text)}
        multiline
        numberOfLines={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#00000010',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.text
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Inter_500Medium',
    color: colors.text,
    marginBottom: 12
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: colors.mutedText,
    marginBottom: 6
  },
  row: {
    flexDirection: 'row',
    gap: 12
  },
  rowItem: {
    flex: 1
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top'
  }
});

export default ProductForm;
