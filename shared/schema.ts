import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Environmental Data Types (no database persistence needed for monitoring dashboard)

export const satelliteImagerySchema = z.object({
  id: z.string(),
  collection: z.string(),
  datetime: z.string(),
  bbox: z.array(z.number()).length(4),
  assets: z.record(z.object({
    href: z.string(),
    type: z.string().optional(),
    title: z.string().optional(),
  })),
  properties: z.record(z.any()),
});

export type SatelliteImagery = z.infer<typeof satelliteImagerySchema>;

export const satelliteSearchSchema = z.object({
  collection: z.enum(['sentinel-2-l2a', 'sentinel-1-grd', 'landsat-c2-l2']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cloudCover: z.number().min(0).max(100).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type SatelliteSearch = z.infer<typeof satelliteSearchSchema>;

export const environmentalMetricSchema = z.object({
  id: z.string(),
  type: z.enum(["water_level", "temperature", "rainfall", "wind_speed"]),
  value: z.number(),
  unit: z.string(),
  location: z.string(),
  district: z.string(),
  division: z.string(),
  timestamp: z.string(),
  severity: z.enum(["safe", "caution", "critical"]).optional(),
  trend: z.object({
    value: z.number(),
    direction: z.enum(["up", "down"]),
  }).optional(),
});

export type EnvironmentalMetric = z.infer<typeof environmentalMetricSchema>;

export const alertSchema = z.object({
  id: z.string(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  type: z.string(),
  location: z.string(),
  district: z.string(),
  division: z.string(),
  description: z.string(),
  timestamp: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lon: z.number(),
  }).optional(),
});

export type Alert = z.infer<typeof alertSchema>;

export const regionDataSchema = z.object({
  name: z.string(),
  division: z.string(),
  population: z.string(),
  elevation: z.string(),
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
  waterLevel: z.string(),
  rainfall: z.string(),
  alerts: z.number(),
  coordinates: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
});

export type RegionData = z.infer<typeof regionDataSchema>;

export const climateDataPointSchema = z.object({
  month: z.string(),
  temperature: z.number(),
  rainfall: z.number(),
  humidity: z.number().optional(),
});

export type ClimateDataPoint = z.infer<typeof climateDataPointSchema>;
