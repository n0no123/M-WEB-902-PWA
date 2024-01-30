import * as z from 'zod'

const coerceArrayOfString = z.string()
    .refine(
        (val) => {
            try {
                JSON.parse(val);
                return true;
            } catch (e) {
                return false;
            }
        }, {
            message: 'Must be a valid JSON'
        })
    .transform((val) => JSON.parse(val) as unknown)
    .refine(
        (parsed) => {
            try {
                return Array.isArray(parsed);
            } catch (e) {
                return false;
            }
        }, {
            message: 'Must be an array'
        })
    .transform((val) => val as unknown[])
    .refine(
        (val) => {
            return val.every((item) => typeof item === 'string');
        }, {
            message: 'Must be an array of strings'
        }
    )
    .transform((val) => val as string[])

export default coerceArrayOfString;
