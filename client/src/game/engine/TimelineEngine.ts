import { TimelineEvent } from '../state/types';

export class TimelineEngine {
  /**
   * Sorts timeline events in chronological order
   */
  public static sortEvents(events: TimelineEvent[]): TimelineEvent[] {
    return [...events].sort((a, b) => a.timestampMinutes - b.timestampMinutes);
  }

  /**
   * Evaluates the visibility and status of timeline events given discovered evidence and contradictions
   */
  public static evaluateTimelineState(
    allEvents: TimelineEvent[],
    discoveredEvidenceIds: string[],
    revealedContradictionIds: string[]
  ): TimelineEvent[] {
    return allEvents.map(event => {
      // If event requires evidence that hasn't been found yet
      if (event.status === 'hidden' && event.evidenceId && !discoveredEvidenceIds.includes(event.evidenceId)) {
        return {
          ...event,
          status: 'hidden',
          title: 'Unidentified Movement / Event',
          trueDescription: 'This critical interval remains unaccounted for in your investigation. Search crime scenes for forensic proof.'
        };
      }

      // If event is contradicted by evidence
      const isContradicted = event.status === 'contradicted' && event.evidenceId && discoveredEvidenceIds.includes(event.evidenceId);

      return {
        ...event,
        status: isContradicted ? 'contradicted' : (event.status === 'hidden' ? 'confirmed' : event.status)
      };
    });
  }

  /**
   * Computes timeline reconstruction progress percentage
   */
  public static computeCompleteness(
    allEvents: TimelineEvent[],
    discoveredEvidenceIds: string[]
  ): number {
    if (allEvents.length === 0) return 0;
    const known = allEvents.filter(e => {
      if (e.status === 'confirmed') return true;
      if (e.evidenceId && discoveredEvidenceIds.includes(e.evidenceId)) return true;
      return false;
    });
    return Math.round((known.length / allEvents.length) * 100);
  }
}
