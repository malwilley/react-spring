import {
  Component,
  PureComponent,
  ReactNode,
  ComponentClass,
  ComponentType,
  Ref
} from 'react'

export type SpringEasingFunc = (t: number) => number

export interface SpringConfig {
  tension?: number
  friction?: number
  velocity?: number
  overshootClamping?: boolean
  restSpeedThreshold?: number
  restDisplacementThreshold?: number

  duration?: number
  easing?: SpringEasingFunc
}

type SpringRendererFunc<DS extends object = {}> = (params: DS) => ReactNode

interface SpringProps<DS extends object = {}> {
  /**
   * Spring config ({ tension, friction })
   * @default config.default
   */
  config?: SpringConfig | ((key: string) => SpringConfig)
  /**
   * Will skip rendering the component if true and write to the dom directly
   * @default false
   */
  native?: boolean
  /**
   * Base styles
   * @default {}
   */
  from?: Partial<DS>
  /**
   * Animates to...
   * @default {}
   */
  to: DS
  /**
   * Callback when the animation starts to animate
   */
  onStart?: () => void
  /**
   * Callback when the animation comes to a still-stand
   */
  onRest?: (ds: DS) => void
  /**
   * Frame by frame callback, first argument passed is the animated value
   */
  onFrame?: () => void
  /**
   * Takes a function that receives interpolated styles
   */
  children?: SpringRendererFunc<DS> | Array<SpringRendererFunc<DS>>
  /**
   * Same as children, but takes precedence if present
   */
  render?: SpringRendererFunc<DS>
  /**
   * Prevents animation if true, you can also pass individual keys
   * @default false
   */
  immediate?: boolean | string[] | ((key: string) => boolean)
  /**
   * When true it literally resets: from -> to
   * @default false
   */
  reset?: boolean
  /**
   * Animation implementation
   * @default SpringAnimation
   */
  impl?: any
  /**
   * Inject props
   * @default undefined
   */
  inject?: any
  /**
   * Animation start delay, optional
   */
  delay?: number
}

export const config: {
  /** default: { tension: 170, friction: 26 } */
  default: SpringConfig
  /** gentle: { tension: 120, friction: 14 } */
  gentle: SpringConfig
  /** wobbly: { tension: 180, friction: 12 } */
  wobbly: SpringConfig
  /** stiff: { tension: 210, friction: 20 } */
  stiff: SpringConfig
  /** slow: { tension: 280, friction: 60 } */
  slow: SpringConfig
  /** molasses: { tension: 280, friction: 120 } */
  molasses: SpringConfig
}

export class Spring<DS extends object> extends PureComponent<SpringProps<DS>> {}

export function interpolate(
  parent: number[],
  config: (...args: number[]) => any
): any

export const animated: {
  <P>(comp: ComponentType<P>): ComponentType<P>
} & {
  [Tag in keyof JSX.IntrinsicElements]: ComponentClass<
    JSX.IntrinsicElements[Tag]
  >
}

type TransitionKeyProps = string | number
type TransitionItemProps = string | number | object

interface TransitionProps<
  TInit extends object = {},
  TFrom extends object = {},
  TEnter extends object = {},
  TLeave extends object = {},
  TUpdate extends object = {}
> {
  /**
   * First render base values (initial from -> enter), if present overrides "from", can be "null" to skip first mounting transition, or: item => values
   */
  initial?: TInit | null
  /**
   * Will skip rendering the component if true and write to the dom directly
   * @default false
   */
  native?: boolean
  /**
   * Spring config ({ tension, friction })
   * @default config.default
   */
  config?: SpringConfig | ((key: string) => SpringConfig)
  /**
   * Base styles
   * @default {}
   */
  from?: TFrom
  /**
   * Animated styles when the component is mounted
   * @default {}
   */
  enter?: TEnter
  /**
   * Unmount styles
   * @default {}
   */
  leave?: TLeave
  /**
   * Fires for nodes that are neither entering nor leaving
   */
  update?: TUpdate
  /**
   * A collection of unique keys that must match with the childrens order
   * Can be omitted if children/render aren't an array
   * Can be a function, which then acts as a key-accessor which is useful when you use the items prop
   * @default {}
   */
  keys?:
    | ((params: TransitionItemProps) => TransitionKeyProps)
    | Array<TransitionKeyProps>
    | TransitionKeyProps
  /**
   * Optional. Let items refer to the actual data and from/enter/leaver/update can return per-object styles
   * @default {}
   */
  items?: Array<TransitionItemProps> | TransitionItemProps

  children?:
    | SpringRendererFunc<TInit & TFrom & TEnter & TLeave & TUpdate>
    | Array<SpringRendererFunc<TInit & TFrom & TEnter & TLeave & TUpdate>>
    | boolean

  render?:
    | SpringRendererFunc<TInit & TFrom & TEnter & TLeave & TUpdate>
    | Array<SpringRendererFunc<TInit & TFrom & TEnter & TLeave & TUpdate>>
    | boolean
}

export class Transition<
  TInit extends object,
  TFrom extends object,
  TEnter extends object,
  TLeave extends object,
  TUpdate extends object
> extends PureComponent<
  TransitionProps<TInit, TFrom, TEnter, TLeave, TUpdate>
> {}

type TrailKeyProps = string | number
type TrailKeyItemProps = string | number | object

interface TrailProps<DS extends object = {}> {
  native?: boolean

  config?: SpringConfig | ((key: string) => SpringConfig)

  from?: Partial<DS>

  to?: DS

  keys?:
    | ((params: TrailKeyItemProps) => TrailKeyProps)
    | Array<TrailKeyProps>
    | TrailKeyProps

  children?: SpringRendererFunc<DS> | Array<SpringRendererFunc<DS>>

  render?: SpringRendererFunc<DS> | Array<SpringRendererFunc<DS>>
}

export class Trail<DS extends object> extends PureComponent<TrailProps<DS>> {}

interface ParallaxProps<S extends object, DS extends object = {}> {
  pages: number

  config?: SpringConfig | ((key: string) => SpringConfig)

  scrolling?: boolean

  horizontal?: boolean

  ref?: Ref<Parallax>
}

export class Parallax<DS extends object = {}> extends PureComponent<
  ParallaxProps<DS>
> {
  scrollTo: (offset: number) => void
}

interface ParallaxLayerProps<S extends object, DS extends object = {}> {
  factor?: number

  offset?: number

  speed?: number
}

export class ParallaxLayer<
  S extends object,
  DS extends object
> extends PureComponent<ParallaxLayerProps<S, DS> & S> {}

interface KeyframesProps<DS extends object = {}> {
  state?: string
}

export class Keyframes<
  S extends object,
  DS extends object
> extends PureComponent<KeyframesProps<DS> & S> {
  static create<S extends object, DS extends object>(
    primitive: ComponentType
  ): (states: object) => (props: object) => Keyframes<S, DS>
  static Spring<S extends object, DS extends object>(
    states: object
  ): (
    props: object
  ) => Keyframes<
    S | Pick<SpringProps<DS>, Exclude<keyof SpringProps<DS>, 'to'>>,
    DS
  >
  static Trail<S extends object, DS extends object>(
    states: object
  ): (
    props: object
  ) => Keyframes<
    S | Pick<TrailProps<DS>, Exclude<keyof TrailProps<DS>, 'to'>>,
    DS
  >
  static Transition<S extends object, DS extends object>(
    states: object
  ): (
    props: object
  ) => Keyframes<
    S | Pick<TransitionProps<S, DS>, Exclude<keyof TransitionProps<DS>, 'to'>>,
    DS
  >
}
