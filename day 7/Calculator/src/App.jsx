import { useState } from 'react'
import './App.css'

const buttons = [
  'C',
  'DEL',
  '%',
  '/',
  '7',
  '8',
  '9',
  '*',
  '4',
  '5',
  '6',
  '-',
  '1',
  '2',
  '3',
  '+',
  '0',
  '.',
  '=',
]

function App() {
  const [display, setDisplay] = useState('0')

  const appendValue = (value) => {
    setDisplay((current) => {
      if (current === 'Error') {
        return value
      }

      if (current === '0' && value !== '.') {
        return value
      }

      return current + value
    })
  }

  const clearDisplay = () => {
    setDisplay('0')
  }

  const deleteLast = () => {
    setDisplay((current) => {
      if (current.length === 1 || current === 'Error') {
        return '0'
      }

      return current.slice(0, -1)
    })
  }

  const calculate = () => {
    try {
      if (!/^[\d+\-*/%. ]+$/.test(display)) {
        setDisplay('Error')
        return
      }

      const result = Function(`"use strict"; return (${display})`)()
      setDisplay(String(Number.isFinite(result) ? result : 'Error'))
    } catch {
      setDisplay('Error')
    }
  }

  const handleButtonClick = (value) => {
    if (value === 'C') {
      clearDisplay()
      return
    }

    if (value === 'DEL') {
      deleteLast()
      return
    }

    if (value === '=') {
      calculate()
      return
    }

    appendValue(value)
  }

  return (
    <main className="calculator-page">
      <section className="calculator" aria-label="Calculator">
        <div className="display" aria-live="polite">
          {display}
        </div>

        <div className="keypad">
          {buttons.map((button) => (
            <button
              key={button}
              type="button"
              className={[
                'key',
                button === 'C' ? 'clear' : '',
                button === '=' ? 'equal' : '',
                ['/', '*', '-', '+', '%'].includes(button) ? 'operator' : '',
                button === '0' ? 'zero' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleButtonClick(button)}
            >
              {button}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
