import { prisma } from "../../prisma/client";

export async function reserveFacility(
  userId: number,
  facility: "POOL" | "STUDIO"
): Promise<void> {
  // ユーザー存在確認
  try {
    await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
  } catch {
    throw new Error("user not found");
  }

  // 開始前予約を取得
  const beforeUsedReserves = await prisma.reserve.findMany({
    where: {
      userId,
      facility,
      status: "BEFORE_USE",
    },
  });

  // 予約可能であるかを判定
  if (facility === "POOL") {
    // プールの場合、同時に予約できるのは3件まで
    if (beforeUsedReserves.length > 3) {
      throw new Error("Reservation limit has been reached");
    }
  } else if (facility === "STUDIO") {
    // スタジオの場合、同時に予約できるのは2件まで
    if (beforeUsedReserves.length > 2) {
      throw new Error("Reservation limit has been reached");
    }
  }

  // 予約を作成
  await prisma.reserve.create({
    data: {
      userId,
      facility,
      status: "BEFORE_USE",
    },
  });
}
