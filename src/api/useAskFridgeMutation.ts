import { useMutation } from '@tanstack/react-query';

import { postJson } from './client';
import type { ApiError, AskFridgeRequest, AskFridgeResponse } from '../types/api';

async function requestAskFridgeSuggestions(payload: AskFridgeRequest) {
  return postJson<AskFridgeResponse, AskFridgeRequest>('/ask-fridge', payload);
}

export function useAskFridgeMutation() {
  return useMutation<AskFridgeResponse, ApiError, AskFridgeRequest>({
    mutationFn: requestAskFridgeSuggestions,
  });
}