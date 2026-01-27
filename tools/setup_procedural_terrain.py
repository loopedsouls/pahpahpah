#!/usr/bin/env python3
"""
Script para configurar automaticamente a cena start3d com terreno procedural
Não requer Unity Editor aberto - modifica o arquivo .unity diretamente
"""

import os
import re
import random
import sys

# Caminhos
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
SCENE_PATH = os.path.join(PROJECT_ROOT, "Assets", "Scenes", "start3d.unity")
BACKUP_PATH = os.path.join(PROJECT_ROOT, "Assets", "Scenes", "start3d.unity.backup")

# GUID do script Start3DProceduralSetup (do arquivo .meta)
SETUP_SCRIPT_GUID = "c9e32cc78c0d437683887ff0e414ea05"

def generate_file_id():
    """Gera um fileID único para Unity"""
    return random.randint(600, 999999)

def create_procedural_setup_gameobject(file_id_base):
    """Cria o YAML para o GameObject ProceduralSetup"""
    go_id = file_id_base
    transform_id = file_id_base + 1
    script_id = file_id_base + 2
    
    yaml = f"""--- !u!1 &{go_id}
GameObject:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {{fileID: 0}}
  m_PrefabInstance: {{fileID: 0}}
  m_PrefabAsset: {{fileID: 0}}
  serializedVersion: 6
  m_Component:
  - component: {{fileID: {transform_id}}}
  - component: {{fileID: {script_id}}}
  m_Layer: 0
  m_Name: ProceduralSetup
  m_TagString: Untagged
  m_Icon: {{fileID: 0}}
  m_NavMeshLayer: 0
  m_StaticEditorFlags: 0
  m_IsActive: 1
--- !u!4 &{transform_id}
Transform:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {{fileID: 0}}
  m_PrefabInstance: {{fileID: 0}}
  m_PrefabAsset: {{fileID: 0}}
  m_GameObject: {{fileID: {go_id}}}
  m_LocalRotation: {{x: 0, y: 0, z: 0, w: 1}}
  m_LocalPosition: {{x: 0, y: 0, z: 0}}
  m_LocalScale: {{x: 1, y: 1, z: 1}}
  m_Children: []
  m_Father: {{fileID: 0}}
  m_RootOrder: 0
  m_LocalEulerAnglesHint: {{x: 0, y: 0, z: 0}}
--- !u!114 &{script_id}
MonoBehaviour:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {{fileID: 0}}
  m_PrefabInstance: {{fileID: 0}}
  m_PrefabAsset: {{fileID: 0}}
  m_GameObject: {{fileID: {go_id}}}
  m_Enabled: 1
  m_EditorHideFlags: 0
  m_Script: {{fileID: 11500000, guid: {SETUP_SCRIPT_GUID}, type: 3}}
  m_Name: 
  m_EditorClassIdentifier: 
  autoSetup: 1
  createLighting: 1
  createSkybox: 1
  createPlayer: 1
  createTerrain: 1
  playerSpawnPosition: {{x: 0, y: 30, z: 0}}
  worldSeed: 12345
  viewDistance: 5
  maxTerrainHeight: 25
  playerObject: {{fileID: 0}}
  terrainGenerator: {{fileID: 0}}
  directionalLight: {{fileID: 0}}
"""
    return yaml, go_id

def update_render_settings(content):
    """Atualiza as configurações de render para névoa e ambiente Genshin-style"""
    # Atualiza fog settings
    content = re.sub(
        r'm_Fog: \d',
        'm_Fog: 1',
        content
    )
    content = re.sub(
        r'm_FogColor: \{r: [\d.]+, g: [\d.]+, b: [\d.]+, a: [\d.]+\}',
        'm_FogColor: {r: 0.75, g: 0.85, b: 0.95, a: 1}',
        content
    )
    content = re.sub(
        r'm_FogMode: \d',
        'm_FogMode: 1',  # Linear fog
        content
    )
    content = re.sub(
        r'm_LinearFogStart: [\d.]+',
        'm_LinearFogStart: 50',
        content
    )
    content = re.sub(
        r'm_LinearFogEnd: [\d.]+',
        'm_LinearFogEnd: 200',
        content
    )
    # Ambient colors (Genshin style)
    content = re.sub(
        r'm_AmbientSkyColor: \{r: [\d.]+, g: [\d.]+, b: [\d.]+, a: [\d.]+\}',
        'm_AmbientSkyColor: {r: 0.7, g: 0.85, b: 1, a: 1}',
        content
    )
    content = re.sub(
        r'm_AmbientEquatorColor: \{r: [\d.]+, g: [\d.]+, b: [\d.]+, a: [\d.]+\}',
        'm_AmbientEquatorColor: {r: 0.8, g: 0.85, b: 0.8, a: 1}',
        content
    )
    content = re.sub(
        r'm_AmbientGroundColor: \{r: [\d.]+, g: [\d.]+, b: [\d.]+, a: [\d.]+\}',
        'm_AmbientGroundColor: {r: 0.4, g: 0.35, b: 0.3, a: 1}',
        content
    )
    return content

