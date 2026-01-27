using UnityEngine;
using System.Collections.Generic;

[System.Serializable]
public class Wave
{
    public string waveName;
    public List<EnemySpawnInfo> enemies;
    public float delayBeforeWave = 2f;
}

[System.Serializable]
public class EnemySpawnInfo
{
    public GameObject enemyPrefab;
    public int count;
    public float spawnDelay = 0.5f;
}

public class WaveManager : MonoBehaviour
{
    [SerializeField] private List<Wave> waves;
    [SerializeField] private List<Transform> spawnPoints;

    private int currentWaveIndex = -1;
    private int enemiesAlive;
    private bool isSpawning;

    public int CurrentWave => currentWaveIndex + 1;
    public int TotalWaves => waves.Count;
    public bool IsComplete => currentWaveIndex >= waves.Count;

    public System.Action<int, int> OnWaveStarted;
    public System.Action OnWaveCompleted;
    public System.Action OnAllWavesCompleted;

    private void Start()
    {
        EnemyBase.OnEnemyDeath += HandleEnemyDeath;
    }

    public void StartWaves()
    {
        StartNextWave();
    }

    public void StartNextWave()
    {
        currentWaveIndex++;

        if (currentWaveIndex >= waves.Count)
        {
            OnAllWavesCompleted?.Invoke();
            return;
        }

        StartCoroutine(SpawnWave(waves[currentWaveIndex]));
    }

    private System.Collections.IEnumerator SpawnWave(Wave wave)
    {
        isSpawning = true;
        
        yield return new WaitForSeconds(wave.delayBeforeWave);
        
        OnWaveStarted?.Invoke(currentWaveIndex + 1, waves.Count);

        foreach (var spawnInfo in wave.enemies)
        {
            for (int i = 0; i < spawnInfo.count; i++)
            {
                SpawnEnemy(spawnInfo.enemyPrefab);
                enemiesAlive++;
                yield return new WaitForSeconds(spawnInfo.spawnDelay);
            }
        }

        isSpawning = false;
    }

    private void SpawnEnemy(GameObject prefab)
    {
        if (spawnPoints.Count == 0) return;

        Transform spawnPoint = spawnPoints[Random.Range(0, spawnPoints.Count)];
        Instantiate(prefab, spawnPoint.position, Quaternion.identity);
    }

    private void HandleEnemyDeath(EnemyBase enemy)
    {
        enemiesAlive--;

        if (enemiesAlive <= 0 && !isSpawning)
        {
            OnWaveCompleted?.Invoke();

            if (currentWaveIndex + 1 >= waves.Count)
            {
                OnAllWavesCompleted?.Invoke();
            }
            else
            {
                StartNextWave();
            }
        }
    }

    private void OnDestroy()
    {
        EnemyBase.OnEnemyDeath -= HandleEnemyDeath;
    }
}
