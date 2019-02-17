interface DatabaseConfig {
  engine: string;
  host: string;
  maxIdleTime: number;
  maxConnections: number;
  minConnections: number;
  name: string;
  password: string;
  port: number;
  user: string;
}

interface AppConfig {
  port: number;
}

interface Config {
  database: DatabaseConfig;
  app: AppConfig;
}

export const { AppConfig, Config, DatabaseConfig };
