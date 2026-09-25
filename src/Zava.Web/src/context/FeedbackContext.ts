import { createContext, useContext } from 'react';

export type FeedbackSeverity = 'success' | 'error' | 'info' | 'warning';

export interface FeedbackMessage {
  message: string;
  severity: FeedbackSeverity;
  /** Optional in-app destination offered as an action (for example the cart). */
  actionLabel?: string;
  actionTo?: string;
}

export interface FeedbackContextValue {
  notify: (feedback: FeedbackMessage) => void;
}

export const FeedbackContext = createContext<FeedbackContextValue>({ notify: () => {} });

export const useFeedback = () => useContext(FeedbackContext);
