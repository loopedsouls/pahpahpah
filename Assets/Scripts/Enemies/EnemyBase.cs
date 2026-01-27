using UnityEngine;

public abstract class EnemyBase : MonoBehaviour
{
    [Header("Stats")]
    [SerializeField] protected float moveSpeed = 3f;
    [SerializeField] protected int contactDamage = 1;

    protected Transform player;
    protected Rigidbody2D rb;
    protected HealthSystem health;
    protected bool isActive = true;

    public static System.Action<EnemyBase> OnEnemyDeath;

    protected virtual void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
        health = GetComponent<HealthSystem>();
    }

    protected virtual void Start()
    {
        player = GameObject.FindGameObjectWithTag("Player")?.transform;
        
        if (health != null)
        {
            health.OnDeath += HandleDeath;
        }
    }

    protected virtual void Update()
    {
        if (!isActive || player == null) return;
        
        UpdateBehavior();
    }

    protected abstract void UpdateBehavior();

    protected virtual void HandleDeath()
    {
        isActive = false;
        OnEnemyDeath?.Invoke(this);
        
        // TODO: Spawn death effect, drop mask chance
        Destroy(gameObject, 0.1f);
    }

    protected virtual void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            if (collision.gameObject.TryGetComponent<HealthSystem>(out var playerHealth))
            {
                playerHealth.TakeDamage(contactDamage);
            }
        }
    }

    protected Vector2 GetDirectionToPlayer()
    {
        if (player == null) return Vector2.zero;
        return (player.position - transform.position).normalized;
    }

    protected float GetDistanceToPlayer()
    {
        if (player == null) return float.MaxValue;
        return Vector2.Distance(transform.position, player.position);
    }

    protected virtual void OnDestroy()
    {
        if (health != null)
        {
            health.OnDeath -= HandleDeath;
        }
    }
}
