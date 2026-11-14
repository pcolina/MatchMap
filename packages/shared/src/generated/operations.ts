/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as Types from './schema';

export type RegisterMutationVariables = Exact<{
  input: Types.RegisterInput;
}>;


export type RegisterMutation = { register: { id: string, email: string, createdAt: string } };
