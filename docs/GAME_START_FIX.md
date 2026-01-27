# ✅ CORREÇÃO: Botão JOGAR Funcionando!

## O que foi feito:

1. **Corrigido GameManager.StartGame()**
   - Agora carrega a cena "Game" (que existe)
   - Antes tentava carregar "Arena1" (que não existe ainda)

2. **Criado GameBootstrap.cs**
   - Garante que o GameManager existe antes de qualquer cena
   - Usa `RuntimeInitializeOnLoadMethod` para inicializar

3. **Atualizado MainMenuManager.cs**
   - Botão JOGAR agora chama `GameManager.Instance.StartGame()`
   - Tem fallback se GameManager não existir

4. **Criado GameSceneDebug.cs**
   - Script temporário para mostrar que o jogo carregou
   - Mostra tela verde com texto de sucesso
   - Botão para voltar ao menu
   - ESC também volta ao menu

## Como testar:

1. **Feche e reabra o Unity**

2. **Abra MainMenu.unity**

3. **Clique Play ▶️**

4. **Clique no botão JOGAR**

5. **Deve aparecer:**
   - Tela verde escuro
   - Texto: "✅ JOGO INICIADO COM SUCESSO!"
   - Botão "VOLTAR AO MENU"

6. **Logs esperados no Console:**
   ```
   🚀 GameBootstrap: Inicializando sistemas...
   ✅ GameManager criado automaticamente
   🎮 Botão JOGAR clicado!
   ✓ GameManager encontrado - usando StartGame()
   🎮 GameManager.StartGame() - Carregando cena Game...
   🎮 GameSceneDebug: Cena Game carregada!
   ✅ Debug UI criada - jogo carregou corretamente!
   ```

## Arquivos modificados/criados:

- ✅ `Assets/Scripts/GameBootstrap.cs` (NOVO)
- ✅ `Assets/Scripts/GameSceneDebug.cs` (NOVO)
- ✅ `Assets/Scripts/Managers/GameManager.cs` (MODIFICADO)
- ✅ `Assets/Scripts/UI/MainMenuManager.cs` (MODIFICADO)
- ✅ `Assets/Scenes/Game.unity` (MODIFICADO - adicionado GameSceneDebug)

## Próximos passos no MVP:

Agora que o botão funciona, você pode substituir o `GameSceneDebug.cs` pelo gameplay real:

1. **Player Controller** (movimento WASD + mouse aim)
2. **Shooting System** (atirar tortas)
3. **Enemy Spawner** (ondas de inimigos)
4. **Mask System** (coletar e usar máscaras)
5. **HUD** (vidas, público, máscaras equipadas)

## Estrutura recomendada:

```
Game Scene deve ter:
├── GameManager (já existe - DontDestroyOnLoad)
├── ArenaManager (gerencia ondas e timer)
├── Player (movimento + ataque)
├── WaveSpawner (spawna inimigos)
├── HUD Canvas (UI do jogo)
└── AudienceMeter (barra de público)
```

## Testando o fluxo completo:

Menu → Jogar → Game Scene (verde) → ESC/Botão → Volta ao Menu

Se tudo isso funcionar, significa que:
- ✅ Menu funciona
- ✅ Transição de cenas funciona
- ✅ GameManager persiste entre cenas
- ✅ Pode voltar ao menu

**Tudo pronto para implementar o gameplay real!** 🎮

---

**Nota**: O `GameSceneDebug.cs` é temporário. Quando implementar o gameplay real, pode removê-lo e usar os scripts de arena/player/enemies.
