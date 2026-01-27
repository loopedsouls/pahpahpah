using UnityEngine;

public class PieProjectile : MonoBehaviour
{
    [SerializeField] private float speed = 12f;
    [SerializeField] private int damage = 1;
    [SerializeField] private float lifetime = 3f;
    [SerializeField] private LayerMask enemyLayer;

    private Vector2 direction;
    private Rigidbody2D rb;
    private bool hasHit;

    public static System.Action OnPieHit;
    public static System.Action OnPieMiss;

    public void Initialize(Vector2 dir)
    {
        direction = dir.normalized;
        
        float angle = Mathf.Atan2(direction.y, direction.x) * Mathf.Rad2Deg;
        transform.rotation = Quaternion.Euler(0, 0, angle);
    }

    private void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    private void Start()
    {
        Destroy(gameObject, lifetime);
    }

    private void FixedUpdate()
    {
        rb.velocity = direction * speed;
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (hasHit) return;

        if (other.TryGetComponent<HealthSystem>(out var health))
        {
            if (other.CompareTag("Enemy"))
            {
                hasHit = true;
                health.TakeDamage(damage);
                OnPieHit?.Invoke();
                SpawnHitEffect();
                Destroy(gameObject);
            }
        }
        else if (other.CompareTag("Wall"))
        {
            hasHit = true;
            OnPieMiss?.Invoke();
            Destroy(gameObject);
        }
    }

    private void SpawnHitEffect()
    {
        // TODO: Instantiate hit effect prefab
    }

    private void OnDestroy()
    {
        if (!hasHit)
        {
            OnPieMiss?.Invoke();
        }
    }
}
