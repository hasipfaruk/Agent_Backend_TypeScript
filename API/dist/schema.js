import { z } from "zod";
// Agent schema
export const agentSchema = z.object({
    id: z.number(),
    name: z.string(),
    type: z.string(),
    capabilities: z.array(z.string()),
    avatar: z.string().optional(),
    status: z.string(),
    metrics: z.any().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
export const insertAgentSchema = agentSchema.omit({ id: true });
// Digital Twin schema
export const digitalTwinSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    data: z.any(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
export const insertDigitalTwinSchema = digitalTwinSchema.omit({ id: true });
// Conversation schema
export const conversationSchema = z.object({
    id: z.number(),
    title: z.string(),
    participants: z.array(z.string()),
    messages: z.array(z.any()).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
export const insertConversationSchema = conversationSchema.omit({ id: true });
// Task schema
export const taskSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    status: z.string(),
    assignedAgentId: z.number().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
export const insertTaskSchema = taskSchema.omit({ id: true });
//# sourceMappingURL=schema.js.map