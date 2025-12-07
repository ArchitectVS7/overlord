using UnityEngine;
using UnityEngine.UI;
using UnityEditor;
using TMPro;
using Overlord.Unity.UI;
using Overlord.Unity.UI.Dialogs;
using Overlord.Unity.UI.Panels;

namespace Overlord.Unity.Editor
{
    /// <summary>
    /// Editor script to automatically build Week 2 UI components.
    /// Run via menu: Overlord → Build Week 2 UI
    /// </summary>
    public class EditorUIBuilder : UnityEditor.Editor
    {
        private static Canvas _canvas;
        private static GameObject _dialogsParent;
        private static TMP_FontAsset _defaultFont;

        [MenuItem("Overlord/Build Week 2 UI")]
        public static void BuildWeek2UI()
        {
            Debug.Log("=== Building Week 2 UI Components ===");

            // Find or create canvas
            _canvas = FindFirstObjectByType<Canvas>();
            if (_canvas == null)
            {
                var canvasGO = new GameObject("Canvas");
                _canvas = canvasGO.AddComponent<Canvas>();
                _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
                canvasGO.AddComponent<CanvasScaler>();
                canvasGO.AddComponent<GraphicRaycaster>();
                Debug.Log("Created Canvas");
            }

            // Find default TMP font
            _defaultFont = Resources.Load<TMP_FontAsset>("Fonts & Materials/LiberationSans SDF");
            if (_defaultFont == null)
            {
                // Try to find any TMP font
                var fonts = Resources.FindObjectsOfTypeAll<TMP_FontAsset>();
                if (fonts.Length > 0)
                {
                    _defaultFont = fonts[0];
                }
            }

            // Create dialogs parent
            _dialogsParent = new GameObject("Dialogs");
            _dialogsParent.transform.SetParent(_canvas.transform, false);
            var dialogsRect = _dialogsParent.AddComponent<RectTransform>();
            SetFullStretch(dialogsRect);

            // Build all dialogs
            var buildingDialog = BuildBuildingPickerDialog();
            var craftDialog = BuildCraftPurchaseDialog();
            var platoonDialog = BuildPlatoonCommissionDialog();
            var researchDialog = BuildResearchDialog();
            var taxDialog = BuildTaxRateDialog();

            // Build action menu
            var actionMenu = BuildActionMenuPanel(buildingDialog, craftDialog, platoonDialog, researchDialog, taxDialog);

            // Wire UIManager
            WireUIManager(buildingDialog, craftDialog, platoonDialog, researchDialog, taxDialog);

            Debug.Log("=== Week 2 UI Build Complete ===");
            Debug.Log($"Created: BuildingPickerDialog, CraftPurchaseDialog, PlatoonCommissionDialog, ResearchDialog, TaxRateDialog, ActionMenuPanel");

            // Mark scene dirty
            UnityEditor.SceneManagement.EditorSceneManager.MarkSceneDirty(
                UnityEditor.SceneManagement.EditorSceneManager.GetActiveScene());
        }

        #region Dialog Builders

