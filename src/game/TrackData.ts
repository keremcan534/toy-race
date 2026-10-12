import { distToSegmentWithPoint } from './PhysicsUtils';

export const TRACK_WIDTH = 120;
export const TRACK_BORDER = 10;

// Generate smooth circular path for Drift Arena (Radius = 600, Center = 600, 600)
const DRIFT_ARENA_POINTS: { x: number, y: number }[] = [];
for (let i = 0; i < 36; i++) {
  const a = (i / 36) * Math.PI * 2;
  DRIFT_ARENA_POINTS.push({
    x: 600 + Math.cos(a) * 600,
    y: 600 + Math.sin(a) * 600
  });
}

export const TRACK_WIDTHS: Record<string, number> = {
  'track-1': 120,
  'track-drag': 220, // Drag Pisti: Very wide, high-speed dragway
  'track-drift-arena': 480, // Drift Arena: Huge open circular asphalt plaza
  'track-night': 260, // Gece Şehir Pisti: Çok geniş yollar (260px)
  'track-redoun': 190, // Redoun Toprak Pisti: 190px genişlikte ralli yolu
  'track-2': 220,
  'track-3': 220,
};

export function getTrackWidth(trackId?: string): number {
  if (!trackId) return TRACK_WIDTH;
  return TRACK_WIDTHS[trackId] || TRACK_WIDTH;
}

export const TRACKS: Record<string, { x: number, y: number }[]> = {
  'track-1': [ // Oval Circuit
    { x: 0, y: -100 },    // Start/Finish node on the left straight
    { x: 0, y: -400 },    // Top-left entry into the turn
    { x: 200, y: -800 },
    { x: 600, y: -1000 },
    { x: 1000, y: -800 },
    { x: 1200, y: -400 },
    { x: 1000, y: 0 },
    { x: 600, y: 200 },
    { x: 200, y: 0 },
    { x: 0, y: 0 },       // Bottom-left exit from turn onto the straight
  ],
  'track-drag': [ // Drag Pisti - Ultra-wide 220px drag strip with high-speed turnaround loops
    // --- 1. Main Drag Strip (High-Speed Straight Blast) ---
    { x: 400, y: 0 },     // Start / Staging Line
    { x: 1200, y: 0 },
    { x: 2000, y: 0 },
    { x: 2800, y: 0 },
    { x: 3600, y: 0 },
    { x: 4400, y: 0 },
    { x: 5200, y: 0 },    // 4.8 km straight drag trap speed zone

    // --- 2. Far-East High-Speed Sweeping Banking Turn ---
    { x: 5700, y: 150 },
    { x: 6100, y: 450 },
    { x: 6300, y: 900 },  // Eastern apex
    { x: 6100, y: 1350 },
    { x: 5700, y: 1650 },
    { x: 5200, y: 1800 },

    // --- 3. Return Straight (Wide High-Speed Return Run) ---
    { x: 4400, y: 1800 },
    { x: 3600, y: 1800 },
    { x: 2800, y: 1800 },
    { x: 2000, y: 1800 },
    { x: 1200, y: 1800 },
    { x: 400, y: 1800 },

    // --- 4. West Sweeping Turnaround back to Staging Area ---
    { x: -100, y: 1650 },
    { x: -500, y: 1350 },
    { x: -700, y: 900 },  // Western apex
    { x: -500, y: 450 },
    { x: -100, y: 150 },
    { x: 100, y: 0 },     // Pre-grid straight staging into { x: 400, y: 0 }
  ],
  'track-drift-arena': DRIFT_ARENA_POINTS,
  'track-night': [ // Gece Şehir Pisti (Midnight Grand Prix) - 260px wide, flowing grand prix circuit
    // 1. Main Pit / Start Straight
    { x: 0, y: 0 },
    { x: 500, y: 0 },

    // 2. Turn 1 & 2: Quick Right-Left Chicane
    { x: 850, y: -70 },
    { x: 1100, y: -220 },
    { x: 1250, y: -450 },

    // 3. Turn 3 & 4: Technical Winding Esses
    { x: 1150, y: -700 },
    { x: 1300, y: -950 },
    { x: 1550, y: -1100 },

    // 4. Turn 5: Eastern High-Speed Sweeper
    { x: 1850, y: -1250 },
    { x: 2050, y: -1500 },
    { x: 2000, y: -1800 },

    // 5. Turn 6: Technical Hairpin
    { x: 1750, y: -2000 },
    { x: 1450, y: -2050 },
    { x: 1200, y: -1900 },

    // 6. Turn 7 & 8: North High-Speed Sweeping Straight
    { x: 950, y: -1700 },
    { x: 500, y: -1720 },
    { x: 100, y: -1700 },
    { x: -250, y: -1650 },

    // 7. Turn 9 & 10: Descending Technical Flow (West)
    { x: -550, y: -1500 },
    { x: -750, y: -1250 },
    { x: -850, y: -950 },
    { x: -850, y: -650 },

    // 8. Turn 11 & 12: Sweeping Southern Carousel into Main Straight
    { x: -850, y: -350 },
    { x: -750, y: -100 },
    { x: -500, y: 50 },
    { x: -250, y: 30 },
    { x: -100, y: 0 },
  ],
  'track-redoun': [ // Redoun - Toprak Ralli Pisti (Compact Dirt Rally Circuit, 190px wide)
    // 1. Start / Finish Line & Main Pit Straight
    { x: 0, y: 0 },
    { x: 500, y: 0 },

    // 2. Turn 1 & 2: Fast Sweeping Right Berm Turn
    { x: 950, y: -120 },
    { x: 1300, y: -400 },
    { x: 1400, y: -800 },

    // 3. Turn 3: North Canyon Ridge Crest (Left Hand Sweeper)
    { x: 1200, y: -1250 },
    { x: 800, y: -1450 },

    // 4. Turn 4 & 5: Dynamic Dirt S-Chicane (Loose Gravel Switchback)
    { x: 400, y: -1300 },
    { x: 100, y: -1500 },
    { x: -300, y: -1350 },

    // 5. Turn 6 & 7: West Mud Horseshoe Hairpin
    { x: -700, y: -1050 },
    { x: -850, y: -650 },
    { x: -700, y: -250 },

    // 6. Turn 8: Sweeping Left Turn Launching onto Main Straight
    { x: -350, y: 0 },
  ],
};

