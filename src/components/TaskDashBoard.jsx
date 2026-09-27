import { useEffect, useState } from "react"
import { Task } from "./Task"
import "./TaskDashBoard.css"

const EMPTY_TASK = {
    titulo: "",
    contenido: "",
    fechaLimite: "",
    tiempoEstimado: "",
    completada: false,
    informacionDelSystema: {
        fechaCreacion: "",
        fechaUltimaMoficacion: ""
    }
}

const FILTERS = {
    ALL: "Todas",
    PENDING: "SIN_COMPLETAR",
    COMPLETED: "COMPLETADAS"
}

export const TaskDashBoard = () => {

    // =========================
    // ESTADO
    // =========================

    const [taskList, setTaskList] = useState( JSON.parse(localStorage.getItem('task')) || [])
    const [currentTask, setCurrentTask] = useState(EMPTY_TASK)

    const [filterCompleted, setFilterCompleted] = useState(FILTERS.ALL)

    const [viewFormNewTask, setViewFormNewTask] = useState(false)
    const [isViewEdit, setIsViewEdit] = useState(false)


    // =========================
    // INPUTS
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target

        setCurrentTask((task) => ({
            ...task,
            [name]: value
        }))
    }


    // =========================
    // FORMULARIOS
    // =========================

    const openCreateForm = () => {
        setCurrentTask(EMPTY_TASK)
        setViewFormNewTask(true)
    }

    const closeCreateForm = () => {
        setCurrentTask(EMPTY_TASK)
        setViewFormNewTask(false)
    }

    const closeEditForm = () => {
        setCurrentTask(EMPTY_TASK)
        setIsViewEdit(false)
    }


    // =========================
    // VALIDACIÓN
    // =========================

    const validateTask = () => {

        if (!currentTask.titulo.trim()) {
            alert("Complete el título")
            return false
        }

        if (!currentTask.contenido.trim()) {
            alert("Complete el contenido")
            return false
        }

        if(!currentTask.fechaLimite){
            alert("Complete la fecha limite")
            return false
        }

        return true
    }


    // =========================
    // CREAR TAREA
    // =========================

    const handleCreateTask = (e) => {
        e.preventDefault()

        if (!validateTask()) return

        const now = Date.now()

        const newTask = {
            ...currentTask,

            id: crypto.randomUUID(),

            informacionDelSystema: {
                fechaCreacion: now,
                fechaUltimaMoficacion: now
            }
        }

        setTaskList((tasks) => [
            ...tasks,
            newTask
        ])

        closeCreateForm()
    }

    useEffect(() => {
        localStorage.setItem('task', JSON.stringify(taskList))
    },[taskList])

    // =========================
    // EDITAR TAREA
    // =========================

    const handleViewEdit = (id) => {

        const taskToEdit = taskList.find(
            (task) => task.id === id
        )

        if (!taskToEdit) return

        setCurrentTask({
            ...taskToEdit
        })

        setIsViewEdit(true)
    }


    const handleSaveEditTask = (e) => {
        e.preventDefault()

        if (!validateTask()) return

        const updatedTask = {
            ...currentTask,

            informacionDelSystema: {
                ...currentTask.informacionDelSystema,

                fechaUltimaMoficacion: Date.now()
            }
        }

        setTaskList((tasks) =>
            tasks.map((task) =>
                task.id === updatedTask.id
                    ? updatedTask
                    : task
            )
        )

        closeEditForm()
    }


    // =========================
    // COMPLETAR TAREA
    // =========================

    const handleCompleteTask = (id, completed) => {

        setTaskList((tasks) =>
            tasks.map((task) =>
                task.id === id
                    ? {
                        ...task,
                        completada: completed,
                        informacionDelSystema: {
                            ...task.informacionDelSystema,
                            fechaUltimaMoficacion: Date.now()
                        }
                    }
                    : task
            )
        )
    }


    // =========================
    // ELIMINAR TAREA
    // =========================

    const handleDeleteTask = (id) => {

        setTaskList((tasks) =>
            tasks.filter(
                (task) => task.id !== id
            )
        )
    }


    // =========================
    // FILTRO
    // =========================

    const filteredTasks = taskList.filter((task) => {

        switch (filterCompleted) {

            case FILTERS.COMPLETED:
                return task.completada

            case FILTERS.PENDING:
                return !task.completada

            case FILTERS.ALL:
            default:
                return true
        }
    })


    // =========================
    // ESTADÍSTICAS DEL DÍA
    // =========================

    const today = new Date()

    const tasksToday = taskList.filter((task) => {

        const creationDate =
            task.informacionDelSystema?.fechaCreacion

        if (!creationDate) return false

        const taskDate = new Date(creationDate)

        return (
            taskDate.getDate() === today.getDate() &&
            taskDate.getMonth() === today.getMonth() &&
            taskDate.getFullYear() === today.getFullYear()
        )
    })

    const tasksCreatedToday = tasksToday.length

    const tasksCompletedToday = tasksToday.filter(
        (task) => task.completada
    ).length

    const tasksPendingToday = tasksToday.filter(
        (task) => !task.completada
    ).length


    // =========================
    // RENDER
    // =========================

    return (
        <div className="container">

            <div className="container-tasks">

                {/* ================= HEADER ================= */}

                <header>
                    <h1>Pendientes</h1>
                </header>


                <main>

                    {/* ================= RESUMEN ================= */}

                    <section className="daily-summary">

                        <div className="daily-summary__header">

                            <span className="daily-summary__system">
                                FECHA
                            </span>

                            <span className="daily-summary__date">
                                {today
                                    .toLocaleDateString("es-CO", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })
                                    .toUpperCase()}
                            </span>

                        </div>


                        <div className="daily-summary__title">
                            REPORTE DE ACTIVIDAD DIARIA
                        </div>


                        <div className="daily-summary__stats">

                            <div className="daily-summary__item">

                                <span className="daily-summary__label">
                                    TAREAS CREADAS
                                </span>

                                <span className="daily-summary__value">
                                    {tasksCreatedToday}
                                </span>

                            </div>


                            <div className="daily-summary__item">

                                <span className="daily-summary__label">
                                    SIN COMPLETAR
                                </span>

                                <span className="daily-summary__value">
                                    {tasksPendingToday}
                                </span>

                            </div>


                            <div className="daily-summary__item">

                                <span className="daily-summary__label">
                                    COMPLETADAS
                                </span>

                                <span className="daily-summary__value">
                                    {tasksCompletedToday}
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* ================= OPCIONES ================= */}

                    <section className="options">

                        <div className="options-container__input">

                            <input
                                type="text"
                                name="content"
                                placeholder="Buscar"
                            />

                        </div>


                        <div className="options-container__btn">

                            <button onClick={openCreateForm}>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                >
                                    <path d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" />
                                </svg>

                            </button>

                        </div>

                    </section>


                    {/* ================= LISTA ================= */}

                    <section className="container-task__list">


                        {/* FILTROS */}

                        <div className="container-task__filters">

                            <button
                                className={
                                    filterCompleted === FILTERS.ALL
                                        ? "nuclear-button-active"
                                        : "nuclear-button"
                                }
                                onClick={() =>
                                    setFilterCompleted(FILTERS.ALL)
                                }
                            >
                                VER TODAS
                            </button>


                            <button
                                className={
                                    filterCompleted === FILTERS.PENDING
                                        ? "nuclear-button-active"
                                        : "nuclear-button"
                                }
                                onClick={() =>
                                    setFilterCompleted(FILTERS.PENDING)
                                }
                            >
                                SIN COMPLETAR
                            </button>


                            <button
                                className={
                                    filterCompleted === FILTERS.COMPLETED
                                        ? "nuclear-button-active"
                                        : "nuclear-button"
                                }
                                onClick={() =>
                                    setFilterCompleted(FILTERS.COMPLETED)
                                }
                            >
                                COMPLETADAS
                            </button>

                        </div>


                        {/* TAREAS */}

                        {filteredTasks.length === 0 ? (

                            <span>
                                No has creado tareas o no hay coincidencias
                            </span>

                        ) : (

                            filteredTasks.map((task) => (

                                <Task
                                    key={task.id}
                                    task={task}
                                    onDelete={handleDeleteTask}
                                    onEdit={handleViewEdit}
                                    onComplete={handleCompleteTask}
                                />

                            ))

                        )}

                    </section>

                </main>

            </div>


            {/* ================= CREAR ================= */}

            {viewFormNewTask && (

                <div className="container-form">

                    <form
                        onSubmit={handleCreateTask}
                        className="form-con-cierre"
                    >

                        <button
                            type="button"
                            className="btn-cancelar-absolute"
                            onClick={closeCreateForm}
                        >
                            ✕
                        </button>


                        <h3>Ingrese la tarea</h3>


                        <input
                            type="text"
                            name="titulo"
                            value={currentTask.titulo}
                            onChange={handleChange}
                            placeholder="Título"
                        />


                        <textarea
                            name="contenido"
                            value={currentTask.contenido}
                            onChange={handleChange}
                            maxLength="255"
                            placeholder="Ingrese descripción"
                        />


                        <div className="fecha_limite">

                            <label htmlFor="fechaLimite">
                                Fecha límite
                            </label>

                            <div className="container_time">

                                <input
                                    type="datetime-local"
                                    id="fechaLimite"
                                    name="fechaLimite"
                                    value={currentTask.fechaLimite}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        <button
                            className="btn_crear"
                            type="submit"
                        >
                            Crear
                        </button>

                    </form>

                </div>

            )}


            {/* ================= EDITAR ================= */}

            {isViewEdit && (

                <div className="container-form">

                    <form
                        onSubmit={handleSaveEditTask}
                        className="form-con-cierre"
                    >

                        <button
                            type="button"
                            className="btn-cancelar-absolute"
                            onClick={closeEditForm}
                        >
                            ✕
                        </button>


                        <h3>Editar información</h3>


                        <input
                            type="text"
                            name="titulo"
                            value={currentTask.titulo}
                            onChange={handleChange}
                            placeholder="Título"
                        />


                        <textarea
                            name="contenido"
                            value={currentTask.contenido}
                            onChange={handleChange}
                            maxLength="255"
                            placeholder="Ingrese descripción"
                        />


                        <div className="fecha_limite">

                            <label htmlFor="fechaLimiteEdit">
                                Fecha límite
                            </label>

                            <div className="container_time">

                                <input
                                    type="datetime-local"
                                    id="fechaLimiteEdit"
                                    name="fechaLimite"
                                    value={currentTask.fechaLimite}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        <button
                            className="btn_crear"
                            type="submit"
                        >
                            Guardar
                        </button>

                    </form>

                </div>

            )}

        </div>
    )
}
