import { Meeting } from "@/types/meeting"
import { Card } from "@/components/ui/card"
import { Users, Calendar, Clock } from "lucide-react"

interface MeetingSummaryProps {
    meetings: Meeting[]
}

export function MeetingSummary({ meetings }: MeetingSummaryProps) {
    const now = new Date()
    const upcomingCount = meetings.filter(m => new Date(m.date) > now).length
    const pastCount = meetings.filter(m => new Date(m.date) <= now).length
    const totalCount = meetings.length

    const totalAttendees = meetings.reduce((acc, meeting) => acc + meeting.users.length, 0)
    const averageAttendees = totalCount > 0 ? Math.round(totalAttendees / totalCount) : 0

    return (
        <Card className="px-6 py-3">
            <div className="flex items-center justify-center gap-8">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 group">
                            <Clock className="h-4 w-4 text-blue-500 group-hover:scale-125 transition-transform" />
                            <span className="font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                                {upcomingCount}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">Upcoming</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 group">
                            <Calendar className="h-4 w-4 text-purple-500 group-hover:scale-125 transition-transform" />
                            <span className="font-medium text-purple-600 group-hover:text-purple-700 transition-colors">
                                {pastCount}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">Past</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 group">
                            <Users className="h-4 w-4 text-green-500 group-hover:scale-125 transition-transform" />
                            <span className="font-medium text-green-600 group-hover:text-green-700 transition-colors">
                                {averageAttendees}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">Avg. Attendees</span>
                    </div>

                    <div className="h-12 w-px bg-border" />

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 group">
                            <span className="text-lg font-semibold text-foreground">
                                {totalCount}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">Total Meetings</span>
                    </div>
                </div>
            </div>
        </Card>
    )
} 