"use client";
"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { Task } from "@/types/task"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface AnalyticsChartProps {
  tasks: Task[];
  totalMinutes: number
}

export function AnalyticsChart({ tasks, totalMinutes }: AnalyticsChartProps) {
  const analyticsData = useMemo(() => {
    // Time logged per day (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    const timeByDay = last7Days.map((date) => {
      const dayTasks = tasks.filter((task) => {
        // Use completedAt for completed tasks, inProgressAt for in-progress, or updatedAt as fallback
        const relevantDate = task.completedAt || task.inProgressAt || task.updatedAt
        return relevantDate?.startsWith(date)
      })

      return {
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        minutes: dayTasks.reduce((sum, task) => sum + (task.totalMinutes || 0), 0),
      }
    })

    // Task status distribution
    const statusCounts = {
      TODO: tasks.filter((t) => t.status === "TODO").length,
      IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      DONE: tasks.filter((t) => t.status === "DONE").length,
    }

    const statusData = [
      { name: "To Do", value: statusCounts.TODO, color: "#6B7280" },
      { name: "In Progress", value: statusCounts.IN_PROGRESS, color: "#3B82F6" },
      { name: "Done", value: statusCounts.DONE, color: "#10B981" },
    ]

    // Task completion rate
    const totalTasks = tasks.length
    const completedTasks = statusCounts.DONE
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const totalHours = Math.round((totalMinutes / 60) * 10) / 10

    // Task Completion Timeline
    const completionTimeline = tasks
      .filter((task) => task.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 10)
      .map((task) => ({
        title: task.title,
        completedAt: task.completedAt!,
        totalMinutes: task.totalMinutes || 0,
      }))

    return {
      timeByDay,
      statusData,
      completionRate,
      totalHours,
      totalTasks,
      completedTasks,
      completionTimeline,
    }
  }, [tasks])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Track your productivity and task completion metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analyticsData.completedTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.completionRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Time Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalHours}h</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Logged Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Time Logged (Last 7 Days)</CardTitle>
            <CardDescription>Minutes logged per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                minutes: {
                  label: "Minutes",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.timeByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="minutes"
                    stroke="var(--color-minutes)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-minutes)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Current task breakdown by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-gray-600">{data.value} tasks</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {analyticsData.statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Completion Timeline */}
      {analyticsData.completionTimeline.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Completions</CardTitle>
            <CardDescription>Recently completed tasks with timestamps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.completionTimeline.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{task.title}</p>
                    <p className="text-sm text-green-600">
                      Completed {formatDistanceToNow(new Date(task.completedAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Done</Badge>
                    {task.totalMinutes > 0 && <span className="text-sm text-gray-500">{task.totalMinutes}m</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>Your most recently updated tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks
              .sort((a, b) => new Date(b.updatedAt || "").getTime() - new Date(a.updatedAt || "").getTime())
              .slice(0, 5)
              .map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{task.title}</p>
                    <p className="text-sm text-gray-500 truncate">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        task.status === "DONE"
                          ? "bg-green-100 text-green-800"
                          : task.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {task.status.replace("_", " ")}
                    </Badge>
                    {task.totalMinutes && <span className="text-sm text-gray-500">{task.totalMinutes}m</span>}
                  </div>
                </div>
              ))}
            {tasks.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No tasks yet. Create your first task to see analytics!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
