<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user has the specified role.
     */
    public function hasRole(User $user, string $role): bool
    {
        return $user->role && $user->role->name === $role;
    }

    /**
     * Determine if the user is an admin.
     */
    public function isAdmin(User $user): bool
    {
        return $this->hasRole($user, 'Client-Admin');
    }

    /**
     * Determine if the user is a member.
     */
    public function isMember(User $user): bool
    {
        return $this->hasRole($user, 'Member');
    }
} 