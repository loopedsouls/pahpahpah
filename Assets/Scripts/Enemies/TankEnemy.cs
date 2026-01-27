using UnityEngine;

public class TankEnemy : EnemyBase
{
    [Header("Tank Settings")]
    [SerializeField] private float knockbackForce = 8f;
    [SerializeField] private float attackCooldown = 1f;

    private float nextAttackTime;

    protected override void Awake()
    {
        base.Awake();
        moveSpeed = 1.5f; // Slower than basic
    }

    protected override void UpdateBehavior()
    {
        Vector2 direction = GetDirectionToPlayer();
        rb.velocity = direction * moveSpeed;

        if (direction.x != 0)
        {
            transform.localScale = new Vector3(Mathf.Sign(direction.x), 1, 1);
        }
    }

    protected override void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Player") && Time.time >= nextAttackTime)
        {
            if (collision.gameObject.TryGetComponent<HealthSystem>(out var playerHealth))
            {
                playerHealth.TakeDamage(contactDamage);
            }

            // Apply knockback
            if (collision.gameObject.TryGetComponent<Rigidbody2D>(out var playerRb))
            {
                Vector2 knockbackDir = (collision.transform.position - transform.position).normalized;
                playerRb.AddForce(knockbackDir * knockbackForce, ForceMode2D.Impulse);
            }

            nextAttackTime = Time.time + attackCooldown;
        }
    }
}
