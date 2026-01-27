using UnityEngine;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    public enum GameState { Menu, Playing, Paused, GameOver, Victory }

    [SerializeField] private int maxContinues = 2;

    private GameState currentState;
    private int continuesUsed;
    private int currentArena;

    public GameState CurrentState => currentState;
    public int CurrentArena => currentArena;

    public System.Action<GameState> OnStateChanged;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    private void Start()
    {
        SetState(GameState.Menu);
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            if (currentState == GameState.Playing)
                PauseGame();
            else if (currentState == GameState.Paused)
                ResumeGame();
        }
    }

    public void SetState(GameState newState)
    {
        currentState = newState;
        
        switch (newState)
        {
            case GameState.Menu:
                Time.timeScale = 1f;
                break;
            case GameState.Playing:
                Time.timeScale = 1f;
                break;
            case GameState.Paused:
                Time.timeScale = 0f;
                break;
            case GameState.GameOver:
                Time.timeScale = 0f;
                break;
            case GameState.Victory:
                Time.timeScale = 0f;
                break;
        }

        OnStateChanged?.Invoke(newState);
    }

    public void StartGame()
    {
        currentArena = 1;
        continuesUsed = 0;
        SetState(GameState.Playing);
        SceneManager.LoadScene("Arena1");
    }

    public void PauseGame()
    {
        SetState(GameState.Paused);
    }

    public void ResumeGame()
    {
        SetState(GameState.Playing);
    }

    public void GameOver()
    {
        SetState(GameState.GameOver);
    }

    public void Victory()
    {
        SetState(GameState.Victory);
    }

    public bool TryContinue()
    {
        if (continuesUsed >= maxContinues) return false;

        continuesUsed++;
        SetState(GameState.Playing);
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
        return true;
    }

    public void NextArena()
    {
        currentArena++;
        
        if (currentArena > 4)
        {
            Victory();
            return;
        }

        SceneManager.LoadScene($"Arena{currentArena}");
    }

    public void ReturnToMenu()
    {
        SetState(GameState.Menu);
        SceneManager.LoadScene("MainMenu");
    }

    public void RestartGame()
    {
        SetState(GameState.Playing);
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }

    public void TogglePause()
    {
        if (currentState == GameState.Playing)
            PauseGame();
        else if (currentState == GameState.Paused)
            ResumeGame();
    }

    public void QuitGame()
    {
        #if UNITY_EDITOR
        UnityEditor.EditorApplication.isPlaying = false;
        #else
        Application.Quit();
        #endif
    }
}
