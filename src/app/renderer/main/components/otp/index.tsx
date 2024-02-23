import { TOTP } from 'otpauth'
import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger, useTimedTooltip } from '../../../common/components'
import { useTranslation } from 'react-i18next'
import { useClipboardContext, useConfigContext } from '../../../common/contexts'

const RADIUS = 30
const CIRCUMFERENCE: number = RADIUS * 2 * Math.PI
export const RegExpPattern = 'otpauth:\\/\\/(?<protocol>totp|hotp)\\/(?:(?<issuerInLabel>[a-zA-Z]+):)?(?<label>[a-zA-Z+.@]+)(?:\\?|(?:%3F))(?:secret)(?:(?:%3D)|=)(?<secret>[^&%\\r\\n]+)(?:(?:(?:%26)|&)issuer(?:(?:%3D)|=)(?<issuer>[^&\\r\\n]+))?(?:(?:(?:%26)|&)algorithm(?:(?:%3D)|=)(?<algorithm>[^&\\r\\n]+))?(?:(?:(?:%26)|&)digits(?:(?:%3D)|=)(?<digits>[0-9]+))?(?:(?:(?:%26)|&)period(?:(?:%3D)|=)(?<period>[0-9]+))?(?:(?:(?:%26)|&)counter(?:(?:%3D)|=)(?<counter>[0-9]+))?'

const copyOTP = ({ props, key, altKey, metaKey, shiftKey, ctrlKey }) => {
  if (key === 'Enter') {
    props.handleSetClipboard(props.otp)
  }
  if (key === ' ') {
    props.handleSetClipboard(props.otp)
  }
  if (!altKey && !metaKey && !shiftKey && ctrlKey && key === 'c') {
    props.handleSetClipboard(props.otp)
  }
}

const SmallOTPComponent = (props: {
  copyOnClick: boolean,
  otp: string,
  timer: { time: number, percentage: number },
  period: number,
  handleSetClipboard: (value: string) => void
}) => {
  return (
    <div className="flex flex-col items-center cursor-pointer justify-center"
         onClick={ (event) => {
           event.preventDefault()
           if (props.copyOnClick) {
             props.handleSetClipboard(props.otp)
           }
         } }
         tabIndex={ 0 }
         onKeyUp={ (event) => copyOTP({ props, ...event }) }
    >
      <div className="text-center text-xl px-5">
        <OTPCode value={ props.otp } size={ props.otp.length }/>
        <progress
          className="progress progress-info"
          value={ String(props.timer.time) }
          max={ props.period }
        />
      </div>
    </div>
  )
}

const SmallOTPComponentError = () => {
  return (
    <div className="flex flex-col items-center cursor-pointer justify-center">
      <div className="text-center text-xl px-5">
        Invalid URI
        <progress
          className="progress progress-error"
          value={ 100 }
          max={ 100 }
        />
      </div>
    </div>
  )
}

const LargeOTPComponent = (props: {
  copyOnClick: boolean,
  otp: string,
  timer: { time: number, percentage: number }
  handleSetClipboard: (value: string) => void
}) => {
  let componentColor = 'text-info'
  if (props.timer.percentage < 50 && props.timer.percentage >= 25) {
    componentColor = 'text-warning'
  } else if (props.timer.percentage < 25) {
    componentColor = 'text-error'
  }

  return (
    <div className="flex flex-row items-center cursor-pointer justify-center"
         onClick={ () => {
           if (props.copyOnClick) {
             props.handleSetClipboard(props.otp)
           }
         } }
         tabIndex={ 0 }
         onKeyUp={ (event) => copyOTP({ props, ...event }) }
    >
      <div className="inline-flex items-center justify-center overflow-hidden rounded-full relative"
           style={ { width: '5rem', height: '5rem' } }
      >
        <svg className="w-full h-full absolute">
          <circle
            className="text-base-100"
            strokeWidth="7"
            stroke="currentColor"
            fill="transparent"
            r={ RADIUS }
            cx="50%"
            cy="50%"
          />
          <circle
            className={ componentColor }
            strokeWidth="4"
            strokeDasharray={ CIRCUMFERENCE }
            strokeDashoffset={ (CIRCUMFERENCE - (props.timer.percentage / 100) * CIRCUMFERENCE) }
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={ RADIUS }
            cx="50%"
            cy="50%"
            transform="rotate(-90 40 40)"
          />
        </svg>
        <span className={ 'absolute text-xl unselectable ' + componentColor }>{ props.timer.time } s</span>
      </div>
      <div className="text-center text-xl px-5">
        <OTPCode value={ props.otp } size={ props.otp.length }/>
      </div>
    </div>
  )
}

const LargeOTPComponentError = () => {
  return (
    <div className="flex flex-row items-center cursor-pointer justify-center">
      <div className="flex items-center justify-center overflow-hidden rounded-full relative"
           style={ { width: '5rem', height: '5rem' } }
      >
        <svg className="w-full h-full absolute">
          <circle
            className="text-neutral"
            strokeWidth="7"
            stroke="currentColor"
            fill="transparent"
            r={ 30 }
            cx="50%"
            cy="50%"
          />
          <circle
            className="text-error"
            strokeWidth="4"
            strokeDasharray={ CIRCUMFERENCE }
            strokeDashoffset={ 0 }
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={ RADIUS }
            cx="50%"
            cy="50%"
            transform="rotate(-90 40 40)"
          />
        </svg>
        <span className="absolute text-error text-4xl unselectable">!</span>
      </div>
      <div className="text-center text-xl px-5">
        Invalid URI
      </div>
    </div>
  )
}


