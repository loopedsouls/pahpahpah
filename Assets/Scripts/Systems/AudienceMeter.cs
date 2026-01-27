using UnityEngine;

public class AudienceMeter : MonoBehaviour
{
    [Header("Settings")]
    [SerializeField] private float maxMeter = 100f;
    [SerializeField] private float startingMeter = 50f;
    [SerializeField] private float gameOverThreshold = 20f;
    [SerializeField] private float bonusDamageThreshold = 80f;

    [Header("Gain Values")]
    [SerializeField] private float pieHitGain = 5f;
    [SerializeField] private float enemyKillGain = 8f;
    [SerializeField] private float comboGain = 10f;

    [Header("Loss Values")]
    [SerializeField] private float pieMissLoss = 2f;
    [SerializeField] private float damageTakenLoss = 5f;
    [SerializeField] private float enemyEscapeLoss = 15f;
    [SerializeField] private float idleLoss = 10f;
    [SerializeField] private float idleTime = 5f;

    private float currentMeter;
    private float lastActionTime;
    private int comboCount;
    private float comboTimer;
    private const float COMBO_WINDOW = 2f;

    public float CurrentMeter => currentMeter;
    public float MaxMeter => maxMeter;
    public float Percentage => currentMeter / maxMeter * 100f;
    public bool HasBonusDamage => currentMeter >= bonusDamageThreshold;

    public System.Action<float, float> OnMeterChanged;
    public System.Action OnGameOverFromAudience;
    public System.Action OnBonusDamageActivated;
    public System.Action OnBonusDamageDeactivated;

    private bool wasBonusActive;

    private void Start()
    {
        currentMeter = startingMeter;
        lastActionTime = Time.time;

        PieProjectile.OnPieHit += HandlePieHit;
        PieProjectile.OnPieMiss += HandlePieMiss;
        EnemyBase.OnEnemyDeath += HandleEnemyKill;
    }

    private void Update()
    {
        // Combo timer
        if (comboCount > 0)
        {
            comboTimer -= Time.deltaTime;
            if (comboTimer <= 0)
            {
                comboCount = 0;
            }
        }

        // Idle penalty
        if (Time.time - lastActionTime >= idleTime)
        {
            ModifyMeter(-idleLoss * Time.deltaTime);
        }

        // Check bonus damage state
        bool isBonusActive = HasBonusDamage;
        if (isBonusActive != wasBonusActive)
        {
            if (isBonusActive)
                OnBonusDamageActivated?.Invoke();
            else
                OnBonusDamageDeactivated?.Invoke();
            
            wasBonusActive = isBonusActive;
        }
    }

    private void HandlePieHit()
    {
        lastActionTime = Time.time;
        
        comboCount++;
        comboTimer = COMBO_WINDOW;

        float gain = pieHitGain;
        if (comboCount >= 3)
        {
            gain += comboGain;
        }

        ModifyMeter(gain);
    }

    private void HandlePieMiss()
    {
        comboCount = 0;
        ModifyMeter(-pieMissLoss);
    }

    private void HandleEnemyKill(EnemyBase enemy)
    {
        lastActionTime = Time.time;
        ModifyMeter(enemyKillGain);
    }

    public void OnPlayerDamaged()
    {
        ModifyMeter(-damageTakenLoss);
    }

    public void OnEnemyEscaped()
    {
        ModifyMeter(-enemyEscapeLoss);
    }

    private void ModifyMeter(float amount)
    {
        currentMeter = Mathf.Clamp(currentMeter + amount, 0, maxMeter);
        OnMeterChanged?.Invoke(currentMeter, maxMeter);

        if (currentMeter < gameOverThreshold)
        {
            OnGameOverFromAudience?.Invoke();
        }
    }

    private void OnDestroy()
    {
        PieProjectile.OnPieHit -= HandlePieHit;
        PieProjectile.OnPieMiss -= HandlePieMiss;
        EnemyBase.OnEnemyDeath -= HandleEnemyKill;
    }
}
