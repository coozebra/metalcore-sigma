import { format } from 'date-fns';

export const isExpired = (date: string) => new Date().getTime() > new Date(date).getTime();

export const readableDate = (date: string) => format(new Date(date), 'PP');

export const readableTimeOfDay = (date: string) => format(new Date(date), 'p');

export const generateTimestamp = () => new Date().getTime();

export const timestampInSeconds = () => Math.floor(generateTimestamp() / 1000);
