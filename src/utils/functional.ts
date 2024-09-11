import { isPromise } from '@tool-belt/type-predicates'

/**
 * Wraps a function with error suppression and optional logging.
 *
 * @param fn - The function to execute.
 * @param errorMessage - The error message to log if an exception is thrown.
 * @returns The wrapped function with error suppression.
 */
export function withSuppress<T extends (...args: any[]) => any>(
  fn: T,
  errorMessage?: string,
): (
  ...args: Parameters<T>
) => ReturnType<T> extends Promise<infer U>
  ? Promise<U | undefined>
  : ReturnType<T> | undefined {
  const log = errorMessage ? (msg: string) => console.error(msg) : null

  return (...args: Parameters<T>) => {
    try {
      const result = fn(...args)

      if (isPromise(result)) {
        return result.catch((error) => {
          log?.(`${errorMessage}\n${error?.stack ?? error}`)
          return undefined
        })
      }

      return result
    } catch (error) {
      log?.(
        `${errorMessage}\n${Reflect.get(error as Record<string, any>, 'stack') ?? error}`,
      )
      return undefined
    }
  }
}
