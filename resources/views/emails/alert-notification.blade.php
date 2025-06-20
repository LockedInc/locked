<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .alert-box {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .task-info {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            font-size: 12px;
            color: #6c757d;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Task Alert Notification</h2>
        <p>Hello {{ $recipient->full_name }},</p>
    </div>

    <div class="alert-box">
        <h3>📢 New Alert from {{ $admin->full_name }}</h3>
        <p><strong>Message:</strong></p>
        <p>{{ $alert->message }}</p>
    </div>

    <div class="task-info">
        <h4>Task Details:</h4>
        <p><strong>Task:</strong> {{ $task->name }}</p>
        <p><strong>Description:</strong> {{ $task->description }}</p>
        <p><strong>Status:</strong> {{ ucfirst($task->status) }}</p>
        <p><strong>Priority:</strong> {{ ucfirst($task->priority) }}</p>
        <p><strong>Due Date:</strong> {{ $task->due_date ? $task->due_date->format('M d, Y') : 'No due date' }}</p>
    </div>

    <div style="text-align: center;">
        <a href="{{ url('/tasks/' . $task->id) }}" class="btn">View Task</a>
    </div>

    <div class="footer">
        <p>This alert was sent by {{ $admin->full_name }} on {{ $alert->created_at->format('M d, Y \a\t g:i A') }}.</p>
        <p>If you have any questions, please contact your administrator.</p>
    </div>
</body>
</html> 