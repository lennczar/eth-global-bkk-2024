import { NextResponse } from "next/server";
import { DEPLOYMENT_URL } from "vercel-url";

const key = JSON.parse(process.env.BITTE_KEY || "{}");
const config = JSON.parse(process.env.BITTE_CONFIG || "{}");

if (!key?.accountId) {
	console.warn("Missing account info.");
}
if (!config || !config.url) {
	console.warn("Missing config or url in config.");
}

export async function GET() {
	const pluginData = {
		openapi: "3.0.0",
		info: {
			title: "Luma API",
			description: "API for retrieving information from a Luma calendar.",
			version: "1.0.0",
		},
		servers: [
			{
				url: config?.url || DEPLOYMENT_URL,
			},
		],
		"x-mb": {
			"account-id": key.accountId || "",
			assistant: {
				name: "Luma Agent",
				description: "A better search tool for Luma",
				instructions:
					"You can query Luma events to find interesting events. You can find projects around a specified topic. You can find the event where most VC funds / builders / specific firms are attending. You can differentiate between parties, hacker houses, pitch competitions, hackathons, mixers, etc. IMPORTANT INSTRUCTIONS. You will need a calendar ID to use the get-calendar operation. You can derive the id from a calendar link like this: https://lu.ma/{calendarId} - important: do not query lu.ma/... directly, use the tool. If fetching the calendar fails ask specifically for the calendar id.",
				tools: [],
			},
		},
		paths: {
			"/api/{calendarId}": {
				get: {
					operationId: "get-calendar",
					description: "Get luma calendar as list of events.",
					parameters: [
						{
							name: "calendarId",
							in: "path",
							description: "The identifier for the calendar to get.",
							required: true,
							schema: {
								type: "string",
							},
						},
					],
					responses: {
						"200": {
							description: "Successful response",
							content: {
								"application/json": {
									schema: {},
								},
							},
						},
						"400": {
							description: "Bad request",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											error: {
												type: "string",
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	};
	return NextResponse.json(pluginData);
}
