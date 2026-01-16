import { create } from 'zustand';

interface SettingsState {
    unsplashAccessKey: string;
    replicateApiToken: string;
    nounProjectKey: string;
    nounProjectSecret: string;
    setUnsplashAccessKey: (key: string) => void;
    setReplicateApiToken: (token: string) => void;
    setNounProjectKey: (key: string) => void;
    setNounProjectSecret: (secret: string) => void;
    loadSettings: () => Promise<void>;
    saveSettings: () => Promise<void>;
}

// Initial default keys
const DEFAULT_UNSPLASH_KEY = 'oxyNFfGetgxiwbwKlfRJRPhaKTzLASG5tTdB2L475s4';
const DEFAULT_NOUN_KEY = '3baa265e8e794be59b6711a7756422a7';
const DEFAULT_NOUN_SECRET = 'b604c39eac734cb99ed1bef81be2c496';

export const useSettingsStore = create<SettingsState>((set, get) => ({
    unsplashAccessKey: DEFAULT_UNSPLASH_KEY,
    replicateApiToken: '',
    nounProjectKey: DEFAULT_NOUN_KEY,
    nounProjectSecret: DEFAULT_NOUN_SECRET,

    setUnsplashAccessKey: (key) => set({ unsplashAccessKey: key }),
    setReplicateApiToken: (token) => set({ replicateApiToken: token }),
    setNounProjectKey: (key) => set({ nounProjectKey: key }),
    setNounProjectSecret: (secret) => set({ nounProjectSecret: secret }),

    loadSettings: async () => {
        if (window.electronAPI) {
            try {
                const config = await window.electronAPI.readConfig();
                if (config) {
                    set({
                        unsplashAccessKey: config.unsplashAccessKey || DEFAULT_UNSPLASH_KEY,
                        replicateApiToken: config.replicateApiToken || '',
                        nounProjectKey: config.nounProjectKey || DEFAULT_NOUN_KEY,
                        nounProjectSecret: config.nounProjectSecret || DEFAULT_NOUN_SECRET,
                    });
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        } else {
            // Fallback to localStorage
            set({
                unsplashAccessKey: localStorage.getItem('unsplash_access_key') || DEFAULT_UNSPLASH_KEY,
                replicateApiToken: localStorage.getItem('replicate_api_token') || '',
                nounProjectKey: localStorage.getItem('noun_project_key') || DEFAULT_NOUN_KEY,
                nounProjectSecret: localStorage.getItem('noun_project_secret') || DEFAULT_NOUN_SECRET,
            });
        }
    },

    saveSettings: async () => {
        const { unsplashAccessKey, replicateApiToken, nounProjectKey, nounProjectSecret } = get();
        if (window.electronAPI) {
            try {
                await window.electronAPI.saveConfig({
                    unsplashAccessKey,
                    replicateApiToken,
                    nounProjectKey,
                    nounProjectSecret
                });
            } catch (error) {
                console.error('Failed to save settings:', error);
            }
        } else {
            localStorage.setItem('unsplash_access_key', unsplashAccessKey);
            localStorage.setItem('replicate_api_token', replicateApiToken);
            localStorage.setItem('noun_project_key', nounProjectKey);
            localStorage.setItem('noun_project_secret', nounProjectSecret);
        }
    }
}));
