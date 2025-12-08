# AFS-081: Audio System

**Status:** Draft
**Priority:** P2 (Medium)
**Owner:** Lead Developer
**PRD Reference:** FR-AUDIO-001

---

## Summary

Audio system implementing music playback, sound effects, and audio mixing with volume controls, mute options, and dynamic audio based on game state (combat music, victory fanfare, UI feedback), creating immersive atmosphere while respecting player audio preferences.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Game state queries
- **AFS-002 (Turn System)**: Turn phase transitions
- **AFS-004 (Settings Manager)**: Audio settings persistence
- **AFS-041 (Combat System)**: Combat triggers

---

## Requirements

### Audio Categories

1. **Music** (Background Tracks)
   - **Main Menu**: Ambient space theme (looping)
   - **Galaxy View**: Strategic orchestral theme (looping)
   - **Planet Management**: Calm industrial theme (looping)
   - **Combat**: Intense battle music (non-looping, returns to strategic)
   - **Victory**: Triumphant fanfare (one-shot, then main menu)
   - **Defeat**: Somber defeat theme (one-shot, then main menu)

2. **Sound Effects** (UI Feedback)
   - **Button Click**: Short click sound (50ms)
   - **Construction Start**: Building construction sound (500ms)
   - **Construction Complete**: Success chime (300ms)
   - **Resource Warning**: Warning beep (200ms)
   - **Combat Start**: Battle alert siren (1s)
   - **Victory**: Celebration sound (2s)

3. **Ambient Sounds** (Environmental)
   - **Galaxy View**: Space ambience (wind, distant rumbles)
   - **Planet Management**: Industrial machinery hum
   - **Combat**: Explosions, weapon fire (layered with combat music)

### Volume Controls

1. **Master Volume**
   - **Range**: 0-100%
   - **Default**: 80%
   - **Affects**: All audio (music, SFX, ambient)
   - **Mute**: Toggle button (hotkey: M)

2. **Music Volume**
   - **Range**: 0-100%
   - **Default**: 60%
   - **Affects**: Background music only
   - **Independent**: Can adjust without affecting SFX

3. **SFX Volume**
   - **Range**: 0-100%
   - **Default**: 80%
   - **Affects**: UI sounds, combat effects, notifications

4. **Ambient Volume**
   - **Range**: 0-100%
   - **Default**: 40%
   - **Affects**: Environmental sounds, space ambience

### Music System

1. **Music Transitions**
   - **Fade Duration**: 2 seconds crossfade between tracks
   - **Seamless Looping**: Music loops without gaps
   - **Priority**: Combat music interrupts current track
   - **Resume**: Returns to previous track after combat

2. **Dynamic Music** (Adaptive)
   - **Tension System**: Music intensity increases with threat level
   - **Low Tension**: Calm strategic theme (player winning)
   - **High Tension**: Intense strategic theme (player losing)
   - **MVP Scope**: Static music tracks (no dynamic intensity)

3. **Music Playlist**
   - **Track 1**: Main Menu Theme (2 minutes, looping)
   - **Track 2**: Galaxy View Theme (3 minutes, looping)
   - **Track 3**: Planet Management Theme (2.5 minutes, looping)
   - **Track 4**: Combat Theme (2 minutes, one-shot)
   - **Track 5**: Victory Fanfare (10 seconds, one-shot)
   - **Track 6**: Defeat Theme (15 seconds, one-shot)

### Sound Effects System

1. **UI Sounds**
   - **Button Hover**: Subtle hover sound (20ms)
   - **Button Click**: Click sound (50ms)
   - **Panel Open**: Slide-in sound (300ms)
   - **Panel Close**: Slide-out sound (300ms)
   - **Error**: Buzzer sound (100ms)

2. **Game Event Sounds**
   - **Construction Start**: Building start sound (500ms)
   - **Construction Complete**: Success chime (300ms)
   - **Research Complete**: Tech unlock sound (800ms)
   - **Fleet Arrived**: Ship arrival sound (600ms)
   - **Resource Low**: Warning beep (200ms, repeats 3×)

3. **Combat Sounds**
   - **Battle Start**: Alert siren (1s)
   - **Laser Fire**: Pew pew sound (200ms)
   - **Missile Launch**: Whoosh sound (400ms)
   - **Explosion**: Boom sound (500ms)
   - **Ship Destroyed**: Large explosion (1s)

4. **Sound Priority**
   - **High Priority**: Combat, victory/defeat (always play)
   - **Medium Priority**: Construction, UI (play if channel available)
   - **Low Priority**: Button hover (skip if >5 sounds playing)

### Audio Settings

1. **Settings Panel**
   - **Master Volume Slider**: 0-100%
   - **Music Volume Slider**: 0-100%
   - **SFX Volume Slider**: 0-100%
   - **Ambient Volume Slider**: 0-100%
   - **Mute All Checkbox**: Quick mute toggle
   - **Preview Buttons**: Play sample sound for each category

