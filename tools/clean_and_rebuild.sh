#!/bin/bash
# Script para limpar cache e forçar recriação do menu

echo "🧹 LIMPANDO CACHE DO UNITY..."
echo "================================"

# Perguntar confirmação
read -p "⚠️  Isso vai deletar Library/ e Temp/. Continuar? (s/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo "❌ Cancelado"
    exit 1
fi

# Limpar cache
echo "🗑️  Removendo Library/..."
rm -rf Library/

echo "🗑️  Removendo Temp/..."
rm -rf Temp/

echo ""
echo "✅ CACHE LIMPO!"
echo ""
echo "🎮 PRÓXIMO PASSO:"
echo "   1. Abra o Unity (vai demorar - está reimportando)"
echo "   2. Aguarde a importação terminar"
echo "   3. Abra Assets/Scenes/MainMenu.unity"
echo "   4. Clique Play ▶️"
echo "   5. Veja o Console para os logs"
echo ""
echo "📝 Se ainda não funcionar, execute:"
echo "   python3 tools/create_menu_scene.py"
echo ""
