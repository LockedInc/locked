<?php

namespace App\Services;
use App\Models\Alert;
use App\Models\Task;
use App\Models\User;
use App\Mail\AlertNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AlertsService
{   
    // get all alerts for a user
    public function getUserAlerts($userId)
    {   
        $user = User::find($userId);
        
        if (!$user) {
            return collect(); // Return empty collection if user not found
        }
        
        // Get alerts for tasks that the user is assigned to and belong to their client
        $query = Alert::with(['admin', 'task'])
            ->whereHas('task', function($query) use ($user) {
                $query->whereHas('users', function($subQuery) use ($user) {
                    $subQuery->where('user_id', $user->id);
                })->where('client_id', $user->client_id);
            });

        // Sort: unread first (newest to oldest), then read (most recently read first)
        return $query->orderByRaw('
            CASE 
                WHEN is_read = 0 THEN 0 
                ELSE 1 
            END ASC,
            CASE 
                WHEN is_read = 0 THEN created_at 
                ELSE read_at 
            END DESC
        ')->get();
    }

    // mark alert as read
    public function markAlertAsRead($alertId, $userId)
    {
        $user = User::find($userId);
        
        if (!$user) {
            return null;
        }
        
        // Find alert that belongs to a task the user is assigned to
        $alert = Alert::whereHas('task', function($query) use ($user) {
            $query->whereHas('users', function($subQuery) use ($user) {
                $subQuery->where('user_id', $user->id);
            })->where('client_id', $user->client_id);
        })->find($alertId);
        
        if ($alert) {
            $alert->update([
                'is_read' => true,
                'read_at' => now()
            ]);
            return $alert;
        }
        
        return null;
    }

    // mark alert as unread
    public function markAlertAsUnread($alertId, $userId)
    {
        $user = User::find($userId);
        
        if (!$user) {
            return null;
        }
        
        // Find alert that belongs to a task the user is assigned to
        $alert = Alert::whereHas('task', function($query) use ($user) {
            $query->whereHas('users', function($subQuery) use ($user) {
                $subQuery->where('user_id', $user->id);
            })->where('client_id', $user->client_id);
        })->find($alertId);
        
        if ($alert) {
            $alert->update([
                'is_read' => false,
                'read_at' => null
            ]);
            return $alert;
        }
        
        return null;
    }

    // mark all alerts as read for a user
    public function markAllAlertsAsRead($userId)
    {
        $user = User::find($userId);
        
        if (!$user) {
            return 0;
        }
        
        return Alert::whereHas('task', function($query) use ($user) {
            $query->whereHas('users', function($subQuery) use ($user) {
                $subQuery->where('user_id', $user->id);
            })->where('client_id', $user->client_id);
        })->where('is_read', false)->update([
            'is_read' => true,
            'read_at' => now()
        ]);
    }

    // get unread alerts count for a user
    public function getUnreadAlertsCount($userId)
    {
        $user = User::find($userId);
        
        if (!$user) {
            return 0;
        }
        
        return Alert::whereHas('task', function($query) use ($user) {
            $query->whereHas('users', function($subQuery) use ($user) {
                $subQuery->where('user_id', $user->id);
            })->where('client_id', $user->client_id);
        })->where('is_read', false)->count();
    }

    // create an alert by an admin
    public function createAlert($adminUserId, $message, $taskId, $userIds = null)
    {
        // Get the admin user
        $admin = User::find($adminUserId);
        if (!$admin) {
            throw new \Exception('Admin user not found');
        }

        // Get the task with its relationships
        $task = Task::with(['users', 'client'])->find($taskId);
        if (!$task) {
            throw new \Exception('Task not found');
        }

        // Create a single alert associated with the task
        $alert = Alert::create([
            'admin_id' => $adminUserId,
            'message' => $message,
            'task_id' => $taskId,
            'user_id' => null // This alert is for all users assigned to the task
        ]);

        // Load the task relationship for the alert
        $alert->load('task');

        // Send emails to all users assigned to the task
        if ($userIds && is_array($userIds)) {
            $users = User::whereIn('id', $userIds)->get();
        } else {
            // If no specific user IDs provided, get all users assigned to the task
            $users = $task->users;
        }

        // Send email to each user
        foreach ($users as $user) {
            try {
                Mail::to($user->email)->send(new AlertNotification($alert, $user, $admin));
            } catch (\Exception $e) {
                // Log the email sending error but don't fail the entire operation
                \Illuminate\Support\Facades\Log::error('Failed to send alert email', [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'alert_id' => $alert->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $alert;
    }
}