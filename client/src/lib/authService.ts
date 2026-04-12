const API_BASE_URL = 'http://localhost:8080';

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token?: string;
  message?: string;
  error?: string;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = (await response.json().catch(() => null)) as LoginResponse | T | null;

    if (!response.ok) {
      const errorData = data as LoginResponse | null;
      throw new Error(errorData?.message || errorData?.error || 'Login failed');
    }

    return data as T;
  }

  const text = await response.text().catch(() => '');

  if (!response.ok) {
    throw new Error(text || 'Login failed');
  }

  return text as T;
};

export async function loginRequest(payload: LoginPayload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseResponse<LoginResponse>(response);
}

export function getGoogleAuthUrl() {
  return `${API_BASE_URL}/oauth2/authorization/google`;
}

export { API_BASE_URL };
