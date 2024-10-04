import React, { useState, useEffect } from 'react'
import { Shuffle, RefreshCw, Clock } from 'lucide-react'

const numerosEnLetras: { [key: number]: string } = {
  0: 'cero', 1: 'uno', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco',
  6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez',
  11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince',
  20: 'veinte', 30: 'treinta', 40: 'cuarenta', 50: 'cincuenta',
  60: 'sesenta', 70: 'setenta', 80: 'ochenta', 90: 'noventa', 100: 'cien'
}

function obtenerNombreNumero(numero: number): string {
  if (numero in numerosEnLetras) return numerosEnLetras[numero]
  if (numero < 20) return `dieci${numerosEnLetras[numero - 10]}`
  if (numero < 30) return `veinti${numerosEnLetras[numero - 20]}`
  const decena = Math.floor(numero / 10) * 10
  const unidad = numero % 10
  if (unidad === 0) return numerosEnLetras[decena]
  return `${numerosEnLetras[decena]} y ${numerosEnLetras[unidad]}`
}

function App() {
  const [numeroActual, setNumeroActual] = useState(0)
  const [opciones, setOpciones] = useState<string[]>([])
  const [puntos, setPuntos] = useState(0)
  const [jugadas, setJugadas] = useState(0)
  const [juegoTerminado, setJuegoTerminado] = useState(false)
  const [tiempoInicio, setTiempoInicio] = useState(0)
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0)

  const generarNumeroAleatorio = () => {
    return Math.floor(Math.random() * 101)
  }

  const generarOpciones = (numero: number) => {
    const opcionCorrecta = obtenerNombreNumero(numero)
    let opcionesIncorrectas = []
    while (opcionesIncorrectas.length < 2) {
      const numeroIncorrecto = generarNumeroAleatorio()
      if (numeroIncorrecto !== numero) {
        opcionesIncorrectas.push(obtenerNombreNumero(numeroIncorrecto))
      }
    }
    return [opcionCorrecta, ...opcionesIncorrectas].sort(() => 0.5 - Math.random())
  }

  const nuevaPregunta = () => {
    if (jugadas < 10) {
      const nuevoNumero = generarNumeroAleatorio()
      setNumeroActual(nuevoNumero)
      setOpciones(generarOpciones(nuevoNumero))
      setJugadas(jugadas + 1)
    } else {
      setJuegoTerminado(true)
    }
  }

  const verificarRespuesta = (opcion: string) => {
    if (opcion === obtenerNombreNumero(numeroActual)) {
      setPuntos(puntos + 1)
    }
    nuevaPregunta()
  }

  const reiniciarJuego = () => {
    setPuntos(0)
    setJugadas(0)
    setJuegoTerminado(false)
    setTiempoInicio(Date.now())
    nuevaPregunta()
  }

  useEffect(() => {
    reiniciarJuego()
  }, [])

  useEffect(() => {
    let intervalo: number
    if (!juegoTerminado) {
      intervalo = setInterval(() => {
        setTiempoTranscurrido(Math.floor((Date.now() - tiempoInicio) / 1000))
      }, 1000)
    }
    return () => clearInterval(intervalo)
  }, [juegoTerminado, tiempoInicio])

  const formatTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60)
    const segundosRestantes = segundos % 60
    return `${minutos}:${segundosRestantes < 10 ? '0' : ''}${segundosRestantes}`
  }

  if (juegoTerminado) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-8">¡Juego Terminado!</h1>
        <p className="text-2xl mb-4">Tu puntaje final es: {puntos} de 10</p>
        <p className="text-2xl mb-4">Tiempo total: {formatTiempo(tiempoTranscurrido)}</p>
        <button
          onClick={reiniciarJuego}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300"
        >
          <RefreshCw className="mr-2" />
          Jugar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-8">Quiz de Números en Letras</h1>
      <div className="bg-white rounded-lg shadow-lg p-8 w-96">
        <p className="text-3xl font-bold text-center text-gray-800 mb-6">{numeroActual}</p>
        <div className="grid grid-cols-1 gap-4">
          {opciones.map((opcion, index) => (
            <button
              key={index}
              onClick={() => verificarRespuesta(opcion)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between w-96">
        <p className="text-2xl font-semibold">Puntos: {puntos}</p>
        <p className="text-xl flex items-center">
          <Clock className="mr-2" />
          {formatTiempo(tiempoTranscurrido)}
        </p>
      </div>
      <p className="mt-2 text-xl">Jugada: {jugadas} de 10</p>
      <button
        onClick={nuevaPregunta}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300"
      >
        <Shuffle className="mr-2" />
        Siguiente pregunta
      </button>
    </div>
  )
}

export default App