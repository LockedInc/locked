<?php

namespace App\Services;
use App\Models\Alert;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

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
    public function createAlert($adminUserId, $message, $taskId, $userIds)
    {
        $alert = Alert::create([
            'admin_id' => $adminUserId,
            'message' => $message,
            'task_id' => $taskId
        ]);

        // If userIds is provided, create user-specific alerts
        if (!empty($userIds)) {
            foreach ($userIds as $userId) {
                // You might want to create individual alert records for each user
                // or use a pivot table depending on your alert structure
                Alert::create([
                    'admin_id' => $adminUserId,
                    'message' => $message,
                    'task_id' => $taskId,
                    'user_id' => $userId
                ]);
            }
        }

        return $alert;
    }
}