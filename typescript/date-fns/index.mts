import { TZDate } from "@date-fns/tz";
import { addHours } from "date-fns";

const date = new Date(2022, 2, 13);
console.log(addHours(date, 2).toISOString());

const tzDate = new TZDate(2022, 2, 13, "Asia/Tokyo");
console.log(addHours(tzDate, 2).withTimeZone("UTC").toISOString());
console.log(addHours(tzDate, 2).toISOString());
console.log(addHours(tzDate, 2).getDate());
