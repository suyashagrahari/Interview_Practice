declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: google.accounts.id.CredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (callback: (notification: google.accounts.id.PromptMomentNotification) => void) => void;
          renderButton: (element: HTMLElement, options: google.accounts.id.GsiButtonConfiguration) => void;
        };
      };
    };
  }
}

declare namespace google {
  namespace accounts {
    namespace id {
      interface CredentialResponse {
        credential: string;
        select_by: string;
      }

      interface PromptMomentNotification {
        isNotDisplayed(): boolean;
        isSkippedMoment(): boolean;
        getMomentType(): string;
        isDismissedMoment(): boolean;
        getDismissedReason(): string;
        getSkippedReason(): string;
        isDisplayedMoment(): boolean;
        isDisplayed(): boolean;
        getNotDisplayedReason(): string;
        isSkipped(): boolean;
        getSkippedReason(): string;
        isDismissed(): boolean;
        getDismissedReason(): string;
        getMomentType(): string;
      }

      interface GsiButtonConfiguration {
        type: 'standard' | 'icon';
        theme?: 'outline' | 'filled_blue' | 'filled_black';
        size?: 'large' | 'medium' | 'small';
        text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
        shape?: 'rectangular' | 'rounded' | 'circular' | 'pill';
        logo_alignment?: 'left' | 'center';
        width?: string;
        local?: string;
      }
    }
  }
}

export {};
