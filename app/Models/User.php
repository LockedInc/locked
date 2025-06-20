<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * User model representing application users.
 * 
 * This model handles user authentication, relationships with other entities,
 * and provides accessors for computed attributes.
 * 
 * @property int $id
 * @property string $fname First name
 * @property string|null $mname Middle name
 * @property string $lname Last name
 * @property string $email Email address (unique)
 * @property string $password Hashed password
 * @property int|null $client_id Associated client ID
 * @property int $role_id User role ID
 * @property \Carbon\Carbon|null $email_verified_at Email verification timestamp
 * @property string|null $remember_token Remember me token
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon|null $deleted_at Soft delete timestamp
 * 
 * @property-read string $full_name Computed full name
 * @property-read \App\Models\Client|null $client Associated client
 * @property-read \App\Models\Role $role User role
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Meeting[] $meetings User's meetings
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Task[] $tasks User's tasks
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Alert[] $alerts Alerts received by user
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Alert[] $sentAlerts Alerts sent by user (as admin)
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The relationships that should always be loaded.
     *
     * @var array<string>
     */
    protected $with = ['role'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'fname',
        'mname',
        'lname',
        'email',
        'password',
        'client_id',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's full name.
     * 
     * Combines first, middle, and last names, filtering out empty values
     * and trimming whitespace.
     *
     * @return string The user's full name
     */
    public function getFullNameAttribute(): string
    {
        return trim(implode(' ', array_filter([$this->fname, $this->mname, $this->lname])));
    }

    /**
     * Get the meetings that the user is associated with.
     * 
     * Many-to-many relationship with meetings through the meeting_user pivot table.
     * Includes timestamps for when the user was added to/removed from meetings.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<\App\Models\Meeting>
     */
    public function meetings(): BelongsToMany
    {
        return $this->belongsToMany(Meeting::class)->withTimestamps();
    }

    /**
     * Get the tasks that the user is assigned to.
     * 
     * Many-to-many relationship with tasks through the task_user pivot table.
     * Includes timestamps for when the user was assigned to/removed from tasks.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<\App\Models\Task>
     */
    public function tasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class)->withTimestamps();
    }

    /**
     * Get the client that the user belongs to.
     * 
     * Many-to-one relationship where users can belong to a specific client.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Client, \App\Models\User>
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the role assigned to the user.
     * 
     * Many-to-one relationship defining the user's role and permissions.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Role, \App\Models\User>
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the alerts that the user has sent as an admin.
     * 
     * One-to-many relationship where the user (as admin) is the sender of alerts.
     * Uses the 'admin_id' foreign key to distinguish from received alerts.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\Alert>
     */
    public function sentAlerts(): HasMany
    {
        return $this->hasMany(Alert::class, 'admin_id');
    }
}
