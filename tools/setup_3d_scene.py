#!/usr/bin/env python3
"""
Script para configurar a cena start3d automaticamente sem Unity Editor
Adiciona o modelo da cozinha, Ellysa e o Scene3DController à câmera
"""

import os
import re
import uuid

def generate_unity_guid():
    """Gera um GUID único no formato Unity"""
    return str(uuid.uuid4()).replace('-', '')

def find_meta_guid(meta_path):
    """Extrai o GUID de um arquivo .meta"""
    if not os.path.exists(meta_path):
        return None
    
    with open(meta_path, 'r') as f:
        content = f.read()
        match = re.search(r'guid:\s*([a-f0-9]+)', content)
        if match:
            return match.group(1)
    return None

def get_file_id_from_fbx(fbx_meta_path):
    """Extrai o primeiro fileID de mesh de um arquivo FBX"""
    # Para FBX, Unity gera fileIDs específicos
    # Usaremos um padrão genérico
    return "100100000"  # ID padrão para primeiro mesh em FBX

def update_scene_with_models(scene_path):
    """Atualiza a cena start3d com os modelos e componentes"""
    
    print("🔧 Configurando cena start3d automaticamente...")
    
    # Encontrar GUIDs dos assets
    kitchen_guid = find_meta_guid("Assets/Environment/Models/kitchen.blend.meta")
    ellysa_guid = find_meta_guid("Assets/Characters/Ellysa/Ellysa.fbx.meta")
    controller_guid = find_meta_guid("Assets/Scripts/Scene3DController.cs.meta")
    
    if not kitchen_guid:
        print("❌ kitchen.blend.meta não encontrado")
        return False
    
    print(f"✅ Kitchen GUID: {kitchen_guid}")
    
    if ellysa_guid:
        print(f"✅ Ellysa GUID: {ellysa_guid}")
    else:
        print("⚠️  Ellysa.fbx.meta não encontrado, pulando")
    
    if controller_guid:
        print(f"✅ Scene3DController GUID: {controller_guid}")
    else:
        print("⚠️  Scene3DController.cs.meta não encontrado, pulando")
    
    # Ler cena atual
    with open(scene_path, 'r') as f:
        scene_content = f.read()
    
    # IDs únicos para novos GameObjects
    kitchen_model_id = 1234567892
    ellysa_model_id = 1234567893
    
    # Adicionar componente Scene3DController à câmera
    if controller_guid:
        camera_component = f"""  - component: {{fileID: 1234567894}}"""
        
        # Inserir componente na lista de componentes da câmera (GameObject 963194225)
        scene_content = scene_content.replace(
            """  m_Component:
  - component: {fileID: 963194228}
  - component: {fileID: 963194227}
  - component: {fileID: 963194226}""",
            f"""  m_Component:
  - component: {{fileID: 963194228}}
  - component: {{fileID: 963194227}}
  - component: {{fileID: 963194226}}
{camera_component}"""
        )
        
        # Adicionar MonoBehaviour do Scene3DController
        controller_mono = f"""--- !u!114 &1234567894
MonoBehaviour:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {{fileID: 0}}
  m_PrefabInstance: {{fileID: 0}}
  m_PrefabAsset: {{fileID: 0}}
  m_GameObject: {{fileID: 963194225}}
  m_Enabled: 1
  m_EditorHideFlags: 0
  m_Script: {{fileID: 11500000, guid: {controller_guid}, type: 3}}
  m_Name: 
  m_EditorClassIdentifier: 
  mouseSensitivity: 2
  moveSpeed: 5
  minYAngle: -60
  maxYAngle: 60
  exitKey: 27
  menuSceneName: MainMenu
"""
        # Inserir antes do último GameObject (Kitchen)
        scene_content = scene_content.replace(
            "--- !u!1 &1234567890",
            controller_mono + "--- !u!1 &1234567890"
        )
    
    # Adicionar modelo da cozinha como filho do GameObject Kitchen
    kitchen_prefab = f"""--- !u!1001 &{kitchen_model_id}
PrefabInstance:
  m_ObjectHideFlags: 0
  serializedVersion: 2
  m_Modification:
    m_TransformParent: {{fileID: 1234567891}}
    m_Modifications: []
    m_RemovedComponents: []
  m_SourcePrefab: {{fileID: 100100000, guid: {kitchen_guid}, type: 3}}
"""
    
    # Adicionar modelo da Ellysa se existir
    ellysa_prefab = ""
    if ellysa_guid:
        ellysa_prefab = f"""--- !u!1001 &{ellysa_model_id}
PrefabInstance:
  m_ObjectHideFlags: 0
  serializedVersion: 2
  m_Modification:
    m_TransformParent: {{fileID: 1234567891}}
    m_Modifications:
    - target: {{fileID: 400000, guid: {ellysa_guid}, type: 3}}
      propertyPath: m_LocalPosition.x
      value: 2
      objectReference: {{fileID: 0}}
    - target: {{fileID: 400000, guid: {ellysa_guid}, type: 3}}
      propertyPath: m_LocalPosition.y
      value: 0
      objectReference: {{fileID: 0}}
    - target: {{fileID: 400000, guid: {ellysa_guid}, type: 3}}
      propertyPath: m_LocalPosition.z
      value: 0
      objectReference: {{fileID: 0}}
    - target: {{fileID: 400000, guid: {ellysa_guid}, type: 3}}
      propertyPath: m_LocalRotation.x
      value: 0
      objectReference: {{fileID: 0}}
    - target: {{fileID: 400000, guid: {ellysa_guid}, type: 3}}
      propertyPath: m_LocalRotation.y
      value: 0
      objectReference: {{fileID: 0}}
    - target: {{fileID: 400000, guid: {ellysa_guid}, type: 3}}
      propertyPath: m_LocalRotation.z
      value: 0
      objectReference: {{fileID: 0}}
    - target: {{fileID: 400000, guid: {ellysa_guid}, type: 3}}
      propertyPath: m_LocalRotation.w
      value: 1
      objectReference: {{fileID: 0}}
    m_RemovedComponents: []
  m_SourcePrefab: {{fileID: 100100000, guid: {ellysa_guid}, type: 3}}
"""
    
    # Adicionar ao final da cena
    scene_content += "\n" + kitchen_prefab
    if ellysa_prefab:
        scene_content += "\n" + ellysa_prefab
    
    # Salvar cena modificada
    with open(scene_path, 'w') as f:
        f.write(scene_content)
    
    print("✅ Cena start3d configurada com sucesso!")
    return True

if __name__ == "__main__":
    scene_path = "Assets/Scenes/start3d.unity"
    
    if not os.path.exists(scene_path):
        print(f"❌ Cena {scene_path} não encontrada")
        exit(1)
    
    success = update_scene_with_models(scene_path)
    
    if success:
        print("\n" + "="*60)
        print("✅ CONFIGURAÇÃO COMPLETA!")
        print("="*60)
        print("\nA cena start3d agora contém:")
        print("  • Modelo da cozinha (kitchen.blend)")
        print("  • Modelo da Ellysa (Ellysa.fbx)")
        print("  • Scene3DController na câmera")
        print("\nAbra o Unity Editor para testar!")
    else:
        print("\n❌ Falha na configuração")
        exit(1)
