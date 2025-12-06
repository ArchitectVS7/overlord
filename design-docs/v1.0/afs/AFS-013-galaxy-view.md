# AFS-013: Galaxy View Interface

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-GALAXY-003

---

## Summary

3D galaxy visualization system that renders planets in orbital layout, displays ownership colors, shows terraforming status, indicates craft presence, and supports camera controls for navigation and planet selection.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Planet data and ownership
- **AFS-012 (Planet System)**: Planet properties and positions
- **AFS-005 (Input System)**: Camera controls and selection
- **AFS-081 (Rendering System)**: Low-poly shaders and post-processing

---

## Requirements

### Visual Representation

1. **Planet Rendering**
   - **Low-poly 3D models**: 200-800 polygons per planet
   - **Procedural surface textures**: Generated from planet VisualSeed
   - **Planet type-specific materials**:
     - Volcanic: Red/orange with emissive lava cracks
     - Desert: Tan/yellow with dune normals
     - Tropical: Green/blue with cloud layer
     - Metropolis: Gray/white with city lights (emissive at night)
   - **Rotation animation**: Slow spin (0.1-0.5 degrees/sec)
   - **Scale variation**: 1.0-1.5x multiplier per planet

2. **Ownership Indicators**
   - **Color-coded halos**: Ring or aura around planet
     - Player-owned: **Blue** glow
     - AI-owned: **Red** glow
     - Neutral: **Gray** or no glow
   - **Ownership icons**: Small faction emblem above planet
   - **Highlight on selection**: Brighter glow + outline shader

3. **Terraforming Status**
   - **Atmosphere Processor indicator**: Pulsing green light on planet surface
   - **Progress bar**: Floating above planet (0-10 turns remaining)
   - **Particle effects**: Construction dust/energy beams during terraforming
   - **Completion effect**: Flash and color shift when finished

4. **Craft Presence**
   - **Docked craft**: Small ship models on docking bay platforms (visible in orbit)
   - **Orbiting craft**: Craft models circling planet (if docking slots full)
   - **Craft count badge**: Number displayed near planet (e.g., "3 craft")
   - **Fleet composition icons**: Battle Cruiser vs Cargo Cruiser icons

5. **Central Star**
   - **Sun model**: Bright sphere at center (0, 0, 0)
   - **Emissive material**: Yellow/white glow
   - **Lens flare**: Subtle bloom effect
   - **Light source**: Main directional light for planets

### Camera System

1. **Camera Controls (PC)**
   - **Pan**: WASD or Arrow Keys, or Edge Scrolling
   - **Zoom**: Mouse Wheel or Q/E keys
   - **Rotate**: Middle Mouse Drag (optional)
   - **Reset View**: R key (return to default angle)

2. **Camera Controls (Mobile)**
   - **Pan**: One-finger drag
   - **Zoom**: Two-finger pinch
   - **Rotate**: Two-finger rotate gesture
   - **Reset View**: Double-tap empty space

3. **Camera Constraints**
   - **Min zoom**: 200 units from center (see whole system)
   - **Max zoom**: 50 units from center (close-up planet view)
   - **Pan limits**: None (free camera, can rotate around star)
   - **Default angle**: 45-degree isometric view

4. **Camera Transitions**
   - **Smooth lerp**: 0.5 second transitions for zoom/pan
   - **Focus on planet**: Click planet to center camera
   - **Auto-follow**: Optional camera follows selected fleet movement

### Planet Selection

1. **Selection Input**
   - **Click to select**: Left-click (PC) or Tap (Mobile)
   - **Multi-select**: Shift+Click (PC only, for future multiplayer)
   - **Deselect**: Click empty space or Esc key

2. **Selection Feedback**
   - **Visual highlight**: Brighter halo + outline shader
   - **UI panel**: Planet details panel appears on right side
   - **Cursor change**: Pointer changes to "inspect" icon on hover

3. **Selection Info Displayed**
   - Planet name and type
   - Owner (Player/AI/Neutral)
   - Resource counts (Food, Minerals, Fuel, Energy, Credits)
   - Population and morale
   - Structures (Docking Bays, Platforms, Buildings)
   - Craft present (count and types)
   - Platoons garrisoned (count and strength)

### UI Overlay Elements

1. **Planet Labels**
   - **Name tag**: Floating text above each planet
   - **Distance from camera**: Fade out when far, fade in when close
   - **Always face camera**: Billboard shader
   - **Owner color**: Text color matches faction (Blue/Red/Gray)

