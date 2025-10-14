import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FeedStackParamList } from '@navigation/FeedStackNavigator';
import { useCatalogs } from '@context/CatalogContext';
import { Catalog, CatalogProduct } from '@types/catalog';
import ColorSelector from '@components/ColorSelector';
import ProductForm from '@components/ProductForm';
import CatalogPreview from '@components/CatalogPreview';
import { colors } from '@theme/colors';
import { generateProductId } from '@utils/ids';
import { exportCatalogToPdf } from '@services/pdf/exportCatalog';

export type CatalogDetailsScreenProps = NativeStackScreenProps<FeedStackParamList, 'CatalogDetails'>;

const CatalogDetailsScreen: React.FC<CatalogDetailsScreenProps> = ({ route, navigation }) => {
  const { catalogId } = route.params;
  const { catalogs, updateCatalog, deleteCatalog } = useCatalogs();
  const catalog = catalogs.find((item) => item.id === catalogId);

  const [form, setForm] = React.useState<Catalog | undefined>(catalog);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setForm(catalog);
  }, [catalog]);

  if (!catalog || !form) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Catálogo não encontrado.</Text>
      </View>
    );
  }

  const updateProducts = (products: CatalogProduct[]) => {
    setForm((prev) => (prev ? { ...prev, products } : prev));
  };

  const handleChange = (key: keyof Catalog, value: Catalog[keyof Catalog]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleAddProduct = () => {
    updateProducts([
      ...form.products,
      {
        id: generateProductId(),
        name: '',
        price: 0
      }
    ]);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      Alert.alert('Informe um nome', 'Seu catálogo precisa de um nome.');
      return;
    }
    setSaving(true);
    updateCatalog(form);
    setSaving(false);
    Alert.alert('Sucesso', 'Catálogo atualizado com sucesso.');
  };

  const handleDelete = () => {
    Alert.alert('Excluir catálogo', 'Deseja excluir este catálogo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteCatalog(catalogId);
          navigation.goBack();
        }
      }
    ]);
  };

  const handleExport = async () => {
    try {
      await exportCatalogToPdf(form, { share: true });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar o catálogo.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Nome do catálogo</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
        placeholderTextColor={colors.mutedText}
      />

      <View style={styles.section}>
        <ColorSelector
          selectedColors={form.colors.filter(Boolean) as string[]}
          onChange={(palette) =>
            handleChange('colors', [palette[0] ?? '#1089ED', palette[1], palette[2]])
          }
        />
      </View>

      <View style={styles.productsHeader}>
        <Text style={styles.sectionTitle}>Produtos</Text>
        <TouchableOpacity onPress={handleAddProduct}>
          <Text style={styles.addProduct}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {form.products.map((product) => (
        <ProductForm
          key={product.id}
          product={product}
          onChange={(data) =>
            updateProducts(form.products.map((item) => (item.id === product.id ? data : item)))
          }
          onRemove={() => updateProducts(form.products.filter((item) => item.id !== product.id))}
        />
      ))}

      <CatalogPreview catalog={form} />

      <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Salvando...' : 'Salvar alterações'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleExport}>
        <Text style={[styles.buttonText, styles.primaryText]}>Exportar PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.destructiveButton]} onPress={handleDelete}>
        <Text style={styles.buttonText}>Excluir catálogo</Text>
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
  label: {
    fontFamily: 'Inter_500Medium',
    color: colors.text,
    marginBottom: 8
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.text,
    marginBottom: 24
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.text
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  addProduct: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.primary
  },
  button: {
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16
  },
  primaryButton: {
    backgroundColor: colors.primary,
    shadowColor: '#1089ED',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  secondaryButton: {
    backgroundColor: '#E9F4FF'
  },
  destructiveButton: {
    backgroundColor: '#FEE2E2'
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#fff'
  },
  primaryText: {
    color: colors.primary
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background
  },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    color: colors.mutedText
  }
});

export default CatalogDetailsScreen;
