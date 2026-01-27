using UnityEngine;
using System.Collections.Generic;

public class MaskSystem : MonoBehaviour
{
    [SerializeField] private int maxEquippedMasks = 3;
    [SerializeField] private List<MaskData> allMasks;

    private List<MaskData> collectedMasks = new List<MaskData>();
    private MaskData[] equippedMasks;
    private int activeMaskIndex = 0;
    private Dictionary<MaskType, float> cooldownTimers = new Dictionary<MaskType, float>();
    private Dictionary<MaskType, MaskBehavior> maskBehaviors = new Dictionary<MaskType, MaskBehavior>();

    public MaskData ActiveMask => equippedMasks[activeMaskIndex];
    public MaskData[] EquippedMasks => equippedMasks;
    public int ActiveMaskIndex => activeMaskIndex;

    public System.Action<int, MaskData> OnMaskEquipped;
    public System.Action<int> OnMaskSwitched;
    public System.Action<MaskType> OnMaskActivated;
    public System.Action<MaskData> OnMaskCollected;

    private void Awake()
    {
        equippedMasks = new MaskData[maxEquippedMasks];
        InitializeMaskBehaviors();
    }

    private void InitializeMaskBehaviors()
    {
        maskBehaviors[MaskType.Bitmask] = gameObject.AddComponent<BitmaskBehavior>();
        maskBehaviors[MaskType.AlphaMask] = gameObject.AddComponent<AlphaMaskBehavior>();
        maskBehaviors[MaskType.DataMask] = gameObject.AddComponent<DataMaskBehavior>();
        maskBehaviors[MaskType.SurgicalMask] = gameObject.AddComponent<SurgicalMaskBehavior>();
        maskBehaviors[MaskType.ShaderMask] = gameObject.AddComponent<ShaderMaskBehavior>();
    }

    private void Update()
    {
        HandleMaskInput();
        UpdateCooldowns();
    }

    private void HandleMaskInput()
    {
        // Switch masks with 1-3 keys
        for (int i = 0; i < maxEquippedMasks; i++)
        {
            if (Input.GetKeyDown(KeyCode.Alpha1 + i))
            {
                SwitchToMask(i);
            }
        }

        // Activate mask with right click (for active masks)
        if (Input.GetMouseButtonDown(1))
        {
            TryActivateMask();
        }
    }

    private void UpdateCooldowns()
    {
        var keys = new List<MaskType>(cooldownTimers.Keys);
        foreach (var key in keys)
        {
            if (cooldownTimers[key] > 0)
            {
                cooldownTimers[key] -= Time.deltaTime;
            }
        }
    }

    public void CollectMask(MaskData mask)
    {
        if (collectedMasks.Contains(mask)) return;

        collectedMasks.Add(mask);
        OnMaskCollected?.Invoke(mask);

        // Auto-equip if slot available
        for (int i = 0; i < maxEquippedMasks; i++)
        {
            if (equippedMasks[i] == null)
            {
                EquipMask(mask, i);
                break;
            }
        }
    }

    public void EquipMask(MaskData mask, int slot)
    {
        if (slot < 0 || slot >= maxEquippedMasks) return;
        if (!collectedMasks.Contains(mask)) return;

        equippedMasks[slot] = mask;
        OnMaskEquipped?.Invoke(slot, mask);
    }

    public void SwitchToMask(int slot)
    {
        if (slot < 0 || slot >= maxEquippedMasks) return;
        if (equippedMasks[slot] == null) return;

        activeMaskIndex = slot;
        OnMaskSwitched?.Invoke(slot);
    }

    public void TryActivateMask()
    {
        var mask = ActiveMask;
        if (mask == null || mask.isPassive) return;

        if (cooldownTimers.TryGetValue(mask.maskType, out float cd) && cd > 0)
            return;

        if (maskBehaviors.TryGetValue(mask.maskType, out var behavior))
        {
            behavior.Activate(mask);
            cooldownTimers[mask.maskType] = mask.cooldown;
            OnMaskActivated?.Invoke(mask.maskType);
        }
    }

    public float GetCooldownRemaining(MaskType type)
    {
        return cooldownTimers.TryGetValue(type, out float cd) ? Mathf.Max(0, cd) : 0;
    }

    public bool IsMaskOnCooldown(MaskType type)
    {
        return GetCooldownRemaining(type) > 0;
    }

    public MaskBehavior GetMaskBehavior(MaskType type)
    {
        return maskBehaviors.TryGetValue(type, out var behavior) ? behavior : null;
    }
}
