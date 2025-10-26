<?php

namespace App\Http\Controllers;

use App\Models\PrintOrder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PrintOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = PrintOrder::with('user');

            // Filter by user if not admin
            if (!Auth::user()->hasRole('admin')) {
                $query->where('user_id', Auth::id());
            }

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by payment status if provided
            if ($request->has('payment_status')) {
                $query->where('payment_status', $request->payment_status);
            }

            $printOrders = $query->orderBy('created_at', 'desc')->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $printOrders,
                'message' => 'Print orders retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve print orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file_name' => 'required|string|max:255',
            'file_url' => 'nullable|string|max:500',
            'print_type' => ['required', Rule::in(['color', 'bw', 'photo'])],
            'paper_size' => ['required', Rule::in(['A4', 'A3', 'Letter', '4x6', '5x7', '8x10'])],
            'copies' => 'required|integer|min:1|max:100',
            'total_pages' => 'required|integer|min:1',
            'price_per_page' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'payment_method' => ['required', Rule::in(['cod', 'bank_transfer'])],
            'payment_status' => ['required', Rule::in(['pending', 'paid', 'failed'])],
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $printOrder = PrintOrder::create([
                'user_id' => Auth::id(),
                ...$request->validated(),
                'status' => 'pending'
            ]);

            $printOrder->load('user');

            return response()->json([
                'success' => true,
                'data' => $printOrder,
                'message' => 'Print order created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create print order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $printOrder = PrintOrder::with('user')->findOrFail($id);

            // Check if user owns this order or is admin
            if ($printOrder->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to print order'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $printOrder,
                'message' => 'Print order retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Print order not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $printOrder = PrintOrder::findOrFail($id);

            // Check if user owns this order or is admin
            if ($printOrder->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to print order'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'status' => [Rule::in(['pending', 'processing', 'completed', 'cancelled'])],
                'payment_status' => [Rule::in(['pending', 'paid', 'failed'])],
                'notes' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $printOrder->update($request->validated());
            $printOrder->load('user');

            return response()->json([
                'success' => true,
                'data' => $printOrder,
                'message' => 'Print order updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update print order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update payment status
     */
    public function updatePayment(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'payment_status' => ['required', Rule::in(['pending', 'paid', 'failed'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $printOrder = PrintOrder::findOrFail($id);

            // Check if user owns this order or is admin
            if ($printOrder->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to print order'
                ], 403);
            }

            $printOrder->update([
                'payment_status' => $request->payment_status
            ]);

            $printOrder->load('user');

            return response()->json([
                'success' => true,
                'data' => $printOrder,
                'message' => 'Payment status updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $printOrder = PrintOrder::findOrFail($id);

            // Check if user owns this order or is admin
            if ($printOrder->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to print order'
                ], 403);
            }

            // Only allow deletion of pending orders
            if ($printOrder->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete order that is already being processed'
                ], 422);
            }

            $printOrder->delete();

            return response()->json([
                'success' => true,
                'message' => 'Print order deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete print order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
