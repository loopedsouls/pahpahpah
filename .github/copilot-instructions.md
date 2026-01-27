# AI Agent Instructions for PÁ PÁ PÁ: THE MASK GAME

## Project Overview
This is a 2D top-down arena shooter where players throw pies at enemies in wave-based arenas, collecting "masks" that grant unique powers. The game blends arcade gameplay with Brazilian TV show aesthetics, featuring pixel art and a public audience meter that affects gameplay.

**Core Loop:** Enter arena → Defeat enemies in waves → Collect masks every 3 kills → Use mask powers → Maintain audience approval → Complete arena.

## Key Systems Implementation

### Mask System
- Masks are permanent power-ups collected from the arena floor after defeating enemies.
- Implement as scriptable objects or enums with activation methods.
- Example: Bitmask provides area-of-effect pie hits; Alpha Mask enables invulnerable dash.
- Equip up to 3 masks simultaneously, switched via number keys (1-3).

### Enemy AI Patterns
- **Basic Competitor:** Simple pathfinding toward player, melee attack on contact.
- **Shooter:** Maintains distance, fires pies at player.
- **Tank:** Slow movement, high HP (3), knockback attack.
- Use state machines for behavior; prioritize player targeting.

### Audience Meter
- Visual bar (0-100%) in top-center HUD.
- Increases: +5% per pie hit, +8% per enemy kill, +10% combo bonus.
- Decreases: -2% per miss, -5% per damage taken, -15% if enemy escapes.
- Game over if below 20%; bonus damage above 80%.

### Wave Progression
- Arenas have 3-4 waves with increasing difficulty.
- Spawn enemies in patterns; end wave when all defeated.
- Timer per arena (2 minutes); failure if time expires.

## Development Conventions

### Art Style
- Pixel art at 320x180 base resolution, upscaled 3-4x.
- Vibrant palette: Yellow, electric blue, show red primaries; neon pink, lime green secondaries.
- Animations: 4-frame idle/walk cycles, 2-frame attacks, 3-frame deaths.

### Audio Design
- 8-bit style music with 140-170 BPM progression.
- SFX: Pie launch (whoosh), hit (splat + laugh), miss (empty whoosh), dash (zoom).
- Audience reactions: Short laughs for hits, applause for combos, boos for misses.

### Code Structure
- Use Unity's component-based architecture for player, enemies, masks.
- Implement game states (Menu, Arena, Pause, GameOver) in a central GameManager.
- HUD elements: Hearts for lives, audience bar, equipped masks, wave/timer.

### Asset Organization
- Sprites: Player (32x32), enemies (24x24), pies (16x16), masks (24x24).
- Audio: Separate folders for music loops and SFX.
- Reference [README.md](README.md) asset checklist for completion tracking.

## Implementation Priorities
1. Player movement and pie-throwing mechanics.
2. Basic enemy AI and collision/damage.
3. Mask collection and power activation.
4. Wave spawning and arena progression.
5. Audience meter and failure conditions.

Follow the 72-hour jam schedule in [README.md](README.md) for phased development. Focus on playable MVP before polish.