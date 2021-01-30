import {Assign} from 'utility-types'

export type SetBodyToType<A extends object, B extends object> = Assign<
  A,
  Record<'body', B>
>

export type SetQueryStringType<A extends object, B extends object> = Assign<
  A,
  Record<'queryStringParameters', B>
>

export type SetPathParameterType<A extends object, B extends object> = Assign<
  A,
  Record<'pathParameters', B>
>
