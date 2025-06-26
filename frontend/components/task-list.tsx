import type { Task } from "@/types/task"
import { TaskCard } from "./task-card"

interface TaskListProps {
  tasks: Task[]
  onStatusChange: (id: number, status: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  canDelete?: boolean
}

export function TaskList({ tasks, onStatusChange, onEdit, onDelete, canDelete = false }: TaskListProps) {
  const todoTasks = tasks.filter((task) => task.status === "TODO")
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS")
  const doneTasks = tasks.filter((task) => task.status === "DONE")

  const TaskColumn = ({ title, tasks }: { title: string; tasks: Task[]; status: string }) => (
    <div className="flex-1 min-w-0">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{tasks.length} tasks</p>
        </div>
        <div className="p-4 space-y-3 min-h-[200px]">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
              canDelete={canDelete}
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-center text-gray-400 py-8">No tasks in {title.toLowerCase()}</div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Mobile view - stacked columns */}
      <div className="block lg:hidden space-y-6">
        <TaskColumn title="To Do" tasks={todoTasks} status="TODO" />
        <TaskColumn title="In Progress" tasks={inProgressTasks} status="IN_PROGRESS" />
        <TaskColumn title="Done" tasks={doneTasks} status="DONE" />
      </div>

      {/* Desktop view - side by side columns */}
      <div className="hidden lg:flex gap-6">
        <TaskColumn title="To Do" tasks={todoTasks} status="TODO" />
        <TaskColumn title="In Progress" tasks={inProgressTasks} status="IN_PROGRESS" />
        <TaskColumn title="Done" tasks={doneTasks} status="DONE" />
      </div>
    </div>
  )
}
