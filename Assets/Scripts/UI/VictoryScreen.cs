using UnityEngine;
using TMPro;

public class VictoryScreen : MonoBehaviour
{
    [SerializeField] private GameObject victoryUI;
    [SerializeField] private TextMeshProUGUI messageText;
    [SerializeField] private TextMeshProUGUI statsText;

    private void Start()
    {
        if (victoryUI != null)
        {
            victoryUI.SetActive(false);
        }
    }

    private void Update()
    {
        if (GameManager.Instance != null && victoryUI != null)
        {
            bool shouldShow = GameManager.Instance.CurrentState == GameManager.GameState.Victory;
            
            if (victoryUI.activeSelf != shouldShow)
            {
                victoryUI.SetActive(shouldShow);
                
                if (shouldShow)
                {
                    DisplayVictory();
                }
            }
        }
    }

    private void DisplayVictory()
    {
        if (messageText != null)
        {
            messageText.text = "ARENA COMPLETA!\nO PÚBLICO AMOU!";
        }

        if (statsText != null)
        {
            var arena = FindFirstObjectByType<ArenaManager>();
            if (arena != null)
            {
                float time = arena.GetElapsedTime();
                int minutes = (int)(time / 60);
                int seconds = (int)(time % 60);
                statsText.text = $"Tempo: {minutes:00}:{seconds:00}";
            }
        }
    }

    public void NextArena()
    {
        if (GameManager.Instance != null)
        {
            GameManager.Instance.StartGame();
        }
    }

    public void ReturnToMenu()
    {
        if (GameManager.Instance != null)
        {
            GameManager.Instance.ReturnToMenu();
        }
    }
}
