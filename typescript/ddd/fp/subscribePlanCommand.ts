import {
  createSubscription,
  dateFromString,
  GetPlanById,
  SaveSubscription,
} from "./data";

type SubscribePlanDto = {
  planId: number;
  userId: number;
  startSubscriptionDateTime: string;
};

function subscribePlan(
  dto: SubscribePlanDto,
  getPlanById: GetPlanById,
  saveSubscription: SaveSubscription
): void {
  const plan = getPlanById(dto.planId);
  if (!plan) {
    throw new Error("plan not found");
  }

  saveSubscription(
    createSubscription(
      dto.userId,
      plan.id,
      dateFromString(dto.startSubscriptionDateTime)
    )
  );
}