2. **Resource Icons**
   - **Production indicators**: Small icons for active buildings
     - Mining Station: Mineral/Fuel icons
     - Horticultural Station: Food icon
     - Solar Satellite: Energy icon
   - **Terraforming timer**: Turn countdown (e.g., "5 turns")

3. **Combat Indicators**
   - **Under attack**: Red pulsing icon above planet
   - **Battle animation**: Explosions and weapon fire effects
   - **Damage state**: Planet model switches to "damaged" variant

### Performance Optimization

1. **Level of Detail (LOD)**
   - **High detail**: <100 units from camera (800 polygons)
   - **Medium detail**: 100-200 units (400 polygons)
   - **Low detail**: >200 units (200 polygons)
   - **Occlusion culling**: Planets behind star are culled

2. **Texture Streaming**
   - **Close planets**: 512x512 textures
   - **Distant planets**: 256x256 textures
   - **Dynamic loading**: Stream textures based on camera distance

3. **Particle Budget**
   - **Max 3 particle systems active**: Terraforming effects limited
   - **Pool effects**: Reuse particle systems instead of spawning new
   - **Low-end mode**: Disable particles entirely on mobile low settings

---

## Acceptance Criteria

### Functional Criteria

- [ ] All planets render in correct 3D positions
- [ ] Ownership colors (Blue/Red/Gray) display correctly
- [ ] Terraforming status visible (pulsing indicator + timer)
- [ ] Craft presence shown (docked icons or orbiting models)
- [ ] Camera pan, zoom, rotate controls work smoothly
- [ ] Planet selection highlights selected planet
- [ ] Planet details panel updates on selection
- [ ] Central star provides lighting for scene

### Performance Criteria

- [ ] 60 FPS on PC with 6 planets (1080p)
- [ ] 30 FPS on mobile with 6 planets (dynamic resolution)
- [ ] LOD transitions smooth (no popping)
- [ ] Camera transitions smooth (no judder)
- [ ] Planet rotation does not cause frame drops

### Integration Criteria

- [ ] Integrates with Game State Manager (AFS-001) for planet data
- [ ] Reads planet properties from Planet System (AFS-012)
- [ ] Uses Input System (AFS-005) for camera controls
- [ ] Applies rendering settings from Settings Manager (AFS-004)
- [ ] Renders with Rendering System shaders (AFS-081)

---

## Technical Notes

### Implementation Approach

