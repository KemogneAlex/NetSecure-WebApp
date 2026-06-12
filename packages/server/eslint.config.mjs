/**
    * @description      : 
    * @author           : kemogne
    * @group            : 
    * @created          : 30/05/2024 - 06:12:39
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 30/05/2024
    * - Author          : kemogne
    * - Modification    : 
**/
import pluginJs from '@eslint/js';
import pluginNode from 'eslint-plugin-node';
import eslintPluginReact from 'eslint-plugin-react';
import globals from 'globals';

export default {

  settings: {
    react: {
      version: "detect", // "detect" permet à ESLint de détecter automatiquement la version de React
    },
  },

  languageOptions: {
    globals: {
      ...globals.node, // Assurez-vous d'inclure ici les variables globales de Node.js
      // Vous pouvez ajouter d'autres variables globales si nécessaire
    },
    // Ajoutez ici d'autres options de langue, comme ecmaVersion, sourceType, etc.
  },
  plugins: {
    // Liste de vos plugins, par exemple :
    '@eslint/js': pluginJs,
    'eslint-plugin-node': pluginNode,
    // Assurez-vous d'inclure le plugin React correctement configuré
    'react': eslintPluginReact,
  },
  rules: {
    // Utilisez fixupConfigRules pour ajuster les règles de React
    "react/display-name": "error",
    "react/jsx-key": "error",
    "react/jsx-no-comment-textnodes": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-target-blank": "error",
    "react/jsx-no-undef": "error",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/no-children-prop": "error",
    "react/no-danger-with-children": "error",
    "react/no-deprecated": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-find-dom-node": "error",
    "react/no-is-mounted": "error",
    "react/no-render-return-value": "error",
    "react/no-string-refs": "error",
    "react/no-unescaped-entities": "error",
    "react/no-unknown-property": "error",
    "react/no-unsafe": "off",
    "react/prop-types": "error",
    "react/react-in-jsx-scope": "error",
    "react/require-render-return": "error",
    // ... autres règles personnalisées
  },
  // Ajoutez ici d'autres propriétés de configuration nécessaires
};
