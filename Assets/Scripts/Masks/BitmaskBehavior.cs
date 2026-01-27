using UnityEngine;

/// <summary>
/// Bitmask: Tortas atingem múltiplos inimigos em área (passivo)
/// </summary>
public class BitmaskBehavior : MaskBehavior
{
    [SerializeField] private float aoeRadius = 2f;
    [SerializeField] private LayerMask enemyLayer;

    protected override void OnActivate()
    {
        // Passive - handled by modifying pie behavior
    }

    public void ApplyAreaDamage(Vector2 hitPosition, int damage)
    {
        if (!isActive) return;

        Collider2D[] enemies = Physics2D.OverlapCircleAll(hitPosition, aoeRadius, enemyLayer);
        
        foreach (var enemy in enemies)
        {
            if (enemy.TryGetComponent<HealthSystem>(out var health))
            {
                health.TakeDamage(damage);
            }
        }
    }
}
