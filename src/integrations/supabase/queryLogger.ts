
/**
 * Query performance logging utility for development mode
 */

interface QueryLog {
  queryName: string;
  duration: number;
  timestamp: Date;
}

class QueryPerformanceLogger {
  private logs: QueryLog[] = [];
  
  /**
   * Start timing a query
   */
  startQuery(queryName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.logQuery(queryName, duration);
    };
  }
  
  /**
   * Log query performance
   */
  private logQuery(queryName: string, duration: number): void {
    const isDevelopment = import.meta.env.MODE === 'development';
    
    if (isDevelopment) {
      const log: QueryLog = {
        queryName,
        duration,
        timestamp: new Date()
      };
      
      this.logs.push(log);
      
      // Console log with formatting
      const durationColor = duration > 1000 ? 'color: red' : duration > 500 ? 'color: orange' : 'color: green';
      
      console.group(`📊 Query Performance: ${queryName}`);
      console.log(`%c⏱️ Duration: ${duration.toFixed(2)}ms`, durationColor);
      console.log(`📅 Timestamp: ${log.timestamp.toISOString()}`);
      console.groupEnd();
      
      // Warn about slow queries
      if (duration > 1000) {
        console.warn(`🐌 Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`);
      }
    }
  }
  
  /**
   * Get performance statistics
   */
  getStats(): { totalQueries: number; averageDuration: number; slowestQuery: QueryLog | null } {
    if (this.logs.length === 0) {
      return { totalQueries: 0, averageDuration: 0, slowestQuery: null };
    }
    
    const totalDuration = this.logs.reduce((sum, log) => sum + log.duration, 0);
    const averageDuration = totalDuration / this.logs.length;
    const slowestQuery = this.logs.reduce((slowest, current) => 
      current.duration > slowest.duration ? current : slowest
    );
    
    return {
      totalQueries: this.logs.length,
      averageDuration,
      slowestQuery
    };
  }
  
  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }
}

// Export singleton instance
export const queryLogger = new QueryPerformanceLogger();

/**
 * Utility function to wrap async functions with performance logging
 */
export const withQueryLogging = <T extends any[], R>(
  queryName: string,
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    const endTimer = queryLogger.startQuery(queryName);
    
    try {
      const result = await fn(...args);
      endTimer();
      return result;
    } catch (error) {
      endTimer();
      throw error;
    }
  };
};