```csharp
public class GalaxyView : MonoBehaviour
{
    [SerializeField] private Camera _galaxyCamera;
    [SerializeField] private GameObject _planetPrefab;
    [SerializeField] private GameObject _starPrefab;
    [SerializeField] private Material _playerHaloMaterial;
    [SerializeField] private Material _aiHaloMaterial;
    [SerializeField] private Material _neutralHaloMaterial;

    private Dictionary<int, PlanetView> _planetViews = new Dictionary<int, PlanetView>();
    private PlanetView _selectedPlanet;
    private GameObject _centralStar;

    private void Start()
    {
        InitializeGalaxyView();
        SubscribeToEvents();
    }

    private void InitializeGalaxyView()
    {
        // Create central star
        _centralStar = Instantiate(_starPrefab, Vector3.zero, Quaternion.identity);
        _centralStar.name = "Central Star";

        // Create planet views
        var planets = GameStateManager.Instance.GetAllPlanets();
        foreach (var planet in planets)
        {
            CreatePlanetView(planet);
        }

        // Position camera
        _galaxyCamera.transform.position = new Vector3(0, 150, -150);
        _galaxyCamera.transform.LookAt(Vector3.zero);
    }

    private void CreatePlanetView(PlanetEntity planet)
    {
        var planetGO = Instantiate(_planetPrefab, planet.Position, Quaternion.identity);
        planetGO.name = planet.Name;

        var planetView = planetGO.AddComponent<PlanetView>();
        planetView.Initialize(planet, this);

        _planetViews[planet.ID] = planetView;
    }

    public void SelectPlanet(int planetID)
    {
        // Deselect previous
        if (_selectedPlanet != null)
        {
            _selectedPlanet.SetSelected(false);
        }

        // Select new
        if (_planetViews.TryGetValue(planetID, out var planetView))
        {
            _selectedPlanet = planetView;
            _selectedPlanet.SetSelected(true);

            // Focus camera on planet
            FocusCameraOnPlanet(planetView.transform.position);

            // Update UI panel
            UIManager.Instance.ShowPlanetDetails(planetID);
        }
    }

    private void FocusCameraOnPlanet(Vector3 position)
    {
        StartCoroutine(SmoothCameraTransition(position, 0.5f));
    }

    private IEnumerator SmoothCameraTransition(Vector3 target, float duration)
    {
        Vector3 startPos = _galaxyCamera.transform.position;
        Vector3 targetPos = target + (startPos - target).normalized * 80f; // 80 units from planet
        float elapsed = 0f;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = Mathf.SmoothStep(0f, 1f, elapsed / duration);
            _galaxyCamera.transform.position = Vector3.Lerp(startPos, targetPos, t);
            _galaxyCamera.transform.LookAt(target);
            yield return null;
        }

        _galaxyCamera.transform.position = targetPos;
        _galaxyCamera.transform.LookAt(target);
    }

    private void SubscribeToEvents()
    {
        GameStateManager.Instance.OnPlanetOwnerChanged += OnPlanetOwnerChanged;
        GameStateManager.Instance.OnPlanetColonized += OnPlanetColonized;
        InputManager.Instance.OnPointerUp += OnPointerUp;
    }

    private void OnPlanetOwnerChanged(int planetID, FactionType newOwner)
    {
        if (_planetViews.TryGetValue(planetID, out var planetView))
        {
            planetView.UpdateOwnershipVisuals();
        }
    }

    private void OnPlanetColonized(int planetID)
    {
        if (_planetViews.TryGetValue(planetID, out var planetView))
        {
            planetView.PlayColonizationEffect();
        }
    }

    private void OnPointerUp(Vector2 screenPosition)
    {
        Ray ray = _galaxyCamera.ScreenPointToRay(screenPosition);
        if (Physics.Raycast(ray, out RaycastHit hit, Mathf.Infinity))
        {
            var planetView = hit.collider.GetComponent<PlanetView>();
            if (planetView != null)
            {
                SelectPlanet(planetView.PlanetID);
            }
        }
        else
        {
            // Clicked empty space, deselect
            SelectPlanet(-1);
        }
    }
}
```

### Planet View Component

```csharp
public class PlanetView : MonoBehaviour
{
    public int PlanetID { get; private set; }

    [SerializeField] private MeshRenderer _planetRenderer;
    [SerializeField] private GameObject _haloObject;
    [SerializeField] private ParticleSystem _terraformingEffect;
    [SerializeField] private TextMeshPro _nameLabel;
    [SerializeField] private Transform _dockingBayContainer;

    private PlanetEntity _planetData;
    private GalaxyView _galaxyView;
    private Material _haloMaterial;
    private bool _isSelected;

    public void Initialize(PlanetEntity planet, GalaxyView galaxyView)
    {
        _planetData = planet;
        _galaxyView = galaxyView;
        PlanetID = planet.ID;

        // Apply procedural texture
        GeneratePlanetTexture(planet.Type, planet.VisualSeed);

        // Set rotation speed
        StartCoroutine(RotatePlanet(planet.RotationSpeed));

        // Set scale
        transform.localScale = Vector3.one * planet.ScaleMultiplier;

        // Set ownership visuals
        UpdateOwnershipVisuals();

        // Set name label
        _nameLabel.text = planet.Name;
        _nameLabel.color = GetOwnerColor(planet.Owner);

        // Terraforming effect
        if (!planet.Colonized && planet.TerraformingProgress > 0)
        {
            _terraformingEffect.Play();
        }
    }

    public void SetSelected(bool selected)
    {
        _isSelected = selected;

        if (_isSelected)
        {
            // Brighten halo, add outline
            _haloMaterial.SetFloat("_Intensity", 2.0f);
        }
        else
        {
            _haloMaterial.SetFloat("_Intensity", 1.0f);
        }
    }

    public void UpdateOwnershipVisuals()
    {
        _planetData = GameStateManager.Instance.GetPlanetByID(PlanetID);

        // Update halo color
        switch (_planetData.Owner)
        {
            case FactionType.Player:
                _haloMaterial = new Material(_galaxyView.PlayerHaloMaterial);
                break;
            case FactionType.AI:
                _haloMaterial = new Material(_galaxyView.AIHaloMaterial);
                break;
            case FactionType.Neutral:
                _haloMaterial = new Material(_galaxyView.NeutralHaloMaterial);
                break;
        }

        _haloObject.GetComponent<MeshRenderer>().material = _haloMaterial;

        // Update name label color
        _nameLabel.color = GetOwnerColor(_planetData.Owner);
    }

    public void PlayColonizationEffect()
    {
        // Flash effect, particle burst, color shift
        StartCoroutine(ColonizationFlash());
        _terraformingEffect.Stop();
    }

    private IEnumerator ColonizationFlash()
    {
        float duration = 1.0f;
        float elapsed = 0f;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float intensity = Mathf.Sin(elapsed / duration * Mathf.PI) * 2f;
            _haloMaterial.SetFloat("_Intensity", 1.0f + intensity);
            yield return null;
        }

        _haloMaterial.SetFloat("_Intensity", 1.0f);
    }

    private IEnumerator RotatePlanet(float degreesPerSecond)
    {
        while (true)
        {
            transform.Rotate(Vector3.up, degreesPerSecond * Time.deltaTime);
            yield return null;
        }
    }

    private void GeneratePlanetTexture(PlanetType type, int seed)
    {
        // Use seed to generate procedural texture (Perlin noise, etc.)
        // Apply to planet material
        // Different noise patterns for Volcanic/Desert/Tropical/Metropolis
    }

    private Color GetOwnerColor(FactionType owner)
    {
        switch (owner)
        {
            case FactionType.Player: return Color.cyan;
            case FactionType.AI: return Color.red;
            case FactionType.Neutral: return Color.gray;
            default: return Color.white;
        }
    }
}
```