        private static BuildingPickerDialog BuildBuildingPickerDialog()
        {
            var dialogGO = CreateDialogBase("BuildingPickerDialog");
            var dialog = dialogGO.AddComponent<BuildingPickerDialog>();
            var panel = dialogGO.transform.Find("Panel").gameObject;

            // Create building buttons
            string[] buildings = { "DockingBay", "SurfacePlatform", "MiningStation", "HorticulturalStation", "OrbitalDefense" };
            var buttonsParent = CreateUIElement<RectTransform>("BuildingButtons", panel.transform);
            SetRect(buttonsParent, 0, -100, 400, 250);
            var layout = buttonsParent.gameObject.AddComponent<VerticalLayoutGroup>();
            layout.spacing = 10;
            layout.childAlignment = TextAnchor.MiddleCenter;
            layout.childControlHeight = true;
            layout.childControlWidth = true;

            Button[] buttons = new Button[5];
            TMP_Text[] infoTexts = new TMP_Text[5];

            for (int i = 0; i < buildings.Length; i++)
            {
                var btnGO = CreateButton($"{buildings[i]}Button", buttonsParent);
                buttons[i] = btnGO.GetComponent<Button>();

                var infoText = CreateText($"{buildings[i]}InfoText", btnGO.transform, "Cost: 0 | Time: 0");
                infoTexts[i] = infoText;
                SetRect(infoText.rectTransform, 0, -20, 180, 20);
            }

            // Wire serialized fields via SerializedObject
            var so = new SerializedObject(dialog);
            WireDialogBaseFields(so, panel);
            so.FindProperty("dockingBayButton").objectReferenceValue = buttons[0];
            so.FindProperty("surfacePlatformButton").objectReferenceValue = buttons[1];
            so.FindProperty("miningStationButton").objectReferenceValue = buttons[2];
            so.FindProperty("horticulturalStationButton").objectReferenceValue = buttons[3];
            so.FindProperty("orbitalDefenseButton").objectReferenceValue = buttons[4];
            so.FindProperty("dockingBayInfoText").objectReferenceValue = infoTexts[0];
            so.FindProperty("surfacePlatformInfoText").objectReferenceValue = infoTexts[1];
            so.FindProperty("miningStationInfoText").objectReferenceValue = infoTexts[2];
            so.FindProperty("horticulturalStationInfoText").objectReferenceValue = infoTexts[3];
            so.FindProperty("orbitalDefenseInfoText").objectReferenceValue = infoTexts[4];
            so.ApplyModifiedProperties();

            Debug.Log("  ✓ BuildingPickerDialog created");
            return dialog;
        }

        private static CraftPurchaseDialog BuildCraftPurchaseDialog()
        {
            var dialogGO = CreateDialogBase("CraftPurchaseDialog");
            var dialog = dialogGO.AddComponent<CraftPurchaseDialog>();
            var panel = dialogGO.transform.Find("Panel").gameObject;

            // Create craft buttons
            string[] crafts = { "BattleCruiser", "CargoCruiser", "SolarSatellite", "AtmosphereProcessor" };
            var buttonsParent = CreateUIElement<RectTransform>("CraftButtons", panel.transform);
            SetRect(buttonsParent, 0, -100, 400, 200);
            var layout = buttonsParent.gameObject.AddComponent<VerticalLayoutGroup>();
            layout.spacing = 10;
            layout.childAlignment = TextAnchor.MiddleCenter;
            layout.childControlHeight = true;
            layout.childControlWidth = true;

            Button[] buttons = new Button[4];
            TMP_Text[] infoTexts = new TMP_Text[4];

            for (int i = 0; i < crafts.Length; i++)
            {
                var btnGO = CreateButton($"{crafts[i]}Button", buttonsParent);
                buttons[i] = btnGO.GetComponent<Button>();

                var infoText = CreateText($"{crafts[i]}InfoText", btnGO.transform, "Cost: 0 | Crew: 0");
                infoTexts[i] = infoText;
                SetRect(infoText.rectTransform, 0, -20, 180, 20);
            }

            // Wire serialized fields
            var so = new SerializedObject(dialog);
            WireDialogBaseFields(so, panel);
            so.FindProperty("battleCruiserButton").objectReferenceValue = buttons[0];
            so.FindProperty("cargoCruiserButton").objectReferenceValue = buttons[1];
            so.FindProperty("solarSatelliteButton").objectReferenceValue = buttons[2];
            so.FindProperty("atmosphereProcessorButton").objectReferenceValue = buttons[3];
            so.FindProperty("battleCruiserInfoText").objectReferenceValue = infoTexts[0];
            so.FindProperty("cargoCruiserInfoText").objectReferenceValue = infoTexts[1];
            so.FindProperty("solarSatelliteInfoText").objectReferenceValue = infoTexts[2];
            so.FindProperty("atmosphereProcessorInfoText").objectReferenceValue = infoTexts[3];
            so.ApplyModifiedProperties();

            Debug.Log("  ✓ CraftPurchaseDialog created");
            return dialog;
        }

