import { format, parseISO } from "date-fns"

export const formatDate = (value: string) =>
    value ? format(parseISO(value), "MMM d, yyyy") : ""
