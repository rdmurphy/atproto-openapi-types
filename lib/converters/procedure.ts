import type { LexXrpcProcedure } from "@atproto/lexicon";
import type { OpenAPIV3_1 } from "openapi-types";

import { convertObject, convertProperty } from "./object.ts";
import { calculateTag } from "../utils.ts";

export function convertProcedure(
  id: string,
  name: string,
  procedure: LexXrpcProcedure,
): OpenAPIV3_1.OperationObject<"POST"> {
  const post = {
    tags: [calculateTag(id)],
    ...(procedure.description && { summary: procedure.description }),
    operationId: id,
    ...(authenticatedEndpoints.has(id) && { security: [{ Bearer: [] }] }),
  } as OpenAPIV3_1.OperationObject<"POST">;

  if (procedure.input) {
    const input = procedure.input;
    const mediaType = {} as OpenAPIV3_1.MediaTypeObject;

    if (input.schema) {
      const schema = input.schema;

      mediaType.schema = schema.type === "object"
        ? convertObject(id, name, schema)
        : convertProperty(id, name, schema);
    }

    const requestBody: OpenAPIV3_1.RequestBodyObject = {
      required: true,
      content: {
        [procedure.input!.encoding]: mediaType,
      },
    };

    post.requestBody = requestBody;
  }

  const responses = {} as OpenAPIV3_1.ResponsesObject;

  if (procedure.output) {
    const output = procedure.output;
    const mediaType = {} as OpenAPIV3_1.MediaTypeObject;

    if (output.schema) {
      const schema = output.schema;

      mediaType.schema = schema.type === "object"
        ? convertObject(id, name, schema)
        : convertProperty(id, name, schema);
    }

    responses["200"] = {
      description: "OK",
      content: {
        [procedure.output.encoding]: mediaType,
      },
    };
  } else {
    responses["200"] = {
      description: "OK",
    };
  }

  responses["400"] = {
    description: "Bad Request",
  };

  if (authenticatedEndpoints.has(id)) {
    responses["401"] = {
      description: "Unauthorized",
    };
  }

  post.responses = responses;

  return post;
}

/**
 * Building this by hand because this is documented ...no where?
 */
const authenticatedEndpoints = new Set([
  "app.bsky.actor.putPreferences",
  "app.bsky.graph.muteActor",
  "app.bsky.graph.muteActorList",
  "app.bsky.graph.unmuteActor",
  "app.bsky.graph.unmuteActorList",
  "app.bsky.notification.updateSeen",
  "com.atproto.admin.disableAccountInvites",
  "com.atproto.admin.disableInviteCodes",
  "com.atproto.admin.enableAccountInvites",
  "com.atproto.admin.resolveModerationReports",
  "com.atproto.admin.reverseModerationAction",
  "com.atproto.admin.takeModerationAction",
  "com.atproto.admin.updateAccountEmail",
  "com.atproto.admin.updateAccountHandle",
  "com.atproto.identity.updateHandle",
  "com.atproto.moderation.createReport",
  "com.atproto.repo.applyWrites",
  "com.atproto.repo.createRecord",
  "com.atproto.repo.deleteRecord",
  "com.atproto.repo.putRecord",
  "com.atproto.repo.rebaseRepo",
  "com.atproto.repo.uploadBlob",
  "com.atproto.server.createAppPassword",
  "com.atproto.server.createInviteCode",
  "com.atproto.server.createInviteCodes",
  "com.atproto.server.deleteSession",
  "com.atproto.server.refreshSession",
  "com.atproto.server.requestAccountDelete",
  "com.atproto.server.revokeAppPassword",
]);
