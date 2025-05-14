<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Role;
use App\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Create permissions
        $permissions = [
            [ #1
                'name' => 'manage_platform',
                'description' => 'Full platform management access',
            ],

            [ #2
                'name' => 'manage_client',
                'description' => 'Manage client information and settings',
            ],

            [ #3
                'name' => 'view_client',
                'description' => 'View client information',
            ],
        ];

        $permissionIds = [];
        foreach ($permissions as $permission) {
            $permissionIds[$permission['name']] = DB::table('permissions')->insertGetId([
                'name' => $permission['name'],
                'description' => $permission['description'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }

        // Create roles
        $roles = [
            [ #1
                'name' => 'System-Admin',
                'description' => 'System Administrator with full platform access',
                'permissions' => ['manage_platform', 'manage_client', 'view_client'],
            ],

            [ #2
                'name' => 'Client-Admin',
                'description' => 'Administrator with client management access',
                'permissions' => ['manage_client', 'view_client'],
            ],

            [ #3
                'name' => 'Member',
                'description' => 'Basic member with view access',
                'permissions' => ['view_client'],
            ],
            
        ];

        foreach ($roles as $role) {
            // Create role
            $roleId = DB::table('roles')->insertGetId([
                'name' => $role['name'],
                'description' => $role['description'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            // Assign permissions to role
            foreach ($role['permissions'] as $permissionName) {
                DB::table('role_permissions')->insert([
                    'role_id' => $roleId,
                    'permission_id' => $permissionIds[$permissionName],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }
    }
}