### Camera Controller

```csharp
public class GalaxyCameraController : MonoBehaviour
{
    [SerializeField] private Camera _camera;
    [SerializeField] private float _panSpeed = 50f;
    [SerializeField] private float _zoomSpeed = 100f;
    [SerializeField] private float _rotateSpeed = 50f;

    private float _minZoom = 200f;
    private float _maxZoom = 50f;
    private float _currentZoom = 150f;

    private void Update()
    {
        HandlePan();
        HandleZoom();
        HandleRotate();
    }

    private void HandlePan()
    {
        Vector2 panInput = Vector2.zero;

        // Keyboard input
        if (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow))
            panInput.y = 1f;
        if (Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow))
            panInput.y = -1f;
        if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow))
            panInput.x = -1f;
        if (Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.RightArrow))
            panInput.x = 1f;

        // Apply pan
        if (panInput != Vector2.zero)
        {
            Vector3 moveDir = transform.right * panInput.x + transform.forward * panInput.y;
            moveDir.y = 0f; // Keep camera at same height
            transform.position += moveDir * _panSpeed * Time.deltaTime;
        }
    }

    private void HandleZoom()
    {
        float zoomInput = 0f;

        // Mouse wheel
        zoomInput = Input.mouseScrollDelta.y;

        // Keyboard Q/E
        if (Input.GetKey(KeyCode.Q))
            zoomInput = -1f;
        if (Input.GetKey(KeyCode.E))
            zoomInput = 1f;

        // Apply zoom
        if (zoomInput != 0f)
        {
            _currentZoom = Mathf.Clamp(_currentZoom - zoomInput * _zoomSpeed * Time.deltaTime, _maxZoom, _minZoom);
            Vector3 direction = (transform.position - Vector3.zero).normalized;
            transform.position = direction * _currentZoom;
            transform.LookAt(Vector3.zero);
        }
    }

    private void HandleRotate()
    {
        // Middle mouse drag to rotate around star
        if (Input.GetMouseButton(2))
        {
            float rotateX = Input.GetAxis("Mouse X") * _rotateSpeed * Time.deltaTime;
            transform.RotateAround(Vector3.zero, Vector3.up, rotateX);
        }
    }

    public void ResetView()
    {
        transform.position = new Vector3(0, 150, -150);
        transform.LookAt(Vector3.zero);
        _currentZoom = 150f;
    }
}
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Planet data
- **AFS-012 (Planet System)**: Planet properties
- **AFS-005 (Input System)**: Camera controls and selection input

### Depended On By
- **AFS-071 (UI State Machine)**: Planet details panel
- **AFS-014 (Navigation System)**: Fleet movement visualization

### Events Published
- `OnPlanetSelected(int planetID)`: Planet selected by player
- `OnPlanetDeselected()`: Selection cleared
- `OnCameraFocusChanged(Vector3 focusPoint)`: Camera moved to new location

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
