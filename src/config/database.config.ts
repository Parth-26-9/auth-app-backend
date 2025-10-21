export interface IDatabaseConfig {
  uri: string;
}

export const databaseConfig = (): IDatabaseConfig => ({
  uri: process.env.POSTGRES_URL,
});
