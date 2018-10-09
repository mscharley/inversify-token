import { inject, interfaces } from "inversify";

/**
 * Foo.
 */
export class Token<T> {
  /**
   * This property will always be null - the value is not important, it is a dummy value for compiler use.
   *
   * @internal
   */
  public _witness!: T;

  constructor(
    public readonly identifier: string | symbol,
  ) {}
}

/**
 * Foo.
 */
export type TokenType<T extends Token<any>> = T["_witness"];

/**
 * Foo.
 */
export const getToken = <T extends Token<any>>(container: interfaces.Container, token: T): TokenType<T> =>
  container.get<T["_witness"]>(token.identifier);

/**
 * Foo.
 */
export const injectToken =
  <T extends Token<any>>(token: T): ((target: any, targetKey: string, index?: number | undefined) => void) =>
    inject(token.identifier);

/**
 * Foo.
 */
export const tokenBinder =
  (bind: interfaces.Bind) =>
  <T extends Token<any>>(token: T): interfaces.BindingToSyntax<T["_witness"]> =>
    bind<T["_witness"]>(token.identifier);
