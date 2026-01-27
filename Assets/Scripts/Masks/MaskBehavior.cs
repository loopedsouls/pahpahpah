using UnityEngine;

public abstract class MaskBehavior : MonoBehaviour
{
    protected PlayerController player;
    protected MaskData currentMaskData;
    protected bool isActive;

    public bool IsActive => isActive;

    protected virtual void Awake()
    {
        player = GetComponent<PlayerController>();
    }

    public virtual void Activate(MaskData data)
    {
        currentMaskData = data;
        isActive = true;
        OnActivate();
    }

    public virtual void Deactivate()
    {
        isActive = false;
        OnDeactivate();
    }

    protected abstract void OnActivate();
    protected virtual void OnDeactivate() { }
}
