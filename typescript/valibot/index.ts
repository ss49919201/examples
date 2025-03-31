import * as v from "valibot";

const uuuidSchema = v.pipe(v.string(), v.uuid());
const emailSchema = v.pipe(v.string(), v.email());
