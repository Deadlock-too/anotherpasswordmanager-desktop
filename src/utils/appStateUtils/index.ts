import { AppStateValues } from '../../types'

export class AppState<T extends AppStateValues> {
  constructor(private value: T) {
  }

  public get() {
    return this.value
  }

  public set(value: T) {
    this.value = value
    return this
  }

  public has(key: T) {
    return !!(this.value & key)
  }

  public add(key: T) {
    (this.value as number) |= key
    return this
  }

  public remove(key: T) {
    (this.value as number) &= ~key
    return this
  }

  public toggle(key: T) {
    this.has(key) ? this.remove(key) : this.add(key)
    return this
  }
}