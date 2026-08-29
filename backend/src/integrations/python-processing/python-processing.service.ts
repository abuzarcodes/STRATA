import { AxiosError } from 'axios';
import { pythonHttpClient } from './python-processing.client';
import {
  PythonServiceHealth,
  ProcessingRequest,
  ProcessingResponse,
  ExtrusionParameters,
  ExtrusionResult,
} from './python-processing.types';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';

export class PythonProcessingService {
  /**
   * Perform health check against the Python/FastAPI geometry server.
   */
  async checkHealth(): Promise<PythonServiceHealth> {
    try {
      const response = await pythonHttpClient.get<PythonServiceHealth>('/health');
      return response.data;
    } catch (error) {
      this.handleHttpError(error, 'Failed to connect to Python processing service');
    }
  }

  /**
   * Dispatch a generic processing job to Python.
   */
  async submitJob<TReq, TRes>(
    endpoint: string,
    payload: ProcessingRequest<TReq>,
  ): Promise<ProcessingResponse<TRes>> {
    try {
      const response = await pythonHttpClient.post<ProcessingResponse<TRes>>(endpoint, payload);
      return response.data;
    } catch (error) {
      this.handleHttpError(error, `Failed to execute Python task [${payload.taskType}]`);
    }
  }

  /**
   * Request 2D-to-3D volumetric mesh extrusion and watertight certification.
   */
  async request3dExtrusion(
    jobId: string,
    params: ExtrusionParameters,
  ): Promise<ProcessingResponse<ExtrusionResult>> {
    const payload: ProcessingRequest<ExtrusionParameters> = {
      jobId,
      taskType: 'ai_extrusion',
      parameters: params,
    };

    return this.submitJob<ExtrusionParameters, ExtrusionResult>('/process/extrude', payload);
  }

  /**
   * Standardized error translation from Axios to AppError.
   */
  private handleHttpError(error: unknown, fallbackMessage: string): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status ?? 502;
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        fallbackMessage;

      throw new AppError(status, ErrorCodes.EXTERNAL_SERVICE_ERROR, message);
    }

    throw new AppError(500, ErrorCodes.INTERNAL_ERROR, fallbackMessage);
  }
}

export const pythonProcessingService = new PythonProcessingService();
