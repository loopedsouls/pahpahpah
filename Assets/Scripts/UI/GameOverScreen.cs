using UnityEngine;
using TMPro;

public class GameOverScreen : MonoBehaviour
{
    [SerializeField] private GameObject gameOverUI;
    [SerializeField] private TextMeshProUGUI messageText;

    private void Start()
    {
        if (gameOverUI != null)
        {
            gameOverUI.SetActive(false);
        }
    }

    private void Update()
    {
        if (GameManager.Instance != null && gameOverUI != null)
        {
            bool shouldShow = GameManager.Instance.CurrentState == GameManager.GameState.GameOver;
            
            if (gameOverUI.activeSelf != shouldShow)
            {
                gameOverUI.SetActive(shouldShow);
                
                if (shouldShow && messageText != null)
                {
                    messageText.text = "VOCÊ PERDEU O PÚBLICO!\nTENTE NOVAMENTE";
                }
            }
        }
    }

    public void Retry()
    {
        if (GameManager.Instance != null)
        {
            GameManager.Instance.RestartGame();
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
