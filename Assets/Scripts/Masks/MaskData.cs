using UnityEngine;

public enum MaskType
{
    Bitmask,        // Multi-target area damage
    AlphaMask,      // Invincible dash
    DataMask,       // Enemy confusion
    SurgicalMask,   // Regeneration
    ShaderMask      // Slow-motion aim
}

[CreateAssetMenu(fileName = "NewMask", menuName = "PaPaPa/Mask Data")]
public class MaskData : ScriptableObject
{
    [Header("Identity")]
    public MaskType maskType;
    public string maskName;
    [TextArea] public string description;
    public Sprite icon;

    [Header("Stats")]
    public float cooldown;
    public float duration;
    public bool isPassive;

    [Header("Visual")]
    public Color maskColor = Color.white;
    public GameObject effectPrefab;
}
