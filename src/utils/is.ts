import { PrimaryGeneratedColumn } from 'typeorm';

export const isStringVersionType = (value: any): value is Parameters<typeof PrimaryGeneratedColumn>[0] => typeof value === 'string';
export const isFunction = (value: any): value is Function => typeof value === 'function';