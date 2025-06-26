export const API_BASE_URL = "http://localhost:3001"

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async handleResponse(response: Response) {
    if (response.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem("token")
      window.location.href = "/login"
      throw new Error("Unauthorized")
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "An error occurred" }))
      throw {
        response: {
          data: errorData,
          status: response.status,
        },
        message: errorData.message || `HTTP error! status: ${response.status}`,
      }
    }

    // Handle 204 No Content response
    if (response.status === 204) {
      return null
    }

    return response.json()
  }

  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async post(endpoint: string, data?: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    return this.handleResponse(response)
  }

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async patch(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }
}

export const apiClient = new ApiClient()
