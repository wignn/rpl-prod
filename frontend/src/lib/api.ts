"use server";

interface ApiRequestProps {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: HeadersInit;
}

/*
this function is used(Blue Print) to make api requests to the backend
*/
/**
 * Makes an API request to the specified endpoint.
 * 
 * @template T - The expected return type of the API request.
 * @param {object} ApiRequestProps - The options for the API request.
 * @param {string} ApiRequestProps.endpoint - The API endpoint to request.
 * @param {string} ApiRequestProps.method - The HTTP method to use for the request.
 * @param {any} [ApiRequestProps.body] - The request body to send (will be JSON stringified).
 * @param {Record<string, string>} [ApiRequestProps.headers={}] - Additional headers to include in the request.
 * @returns {Promise<T>} A promise that resolves to the response body parsed as JSON.
 * @throws {Error} If the fetch operation fails.
 * @example
 * const data = await apiRequest<UserData>({
 *   endpoint: '/users/123',
 *   method: 'GET'
 * });
 */
export async function apiRequest<T>({
  endpoint,
  method,
  body,
  headers = {},
}: ApiRequestProps): Promise<T> {
  const baseUrl =
    `${process.env.NEXT_PUBLIC_API_URL}/api` || "http://localhost:4000/api";

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY as string,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  };
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, config);
    const responseBody = await response.json().catch(() => null);
    if (!response.ok) {
      const errorMessage = responseBody?.message || response.statusText;
      console.log("errorMessage", errorMessage);
      return null as unknown as T;
    }

    return responseBody as T;
  } catch (error) {
    throw error;
  }
}

export async function fileRequest<T>({
  endpoint,
  method,
  body,
  headers = {},
}: ApiRequestProps): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const config: RequestInit = {
    method,
    headers: {
      "x-api-key": process.env.API_KEY as string,
      ...headers,
    },
    body: body instanceof FormData ? body : JSON.stringify(body),
  };

  try {
    const response = await fetch(`${baseUrl}/${endpoint}`, config);

    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = responseBody?.message || response.statusText;
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }

    return responseBody as T;
  } catch (error) {

    throw error;
  }
}
