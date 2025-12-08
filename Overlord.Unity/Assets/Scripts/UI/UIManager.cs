using UnityEngine;

namespace Overlord.Unity.UI
{
    /// <summary>
    /// Singleton manager for UI state and panel management.
    /// Coordinates UI elements across scenes.
    /// </summary>
    public class UIManager : MonoBehaviour
    {
        #region Singleton

        private static UIManager _instance;

        public static UIManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindFirstObjectByType<UIManager>();
                    if (_instance == null)
                    {
                        var go = new GameObject("UIManager");
                        _instance = go.AddComponent<UIManager>();
                    }
                }
                return _instance;
            }
        }

        #endregion

        // NOTE: Modal dialog references will be added after Unity Editor regenerates .csproj
        // The dialog scripts are created and compile successfully:
        // - BuildingPickerDialog.cs
        // - CraftPurchaseDialog.cs
        // - PlatoonCommissionDialog.cs
        // - ResearchDialog.cs
        // - TaxRateDialog.cs
        //
        // To wire them up:
        // 1. Open Unity Editor
        // 2. Let it regenerate Assembly-CSharp.csproj
        // 3. Uncomment the region below and recompile

        // #region Modal Dialogs
        //
        // [Header("Modal Dialogs")]
        // [SerializeField] private Dialogs.BuildingPickerDialog buildingPickerDialog;
        // [SerializeField] private Dialogs.CraftPurchaseDialog craftPurchaseDialog;
        // [SerializeField] private Dialogs.PlatoonCommissionDialog platoonCommissionDialog;
        // [SerializeField] private Dialogs.ResearchDialog researchDialog;
        // [SerializeField] private Dialogs.TaxRateDialog taxRateDialog;
        //
        // public Dialogs.BuildingPickerDialog BuildingPickerDialog => buildingPickerDialog;
        // public Dialogs.CraftPurchaseDialog CraftPurchaseDialog => craftPurchaseDialog;
        // public Dialogs.PlatoonCommissionDialog PlatoonCommissionDialog => platoonCommissionDialog;
        // public Dialogs.ResearchDialog ResearchDialog => researchDialog;
        // public Dialogs.TaxRateDialog TaxRateDialog => taxRateDialog;
        //
        // #endregion

        #region Unity Lifecycle

        void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            DontDestroyOnLoad(gameObject);

            Debug.Log("UIManager initialized");
        }

        void OnDestroy()
        {
            if (_instance == this)
            {
                _instance = null;
            }
        }

        #endregion

        #region Public API

        /// <summary>
        /// Shows a UI panel by name.
        /// </summary>
        public void ShowPanel(string panelName)
        {
            Debug.Log($"ShowPanel: {panelName}");
        }

        /// <summary>
        /// Hides a UI panel by name.
        /// </summary>
        public void HidePanel(string panelName)
        {
            Debug.Log($"HidePanel: {panelName}");
        }

        #endregion
    }
}