        private static PlatoonCommissionDialog BuildPlatoonCommissionDialog()
        {
            var dialogGO = CreateDialogBase("PlatoonCommissionDialog");
            var dialog = dialogGO.AddComponent<PlatoonCommissionDialog>();
            var panel = dialogGO.transform.Find("Panel").gameObject;

            // Troop count slider
            var sliderGO = CreateSlider("TroopCountSlider", panel.transform);
            var slider = sliderGO.GetComponent<Slider>();
            slider.minValue = 1;
            slider.maxValue = 200;
            slider.value = 50;
            slider.wholeNumbers = true;
            SetRect(sliderGO.GetComponent<RectTransform>(), 0, -80, 300, 30);

            var troopCountText = CreateText("TroopCountText", panel.transform, "Troops: 50");
            SetRect(troopCountText.rectTransform, 0, -50, 200, 30);

            // Equipment dropdown
            var equipDropdownGO = CreateDropdown("EquipmentDropdown", panel.transform);
            var equipDropdown = equipDropdownGO.GetComponent<TMP_Dropdown>();
            equipDropdown.ClearOptions();
            equipDropdown.AddOptions(new System.Collections.Generic.List<string> { "Civilian", "Basic", "Standard", "Advanced", "Elite" });
            SetRect(equipDropdownGO.GetComponent<RectTransform>(), -100, -130, 180, 40);

            // Weapon dropdown
            var weaponDropdownGO = CreateDropdown("WeaponDropdown", panel.transform);
            var weaponDropdown = weaponDropdownGO.GetComponent<TMP_Dropdown>();
            weaponDropdown.ClearOptions();
            weaponDropdown.AddOptions(new System.Collections.Generic.List<string> { "Pistol", "Rifle", "AssaultRifle", "Plasma" });
            SetRect(weaponDropdownGO.GetComponent<RectTransform>(), 100, -130, 180, 40);

            // Preview texts
            var costPreview = CreateText("CostPreviewText", panel.transform, "Cost: 0 Credits");
            SetRect(costPreview.rectTransform, 0, -180, 300, 30);

            var strengthPreview = CreateText("StrengthPreviewText", panel.transform, "Strength: 0");
            SetRect(strengthPreview.rectTransform, 0, -210, 300, 30);

            var validationText = CreateText("ValidationText", panel.transform, "READY TO COMMISSION");
            SetRect(validationText.rectTransform, 0, -250, 300, 30);
            validationText.color = Color.green;

            // Wire serialized fields
            var so = new SerializedObject(dialog);
            WireDialogBaseFields(so, panel);
            so.FindProperty("troopCountSlider").objectReferenceValue = slider;
            so.FindProperty("troopCountText").objectReferenceValue = troopCountText;
            so.FindProperty("equipmentDropdown").objectReferenceValue = equipDropdown;
            so.FindProperty("weaponDropdown").objectReferenceValue = weaponDropdown;
            so.FindProperty("costPreviewText").objectReferenceValue = costPreview;
            so.FindProperty("strengthPreviewText").objectReferenceValue = strengthPreview;
            so.FindProperty("validationText").objectReferenceValue = validationText;
            so.ApplyModifiedProperties();

            Debug.Log("  ✓ PlatoonCommissionDialog created");
            return dialog;
        }

