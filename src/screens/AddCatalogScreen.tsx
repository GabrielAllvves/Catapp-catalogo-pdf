import React, { useCallback, useMemo } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import type { ListRenderItem } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@theme/colors';
import { useCatalogs } from '@context/CatalogContext';
import { Catalog, CatalogProduct } from '@types/catalog';
import ProductForm from '@components/ProductForm';
import ColorSelector from '@components/ColorSelector';
import { generateProductId } from '@utils/ids';
import CatalogPreview from '@components/CatalogPreview';
import { RootTabParamList } from '@navigation/BottomTabs';
import { FeedStackParamList } from '@navigation/FeedStackNavigator';

const FREE_PRODUCT_LIMIT = 20;

type AddCatalogNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'AddCatalog'>,
  NativeStackNavigationProp<FeedStackParamList>
>;

const AddCatalogScreen: React.FC = () => {
  const navigation = useNavigation<AddCatalogNavigationProp>();
  const { addCatalog } = useCatalogs();
  const [name, setName] = React.useState('');
  const [logoUri, setLogoUri] = React.useState<string | undefined>();
  const [selectedColors, setSelectedColors] = React.useState<string[]>(['#1089ED']);
  const [products, setProducts] = React.useState<CatalogProduct[]>([]);
  const [saving, setSaving] = React.useState(false);

  const normalizedColors = useMemo<string[]>(() => {
    const [primary, secondary, tertiary] = selectedColors;
    return [primary ?? '#1089ED', secondary, tertiary];
  }, [selectedColors]);

  const handlePickLogo = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Permissão necessária', 'Autorize o acesso à galeria para selecionar uma logo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      base64: false,
      aspect: [1, 1]
    });

    if (!result.canceled) {
      setLogoUri(result.assets[0]?.uri);
    }
  }, []);

  const handleAddProduct = useCallback(() => {
    setProducts((prev) => {
      if (prev.length >= FREE_PRODUCT_LIMIT) {
        Alert.alert('Limite atingido', 'Faça upgrade para o plano premium para adicionar mais produtos.');
        return prev;
      }

      return [
        ...prev,
        {
          id: generateProductId(),
          name: '',
          price: 0
        }
      ];
    });
  }, []);

  const handleUpdateProduct = useCallback((productId: string, data: CatalogProduct) => {
    setProducts((prev) => prev.map((item) => (item.id === productId ? data : item)));
  }, []);

  const handleRemoveProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const handleSaveCatalog = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert('Informe um nome', 'Dê um nome para o seu catálogo.');
      return;
    }

    setSaving(true);
    try {
      const newCatalog: Omit<Catalog, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        logoUri,
        colors: normalizedColors,
        products
      };
      const catalogId = addCatalog(newCatalog);
      Alert.alert('Catálogo criado!', 'Você já pode editar, exportar e compartilhar o seu catálogo.');
      setName('');
      setLogoUri(undefined);
      setProducts([]);
      setSelectedColors(['#1089ED']);
      navigation.navigate('Feed', {
        screen: 'CatalogDetails',
        params: { catalogId }
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o catálogo. Tente novamente.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }, [addCatalog, logoUri, navigation, normalizedColors, name, products]);

  const previewCatalog = useMemo<Catalog>(
    () => ({
      id: 'preview',
      name: name || 'Prévia do Catálogo',
      logoUri,
      colors: normalizedColors,
      products,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }),
    [logoUri, name, normalizedColors, products]
  );

  const renderProduct = useCallback<ListRenderItem<CatalogProduct>>(
    ({ item }) => (
      <ProductForm
        product={item}
        onChange={(data) => handleUpdateProduct(item.id, data)}
        onRemove={() => handleRemoveProduct(item.id)}
      />
    ),
    [handleRemoveProduct, handleUpdateProduct]
  );

  const keyExtractor = useCallback((item: CatalogProduct) => item.id, []);

  const headerComponent = useMemo(
    () => (
      <View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações gerais</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do catálogo"
            placeholderTextColor={colors.mutedText}
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity style={styles.logoButton} onPress={handlePickLogo}>
            {logoUri ? (
              <Image source={{ uri: logoUri }} style={styles.logoPreview} />
            ) : (
              <Text style={styles.logoText}>Adicionar logo</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <ColorSelector selectedColors={selectedColors} onChange={setSelectedColors} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produtos</Text>
          <Text style={styles.sectionCaption}>
            {products.length}/{FREE_PRODUCT_LIMIT}
          </Text>
        </View>
      </View>
    ),
    [handlePickLogo, logoUri, name, products.length, selectedColors]
  );

  const footerComponent = useMemo(
    () => (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addProductButton} onPress={handleAddProduct}>
          <Text style={styles.addProductText}>Adicionar produto</Text>
        </TouchableOpacity>

        <CatalogPreview catalog={previewCatalog} />

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSaveCatalog}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar catálogo'}</Text>
        </TouchableOpacity>
      </View>
    ),
    [handleAddProduct, handleSaveCatalog, previewCatalog, saving]
  );

  return (
    <FlatList
      data={products}
      keyExtractor={keyExtractor}
      renderItem={renderProduct}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={footerComponent}
      style={styles.container}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  listContent: {
    padding: 20,
    paddingBottom: 120
  },
  section: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.text,
    marginBottom: 12
  },
  sectionCaption: {
    fontFamily: 'Inter_500Medium',
    color: colors.mutedText
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.text
  },
  logoButton: {
    height: 140,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  logoText: {
    fontFamily: 'Inter_500Medium',
    color: colors.primary
  },
  logoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 20
  },
  addProductButton: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#E9F4FF'
  },
  addProductText: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.primary,
    fontSize: 15
  },
  footer: {
    paddingTop: 8
  },
  saveButton: {
    marginTop: 28,
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#1089ED',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }
  },
  saveButtonDisabled: {
    opacity: 0.7
  },
  saveButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    fontSize: 16
  }
});

export default AddCatalogScreen;
