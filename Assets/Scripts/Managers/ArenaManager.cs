using UnityEngine;

public class ArenaManager : MonoBehaviour
{
    [Header("Arena Settings")]
    [SerializeField] private string arenaName = "Arena 1";
    [SerializeField] private float arenaTimeLimit = 120f;
    [SerializeField] private Transform[] spawnPoints;

    [Header("References")]
    private WaveManager waveManager;
    private AudienceMeter audienceMeter;

    private float elapsedTime;
    private bool arenaActive;

    private void Start()
    {
        waveManager = GetComponent<WaveManager>();
        audienceMeter = FindFirstObjectByType<AudienceMeter>();
        
        StartArena();
    }

    private void Update()
    {
        if (!arenaActive) return;

        elapsedTime += Time.deltaTime;

        if (elapsedTime >= arenaTimeLimit)
        {
            TimeOut();
        }
    }

    public void StartArena()
    {
        arenaActive = true;
        elapsedTime = 0f;

        if (waveManager != null)
        {
            waveManager.StartWaves();
        }

        Debug.Log($"Arena Started: {arenaName}");
    }

    public void CompleteArena()
    {
        arenaActive = false;
        Debug.Log($"Arena Completed: {arenaName}");

        if (GameManager.Instance != null)
        {
            GameManager.Instance.Victory();
        }
    }

    private void TimeOut()
    {
        arenaActive = false;
        Debug.Log($"Arena Time Out: {arenaName}");

        if (GameManager.Instance != null)
        {
            GameManager.Instance.GameOver();
        }
    }

    public Transform GetRandomSpawnPoint()
    {
        if (spawnPoints == null || spawnPoints.Length == 0)
        {
            return transform;
        }

        return spawnPoints[Random.Range(0, spawnPoints.Length)];
    }

    public float GetRemainingTime()
    {
        return Mathf.Max(0, arenaTimeLimit - elapsedTime);
    }

    public float GetElapsedTime()
    {
        return elapsedTime;
    }
}