def remove_old_objects(content):
    """Remove objetos antigos (Floor, Ellysa_Player, EllysaModel)"""
    # Padrão para encontrar GameObjects completos
    # Vamos identificar pelos IDs conhecidos: 300 (Floor), 400 (Ellysa_Player), 500 (EllysaModel)
    
    objects_to_remove = ['300', '301', '302', '303', '304',  # Floor
                         '400', '401', '402', '403',          # Ellysa_Player
                         '500', '501', '502', '503']          # EllysaModel
    
    for obj_id in objects_to_remove:
        # Remove cada bloco YAML que começa com o ID
        pattern = rf'--- !u!\d+ &{obj_id}\n(?:.*?\n)*?(?=--- !u!|\Z)'
        content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    return content

def update_camera_for_procedural(content):
    """Atualiza a câmera para não ser usada (o player controller cria a dele)"""
    # Desativa a câmera principal (será controlada pelo player)
    # Na verdade, vamos deixar, o ProceduralPlayerController vai usar Camera.main
    return content

def main():
    print("🌍 Configurando cena start3d com terreno procedural...")
    print(f"📁 Cena: {SCENE_PATH}")
    
    # Verifica se o arquivo existe
    if not os.path.exists(SCENE_PATH):
        print(f"❌ Erro: Arquivo não encontrado: {SCENE_PATH}")
        sys.exit(1)
    
    # Faz backup
    print(f"💾 Criando backup: {BACKUP_PATH}")
    with open(SCENE_PATH, 'r', encoding='utf-8') as f:
        original_content = f.read()
    
    with open(BACKUP_PATH, 'w', encoding='utf-8') as f:
        f.write(original_content)
    
    content = original_content
    
    # 1. Atualiza render settings
    print("🎨 Atualizando configurações de render...")
    content = update_render_settings(content)
    
    # 2. Remove objetos antigos
    print("🗑️  Removendo objetos antigos (Floor, Ellysa_Player)...")
    content = remove_old_objects(content)
    
    # 3. Cria o ProceduralSetup GameObject
    print("➕ Adicionando ProceduralSetup...")
    file_id = generate_file_id()
    setup_yaml, go_id = create_procedural_setup_gameobject(file_id)
    
    # Adiciona no final do arquivo
    content = content.rstrip() + "\n" + setup_yaml
    
    # 4. Salva o arquivo
    print("💾 Salvando cena modificada...")
    with open(SCENE_PATH, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("")
    print("=" * 60)
    print("✅ CENA CONFIGURADA COM SUCESSO!")
    print("=" * 60)
    print("")
    print("📋 O que foi feito:")
    print("   • Removido: Floor (chão antigo)")
    print("   • Removido: Ellysa_Player (player antigo)")
    print("   • Removido: EllysaModel")
    print("   • Adicionado: ProceduralSetup (GameObject)")
    print("   • Configurado: Névoa estilo Genshin")
    print("   • Configurado: Iluminação ambiente")
    print("")
    print("🎮 Quando você abrir o Unity e dar Play:")
    print("   • Terreno procedural será gerado automaticamente")
    print("   • Personagem lowpoly roxo (Mia) será criado")
    print("   • Câmera 3ª pessoa estilo Genshin")
    print("")
    print("🎯 Controles:")
    print("   WASD     - Mover")
    print("   Mouse    - Câmera")
    print("   Shift    - Correr")
    print("   Space    - Pular")
    print("   Tab      - Cursor")
    print("   ESC      - Menu")
    print("")
    print(f"📂 Backup salvo em: {BACKUP_PATH}")

if __name__ == "__main__":
    main()
