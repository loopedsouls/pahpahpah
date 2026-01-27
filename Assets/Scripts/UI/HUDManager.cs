using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class HUDManager : MonoBehaviour
{
    [Header("Health")]
    [SerializeField] private Transform heartsContainer;
    [SerializeField] private GameObject heartPrefab;
    [SerializeField] private Sprite heartFull;
    [SerializeField] private Sprite heartEmpty;

    [Header("Audience Meter")]
    [SerializeField] private Slider audienceSlider;
    [SerializeField] private Image audienceFill;
    [SerializeField] private TextMeshProUGUI audienceText;
    [SerializeField] private Color lowColor = Color.red;
    [SerializeField] private Color midColor = Color.yellow;
    [SerializeField] private Color highColor = Color.green;

    [Header("Masks")]
    [SerializeField] private Image[] maskSlots;
    [SerializeField] private Image maskSelectionIndicator;

    [Header("Wave Info")]
    [SerializeField] private TextMeshProUGUI waveText;
    [SerializeField] private TextMeshProUGUI timerText;

    private Image[] heartImages;
    private HealthSystem playerHealth;
    private AudienceMeter audienceMeter;
    private MaskSystem maskSystem;
    private WaveManager waveManager;
    private float arenaTimer;

    private void Start()
    {
        FindReferences();
        SubscribeToEvents();
        InitializeHearts();
    }

    private void FindReferences()
    {
        var player = GameObject.FindGameObjectWithTag("Player");
        if (player != null)
        {
            playerHealth = player.GetComponent<HealthSystem>();
            maskSystem = player.GetComponent<MaskSystem>();
        }

        audienceMeter = FindFirstObjectByType<AudienceMeter>();
        waveManager = FindFirstObjectByType<WaveManager>();
    }

    private void SubscribeToEvents()
    {
        if (playerHealth != null)
            playerHealth.OnHealthChanged += UpdateHearts;

        if (audienceMeter != null)
            audienceMeter.OnMeterChanged += UpdateAudienceMeter;

        if (maskSystem != null)
        {
            maskSystem.OnMaskEquipped += UpdateMaskSlot;
            maskSystem.OnMaskSwitched += UpdateMaskSelection;
        }

        if (waveManager != null)
            waveManager.OnWaveStarted += UpdateWaveText;
    }

    private void InitializeHearts()
    {
        if (playerHealth == null || heartsContainer == null || heartPrefab == null) return;

        heartImages = new Image[playerHealth.MaxHealth];
        
        for (int i = 0; i < playerHealth.MaxHealth; i++)
        {
            GameObject heart = Instantiate(heartPrefab, heartsContainer);
            heartImages[i] = heart.GetComponent<Image>();
        }

        UpdateHearts(playerHealth.CurrentHealth, playerHealth.MaxHealth);
    }

    private void Update()
    {
        UpdateTimer();
    }

    private void UpdateHearts(int current, int max)
    {
        if (heartImages == null) return;

        for (int i = 0; i < heartImages.Length; i++)
        {
            heartImages[i].sprite = i < current ? heartFull : heartEmpty;
        }
    }

    private void UpdateAudienceMeter(float current, float max)
    {
        if (audienceSlider != null)
        {
            audienceSlider.value = current / max;
        }

        if (audienceText != null)
        {
            audienceText.text = $"{Mathf.RoundToInt(current)}%";
        }

        if (audienceFill != null)
        {
            float percentage = current / max;
            if (percentage < 0.3f)
                audienceFill.color = lowColor;
            else if (percentage < 0.7f)
                audienceFill.color = midColor;
            else
                audienceFill.color = highColor;
        }
    }

    private void UpdateMaskSlot(int slot, MaskData mask)
    {
        if (slot < 0 || slot >= maskSlots.Length) return;

        maskSlots[slot].sprite = mask?.icon;
        maskSlots[slot].color = mask != null ? Color.white : new Color(1, 1, 1, 0.3f);
    }

    private void UpdateMaskSelection(int slot)
    {
        if (maskSelectionIndicator != null && slot < maskSlots.Length)
        {
            maskSelectionIndicator.transform.position = maskSlots[slot].transform.position;
        }
    }

    private void UpdateWaveText(int current, int total)
    {
        if (waveText != null)
        {
            waveText.text = $"WAVE {current}/{total}";
        }
    }

    private void UpdateTimer()
    {
        if (timerText == null) return;

        arenaTimer += Time.deltaTime;
        int minutes = (int)(arenaTimer / 60);
        int seconds = (int)(arenaTimer % 60);
        timerText.text = $"{minutes:00}:{seconds:00}";
    }

    private void OnDestroy()
    {
        if (playerHealth != null)
            playerHealth.OnHealthChanged -= UpdateHearts;

        if (audienceMeter != null)
            audienceMeter.OnMeterChanged -= UpdateAudienceMeter;

        if (maskSystem != null)
        {
            maskSystem.OnMaskEquipped -= UpdateMaskSlot;
            maskSystem.OnMaskSwitched -= UpdateMaskSelection;
        }

        if (waveManager != null)
            waveManager.OnWaveStarted -= UpdateWaveText;
    }
}
