type AppEnv = 'development' | 'staging' | 'production';

interface EnvConfig {
  apiBaseUrl: string;
  appEnv: AppEnv;
}

function getRequiredEnvVar(key: string): string {
  const value = import.meta.env[key];
  if (!value || typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `[env] Required environment variable "${key}" is missing or empty.\n` +
        `Ensure it is defined in the appropriate .env file.`,
    );
  }
  return value;
}

function resolveAppEnv(raw: string): AppEnv {
  if (raw === 'development' || raw === 'staging' || raw === 'production') {
    return raw;
  }
  throw new Error(
    `[env] VITE_APP_ENV has an invalid value: "${raw}". ` +
      `Expected one of: development, staging, production.`,
  );
}

const apiBaseUrl = getRequiredEnvVar('VITE_API_BASE_URL');
const appEnvRaw = getRequiredEnvVar('VITE_APP_ENV');
const appEnv = resolveAppEnv(appEnvRaw);

export const env: Readonly<EnvConfig> = Object.freeze({
  apiBaseUrl,
  appEnv,
});
