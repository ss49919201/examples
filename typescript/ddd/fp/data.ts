export type Plan = {
  id: number;
};

export type GetPlanById = {
  (id: number): Plan;
};

export function getPlanById(
  ...[id]: Parameters<GetPlanById>
): ReturnType<GetPlanById> {
  return {
    id,
  };
}

export type Subscription = {
  id: number;
  userId: number;
  planId: number;
  startDate: Date;
};

export function createSubscription(
  userId: number,
  planId: number,
  startDate: Date
): Subscription {
  return {
    id: 0,
    userId,
    planId,
    startDate,
  };
}

export type SaveSubscription = {
  (v: Subscription): void;
};

export function saveSubscription(
  ...[v]: Parameters<SaveSubscription>
): ReturnType<SaveSubscription> {
  return;
}

export function dateFromString(s: string): Date {
  return new Date(s);
}
