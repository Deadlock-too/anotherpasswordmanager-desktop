import { AppStateValues } from '../../types'

export class AppState<T extends AppStateValues> {
  constructor(private value: T) {
  }

  public get() {
    console.log('get', this.value)
    return this.value
  }

  public set(value: T) {
    this.value = value
    console.log('set', this.value)
    return this
  }

  public has(key: T) {
    console.log('has', this.value, key)
    return !!(this.value & key)
  }

  public add(key: T) {
    (this.value as number) |= key
    console.log('add', this.value, key)
    return this
  }

  public remove(key: T) {
    (this.value as number) &= ~key
    console.log('remove', this.value, key)
    return this
  }

  public toggle(key: T) {
    this.has(key) ? this.remove(key) : this.add(key)
    console.log('toggle', this.value, key)
    return this
  }
}