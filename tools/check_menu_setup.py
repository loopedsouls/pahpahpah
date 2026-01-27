#!/usr/bin/env python3
"""
Verifica se o projeto está configurado corretamente para o menu funcionar
"""

import os
import sys

def check_file_exists(path, description):
    """Verifica se um arquivo existe"""
    if os.path.exists(path):
        print(f"✅ {description}")
        return True
    else:
        print(f"❌ {description} - FALTANDO: {path}")
        return False

def check_script_has_content(path, search_text, description):
    """Verifica se um script contém determinado texto"""
    if not os.path.exists(path):
        print(f"❌ {description} - Arquivo não existe: {path}")
        return False
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        if search_text in content:
            print(f"✅ {description}")
            return True
        else:
            print(f"❌ {description} - Texto não encontrado: {search_text}")
            return False

def main():
    print("🔍 VERIFICANDO CONFIGURAÇÃO DO MENU PÁ PÁ PÁ")
    print("=" * 60)
    
    all_ok = True
    
    # 1. Verificar arquivos essenciais
    print("\n📁 Verificando arquivos essenciais...")
    all_ok &= check_file_exists("Assets/Scenes/MainMenu.unity", "Scene MainMenu.unity")
    all_ok &= check_file_exists("Assets/Scenes/Game.unity", "Scene Game.unity")
    all_ok &= check_file_exists("Assets/Scripts/UI/MainMenuManager.cs", "MainMenuManager.cs")
    all_ok &= check_file_exists("Assets/Scripts/ForceMainMenu.cs", "ForceMainMenu.cs")
    
    # 2. Verificar conteúdo dos scripts
    print("\n🔧 Verificando conteúdo dos scripts...")
    all_ok &= check_script_has_content(
        "Assets/Scripts/UI/MainMenuManager.cs",
        "CreatePahPahPahMainMenu",
        "MainMenuManager tem método CreatePahPahPahMainMenu"
    )
    all_ok &= check_script_has_content(
        "Assets/Scripts/UI/MainMenuManager.cs",
        "Canvas canvas = canvasObj.AddComponent<Canvas>",
        "MainMenuManager cria Canvas programaticamente"
    )
    all_ok &= check_script_has_content(
        "Assets/Scripts/ForceMainMenu.cs",
        "RuntimeInitializeOnLoadMethod",
        "ForceMainMenu usa RuntimeInitializeOnLoadMethod"
    )
    
    # 3. Verificar scene MainMenu
    print("\n🎬 Verificando scene MainMenu.unity...")
    all_ok &= check_script_has_content(
        "Assets/Scenes/MainMenu.unity",
        "MainMenuManager",
        "Scene contém GameObject MainMenuManager"
    )
    
    # 4. Verificar Build Settings
    print("\n⚙️ Verificando Build Settings...")
    all_ok &= check_script_has_content(
        "ProjectSettings/EditorBuildSettings.asset",
        "MainMenu.unity",
        "MainMenu está no Build Settings"
    )
    all_ok &= check_script_has_content(
        "ProjectSettings/EditorBuildSettings.asset",
        "Game.unity",
        "Game está no Build Settings"
    )
    
    # 5. Verificar tools
    print("\n🛠️ Verificando ferramentas...")
    all_ok &= check_file_exists("tools/create_menu_scene.py", "Script de criação de menu")
    all_ok &= check_file_exists("tools/auto_setup_unity.py", "Script de setup automático")
    
    # 6. Verificar GUID do MainMenuManager
    print("\n🔑 Verificando GUID do MainMenuManager...")
    meta_path = "Assets/Scripts/UI/MainMenuManager.cs.meta"
    if os.path.exists(meta_path):
        with open(meta_path, 'r') as f:
            content = f.read()
            if 'guid:' in content:
                guid = [line.split('guid:')[1].strip() for line in content.split('\n') if 'guid:' in line][0]
                print(f"✅ GUID encontrado: {guid}")
                
                # Verificar se o GUID está na scene
                with open("Assets/Scenes/MainMenu.unity", 'r') as scene_f:
                    scene_content = scene_f.read()
                    if guid in scene_content:
                        print(f"✅ GUID está correto na scene")
                    else:
                        print(f"⚠️ GUID não encontrado na scene - execute: python3 tools/create_menu_scene.py")
                        all_ok = False
            else:
                print(f"❌ GUID não encontrado em .meta")
                all_ok = False
    else:
        print(f"❌ Arquivo .meta não existe")
        all_ok = False
    
    # Resultado final
    print("\n" + "=" * 60)
    if all_ok:
        print("✅ TUDO CERTO! Projeto está configurado corretamente!")
        print("\n🎮 PRÓXIMO PASSO:")
        print("   1. Abra o Unity")
        print("   2. Abra Assets/Scenes/MainMenu.unity")
        print("   3. Clique Play ▶️")
        print("   4. Veja os logs no Console (Ctrl+Shift+C)")
        print("   5. Menu deve aparecer!")
        return 0
    else:
        print("❌ PROBLEMAS ENCONTRADOS!")
        print("\n🔧 CORREÇÃO:")
        print("   Execute: python3 tools/create_menu_scene.py")
        print("   Depois rode este script novamente.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
