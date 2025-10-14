# Catapp

Aplicativo mobile construído com React Native + TypeScript e Expo inspirado na experiência do Tasko. O Catapp permite criar, editar e exportar catálogos de produtos com visual moderno e geração de PDF.

## 📁 Estrutura

- **Navegação**: Bottom Tabs com Feed, Adicionar Catálogo e Perfil.
- **Catálogos**: gerenciamento via contexto global e persistência em SQLite.
- **PDF**: exportação com `pdf-lib`, compartilhamento via `expo-sharing`.
- **Estilo**: paleta azul `#1089ED`, tipografia Inter e componentes reutilizáveis.

## ▶️ Executando o projeto

```bash
npm install
npm run start
```

Use o Expo Go ou um emulador iOS/Android para visualizar o app.

## 🧩 Próximos passos sugeridos

- Integrar autenticação (Firebase Auth ou backend próprio).
- Habilitar upload de imagens de produtos (câmera/galeria).
- Sincronizar catálogos com backend/Firebase para múltiplos dispositivos.
- Criar templates premium e fluxo de upgrade no app.
