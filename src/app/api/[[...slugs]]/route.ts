import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

const app = new Elysia({ prefix: "/api", aot: false })
	.use(swagger())
	.get("/:calendarId", async ({ params: { calendarId } }) => {
		const calendar = await fetch(`https://api.lu.ma/url?url=${calendarId}`, {
			method: "GET",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
		})
      .then(resp => resp.json())
      .then(resp => resp.data);

    if (!calendar) return { error: `Calendar ${calendarId} not found` }

    // console.log(calendar.featured_items.map((i: { event: { api_id: string }}) => `https://api.lu.ma/event/get?event_api_id=${i.event.api_id}`))

    const events = await Promise.all(
      calendar.featured_items
        .filter((i: { event: { api_id: string }}) => !!i.event.api_id) // external events dont have api_ids
        .map((i: { event: { api_id: string }}) =>
            fetch(`https://api.lu.ma/event/get?event_api_id=${i.event.api_id}`)
              .then(resp => resp.json())
        )
    )

		return { events };
	})
	.compile();

export const GET = app.handle;
export const POST = app.handle;
