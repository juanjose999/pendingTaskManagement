import { useEffect, useState } from 'react'
import './Task.css'

export const Task = ({ task, onDelete, onEdit, onComplete }) => {

    const calcularTiempoRestante = () => {
        if (!task.fechaLimite) return "SIN FECHA LÍMITE"

        const ahora = Date.now()
        const limite = new Date(task.fechaLimite).getTime()
        const diferencia = limite - ahora

        if (diferencia <= 0) {
            return "TIEMPO EXPIRADO"
        }

        const segundos = Math.floor((diferencia / 1000) % 60)
        const minutos = Math.floor((diferencia / (1000 * 60)) % 60)
        const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24)
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))

        const d = String(dias).padStart(2, '0')
        const h = String(horas).padStart(2, '0')
        const m = String(minutos).padStart(2, '0')
        const s = String(segundos).padStart(2, '0')

        return `${d}D ${h}:${m}:${s}`
    }

    const [timeLeft, setTimeLeft] = useState(calcularTiempoRestante())

    useEffect(() => {

        const interval = setInterval(() => {
            setTimeLeft(calcularTiempoRestante())
        }, 1000)

        return () => clearInterval(interval)

    }, [task.fechaLimite])

    const tiempoExpirado = timeLeft === "TIEMPO EXPIRADO"

    return (
        <div
            className={
                task.completada
                    ? 'container-task__card'
                    : tiempoExpirado
                        ? 'container-task__card tiemExpired'
                        : 'container-task__card'
            }
        >

            {/* CABECERA */}

            <div className='card-header'>

                <div className='title'>
                    <span>{task.titulo}</span>
                </div>

                <div className='container-options__card'>

                    <button
                        className='btn_delete'
                        onClick={() => onDelete(task.id)}
                    >
                        ELIMINAR
                    </button>

                    <button
                        className='btn_edit'
                        onClick={() => onEdit(task.id)}
                    >
                        EDITAR
                    </button>

                </div>

            </div>


            {/* CONTENIDO */}

            <div className='content'>

                <div>
                    <p>{task.materia || task.contenido}</p>
                </div>


                {/* INTERRUPTOR NUCLEAR */}

                <div className='nuclear-control'>

                    <span className='nuclear-control__label'>
                        ESTADO
                    </span>

                    <label
                        className={`nuclear-switch ${
                            task.completada ? 'nuclear-switch--active' : ''
                        }`}
                    >

                        <input
                            type="checkbox"
                            checked={task.completada}
                            onChange={(e) =>
                                onComplete(task.id, e.target.checked)
                            }
                        />

                        <span className='nuclear-switch__lever'></span>

                    </label>

                    <span className='nuclear-control__status'>
                        {task.completada
                            ? 'COMPLETADA'
                            : 'PENDIENTE'}
                    </span>

                </div>

            </div>


            {/* CRONÓMETRO */}

            <div className='container-dates'>

                <div className='spans'>

                    <span>CUENTA REGRESIVA</span>

                    <span
                        className={
                            tiempoExpirado
                                ? 'countdown countdown--expired'
                                : 'countdown'
                        }
                    >
                        {timeLeft}
                    </span>

                </div>

            </div>

        </div>
    )
}