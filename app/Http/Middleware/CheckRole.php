<?php

namespace App\Http\Middleware;

use App\Policies\RolePolicy;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole 
{
    protected $rolePolicy;

    public function __construct(RolePolicy $rolePolicy)
    {
        $this->rolePolicy = $rolePolicy;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (!$user || !$this->rolePolicy->hasRole($user, $role)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