// Legacy aliases
TRACKS['track-2'] = TRACKS['track-drag'];
TRACKS['track-3'] = TRACKS['track-drag'];

export interface TransformationZone {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export function createAlignedTransformationZones(
  trackPath: { x: number, y: number }[],
  zonePoints: { x: number, y: number }[],
  roadWidth: number = TRACK_WIDTH
): TransformationZone[] {
  return zonePoints.map(pt => {
    let minDistance = Infinity;
    let bestP1 = trackPath[0];
    let bestP2 = trackPath[1];
    let closestPt = pt;

    for (let i = 0; i < trackPath.length; i++) {
      const p1 = trackPath[i];
      const p2 = trackPath[(i + 1) % trackPath.length];
      const { d, pt: projPt } = distToSegmentWithPoint(pt, p1, p2);
      if (d < minDistance) {
        minDistance = d;
        bestP1 = p1;
        bestP2 = p2;
        closestPt = projPt;
      }
    }

    // Segment slope / angle
    const dx = bestP2.x - bestP1.x;
    const dy = bestP2.y - bestP1.y;
    const segmentAngle = Math.atan2(dy, dx);

    // Perpendicular rotation so the zone completely blocks the road from side to side
    const rotation = segmentAngle + Math.PI / 2;

    return {
      x: closestPt.x,
      y: closestPt.y,
      // Fully span road + borders + margin into grass on both sides so no escape is possible
      width: roadWidth + 80, 
      height: 50,
      rotation
    };
  });
}

const OVAL_ZONE_CENTERS = [
  { x: 0, y: -250 },      // Left straight
  { x: 800, y: -900 },    // Top straight
  { x: 1100, y: -200 },   // Right straight
  { x: 100, y: 0 }        // Bottom straight
];

const DRAG_ZONE_CENTERS = [
  { x: 2400, y: 0 },       // Mid main drag strip
  { x: 4800, y: 0 },       // End of main drag strip
  { x: 3600, y: 1800 },    // Return straight
  { x: 1200, y: 1800 },    // Return straight
];

const NIGHT_ZONE_CENTERS = [
  { x: 250, y: 0 },         // Start straight
  { x: 1300, y: -950 },     // Mid technical esses
  { x: 1450, y: -2050 },    // North hairpin
  { x: 300, y: -1710 },     // North sweeping section
  { x: -850, y: -800 },     // West descent
];

const REDOUN_ZONE_CENTERS = [
  { x: 250, y: 0 },         // Start straight
  { x: 1350, y: -600 },     // East canyon turn
  { x: 1000, y: -1350 },    // North ridge
  { x: 250, y: -1400 },     // Technical dirt chicane
  { x: -750, y: -650 },     // West mud hairpin
];

export const TRANSFORMATION_ZONES: Record<string, TransformationZone[]> = {
  'track-1': createAlignedTransformationZones(TRACKS['track-1'], OVAL_ZONE_CENTERS, TRACK_WIDTHS['track-1']),
  'track-drag': createAlignedTransformationZones(TRACKS['track-drag'], DRAG_ZONE_CENTERS, TRACK_WIDTHS['track-drag']),
  'track-night': createAlignedTransformationZones(TRACKS['track-night'], NIGHT_ZONE_CENTERS, TRACK_WIDTHS['track-night']),
  'track-redoun': createAlignedTransformationZones(TRACKS['track-redoun'], REDOUN_ZONE_CENTERS, TRACK_WIDTHS['track-redoun']),
  'track-2': createAlignedTransformationZones(TRACKS['track-drag'], DRAG_ZONE_CENTERS, TRACK_WIDTHS['track-drag']),
  'track-3': createAlignedTransformationZones(TRACKS['track-drag'], DRAG_ZONE_CENTERS, TRACK_WIDTHS['track-drag']),
};
