using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace Overlord.Unity.UI.Dialogs
{
    /// <summary>
    /// Base class for all modal dialog panels.
    /// Provides Show/Hide/Confirm/Cancel lifecycle with Action callbacks.
    /// </summary>
    public abstract class ModalDialogPanel : MonoBehaviour
    {
        #region Serialized Fields

        [Header("Dialog Panel")]
        [SerializeField] protected GameObject dialogPanel;

        [Header("Buttons")]
        [SerializeField] protected Button confirmButton;
        [SerializeField] protected Button cancelButton;

        [Header("Text Components")]
        [SerializeField] protected TMP_Text titleText;
        [SerializeField] protected TMP_Text messageText;

        #endregion

        #region Protected Fields

        protected System.Action onConfirm;
        protected System.Action onCancel;

        #endregion

        #region Unity Lifecycle

        protected virtual void Awake()
        {
            // Wire up button listeners
            if (confirmButton != null)
            {
                confirmButton.onClick.AddListener(OnConfirmClicked);
            }

            if (cancelButton != null)
            {
                cancelButton.onClick.AddListener(OnCancelClicked);
            }

            // Start hidden
            if (dialogPanel != null)
            {
                dialogPanel.SetActive(false);
            }
        }

        protected virtual void OnDestroy()
        {
            // Clean up button listeners
            if (confirmButton != null)
            {
                confirmButton.onClick.RemoveListener(OnConfirmClicked);
            }

            if (cancelButton != null)
            {
                cancelButton.onClick.RemoveListener(OnCancelClicked);
            }
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Show the dialog with optional callbacks.
        /// </summary>
        public virtual void Show(System.Action onConfirmCallback = null, System.Action onCancelCallback = null)
        {
            onConfirm = onConfirmCallback;
            onCancel = onCancelCallback;

            if (dialogPanel != null)
            {
                dialogPanel.SetActive(true);
            }

            OnShow();
        }

        /// <summary>
        /// Hide the dialog without invoking callbacks.
        /// </summary>
        public virtual void Hide()
        {
            if (dialogPanel != null)
            {
                dialogPanel.SetActive(false);
            }

            OnHide();
        }

        /// <summary>
        /// Close the dialog (alias for Hide).
        /// </summary>
        public virtual void Close()
        {
            Hide();
        }

        #endregion

        #region Protected Virtual Methods

        /// <summary>
        /// Called when the dialog is shown. Override to perform setup.
        /// </summary>
        protected virtual void OnShow()
        {
            // Override in derived classes
        }

        /// <summary>
        /// Called when the dialog is hidden. Override to perform cleanup.
        /// </summary>
        protected virtual void OnHide()
        {
            // Override in derived classes
        }

        /// <summary>
        /// Called when the confirm button is clicked. Override to add validation.
        /// </summary>
        protected virtual void OnConfirmClicked()
        {
            // Invoke callback
            onConfirm?.Invoke();

            // Hide dialog
            Hide();

            // Clear callbacks
            onConfirm = null;
            onCancel = null;
        }

        /// <summary>
        /// Called when the cancel button is clicked. Override to add cleanup.
        /// </summary>
        protected virtual void OnCancelClicked()
        {
            // Invoke callback
            onCancel?.Invoke();

            // Hide dialog
            Hide();

            // Clear callbacks
            onConfirm = null;
            onCancel = null;
        }

        #endregion

        #region Protected Helper Methods

        /// <summary>
        /// Set the dialog title.
        /// </summary>
        protected void SetTitle(string title)
        {
            if (titleText != null)
            {
                titleText.text = title;
            }
        }

        /// <summary>
        /// Set the dialog message.
        /// </summary>
        protected void SetMessage(string message)
        {
            if (messageText != null)
            {
                messageText.text = message;
            }
        }

        /// <summary>
        /// Enable or disable the confirm button.
        /// </summary>
        protected void SetConfirmButtonEnabled(bool enabled)
        {
            if (confirmButton != null)
            {
                confirmButton.interactable = enabled;
            }
        }

        /// <summary>
        /// Enable or disable the cancel button.
        /// </summary>
        protected void SetCancelButtonEnabled(bool enabled)
        {
            if (cancelButton != null)
            {
                cancelButton.interactable = enabled;
            }
        }

        #endregion
    }
}
