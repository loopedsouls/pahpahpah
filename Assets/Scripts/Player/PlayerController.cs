using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [Header("Movement")]
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float dashSpeed = 15f;
    [SerializeField] private float dashDuration = 0.2f;
    [SerializeField] private float dashCooldown = 1f;

    [Header("Combat")]
    [SerializeField] private GameObject piePrefab;
    [SerializeField] private Transform firePoint;
    [SerializeField] private float fireRate = 0.3f;

    private Rigidbody2D rb;
    private Camera mainCamera;
    private Vector2 moveInput;
    private Vector2 aimDirection;
    
    private bool isDashing;
    private bool canDash = true;
    private float nextFireTime;

    private void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
        mainCamera = Camera.main;
    }

    private void Update()
    {
        if (isDashing) return;

        HandleInput();
        HandleAiming();
        HandleShooting();
        HandleDash();
    }

    private void FixedUpdate()
    {
        if (!isDashing)
        {
            rb.velocity = moveInput * moveSpeed;
        }
    }

    private void HandleInput()
    {
        moveInput.x = Input.GetAxisRaw("Horizontal");
        moveInput.y = Input.GetAxisRaw("Vertical");
        moveInput = moveInput.normalized;
    }

    private void HandleAiming()
    {
        Vector3 mousePos = mainCamera.ScreenToWorldPoint(Input.mousePosition);
        aimDirection = (mousePos - transform.position).normalized;
        
        float angle = Mathf.Atan2(aimDirection.y, aimDirection.x) * Mathf.Rad2Deg;
        transform.rotation = Quaternion.Euler(0, 0, angle);
    }

    private void HandleShooting()
    {
        if (Input.GetMouseButton(0) && Time.time >= nextFireTime)
        {
            Shoot();
            nextFireTime = Time.time + fireRate;
        }
    }

    private void Shoot()
    {
        if (piePrefab == null || firePoint == null) return;

        GameObject pie = Instantiate(piePrefab, firePoint.position, Quaternion.identity);
        PieProjectile projectile = pie.GetComponent<PieProjectile>();
        if (projectile != null)
        {
            projectile.Initialize(aimDirection);
        }

        OnPieShot?.Invoke();
    }

    private void HandleDash()
    {
        if (Input.GetKeyDown(KeyCode.Space) && canDash && moveInput != Vector2.zero)
        {
            StartCoroutine(DashCoroutine());
        }
    }

    private System.Collections.IEnumerator DashCoroutine()
    {
        isDashing = true;
        canDash = false;

        Vector2 dashDirection = moveInput != Vector2.zero ? moveInput : aimDirection;
        rb.velocity = dashDirection * dashSpeed;

        OnDashStarted?.Invoke();

        yield return new WaitForSeconds(dashDuration);

        isDashing = false;
        rb.velocity = Vector2.zero;

        yield return new WaitForSeconds(dashCooldown);
        canDash = true;
    }

    public bool IsDashing => isDashing;
    public Vector2 AimDirection => aimDirection;

    // Events
    public System.Action OnPieShot;
    public System.Action OnDashStarted;
}
