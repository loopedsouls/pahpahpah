using UnityEngine;

public class MaskPickup : MonoBehaviour
{
    [SerializeField] private MaskData maskData;
    [SerializeField] private float bobSpeed = 2f;
    [SerializeField] private float bobHeight = 0.2f;
    [SerializeField] private float rotateSpeed = 30f;

    private Vector3 startPosition;
    private SpriteRenderer spriteRenderer;

    private void Start()
    {
        startPosition = transform.position;
        spriteRenderer = GetComponent<SpriteRenderer>();
        
        if (spriteRenderer != null && maskData != null)
        {
            spriteRenderer.sprite = maskData.icon;
            spriteRenderer.color = maskData.maskColor;
        }
    }

    private void Update()
    {
        // Bob up and down
        float newY = startPosition.y + Mathf.Sin(Time.time * bobSpeed) * bobHeight;
        transform.position = new Vector3(startPosition.x, newY, startPosition.z);
        
        // Rotate
        transform.Rotate(Vector3.forward, rotateSpeed * Time.deltaTime);
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            if (other.TryGetComponent<MaskSystem>(out var maskSystem))
            {
                maskSystem.CollectMask(maskData);
                
                // Play collect effect
                // TODO: Instantiate effect
                
                Destroy(gameObject);
            }
        }
    }
}
