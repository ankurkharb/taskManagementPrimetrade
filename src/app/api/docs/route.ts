import { NextResponse } from "next/server";

// GET /api/docs — OpenAPI 3.0 spec
export async function GET() {
  const spec = {
    openapi: "3.0.0",
    info: {
      title: "PrimeTrade Task API",
      version: "1.0.0",
      description:
        "A RESTful API for task management with authentication, role-based access control, and CRUD operations.",
    },
    servers: [{ url: "/", description: "Current server" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Clerk JWT token",
        },
      },
      schemas: {
        Task: {
          type: "object",
          properties: {
            id: { type: "string", example: "clxyz123abc" },
            title: { type: "string", example: "Complete project report" },
            description: { type: "string", nullable: true, example: "Write the final report for Q4" },
            status: { type: "string", enum: ["PENDING", "IN_PROGRESS", "DONE"], example: "PENDING" },
            priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"], example: "MEDIUM" },
            userId: { type: "string", example: "user_2abc123" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateTask: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", minLength: 1, maxLength: 100 },
            description: { type: "string" },
            priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
          },
        },
        UpdateTask: {
          type: "object",
          properties: {
            title: { type: "string", minLength: 1, maxLength: 100 },
            description: { type: "string" },
            status: { type: "string", enum: ["PENDING", "IN_PROGRESS", "DONE"] },
            priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/Task" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: { type: "string" },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "array", items: { $ref: "#/components/schemas/Task" } },
            pagination: {
              type: "object",
              properties: {
                page: { type: "integer" },
                limit: { type: "integer" },
                total: { type: "integer" },
                totalPages: { type: "integer" },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      "/api/v1/tasks": {
        get: {
          tags: ["Tasks"],
          summary: "Get all tasks",
          description: "Returns a paginated list of tasks belonging to the authenticated user.",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
            { name: "status", in: "query", schema: { type: "string", enum: ["PENDING", "IN_PROGRESS", "DONE"] } },
            { name: "priority", in: "query", schema: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] } },
          ],
          responses: {
            "200": {
              description: "List of tasks",
              content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } },
            },
            "401": {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
          },
        },
        post: {
          tags: ["Tasks"],
          summary: "Create a new task",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/CreateTask" } } },
          },
          responses: {
            "201": {
              description: "Task created",
              content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } },
            },
            "400": { description: "Validation error" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/v1/tasks/{id}": {
        get: {
          tags: ["Tasks"],
          summary: "Get a task by ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": {
              description: "Task found",
              content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } },
            },
            "404": { description: "Task not found" },
          },
        },
        put: {
          tags: ["Tasks"],
          summary: "Update a task",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateTask" } } },
          },
          responses: {
            "200": {
              description: "Task updated",
              content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } },
            },
            "400": { description: "Validation error" },
            "404": { description: "Task not found" },
          },
        },
        delete: {
          tags: ["Tasks"],
          summary: "Delete a task",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Task deleted" },
            "404": { description: "Task not found" },
          },
        },
      },
      "/api/v1/admin/users": {
        get: {
          tags: ["Admin"],
          summary: "List all users (admin only)",
          description: "Returns all registered users. Requires admin role.",
          responses: {
            "200": { description: "List of users" },
            "401": { description: "Unauthorized" },
            "403": { description: "Forbidden — admin role required" },
          },
        },
      },
    },
  };

  return NextResponse.json(spec);
}
