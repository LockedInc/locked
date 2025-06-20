<?php

namespace App\Http\Controllers\ClientAdmin;

use App\Http\Controllers\Controller;
use App\Services\AlertsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AdminAlertController extends Controller
{
    protected $alertsService;

    public function __construct(AlertsService $alertsService)
    {
        $this->alertsService = $alertsService;
    }

    public function sendAlert(Request $request)
    {
        $request->validate([
            'task_id' => 'required|integer|exists:tasks,id',
            'message' => 'required|string|max:1000',
            'user_ids' => 'required|array',
            'user_ids.*' => 'integer|exists:users,id'
        ]);

        $adminId = $request->user()->id;
        $taskId = $request->input('task_id');
        $message = $request->input('message');
        $userIds = $request->input('user_ids');

        Log::info('Creating alert', [
            'admin_id' => $adminId,
            'task_id' => $taskId,
            'message' => $message,
            'user_ids' => $userIds
        ]);

        try {
            $alert = $this->alertsService->createAlert($adminId, $message, $taskId, $userIds);

            Log::info('Alert created successfully', ['alert_id' => $alert->id]);

            // Return a redirect for Inertia
            return redirect()->back()->with('success', 'Alert sent successfully to all task assignees via email and in-app notification');
        } catch (\Exception $e) {
            Log::error('Failed to create alert', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Return a redirect with error for Inertia
            return redirect()->back()->with('error', 'Failed to send alert: ' . $e->getMessage());
        }
    }
} 