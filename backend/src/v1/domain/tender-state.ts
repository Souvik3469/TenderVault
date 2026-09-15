import { TenderStatus, BidStatus } from '@prisma/client';
import { AppError } from '../../utils/errors';

/**
 * The tender and bid state machines, declared once.
 *
 * Previously each transition guard lived inside the service function that
 * performed it, so the machine only existed as the union of scattered `if`
 * statements — correct, but impossible to read in one place and easy to miss
 * when adding a state.
 */

export const TENDER_TRANSITIONS: Record<TenderStatus, readonly TenderStatus[]> = {
  [TenderStatus.draft]: [TenderStatus.open, TenderStatus.cancelled],
  [TenderStatus.open]: [TenderStatus.closed, TenderStatus.awarded, TenderStatus.cancelled],
  [TenderStatus.closed]: [TenderStatus.awarded, TenderStatus.cancelled],
  [TenderStatus.awarded]: [], // terminal
  [TenderStatus.cancelled]: [], // terminal
} as const;

export const BID_TRANSITIONS: Record<BidStatus, readonly BidStatus[]> = {
  [BidStatus.pending]: [BidStatus.accepted, BidStatus.rejected, BidStatus.withdrawn],
  [BidStatus.accepted]: [], // terminal
  [BidStatus.rejected]: [], // terminal
  [BidStatus.withdrawn]: [], // terminal
} as const;

export const canTransitionTender = (from: TenderStatus | null | undefined, to: TenderStatus): boolean =>
  !!from && TENDER_TRANSITIONS[from].includes(to);

export const canTransitionBid = (from: BidStatus, to: BidStatus): boolean =>
  BID_TRANSITIONS[from].includes(to);

/** Throws a 400 with a readable message if the tender transition is not legal. */
export const assertTenderTransition = (
  from: TenderStatus | null | undefined,
  to: TenderStatus,
): void => {
  if (canTransitionTender(from, to)) return;
  const allowed = from ? TENDER_TRANSITIONS[from] : [];
  throw new AppError(
    allowed.length
      ? `A tender in "${from}" cannot become "${to}". Allowed: ${allowed.join(', ')}.`
      : `A tender in "${from ?? 'unknown'}" is in a terminal state and cannot change.`,
    400,
  );
};

/** Throws a 400 with a readable message if the bid transition is not legal. */
export const assertBidTransition = (from: BidStatus, to: BidStatus): void => {
  if (canTransitionBid(from, to)) return;
  const allowed = BID_TRANSITIONS[from];
  throw new AppError(
    allowed.length
      ? `A bid that is "${from}" cannot become "${to}". Allowed: ${allowed.join(', ')}.`
      : `A bid that is "${from}" is in a terminal state and cannot change.`,
    400,
  );
};

/**
 * Narrows a free-text status (query param) to the enum.
 *
 * Returns `undefined` for an absent value and `null` for a value that isn't a
 * legal status. Callers treat `null` as "filter matches nothing", which
 * reproduces the pre-enum behaviour: previously an unknown status string was
 * passed straight to the database and simply matched no rows.
 */
export const parseTenderStatus = (
  value: string | undefined,
): TenderStatus | undefined | null => {
  if (value === undefined || value === '') return undefined;
  return (Object.values(TenderStatus) as string[]).includes(value)
    ? (value as TenderStatus)
    : null;
};