2. **Audio Presets**
   - **Default**: Master 80%, Music 60%, SFX 80%, Ambient 40%
   - **Quiet**: Master 50%, Music 40%, SFX 50%, Ambient 20%
   - **Loud**: Master 100%, Music 80%, SFX 100%, Ambient 60%
   - **Music Only**: Master 80%, Music 80%, SFX 0%, Ambient 0%
   - **SFX Only**: Master 80%, Music 0%, SFX 100%, Ambient 40%

3. **Persistence**
   - **Save Settings**: Audio settings saved to PlayerPrefs (AFS-004)
   - **Load on Start**: Restore settings on game launch
   - **Per-Platform**: Different defaults for mobile (lower default volume)

### Audio Implementation

1. **Audio Mixer**
   - **Unity Audio Mixer**: 4 groups (Master, Music, SFX, Ambient)
   - **Ducking**: Music volume reduces during important SFX (e.g., notifications)
   - **Normalization**: All sounds normalized to prevent clipping

2. **Audio Pooling**
   - **AudioSource Pool**: Pre-create 10 AudioSource components
   - **Reuse**: Reuse sources to avoid GameObject instantiation overhead
   - **Priority Queue**: Higher priority sounds interrupt lower priority

3. **Audio Loading**
   - **Streaming**: Music tracks stream from disk (large files)
   - **Pre-loaded**: SFX loaded into memory (small files)
   - **Compression**: Ogg Vorbis for music, WAV for SFX

---

## Acceptance Criteria

### Functional Criteria

- [ ] Music plays and loops correctly for each game state
- [ ] Music fades between tracks (2 second crossfade)
- [ ] SFX play on UI interactions (button click, panel open)
- [ ] Combat music plays during battles
- [ ] Victory/defeat music plays on game end
- [ ] Volume sliders control respective audio categories
- [ ] Mute toggle silences all audio
- [ ] Audio settings persist across sessions
- [ ] No audio clipping or distortion

### Performance Criteria

- [ ] Audio playback maintains 60 FPS (no frame drops)
- [ ] Sound effects play with <50ms latency
- [ ] Music transitions smooth (no pops or clicks)
- [ ] Audio memory usage <50MB (all loaded assets)

### Integration Criteria

- [ ] Integrates with Settings Manager (AFS-004) for persistence
- [ ] Responds to game state changes (Turn System, Combat System)
- [ ] Plays sounds on UI events (Button clicks, notifications)
- [ ] Controlled by UI State Machine (AFS-071) for state-based music

---

## Technical Notes

### Implementation Approach

