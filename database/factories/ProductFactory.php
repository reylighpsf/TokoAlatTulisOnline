<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 1000, 100000),
            'stock' => $this->faker->numberBetween(0, 100),
            'category' => $this->faker->randomElement(['Buku Tulis', 'Alat Tulis', 'Kertas', 'Map', 'Pensil', 'Pulpen', 'Penghapus', 'Penggaris', 'Lainnya']),
            'is_active' => $this->faker->boolean(80), // 80% chance of being active
            'image' => null,
        ];
    }
}
