using UnityEngine;
using System.Collections.Generic;

/// <summary>
/// Data Mask: Inimigos próximos ficam confusos por 5s
/// </summary>
public class DataMaskBehavior : MaskBehavior
{
    [SerializeField] private float confusionRadius = 5f;
    [SerializeField] private float confusionDuration = 5f;
    [SerializeField] private LayerMask enemyLayer;

    private List<EnemyBase> confusedEnemies = new List<EnemyBase>();

    protected override void OnActivate()
    {
        ApplyConfusion();
    }

    private void ApplyConfusion()
    {
        Collider2D[] enemies = Physics2D.OverlapCircleAll(transform.position, confusionRadius, enemyLayer);

        foreach (var col in enemies)
        {
            if (col.TryGetComponent<EnemyBase>(out var enemy))
            {
                confusedEnemies.Add(enemy);
                // Add confusion component or flag
                var confusion = enemy.gameObject.AddComponent<ConfusionEffect>();
                confusion.Initialize(confusionDuration);
            }
        }

        StartCoroutine(EndConfusionAfterDuration());
    }

    private System.Collections.IEnumerator EndConfusionAfterDuration()
    {
        yield return new WaitForSeconds(confusionDuration);
        confusedEnemies.Clear();
        Deactivate();
    }
}

public class ConfusionEffect : MonoBehaviour
{
    private float duration;
    private float randomMoveTimer;
    private Vector2 randomDirection;
    private Rigidbody2D rb;

    public void Initialize(float dur)
    {
        duration = dur;
        rb = GetComponent<Rigidbody2D>();
        Destroy(this, duration);
    }

    private void Update()
    {
        randomMoveTimer -= Time.deltaTime;
        
        if (randomMoveTimer <= 0)
        {
            randomDirection = Random.insideUnitCircle.normalized;
            randomMoveTimer = Random.Range(0.5f, 1.5f);
        }

        if (rb != null)
        {
            rb.velocity = randomDirection * 2f;
        }
    }
}
