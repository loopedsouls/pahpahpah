using UnityEngine;

public class BasicEnemy : EnemyBase
{
    protected override void UpdateBehavior()
    {
        Vector2 direction = GetDirectionToPlayer();
        rb.linearVelocity = direction * moveSpeed;

        // Face player
        if (direction.x != 0)
        {
            transform.localScale = new Vector3(Mathf.Sign(direction.x), 1, 1);
        }
    }
}
