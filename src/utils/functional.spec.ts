import { withSuppress } from './functional'

describe('withSuppress', () => {
  it('should return the value from a synchronous function without errors', () => {
    const syncFn = () => 42
    const wrappedFn = withSuppress(syncFn)
    expect(wrappedFn()).toBe(42)
  })

  it('should return undefined and log error when synchronous function throws', () => {
    const errorMessage = 'Sync error occurred'
    const syncFn = () => {
      throw new Error('Test Error')
    }
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const wrappedFn = withSuppress(syncFn, errorMessage)
    expect(wrappedFn()).toBeUndefined()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(`${errorMessage}\nError: Test Error`),
    )

    consoleErrorSpy.mockRestore()
  })

  it('should return the resolved value from an asynchronous function without errors', async () => {
    const asyncFn = async () => await Promise.resolve(42)
    const wrappedFn = withSuppress(asyncFn)
    await expect(wrappedFn()).resolves.toBe(42)
  })

  it('should return undefined and log error when asynchronous function rejects', async () => {
    const errorMessage = 'Async error occurred'
    const asyncFn = async () => await Promise.reject(new Error('Test Error'))
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const wrappedFn = withSuppress(asyncFn, errorMessage)
    await expect(wrappedFn()).resolves.toBeUndefined()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(`${errorMessage}\nError: Test Error`),
    )

    consoleErrorSpy.mockRestore()
  })

  it('should return undefined if no error message is provided and the function throws', () => {
    const syncFn = () => {
      throw new Error('Test Error')
    }
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const wrappedFn = withSuppress(syncFn)
    expect(wrappedFn()).toBeUndefined()
    expect(consoleErrorSpy).not.toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })

  it('should return undefined if no error message is provided and the async function rejects', async () => {
    const asyncFn = async () => await Promise.reject(new Error('Test Error'))
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const wrappedFn = withSuppress(asyncFn)
    await expect(wrappedFn()).resolves.toBeUndefined()
    expect(consoleErrorSpy).not.toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })

  it('should handle functions that return promises without errors', async () => {
    const asyncFn = async () => await Promise.resolve('async result')
    const wrappedFn = withSuppress(asyncFn)
    await expect(wrappedFn()).resolves.toBe('async result')
  })

  it('should handle synchronous functions returning undefined without errors', () => {
    const syncFn = () => undefined
    const wrappedFn = withSuppress(syncFn)
    expect(wrappedFn()).toBeUndefined()
  })
})
