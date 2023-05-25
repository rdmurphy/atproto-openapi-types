import type { LexXrpcQuery } from "@atproto/lexicon";
import type { OpenAPIV3_1 } from "openapi-types";

import { convertObject, convertProperty } from "./object.ts";
import { calculateTag, isEmptyObject } from "../utils.ts";

export function convertQuery(
  id: string,
  name: string,
  query: LexXrpcQuery,
): OpenAPIV3_1.OperationObject {
  const get = {
    tags: [calculateTag(id)],
    ...(query.description && { summary: query.description }),
    operationId: id,
    ...(authenticatedEndpoints.has(id) && { security: [{ Bearer: [] }] }),
  } as OpenAPIV3_1.OperationObject<"GET">;

  if (query.parameters && !isEmptyObject(query.parameters.properties)) {
    const properties = query.parameters.properties;
    const required = new Set(query.parameters.required ?? []);
    const parameters = [] as OpenAPIV3_1.ParameterObject[];

    for (const [name, property] of Object.entries(properties)) {
      const parameter: OpenAPIV3_1.ParameterObject = {
        name,
        in: "query",
        ...(property.description && { description: property.description }),
        required: required.has(name),
        // @ts-ignore FIXME: We know this will never be an ArraySchemaObject
        // but TypeScript doesn't. Probably just gotta break out the inner parts
        // of convertProperty more.
        schema: convertProperty(id, name, property),
      };

      parameters.push(parameter);
    }

    get.parameters = parameters;
  }

  const responses = {} as OpenAPIV3_1.ResponsesObject;

  if (query.output) {
    const output = query.output;
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
        [query.output.encoding]: mediaType,
      },
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

  get.responses = responses;

  return get;
}

/**
 * Building this by hand because this is documented ...no where?
 */
const authenticatedEndpoints = new Set([
  "app.bsky.actor.getPreferences",
  "app.bsky.actor.getProfile",
  "app.bsky.actor.getProfiles",
  "app.bsky.actor.getSuggestions",
  "app.bsky.actor.searchActors",
  "app.bsky.actor.searchActorsTypeahead",
  "app.bsky.feed.getActorFeeds",
  "app.bsky.feed.getAuthorFeed",
  "app.bsky.feed.getFeed",
  "app.bsky.feed.getFeedGenerator",
  "app.bsky.feed.getFeedGenerators",
  "app.bsky.feed.getLikes",
  "app.bsky.feed.getPostThread",
  "app.bsky.feed.getPosts",
  "app.bsky.feed.getRepostedBy",
  "app.bsky.feed.getTimeline",
  "app.bsky.graph.getBlocks",
  "app.bsky.graph.getFollowers",
  "app.bsky.graph.getFollows",
  "app.bsky.graph.getList",
  "app.bsky.graph.getListMutes",
  "app.bsky.graph.getLists",
  "app.bsky.graph.getMutes",
  "app.bsky.notification.getUnreadCount",
  "app.bsky.notification.listNotifications",
  "app.bsky.notification.updateSeen",
  "app.bsky.unspecced.getPopular",
  "app.bsky.unspecced.getPopularFeedGenerators",
  "com.atproto.admin.getInviteCodes",
  "com.atproto.admin.getModerationAction",
  "com.atproto.admin.getModerationActions",
  "com.atproto.admin.getModerationReport",
  "com.atproto.admin.getModerationReports",
  "com.atproto.admin.getRecord",
  "com.atproto.admin.getRepo",
  "com.atproto.admin.searchRepos",
  "com.atproto.server.getAccountInviteCodes",
  "com.atproto.server.getSession",
  "com.atproto.server.listAppPasswords",
]);
