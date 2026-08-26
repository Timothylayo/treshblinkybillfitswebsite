import { z } from 'zod';

// 1. Define the strict mathematical and structural rules for your inputs
const orderValidationSchema = z.object({
    customer: z.string().min(2).max(100).trim(),
    
    // Enforce basic phone number formatting
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone format"),
    whatsapp: z.string().regex(/^\+?[0-9]{10,15}$/).optional(),
    
    address: z.string().max(500).trim(),
    deliveryMode: z.enum(['pickup', 'delivery']).default('pickup'),
    
    // Validate the cart array and strict measurement boundaries
    cart: z.array(z.object({
        designId: z.string().or(z.number()).nullable().optional(),
        qty: z.number().int().min(1).max(50).default(1),
        
        // Prevent negative numbers or absurdly huge measurements
        chest: z.number().positive().max(100).optional().nullable(),
        waist: z.number().positive().max(100).optional().nullable(),
        
        // Strip out HTML tags from notes to prevent XSS
        notes: z.string().max(1000).transform(str => str.replace(/<[^>]*>?/gm, '')).optional()
    })).min(1, "Cart cannot be empty")
});

// 2. The Validation Middleware
export const validateOrderPayload = (req, res, next) => {
    try {
        // .parse() automatically strips out any unexpected fields (like admin flags)
        const safeData = orderValidationSchema.parse(req.body);
        
        // Replace the raw request body with the sanitized data
        req.body = safeData; 
        next();
    } catch (error) {
        // If validation fails, Zod throws a detailed error of exactly which field was wrong
        return res.status(400).json({ 
            error: "Input validation failed", 
            details: error.errors 
        });
    }
};