<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole 
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role): Response
    {
        $user = $request->user();

        // If not logged in or no role, deny
        if (!$user || !$user->role) {
            abort(403, 'Unauthorized');
        }

        // Check if user's role matches the required role
        if ($user->role->name !== $role) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
