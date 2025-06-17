<?php

namespace App\Services;

use App\Events\TimelineMessage;
use Illuminate\Support\Facades\Log;

class TimelineMessageService
{
    public function taskCreated($user, string $message, string $subjectType, int $subjectId): void
    {   
        $message = "Task created by " . $user->fname . " " . $user->lname;
        Log::info('through service');
        event(new TimelineMessage($user, $message, $subjectType, $subjectId));
    }

    public function taskUpdated($user, string $message, string $subjectType, int $subjectId, $originalValues, $request): void
    {
        // Get the changed fields
        $changedFields = [];
        foreach ($request as $field => $value) {
            if (isset($originalValues[$field]) && $originalValues[$field] !== $value) {
                $changedFields[$field] = $value;
            }
        }

        $message = "Task updated by " . $user->fname . " " . $user->lname;
        if (!empty($changedFields)) {
            $fieldMessages = [];
            foreach ($changedFields as $field => $value) {
                switch ($field) {
                    case 'name':
                        $fieldMessages[] = "the name to `{$value}`";
                        break;
                    case 'description':
                        $fieldMessages[] = "the description to `{$value}`";
                        break;
                    case 'status':
                        if ($value == 'in_progress') {$value = 'in progress';}
                        $fieldMessages[] = "the status to `{$value}`";
                        break;
                    case 'priority':
                        $fieldMessages[] = "the priority to `{$value}`";
                        break;
                    case 'due_date':
                        $fieldMessages[] = "the due date to `{$value}`";
                        break;
                    case 'users':
                        $fieldMessages[] = "the users assigned`";
                        break;
                        
                        
                }
            }

            if (!empty($fieldMessages)) {
                $lastField = array_pop($fieldMessages);
                $message .= count($fieldMessages) > 0 
                    ? " by changing " . implode(', ', $fieldMessages) . " and " . $lastField
                    : " by changing " . $lastField;
            }
        }

        Log::info('through service');
        event(new TimelineMessage($user, $message, $subjectType, $subjectId));
    }
} 