        private static ResearchDialog BuildResearchDialog()
        {
            var dialogGO = CreateDialogBase("ResearchDialog");
            var dialog = dialogGO.AddComponent<ResearchDialog>();
            var panel = dialogGO.transform.Find("Panel").gameObject;

            // Research info texts
            var currentTier = CreateText("CurrentTierText", panel.transform, "Current Tier: Laser");
            SetRect(currentTier.rectTransform, 0, -60, 300, 30);

            var nextTier = CreateText("NextTierText", panel.transform, "Next Tier: Missile");
            SetRect(nextTier.rectTransform, 0, -100, 300, 30);

            var costText = CreateText("CostText", panel.transform, "Cost: 5000 Credits");
            SetRect(costText.rectTransform, 0, -140, 300, 30);

            var timeText = CreateText("TimeText", panel.transform, "Time: 5 turns");
            SetRect(timeText.rectTransform, 0, -180, 300, 30);

            var progressText = CreateText("ProgressText", panel.transform, "READY TO RESEARCH");
            SetRect(progressText.rectTransform, 0, -220, 300, 30);
            progressText.color = Color.green;

            // Wire serialized fields
            var so = new SerializedObject(dialog);
            WireDialogBaseFields(so, panel);
            so.FindProperty("currentTierText").objectReferenceValue = currentTier;
            so.FindProperty("nextTierText").objectReferenceValue = nextTier;
            so.FindProperty("costText").objectReferenceValue = costText;
            so.FindProperty("timeText").objectReferenceValue = timeText;
            so.FindProperty("progressText").objectReferenceValue = progressText;
            so.ApplyModifiedProperties();

            Debug.Log("  ✓ ResearchDialog created");
            return dialog;
        }

        private static TaxRateDialog BuildTaxRateDialog()
        {
            var dialogGO = CreateDialogBase("TaxRateDialog");
            var dialog = dialogGO.AddComponent<TaxRateDialog>();
            var panel = dialogGO.transform.Find("Panel").gameObject;

            // Tax rate slider
            var sliderGO = CreateSlider("TaxRateSlider", panel.transform);
            var slider = sliderGO.GetComponent<Slider>();
            slider.minValue = 0;
            slider.maxValue = 100;
            slider.value = 50;
            slider.wholeNumbers = true;
            SetRect(sliderGO.GetComponent<RectTransform>(), 0, -80, 300, 30);

            var taxRateValue = CreateText("TaxRateValueText", panel.transform, "50%");
            SetRect(taxRateValue.rectTransform, 160, -80, 60, 30);

            // Preview texts
            var currentRate = CreateText("CurrentRateText", panel.transform, "Current Rate: 50%");
            SetRect(currentRate.rectTransform, 0, -120, 300, 30);

            var revenuePreview = CreateText("RevenuePreviewText", panel.transform, "Est. Revenue: +1000 Credits/turn");
            SetRect(revenuePreview.rectTransform, 0, -160, 300, 30);

            var moraleImpact = CreateText("MoraleImpactText", panel.transform, "Morale Impact: 0/turn");
            SetRect(moraleImpact.rectTransform, 0, -200, 300, 30);
            moraleImpact.color = Color.yellow;

            var categoryText = CreateText("CategoryText", panel.transform, "Category: Moderate Taxes");
            SetRect(categoryText.rectTransform, 0, -240, 300, 30);

            // Wire serialized fields
            var so = new SerializedObject(dialog);
            WireDialogBaseFields(so, panel);
            so.FindProperty("taxRateSlider").objectReferenceValue = slider;
            so.FindProperty("taxRateValueText").objectReferenceValue = taxRateValue;
            so.FindProperty("currentRateText").objectReferenceValue = currentRate;
            so.FindProperty("revenuePreviewText").objectReferenceValue = revenuePreview;
            so.FindProperty("moraleImpactText").objectReferenceValue = moraleImpact;
            so.FindProperty("categoryText").objectReferenceValue = categoryText;
            so.ApplyModifiedProperties();

            Debug.Log("  ✓ TaxRateDialog created");
            return dialog;
        }

        #endregion

        #region ActionMenuPanel Builder

