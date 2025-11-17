import './Windows7Spinner.css'

interface Windows7SpinnerProps {
  size?: number
}

export default function Windows7Spinner({ size = 32 }: Windows7SpinnerProps) {
  return (
    <div className="windows7-spinner" style={{ width: size, height: size }}>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
    </div>
  )
}

