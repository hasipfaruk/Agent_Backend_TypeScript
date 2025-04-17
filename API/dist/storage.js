import { agents, tasks, digitalTwins } from "@shared/schema";
import { db } from "./db.js";
import { eq, sql } from "drizzle-orm";
import { conversations } from "@shared/schema";
export class DatabaseStorage {
    // Agent operations
    async getAgents() {
        return await db.select().from(agents);
    }
    async getAgent(id) {
        const [agent] = await db.select().from(agents).where(eq(agents.id, id));
        return agent;
    }
    async createAgent(insertAgent) {
        const [agent] = await db.insert(agents).values(insertAgent).returning();
        return agent;
    }
    async updateAgentStatus(id, status) {
        const [updated] = await db
            .update(agents)
            .set({ status })
            .where(eq(agents.id, id))
            .returning();
        return updated;
    }
    async updateAgentMetrics(id, metrics) {
        const [updated] = await db
            .update(agents)
            .set({ metrics })
            .where(eq(agents.id, id))
            .returning();
        return updated;
    }
    // Task operations
    async getTasks() {
        return await db.select().from(tasks);
    }
    async getTask(id) {
        const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
        return task;
    }
    async createTask(insertTask) {
        const [task] = await db.insert(tasks).values(insertTask).returning();
        return task;
    }
    async updateTaskStatus(id, status) {
        const [updated] = await db
            .update(tasks)
            .set({ status, updatedAt: new Date() })
            .where(eq(tasks.id, id))
            .returning();
        return updated;
    }
    async getTasksByAgent(agentId) {
        return await db
            .select()
            .from(tasks)
            .where(eq(tasks.assignedAgentId, agentId));
    }
    // Digital Twin operations
    async getDigitalTwins() {
        return await db.select().from(digitalTwins);
    }
    async getDigitalTwin(id) {
        const [twin] = await db.select().from(digitalTwins).where(eq(digitalTwins.id, id));
        return twin;
    }
    async createDigitalTwin(twin) {
        const [newTwin] = await db.insert(digitalTwins).values(twin).returning();
        return newTwin;
    }
    async updateDigitalTwin(id, updates) {
        const [updated] = await db
            .update(digitalTwins)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(digitalTwins.id, id))
            .returning();
        return updated;
    }
    // Clean up duplicate agents (keeping the one with the lowest ID)
    async cleanupDuplicateAgents() {
        try {
            // Get all agents
            const allAgents = await this.getAgents();
            // Group agents by name
            const agentsByName = {};
            for (const agent of allAgents) {
                if (!agentsByName[agent.name]) {
                    agentsByName[agent.name] = [];
                }
                agentsByName[agent.name].push(agent);
            }
            // Count duplicates removed
            let duplicatesRemoved = 0;
            // For each name with multiple agents, keep only the agent with lowest ID (oldest)
            for (const [name, agentsWithName] of Object.entries(agentsByName)) {
                if (agentsWithName.length > 1) {
                    // Sort by ID (ascending)
                    agentsWithName.sort((a, b) => a.id - b.id);
                    // Keep the first one (lowest ID), remove the rest
                    const agentsToRemove = agentsWithName.slice(1);
                    // Delete duplicate agents
                    for (const agent of agentsToRemove) {
                        await db.delete(agents).where(eq(agents.id, agent.id));
                        duplicatesRemoved++;
                        console.log(`Removed duplicate agent: ${name} (ID: ${agent.id})`);
                    }
                }
            }
            return duplicatesRemoved;
        }
        catch (error) {
            console.error("Error cleaning up duplicate agents:", error);
            return 0;
        }
    }
    async deleteDigitalTwin(id) {
        const [deleted] = await db
            .delete(digitalTwins)
            .where(eq(digitalTwins.id, id))
            .returning();
        return !!deleted;
    }
    // Conversation operations
    async getConversations() {
        return await db.select().from(conversations);
    }
    async getConversation(id) {
        const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
        return conversation;
    }
    async createConversation(conversation) {
        const [newConversation] = await db.insert(conversations).values(conversation).returning();
        return newConversation;
    }
    async getConversationsByParticipant(participant) {
        return await db
            .select()
            .from(conversations)
            .where(sql `${participant} = ANY(${conversations.participants})`);
    }
}
export const storage = new DatabaseStorage();
//# sourceMappingURL=storage.js.map