        private static ActionMenuPanel BuildActionMenuPanel(
            BuildingPickerDialog buildingDialog,
            CraftPurchaseDialog craftDialog,
            PlatoonCommissionDialog platoonDialog,
            ResearchDialog researchDialog,
            TaxRateDialog taxDialog)
        {
            var menuGO = new GameObject("ActionMenuPanel");
            menuGO.transform.SetParent(_canvas.transform, false);
            var rect = menuGO.AddComponent<RectTransform>();
            SetRect(rect, -150, 0, 250, 350);
            rect.anchorMin = new Vector2(1, 0.5f);
            rect.anchorMax = new Vector2(1, 0.5f);
            rect.pivot = new Vector2(1, 0.5f);

            var panel = menuGO.AddComponent<ActionMenuPanel>();

            // Background panel
            var bg = menuGO.AddComponent<Image>();
            bg.color = new Color(0.1f, 0.1f, 0.1f, 0.9f);

            // Layout
            var layout = menuGO.AddComponent<VerticalLayoutGroup>();
            layout.spacing = 10;
            layout.padding = new RectOffset(20, 20, 20, 20);
            layout.childAlignment = TextAnchor.MiddleCenter;
            layout.childControlHeight = false;
            layout.childControlWidth = true;
            layout.childForceExpandHeight = false;

            // Create buttons
            string[] actions = { "BuildStructure", "PurchaseCraft", "CommissionPlatoon", "ResearchWeapons", "SetTaxRate", "EndTurn" };
            string[] labels = { "Build Structure", "Purchase Craft", "Commission Platoon", "Research Weapons", "Set Tax Rate", "End Turn" };
            Button[] buttons = new Button[6];

            for (int i = 0; i < actions.Length; i++)
            {
                var btnGO = CreateButton($"{actions[i]}Button", rect, labels[i]);
                var btnRect = btnGO.GetComponent<RectTransform>();
                btnRect.sizeDelta = new Vector2(200, 40);
                buttons[i] = btnGO.GetComponent<Button>();
            }

            // Wire serialized fields
            var so = new SerializedObject(panel);
            so.FindProperty("buildStructureButton").objectReferenceValue = buttons[0];
            so.FindProperty("purchaseCraftButton").objectReferenceValue = buttons[1];
            so.FindProperty("commissionPlatoonButton").objectReferenceValue = buttons[2];
            so.FindProperty("researchWeaponsButton").objectReferenceValue = buttons[3];
            so.FindProperty("setTaxRateButton").objectReferenceValue = buttons[4];
            so.FindProperty("endTurnButton").objectReferenceValue = buttons[5];
            so.FindProperty("buildingPickerDialog").objectReferenceValue = buildingDialog;
            so.FindProperty("craftPurchaseDialog").objectReferenceValue = craftDialog;
            so.FindProperty("platoonCommissionDialog").objectReferenceValue = platoonDialog;
            so.FindProperty("researchDialog").objectReferenceValue = researchDialog;
            so.FindProperty("taxRateDialog").objectReferenceValue = taxDialog;
            so.ApplyModifiedProperties();

            Debug.Log("  ✓ ActionMenuPanel created");
            return panel;
        }

        #endregion

        #region UIManager Wiring

        private static void WireUIManager(
            BuildingPickerDialog buildingDialog,
            CraftPurchaseDialog craftDialog,
            PlatoonCommissionDialog platoonDialog,
            ResearchDialog researchDialog,
            TaxRateDialog taxDialog)
        {
            var uiManager = FindFirstObjectByType<UIManager>();
            if (uiManager == null)
            {
                Debug.LogWarning("UIManager not found in scene. Skipping wiring.");
                return;
            }

            var so = new SerializedObject(uiManager);
            so.FindProperty("buildingPickerDialog").objectReferenceValue = buildingDialog;
            so.FindProperty("craftPurchaseDialog").objectReferenceValue = craftDialog;
            so.FindProperty("platoonCommissionDialog").objectReferenceValue = platoonDialog;
            so.FindProperty("researchDialog").objectReferenceValue = researchDialog;
            so.FindProperty("taxRateDialog").objectReferenceValue = taxDialog;
            so.ApplyModifiedProperties();

            Debug.Log("  ✓ UIManager wired");
        }

        #endregion

        #region UI Element Creators

