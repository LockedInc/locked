<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('fname')->after('id');
            $table->string('mname')->nullable()->after('fname');
            $table->string('lname')->after('mname');
        });

        // Migrate existing data
        DB::table('users')->orderBy('id')->chunk(100, function ($users) {
            foreach ($users as $user) {
                $nameParts = explode(' ', $user->name);
                $fname = $nameParts[0] ?? '';
                $mname = $nameParts[1] ?? null;
                $lname = $nameParts[2] ?? '';

                // If there are more than 3 parts, add the rest to the last name
                if (count($nameParts) > 3) {
                    $lname = implode(' ', array_slice($nameParts, 2));
                }

                DB::table('users')
                    ->where('id', $user->id)
                    ->update([
                        'fname' => $fname,
                        'mname' => $mname,
                        'lname' => $lname,
                    ]);
            }
        });

        // Drop the old name column after data migration
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->after('id');
        });

        // Migrate data back
        DB::table('users')->orderBy('id')->chunk(100, function ($users) {
            foreach ($users as $user) {
                $name = trim(implode(' ', array_filter([$user->fname, $user->mname, $user->lname])));

                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['name' => $name]);
            }
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['fname', 'mname', 'lname']);
        });
    }
};