```csharp
public class AudioSystem : MonoBehaviour
{
    private static AudioSystem _instance;
    public static AudioSystem Instance => _instance;

    [Header("Audio Mixer")]
    public AudioMixer audioMixer;

    [Header("Audio Sources")]
    public AudioSource musicSource;
    public AudioSource ambientSource;
    private List<AudioSource> sfxPool = new List<AudioSource>();

    [Header("Music Tracks")]
    public AudioClip mainMenuMusic;
    public AudioClip galaxyViewMusic;
    public AudioClip planetManagementMusic;
    public AudioClip combatMusic;
    public AudioClip victoryMusic;
    public AudioClip defeatMusic;

    [Header("Sound Effects")]
    public AudioClip buttonClick;
    public AudioClip constructionStart;
    public AudioClip constructionComplete;
    public AudioClip resourceWarning;
    public AudioClip battleStart;
    public AudioClip victorySound;

    private AudioClip _currentMusicTrack;
    private bool _isMuted = false;

    private void Awake()
    {
        _instance = this;
        InitializeAudioSources();
        LoadAudioSettings();
    }

    private void InitializeAudioSources()
    {
        // Create SFX audio source pool (10 sources)
        for (int i = 0; i < 10; i++)
        {
            var source = gameObject.AddComponent<AudioSource>();
            source.playOnAwake = false;
            source.outputAudioMixerGroup = audioMixer.FindMatchingGroups("SFX")[0];
            sfxPool.Add(source);
        }

        // Setup music source
        musicSource.loop = true;
        musicSource.outputAudioMixerGroup = audioMixer.FindMatchingGroups("Music")[0];

        // Setup ambient source
        ambientSource.loop = true;
        ambientSource.outputAudioMixerGroup = audioMixer.FindMatchingGroups("Ambient")[0];
    }

    // Play music track with crossfade
    public void PlayMusic(AudioClip clip, bool loop = true)
    {
        if (_currentMusicTrack == clip)
            return; // Already playing

        StartCoroutine(CrossfadeMusic(clip, loop));
    }

    private IEnumerator CrossfadeMusic(AudioClip newClip, bool loop)
    {
        // Fade out current music (1 second)
        float fadeTime = 1f;
        float elapsed = 0;

        while (elapsed < fadeTime)
        {
            elapsed += Time.deltaTime;
            musicSource.volume = Mathf.Lerp(1f, 0f, elapsed / fadeTime);
            yield return null;
        }

        // Switch to new track
        musicSource.Stop();
        musicSource.clip = newClip;
        musicSource.loop = loop;
        musicSource.Play();

        _currentMusicTrack = newClip;

        // Fade in new music (1 second)
        elapsed = 0;
        while (elapsed < fadeTime)
        {
            elapsed += Time.deltaTime;
            musicSource.volume = Mathf.Lerp(0f, 1f, elapsed / fadeTime);
            yield return null;
        }
    }

    // Play sound effect
    public void PlaySFX(AudioClip clip, float volume = 1f)
    {
        if (clip == null || _isMuted)
            return;

        // Get available audio source from pool
        var source = GetAvailableSource();
        if (source == null)
        {
            Debug.LogWarning("No available audio sources!");
            return;
        }

        source.PlayOneShot(clip, volume);
    }

    private AudioSource GetAvailableSource()
    {
        // Find first source not currently playing
        foreach (var source in sfxPool)
        {
            if (!source.isPlaying)
                return source;
        }

        return null; // All sources busy
    }

    // Set volume for category
    public void SetVolume(string category, float volume)
    {
        // Volume range: 0.0 to 1.0
        float dbVolume = Mathf.Log10(Mathf.Clamp(volume, 0.0001f, 1f)) * 20f;
        audioMixer.SetFloat(category + "Volume", dbVolume);

        // Save to settings
        SettingsManager.Instance.SetAudioVolume(category, volume);
    }

    // Mute/unmute all audio
    public void SetMuted(bool muted)
    {
        _isMuted = muted;

        if (muted)
        {
            audioMixer.SetFloat("MasterVolume", -80f); // -80dB = silence
        }
        else
        {
            float volume = SettingsManager.Instance.GetAudioVolume("Master");
            SetVolume("Master", volume);
        }

        SettingsManager.Instance.SetMuted(muted);
    }

    // Load audio settings from PlayerPrefs
    private void LoadAudioSettings()
    {
        float masterVolume = SettingsManager.Instance.GetAudioVolume("Master");
        float musicVolume = SettingsManager.Instance.GetAudioVolume("Music");
        float sfxVolume = SettingsManager.Instance.GetAudioVolume("SFX");
        float ambientVolume = SettingsManager.Instance.GetAudioVolume("Ambient");

        SetVolume("Master", masterVolume);
        SetVolume("Music", musicVolume);
        SetVolume("SFX", sfxVolume);
        SetVolume("Ambient", ambientVolume);

        _isMuted = SettingsManager.Instance.GetMuted();
        if (_isMuted)
        {
            SetMuted(true);
        }
    }

    // Play music based on UI state
    public void OnUIStateChanged(UIState newState)
    {
        switch (newState)
        {
            case UIState.MainMenu:
                PlayMusic(mainMenuMusic);
                break;
            case UIState.GalaxyView:
                PlayMusic(galaxyViewMusic);
                break;
            case UIState.PlanetManagement:
                PlayMusic(planetManagementMusic);
                break;
            case UIState.CombatResolution:
                PlayMusic(combatMusic, loop: false);
                break;
            case UIState.EndGame:
                // Victory or defeat music determined by game result
                break;
        }
    }

    // Play victory music
    public void PlayVictoryMusic()
    {
        PlayMusic(victoryMusic, loop: false);
    }

    // Play defeat music
    public void PlayDefeatMusic()
    {
        PlayMusic(defeatMusic, loop: false);
    }
}
```

### Audio File Organization

```
Assets/Audio/
├── Music/
│   ├── MainMenu.ogg (streaming)
│   ├── GalaxyView.ogg (streaming)
│   ├── PlanetManagement.ogg (streaming)
│   ├── Combat.ogg (streaming)
│   ├── Victory.ogg (compressed)
│   └── Defeat.ogg (compressed)
├── SFX/
│   ├── UI/
│   │   ├── ButtonClick.wav
│   │   ├── ButtonHover.wav
│   │   ├── PanelOpen.wav
│   │   └── PanelClose.wav
│   ├── Game/
│   │   ├── ConstructionStart.wav
│   │   ├── ConstructionComplete.wav
│   │   ├── ResearchComplete.wav
│   │   └── ResourceWarning.wav
│   └── Combat/
│       ├── BattleStart.wav
│       ├── LaserFire.wav
│       ├── Explosion.wav
│       └── ShipDestroyed.wav
└── Ambient/
    ├── SpaceAmbience.ogg (looping)
    └── IndustrialHum.ogg (looping)
```

---

## Integration Points

### Depends On
- **AFS-004 (Settings Manager)**: Audio settings persistence

### Depended On By
- **AFS-071 (UI State Machine)**: State-based music transitions
- **AFS-074 (Notification System)**: Sound on notifications
- **All UI Components**: Button click sounds

### Events Subscribed
- `UIStateManager.OnStateChanged`: Music transitions
- `BuildingSystem.OnBuildingCompleted`: Construction complete sound
- `CombatSystem.OnBattleStarted`: Combat music trigger
- `TurnSystem.OnTurnEnded`: Ambient sound loops

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