        private static GameObject CreateDialogBase(string name)
        {
            var dialogGO = new GameObject(name);
            dialogGO.transform.SetParent(_dialogsParent.transform, false);
            var dialogRect = dialogGO.AddComponent<RectTransform>();
            SetFullStretch(dialogRect);

            // Dimmer background
            var dimmer = new GameObject("Dimmer");
            dimmer.transform.SetParent(dialogGO.transform, false);
            var dimmerRect = dimmer.AddComponent<RectTransform>();
            SetFullStretch(dimmerRect);
            var dimmerImage = dimmer.AddComponent<Image>();
            dimmerImage.color = new Color(0, 0, 0, 0.5f);

            // Main panel
            var panel = new GameObject("Panel");
            panel.transform.SetParent(dialogGO.transform, false);
            var panelRect = panel.AddComponent<RectTransform>();
            SetRect(panelRect, 0, 0, 450, 400);
            var panelImage = panel.AddComponent<Image>();
            panelImage.color = new Color(0.15f, 0.15f, 0.2f, 0.95f);

            // Title
            var title = CreateText("TitleText", panel.transform, "DIALOG TITLE");
            title.fontSize = 24;
            title.fontStyle = FontStyles.Bold;
            title.alignment = TextAlignmentOptions.Center;
            SetRect(title.rectTransform, 0, 170, 400, 40);

            // Message
            var message = CreateText("MessageText", panel.transform, "Dialog message");
            message.fontSize = 16;
            message.alignment = TextAlignmentOptions.Center;
            SetRect(message.rectTransform, 0, 130, 400, 30);

            // Confirm button
            var confirmBtn = CreateButton("ConfirmButton", panel.transform, "CONFIRM");
            SetRect(confirmBtn.GetComponent<RectTransform>(), -80, -160, 120, 40);

            // Cancel button
            var cancelBtn = CreateButton("CancelButton", panel.transform, "CANCEL");
            SetRect(cancelBtn.GetComponent<RectTransform>(), 80, -160, 120, 40);

            // Start hidden
            dialogGO.SetActive(false);

            return dialogGO;
        }

        private static void WireDialogBaseFields(SerializedObject so, GameObject panel)
        {
            so.FindProperty("dialogPanel").objectReferenceValue = panel;
            so.FindProperty("titleText").objectReferenceValue = panel.transform.Find("TitleText")?.GetComponent<TMP_Text>();
            so.FindProperty("messageText").objectReferenceValue = panel.transform.Find("MessageText")?.GetComponent<TMP_Text>();
            so.FindProperty("confirmButton").objectReferenceValue = panel.transform.Find("ConfirmButton")?.GetComponent<Button>();
            so.FindProperty("cancelButton").objectReferenceValue = panel.transform.Find("CancelButton")?.GetComponent<Button>();
        }

        private static GameObject CreateButton(string name, Transform parent, string label = "Button")
        {
            var btnGO = new GameObject(name);
            btnGO.transform.SetParent(parent, false);
            var rect = btnGO.AddComponent<RectTransform>();
            rect.sizeDelta = new Vector2(200, 40);

            var image = btnGO.AddComponent<Image>();
            image.color = new Color(0.3f, 0.3f, 0.4f, 1f);

            var button = btnGO.AddComponent<Button>();
            var colors = button.colors;
            colors.highlightedColor = new Color(0.4f, 0.4f, 0.6f, 1f);
            colors.pressedColor = new Color(0.2f, 0.2f, 0.3f, 1f);
            button.colors = colors;

            var textGO = new GameObject("Text");
            textGO.transform.SetParent(btnGO.transform, false);
            var textRect = textGO.AddComponent<RectTransform>();
            SetFullStretch(textRect);
            var text = textGO.AddComponent<TextMeshProUGUI>();
            text.text = label;
            text.fontSize = 16;
            text.alignment = TextAlignmentOptions.Center;
            text.color = Color.white;
            if (_defaultFont != null) text.font = _defaultFont;

            return btnGO;
        }

        private static TMP_Text CreateText(string name, Transform parent, string content)
        {
            var textGO = new GameObject(name);
            textGO.transform.SetParent(parent, false);
            var rect = textGO.AddComponent<RectTransform>();
            rect.sizeDelta = new Vector2(200, 30);

            var text = textGO.AddComponent<TextMeshProUGUI>();
            text.text = content;
            text.fontSize = 14;
            text.alignment = TextAlignmentOptions.Center;
            text.color = Color.white;
            if (_defaultFont != null) text.font = _defaultFont;

            return text;
        }

