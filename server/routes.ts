import type { Express } from "express";
import { createServer, type Server } from "http";
import { 
  searchSatelliteImagery, 
  getLatestSentinel2, 
  getLatestSentinel1SAR 
} from "./services/planetaryComputer";
import {
  getCurrentMetrics,
  getActiveAlerts,
  getRegionData,
  getClimateData,
  getDistrictData,
} from "./services/environmentalData";
import { satelliteSearchSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Satellite Imagery Routes
  app.get("/api/satellite/sentinel2/latest", async (req, res) => {
    try {
      const imagery = await getLatestSentinel2();
      res.json(imagery);
    } catch (error) {
      console.error('Error fetching Sentinel-2 imagery:', error);
      res.status(500).json({ 
        error: 'Failed to fetch satellite imagery',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/satellite/sentinel1/latest", async (req, res) => {
    try {
      const imagery = await getLatestSentinel1SAR();
      res.json(imagery);
    } catch (error) {
      console.error('Error fetching Sentinel-1 SAR imagery:', error);
      res.status(500).json({ 
        error: 'Failed to fetch SAR imagery',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/satellite/search", async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validationResult = satelliteSearchSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: 'Invalid request parameters',
          details: validationError.message
        });
      }

      const params = validationResult.data;
      const imagery = await searchSatelliteImagery(params);
      res.json(imagery);
    } catch (error) {
      console.error('Error searching satellite imagery:', error);
      res.status(500).json({ 
        error: 'Failed to search satellite imagery',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Environmental Data Routes
  app.get("/api/metrics/current", (req, res) => {
    try {
      const metrics = getCurrentMetrics();
      res.json(metrics);
    } catch (error) {
      console.error('Error fetching current metrics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch metrics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/alerts", (req, res) => {
    try {
      const alerts = getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      res.status(500).json({ 
        error: 'Failed to fetch alerts',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/region/:district", (req, res) => {
    try {
      const { district } = req.params;
      const regionData = getRegionData(district);
      
      if (!regionData) {
        return res.status(404).json({ 
          error: 'Region not found',
          message: `No data available for district: ${district}`
        });
      }
      
      res.json(regionData);
    } catch (error) {
      console.error('Error fetching region data:', error);
      res.status(500).json({ 
        error: 'Failed to fetch region data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/climate/data", (req, res) => {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : 2024;
      
      if (isNaN(year) || year < 1950 || year > 2100) {
        return res.status(400).json({
          error: 'Invalid year parameter',
          message: 'Year must be between 1950 and 2100'
        });
      }

      const climateData = getClimateData(year);
      res.json(climateData);
    } catch (error) {
      console.error('Error fetching climate data:', error);
      res.status(500).json({ 
        error: 'Failed to fetch climate data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/districts/data", (req, res) => {
    try {
      const districtData = getDistrictData();
      res.json(districtData);
    } catch (error) {
      console.error('Error fetching district data:', error);
      res.status(500).json({ 
        error: 'Failed to fetch district data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
