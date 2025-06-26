type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  userId?: string | number
}

class Logger {
  private logs: LogEntry[] = []

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userId: this.getCurrentUserId(),
    }

    this.logs.push(entry)

    // Console output for development
    if (process.env.NODE_ENV === "development") {
      console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](
        `[${entry.timestamp}] ${level.toUpperCase()}: ${message}`,
        data || "",
      )
    }

    // Keep only last 1000 logs to prevent memory issues
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000)
    }
  }

  private getCurrentUserId(): string | number | undefined {
    // Try to get user ID from token or local storage
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        return payload.userId || payload.id
      } catch {
        return undefined
      }
    }
    return undefined
  }

  info(message: string, data?: any) {
    this.log("info", message, data)
  }

  warn(message: string, data?: any) {
    this.log("warn", message, data)
  }

  error(message: string, data?: any) {
    this.log("error", message, data)
  }

  debug(message: string, data?: any) {
    this.log("debug", message, data)
  }

  // API interaction logging
  apiCall(method: string, endpoint: string, data?: any) {
    this.info(`API ${method.toUpperCase()} ${endpoint}`, data)
  }

  apiSuccess(method: string, endpoint: string, responseTime?: number) {
    this.info(`API ${method.toUpperCase()} ${endpoint} - Success`, { responseTime })
  }

  apiError(method: string, endpoint: string, error: any, responseTime?: number) {
    this.error(`API ${method.toUpperCase()} ${endpoint} - Error`, { error, responseTime })
  }

  // Get logs for debugging
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  // Clear logs
  clearLogs() {
    this.logs = []
  }
}

export const logger = new Logger()