        private static GameObject CreateSlider(string name, Transform parent)
        {
            var sliderGO = new GameObject(name);
            sliderGO.transform.SetParent(parent, false);
            var rect = sliderGO.AddComponent<RectTransform>();
            rect.sizeDelta = new Vector2(200, 20);

            // Background
            var bgGO = new GameObject("Background");
            bgGO.transform.SetParent(sliderGO.transform, false);
            var bgRect = bgGO.AddComponent<RectTransform>();
            SetFullStretch(bgRect);
            bgRect.sizeDelta = new Vector2(0, 10);
            var bgImage = bgGO.AddComponent<Image>();
            bgImage.color = new Color(0.2f, 0.2f, 0.2f, 1f);

            // Fill area
            var fillAreaGO = new GameObject("Fill Area");
            fillAreaGO.transform.SetParent(sliderGO.transform, false);
            var fillAreaRect = fillAreaGO.AddComponent<RectTransform>();
            SetFullStretch(fillAreaRect);
            fillAreaRect.sizeDelta = new Vector2(-20, 0);

            var fillGO = new GameObject("Fill");
            fillGO.transform.SetParent(fillAreaGO.transform, false);
            var fillRect = fillGO.AddComponent<RectTransform>();
            fillRect.anchorMin = Vector2.zero;
            fillRect.anchorMax = new Vector2(0.5f, 1);
            fillRect.sizeDelta = new Vector2(0, 0);
            var fillImage = fillGO.AddComponent<Image>();
            fillImage.color = new Color(0.3f, 0.6f, 0.9f, 1f);

            // Handle slide area
            var handleAreaGO = new GameObject("Handle Slide Area");
            handleAreaGO.transform.SetParent(sliderGO.transform, false);
            var handleAreaRect = handleAreaGO.AddComponent<RectTransform>();
            SetFullStretch(handleAreaRect);
            handleAreaRect.sizeDelta = new Vector2(-20, 0);

            var handleGO = new GameObject("Handle");
            handleGO.transform.SetParent(handleAreaGO.transform, false);
            var handleRect = handleGO.AddComponent<RectTransform>();
            handleRect.sizeDelta = new Vector2(20, 30);
            var handleImage = handleGO.AddComponent<Image>();
            handleImage.color = new Color(0.8f, 0.8f, 0.8f, 1f);

            var slider = sliderGO.AddComponent<Slider>();
            slider.fillRect = fillRect;
            slider.handleRect = handleRect;
            slider.targetGraphic = handleImage;

            return sliderGO;
        }

