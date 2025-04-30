<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'status',
        'priority',
        'due_date',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function meetings()
    {
        return $this->belongsToMany(Meeting::class);
    }

    public function clients()
    {
        return $this->belongsToMany(Client::class);
    }
}
