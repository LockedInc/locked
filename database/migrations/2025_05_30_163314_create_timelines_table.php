<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\SoftDeletes;

return new class extends Migration
{
    use SoftDeletes;
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('timelines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Using short class name for polymorphic relationship (e.g., 'Task', 'Project', etc.)
            $table->string('subject_type');
            $table->unsignedBigInteger('subject_id'); 
            $table->foreignId('origin_client_id')->constrained('clients')->onDelete('cascade');
            $table->text('message');
            $table->softDeletes();
            $table->timestamps();

            // Add indexes for better performance
            $table->index(['subject_type', 'subject_id']);
            $table->index('origin_client_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timelines');
    }
};
