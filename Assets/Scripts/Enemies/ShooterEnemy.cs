using UnityEngine;

public class ShooterEnemy : EnemyBase
{
    [Header("Shooter Settings")]
    [SerializeField] private float preferredDistance = 6f;
    [SerializeField] private float fireRate = 1.5f;
    [SerializeField] private GameObject piePrefab;
    [SerializeField] private Transform firePoint;

    private float nextFireTime;

    protected override void UpdateBehavior()
    {
        float distance = GetDistanceToPlayer();
        Vector2 direction = GetDirectionToPlayer();

        // Maintain preferred distance
        if (distance < preferredDistance - 1f)
        {
            rb.linearVelocity = -direction * moveSpeed;
        }
        else if (distance > preferredDistance + 1f)
        {
            rb.linearVelocity = direction * moveSpeed;
        }
        else
        {
            rb.linearVelocity = Vector2.zero;
        }

        // Face player
        if (direction.x != 0)
        {
            transform.localScale = new Vector3(Mathf.Sign(direction.x), 1, 1);
        }

        // Shoot
        if (Time.time >= nextFireTime && distance <= preferredDistance + 2f)
        {
            Shoot();
            nextFireTime = Time.time + fireRate;
        }
    }

    private void Shoot()
    {
        if (piePrefab == null || firePoint == null) return;

        Vector2 direction = GetDirectionToPlayer();
        GameObject pie = Instantiate(piePrefab, firePoint.position, Quaternion.identity);
        
        // Enemy pies should have different tag/layer
        pie.tag = "EnemyProjectile";
        
        if (pie.TryGetComponent<PieProjectile>(out var projectile))
        {
            projectile.Initialize(direction);
        }
    }
}
