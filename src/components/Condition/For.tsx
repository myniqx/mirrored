import React, {
  ReactNode,
  Fragment,
  Children,
  isValidElement,
  cloneElement,
  ReactElement,
} from 'react'

type RenderFunction<T> = (item: T, index: number) => ReactNode

type ForEachProps<T> = {
  of: T[]
  children: RenderFunction<T>
}

type ForProps<T> =
  | ({
      each: T[]
    } & (
      | {
          fallback: React.ReactElement
          children: RenderFunction<T>
        }
      | {
          children:
            | ReactNode
            | RenderFunction<T>
            | (ReactNode | RenderFunction<T>)[]
        }
    ))
  | {
      children: ReactNode
    }

export function For<T>(props: ForProps<T>) {
  if ('each' in props) {
    const each = props.each
    if ('fallback' in props) {
      if (!each || !each.length) {
        return <>{props.fallback}</>
      }
    }

    let fallback = null
    let renderFunction: RenderFunction<T> | null = null
    if (Array.isArray(props.children)) {
      for (let i = 0; i < props.children.length; i++) {
        if (typeof props.children[i] === 'function') {
          renderFunction = props.children[i] as RenderFunction<T>
        } else if (props.children[i] === For.Fallback) {
          fallback = props.children[i]
        }
      }
    } else {
      renderFunction = props.children as RenderFunction<T>
    }

    if (!each || !each.length) {
      return fallback ? <>{fallback}</> : null
    }

    return (
      <>
        {each.map((item, index) => (
          <Fragment key={index}>
            {renderFunction ? renderFunction(item, index) : null}
          </Fragment>
        ))}
      </>
    )
  }

  let eachComponent: ReactNode | null = null
  let fallbackComponent: ReactNode | null = null

  if (Array.isArray(props.children)) {
    for (let i = 0; i < props.children.length; i++) {
      if (props.children[i] === For.Each) {
        eachComponent = props.children[i] as ReactNode
      } else if (props.children[i] === For.Fallback) {
        fallbackComponent = props.children[i] as ReactNode
      }
    }
  } else {
    eachComponent = props.children as ReactNode
  }

  if (eachComponent && 'props' in (eachComponent as any)) {
    const eachProps = (eachComponent as any).props as {}
    if (eachProps && 'of' in eachProps) {
      const of = eachProps.of as []
      if (!of || !of.length) {
        return fallbackComponent ? <>{fallbackComponent}</> : null
      }
      return eachComponent
    }
  }

  return fallbackComponent ? <>{fallbackComponent}</> : null
}

// For.Each alt bileşeni
For.Each = function ForEach<T>({ of, children }: ForEachProps<T>) {
  if (!of || of.length === 0) {
    return null
  }

  return (
    <>
      {of.map((item, index) => (
        <Fragment key={index}>
          {typeof children === 'function'
            ? (children as RenderFunction<T>)(item, index)
            : children}
        </Fragment>
      ))}
    </>
  )
}

For.Fallback = function ForFallback({ children }: { children?: ReactNode }) {
  return <>{children}</>
}

// For bileşenlerini özelleştirme fonksiyonu
export function createFor<T>() {
  return For as unknown as typeof For & { __type: T }
}
