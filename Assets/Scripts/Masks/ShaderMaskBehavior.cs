using UnityEngine;

/// <summary>
/// Shader Mask: Slow-motion enquanto mira (segura botão direito)
/// </summary>
public class ShaderMaskBehavior : MaskBehavior
{
    [SerializeField] private float slowMotionScale = 0.5f;
    
    private bool isAiming;

    protected override void OnActivate()
    {
        // Handled in Update
    }

    private void Update()
    {
        if (!isActive) return;

        bool wasAiming = isAiming;
        isAiming = Input.GetMouseButton(1);

        if (isAiming && !wasAiming)
        {
            StartSlowMotion();
        }
        else if (!isAiming && wasAiming)
        {
            StopSlowMotion();
        }
    }

    private void StartSlowMotion()
    {
        Time.timeScale = slowMotionScale;
        Time.fixedDeltaTime = 0.02f * slowMotionScale;
    }

    private void StopSlowMotion()
    {
        Time.timeScale = 1f;
        Time.fixedDeltaTime = 0.02f;
    }

    protected override void OnDeactivate()
    {
        if (isAiming)
        {
            StopSlowMotion();
        }
        isAiming = false;
    }

    private void OnDisable()
    {
        StopSlowMotion();
    }
}
