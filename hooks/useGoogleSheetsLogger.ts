'use client';

import { useState, useCallback } from 'react';
import { logLoginEvent, LoginLogData } from '@/lib/google-sheets';

interface LoggerState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export function useGoogleSheetsLogger() {
  const [state, setState] = useState<LoggerState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const log = useCallback(async (data: LoginLogData): Promise<boolean> => {
    setState({ isLoading: true, error: null, success: false });

    const result = await logLoginEvent(data);

    if (result.success) {
      setState({ isLoading: false, error: null, success: true });
      return true;
    } else {
      setState({ isLoading: false, error: result.error || 'Logging failed', success: false });
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, success: false });
  }, []);

  return { ...state, log, reset };
}