const OTPCode = (props: { value: string, size: number }) => {
  const arr = new Array(props.size).fill('-')
  return (
    <div className="flex gap-0.5">
      { arr.map((_, index) => {
        return (
          <input
            key={ index }
            className="input input-xs input-bordered px-0 text-center w-6 cursor-pointer unselectable"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={ props.size }
            value={ props.value.at(index) ?? '' }
            readOnly={ true }
            tabIndex={ -1 }
            aria-hidden={ true }
            onMouseDown={ (event) => {
              event.preventDefault()
            } }
          />
        )
      }) }
    </div>
  )
}

const ParseURI = (props: { uri: string }): TOTP => {
  const regex = new RegExp(RegExpPattern)
  const isMatch = regex.test(props.uri)
  if (!isMatch)
    throw new Error('Invalid URI')

  const match = props.uri.match(regex)
  if (!match || !match.groups)
    throw new Error('Invalid URI')

  // CURRENTLY ONLY SUPPORTS TOTP
  if (match.groups.protocol === 'hotp')
    throw new Error('HOTP not supported')

  return new TOTP({
    issuerInLabel: (match.groups.issuerInLabel === undefined) ?? false,
    label: match.groups.label,
    secret: match.groups.secret,
    issuer: match.groups.issuer,
    algorithm: match.groups.algorithm,
    digits: match.groups.digits ? Number(match.groups.digits) : undefined,
    period: match.groups.period ? Number(match.groups.period) : undefined
  })
}


const OTPError = ({ columnSize }) => {
  return (
    columnSize < 350 ?
      <SmallOTPComponentError/> :
      <LargeOTPComponentError/>
  )
}

const OTPInterface = (props: {
  columnSize: number,
  totp: TOTP,
  otp: string,
  timer: { time: number, percentage: number }
}) => {
  const { isOpen, handleTooltipOpen, handleTooltipClose } = useTimedTooltip(800)
  const { handleSetClipboard } = useClipboardContext()
  const { config } = useConfigContext()
  const copyOnClick = config.settings.security.copyFieldValuesToClipboardOnClick

  const { t } = useTranslation()

  return (
    <Tooltip open={ isOpen } onOpenChange={ handleTooltipClose }>
      <TooltipTrigger className="w-full" onClick={ (e) => {
        e.preventDefault()
        if (copyOnClick) {
          handleTooltipOpen()
        }
      } }>
        {
          props.columnSize < 380 ?
            <SmallOTPComponent copyOnClick={ copyOnClick } handleSetClipboard={ handleSetClipboard } otp={ props.otp }
                               timer={ props.timer }
                               period={ props.totp.period }/> :
            <LargeOTPComponent copyOnClick={ copyOnClick } handleSetClipboard={ handleSetClipboard } otp={ props.otp }
                               timer={ props.timer }/>
        }
      </TooltipTrigger>
      <TooltipContent>
        <div
          className="tooltip tooltip-base-100 tooltip-open"
          data-tip={ t('Entry Detail.OTP Copied') }
        />
      </TooltipContent>
    </Tooltip>
  )
}

const OTP = (props: { otpURI: string, columnSize: number }) => {
  const [ otp, setOTP ] = useState('000000')

  let totp: TOTP
  try {
    totp = ParseURI({ uri: props.otpURI })
  } catch (error) {
    return (
      <OTPError columnSize={ props.columnSize }/>
    )
  }

  const [ timer, setTimer ] = useState({ time: totp.period, percentage: 100 })
  const step = 100 / totp.period

  const resetTimer = () => {
    setTimer({
      time: totp.period,
      percentage: 100
    })
  }

  const updateTimer = () => {
    setTimer(prevState => ({
      time: prevState.time - 1,
      percentage: prevState.percentage - step
    }))
  }

  useEffect(() => {
    // Calculate the current time in seconds
    const currentTime = Math.floor(Date.now() / 1000)

    // Calculate the next regeneration time by rounding up the current time to the nearest multiple of the OTP period
    const nextRegenerationTime = Math.ceil(currentTime / totp.period) * totp.period

    // Calculate the remaining time until the next regeneration
    const initialRemainingTime = nextRegenerationTime - currentTime

    // Calculate the initial remaining percentage
    const initialPercentage = Math.floor((initialRemainingTime / totp.period) * 100)

    // Set the initial OTP and remaining time
    setOTP(totp.generate())
    setTimer({
      time: initialRemainingTime,
      percentage: initialPercentage
    })

    const initialTimer = setInterval(() => {
      setOTP(totp.generate())
      resetTimer()
    }, initialRemainingTime * 1000)

    const initialCountdownTimer = setInterval(() => {
      updateTimer()
    }, 1000)

    // Set a timeout that will start the interval after the remaining time has passed
    const timeoutId = setTimeout(() => {
      clearInterval(initialTimer)
      clearInterval(initialCountdownTimer)

      setOTP(totp.generate())
      resetTimer()

      const timerId = setInterval(() => {
        setOTP(totp.generate())
        resetTimer()
      }, totp.period * 1000)

      const countdownTimerId = setInterval(() => {
        updateTimer()
      }, 1000)

      return () => {
        clearInterval(timerId)
        clearInterval(countdownTimerId)
      }
    }, initialRemainingTime * 1000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <OTPInterface columnSize={ props.columnSize } otp={ otp } timer={ timer } totp={ totp }/>
  )
}

export default OTP