using UnityEngine;

/// <summary>
/// Máscara Cirúrgica: Regenera 1 HP a cada 5 acertos (passivo)
/// </summary>
public class SurgicalMaskBehavior : MaskBehavior
{
    [SerializeField] private int hitsToHeal = 5;
    
    private HealthSystem playerHealth;
    private int hitCounter;

    protected override void Awake()
    {
        base.Awake();
        playerHealth = GetComponent<HealthSystem>();
    }

    private void OnEnable()
    {
        PieProjectile.OnPieHit += HandlePieHit;
    }

    private void OnDisable()
    {
        PieProjectile.OnPieHit -= HandlePieHit;
    }

    protected override void OnActivate()
    {
        // Passive - always active when equipped
        hitCounter = 0;
    }

    private void HandlePieHit()
    {
        if (!isActive) return;

        hitCounter++;
        
        if (hitCounter >= hitsToHeal)
        {
            hitCounter = 0;
            
            if (playerHealth != null)
            {
                playerHealth.Heal(1);
            }
        }
    }

    public int CurrentHits => hitCounter;
    public int HitsRequired => hitsToHeal;
}