        private static GameObject CreateDropdown(string name, Transform parent)
        {
            var dropdownGO = new GameObject(name);
            dropdownGO.transform.SetParent(parent, false);
            var rect = dropdownGO.AddComponent<RectTransform>();
            rect.sizeDelta = new Vector2(180, 40);

            var image = dropdownGO.AddComponent<Image>();
            image.color = new Color(0.25f, 0.25f, 0.35f, 1f);

            var dropdown = dropdownGO.AddComponent<TMP_Dropdown>();

            // Label
            var labelGO = new GameObject("Label");
            labelGO.transform.SetParent(dropdownGO.transform, false);
            var labelRect = labelGO.AddComponent<RectTransform>();
            SetFullStretch(labelRect);
            labelRect.offsetMin = new Vector2(10, 0);
            labelRect.offsetMax = new Vector2(-30, 0);
            var label = labelGO.AddComponent<TextMeshProUGUI>();
            label.fontSize = 14;
            label.alignment = TextAlignmentOptions.Left;
            label.color = Color.white;
            if (_defaultFont != null) label.font = _defaultFont;
            dropdown.captionText = label;

            // Arrow
            var arrowGO = new GameObject("Arrow");
            arrowGO.transform.SetParent(dropdownGO.transform, false);
            var arrowRect = arrowGO.AddComponent<RectTransform>();
            arrowRect.anchorMin = new Vector2(1, 0.5f);
            arrowRect.anchorMax = new Vector2(1, 0.5f);
            arrowRect.pivot = new Vector2(1, 0.5f);
            arrowRect.sizeDelta = new Vector2(20, 20);
            arrowRect.anchoredPosition = new Vector2(-10, 0);
            var arrowImage = arrowGO.AddComponent<Image>();
            arrowImage.color = Color.white;

            // Template (simplified)
            var templateGO = new GameObject("Template");
            templateGO.transform.SetParent(dropdownGO.transform, false);
            var templateRect = templateGO.AddComponent<RectTransform>();
            templateRect.anchorMin = new Vector2(0, 0);
            templateRect.anchorMax = new Vector2(1, 0);
            templateRect.pivot = new Vector2(0.5f, 1);
            templateRect.sizeDelta = new Vector2(0, 150);
            var templateImage = templateGO.AddComponent<Image>();
            templateImage.color = new Color(0.2f, 0.2f, 0.3f, 1f);
            var templateScroll = templateGO.AddComponent<ScrollRect>();

            var viewportGO = new GameObject("Viewport");
            viewportGO.transform.SetParent(templateGO.transform, false);
            var viewportRect = viewportGO.AddComponent<RectTransform>();
            SetFullStretch(viewportRect);
            var viewportMask = viewportGO.AddComponent<Mask>();
            viewportMask.showMaskGraphic = false;
            viewportGO.AddComponent<Image>();

            var contentGO = new GameObject("Content");
            contentGO.transform.SetParent(viewportGO.transform, false);
            var contentRect = contentGO.AddComponent<RectTransform>();
            contentRect.anchorMin = new Vector2(0, 1);
            contentRect.anchorMax = new Vector2(1, 1);
            contentRect.pivot = new Vector2(0.5f, 1);
            contentRect.sizeDelta = new Vector2(0, 30);

            var itemGO = new GameObject("Item");
            itemGO.transform.SetParent(contentGO.transform, false);
            var itemRect = itemGO.AddComponent<RectTransform>();
            itemRect.anchorMin = new Vector2(0, 0.5f);
            itemRect.anchorMax = new Vector2(1, 0.5f);
            itemRect.sizeDelta = new Vector2(0, 30);
            var itemToggle = itemGO.AddComponent<Toggle>();

            var itemLabelGO = new GameObject("Item Label");
            itemLabelGO.transform.SetParent(itemGO.transform, false);
            var itemLabelRect = itemLabelGO.AddComponent<RectTransform>();
            SetFullStretch(itemLabelRect);
            var itemLabel = itemLabelGO.AddComponent<TextMeshProUGUI>();
            itemLabel.fontSize = 14;
            itemLabel.alignment = TextAlignmentOptions.Left;
            itemLabel.color = Color.white;
            if (_defaultFont != null) itemLabel.font = _defaultFont;

            templateScroll.content = contentRect;
            templateScroll.viewport = viewportRect;
            dropdown.template = templateRect;
            dropdown.itemText = itemLabel;

            templateGO.SetActive(false);

            return dropdownGO;
        }

        private static T CreateUIElement<T>(string name, Transform parent) where T : Component
        {
            var go = new GameObject(name);
            go.transform.SetParent(parent, false);
            return go.AddComponent<T>();
        }

        #endregion

        #region Helpers

        private static void SetFullStretch(RectTransform rect)
        {
            rect.anchorMin = Vector2.zero;
            rect.anchorMax = Vector2.one;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
        }

        private static void SetRect(RectTransform rect, float x, float y, float width, float height)
        {
            rect.anchorMin = new Vector2(0.5f, 0.5f);
            rect.anchorMax = new Vector2(0.5f, 0.5f);
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = new Vector2(x, y);
            rect.sizeDelta = new Vector2(width, height);
        }

        #endregion
    }
}
