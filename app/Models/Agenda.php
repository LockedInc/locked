<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;


class Agenda extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'text',
    ];

    public function meeting(): HasOne
    {
        return $this->hasOne(Meeting::class);
    }
}