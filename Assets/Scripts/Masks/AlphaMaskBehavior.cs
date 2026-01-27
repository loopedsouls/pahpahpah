using UnityEngine;

/// <summary>
/// Alpha Mask: Dash invencível por 0.5s, cooldown 3s
/// </summary>
public class AlphaMaskBehavior : MaskBehavior
{
    [SerializeField] private float invincibilityDuration = 0.5f;
    
    private HealthSystem playerHealth;
    private SpriteRenderer spriteRenderer;
    private bool isInvincible;

    protected override void Awake()
    {
        base.Awake();
        playerHealth = GetComponent<HealthSystem>();
        spriteRenderer = GetComponent<SpriteRenderer>();
    }

    protected override void OnActivate()
    {
        if (player != null && !player.IsDashing)
        {
            // Force dash with invincibility
            StartCoroutine(InvincibleDash());
        }
    }

    private System.Collections.IEnumerator InvincibleDash()
    {
        isInvincible = true;
        
        // Visual feedback - transparent
        if (spriteRenderer != null)
        {
            Color c = spriteRenderer.color;
            c.a = 0.5f;
            spriteRenderer.color = c;
        }

        yield return new WaitForSeconds(invincibilityDuration);

        isInvincible = false;
        
        if (spriteRenderer != null)
        {
            Color c = spriteRenderer.color;
            c.a = 1f;
            spriteRenderer.color = c;
        }

        Deactivate();
    }

    public bool IsInvincible => isInvincible;

    private void OnEnable()
    {
        if (playerHealth != null)
        {
            // Hook into damage system to block damage when invincible
        }
    }
}
