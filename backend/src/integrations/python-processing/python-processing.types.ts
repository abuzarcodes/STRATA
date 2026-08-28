export interface PythonServiceHealth {
  status: string;
  version?: string;
  services?: Record<string, string>;
}

export interface ProcessingRequest<T = Record<string, unknown>> {
  jobId: string;
  taskType: 'ai_extrusion' | 'topology_check' | 'watertightness' | 'ulpin_generation' | string;
  parameters: T;
  callbackUrl?: string;
}

export interface ProcessingResponse<T = Record<string, unknown>> {
  jobId: string;
  status: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS';
  result?: T;
  metrics?: {
    processingTimeMs: number;
    memoryUsedMb?: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface ExtrusionParameters {
  footprint2d: {
    type: string;
    coordinates: number[][][] | number[][];
  };
  baseElevation: number;
  height: number;
  crs?: string;
}

export interface ExtrusionResult {
  mesh3d: {
    vertices: number[][];
    faces: number[][];
  };
  volume: number;
  surfaceArea: number;
  isWatertight: boolean;
  ulpin3dToken?: string;
}
